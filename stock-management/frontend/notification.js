document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5000/notifications")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("notificationsContainer");
            if (data.length === 0) {
                container.innerHTML = "<p>Aucune notification.</p>";
                return;
            }

            let notifHTML = "<ul>";
            data.forEach(notif => {
                notifHTML += `<li>${notif}</li>`;
            });
            notifHTML += "</ul>";
            container.innerHTML = notifHTML;
        });
});
