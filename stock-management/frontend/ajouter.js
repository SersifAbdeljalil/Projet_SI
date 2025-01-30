document.getElementById("addProductForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let quantity = document.getElementById("quantity").value;
    let expiration = document.getElementById("expiration").value;

    fetch("http://127.0.0.1:5000/add_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            vegetable: name,
            quantity: quantity,
            expiration_date: expiration,
            image_path: "images/default.jpg"
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").textContent = data.message;
        setTimeout(() => window.location.href = "index.html", 1500);
    });
});
