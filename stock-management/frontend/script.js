document.addEventListener("DOMContentLoaded", function () {
    fetchStock();
    fetchNotifications();
});

let allProducts = []; // Stocker tous les produits pour la recherche et le filtrage

// Charger le stock depuis le backend
function fetchStock() {
    fetch("http://127.0.0.1:5000/stock")
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(data);
            calculateTotalQuantity(data);
        });
}

// Affichage des produits avec mise en évidence des produits expirants bientôt
function displayProducts(products) {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    // Trier par date d'expiration
    products.sort((a, b) => new Date(a['Expiration Date']) - new Date(b['Expiration Date']));

    products.forEach(item => {
        const expirationDate = new Date(item['Expiration Date']);
        const currentDate = new Date();
        const daysLeft = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

        let productCard = `
            <div class="product-card" style="background-color: ${daysLeft <= 20 ? 'red' : 'white'};">
                <img src="${item['Image Path']}" alt="${item.Vegetable}" width="100" height="100" onerror="this.onerror=null; this.src='images/default.jpg';">
                <h3>${item.Vegetable}</h3>
                <p>Quantité : <span id="quantity-${item.Vegetable}">${item.Quantity}</span></p>
                <p>Expiration : ${item['Expiration Date']}</p>
                <button onclick="deleteProduct('${item.Vegetable}')">Supprimer</button>
                <button onclick="window.location.href='modify.html?vegetable=${item.Vegetable}'">Modifier</button>
            </div>
        `;

        container.innerHTML += productCard;
    });
}

// Fonction pour supprimer un produit
function deleteProduct(vegetable) {
    fetch("http://127.0.0.1:5000/delete_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vegetable: vegetable })
    })
    .then(response => response.json())
    .then(data => {
        alert("Produit supprimé avec succès!");
        fetchStock();
    });
}

// Calculer et afficher la quantité totale de chaque produit
function calculateTotalQuantity(products) {
    let totalQuantity = {};
    products.forEach(item => {
        totalQuantity[item.Vegetable] = (totalQuantity[item.Vegetable] || 0) + item.Quantity;
    });

    let totalDisplay = "<h3>Quantité totale des produits :</h3><ul>";
    for (let product in totalQuantity) {
        totalDisplay += `<li>${product}: ${totalQuantity[product]}</li>`;
    }
    totalDisplay += "</ul>";

    document.getElementById("totalQuantity").innerHTML = totalDisplay;
}

// Récupérer les notifications
function fetchNotifications() {
    fetch("http://127.0.0.1:5000/notifications")
        .then(response => response.json())
        .then(data => {
            const notifButton = document.getElementById("notifButton");
            if (data.length > 0) {
                notifButton.style.backgroundColor = "red";
            }
        });
}

// Fonction de recherche et de filtrage
function filterProducts() {
    const searchName = document.getElementById("search-name").value.toLowerCase();
    const searchDate = document.getElementById("search-date").value;

    let filteredProducts = allProducts.filter(item => {
        let matchesName = item.Vegetable.toLowerCase().includes(searchName);
        let matchesDate = searchDate ? item['Expiration Date'] === searchDate : true;
        return matchesName && matchesDate;
    });

    displayProducts(filteredProducts);
}
