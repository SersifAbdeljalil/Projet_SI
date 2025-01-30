document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const vegetableName = urlParams.get("vegetable");

    if (vegetableName) {
        fetchProductDetails(vegetableName);
    }
});

function fetchProductDetails(vegetable) {
    fetch("http://127.0.0.1:5000/stock")
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.Vegetable === vegetable);
            if (product) {
                document.getElementById("name").value = product.Vegetable;
                document.getElementById("quantity").value = product.Quantity;
                document.getElementById("expiration").value = product["Expiration Date"];
                document.getElementById("image").value = product["Image Path"];
            }
        });
}

document.getElementById("modifyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const expiration = document.getElementById("expiration").value;
    const image = document.getElementById("image").value;

    if (name && quantity && expiration && image) {
        updateProductInfo(name, quantity, expiration, image);
    } else {
        alert("Tous les champs doivent être remplis.");
    }
});

function updateProductInfo(name, quantity, expiration, image) {
    fetch("http://127.0.0.1:5000/update_product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            vegetable: name,
            quantity: quantity,
            expiration_date: expiration,
            image_path: image
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("Produit mis à jour avec succès!");
            window.location.href = "index.html";  // Redirige vers la page d'accueil après modification
        }
    })
    .catch(err => console.error('Erreur lors de la mise à jour du produit', err));
}
