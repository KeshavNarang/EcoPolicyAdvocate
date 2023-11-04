document.addEventListener("DOMContentLoaded", () => {
    const billList = document.getElementById("billList");

    // Load JSON data from "bills/coal_data.json"
    fetch("bills/coal_data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(bill => {
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');
                card.style.border = '2px solid #ccc';
                card.style.boxShadow = '3px 3px 5px #888';
                card.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted text-center">${bill.bill_id}</h6>
                        <h5 class="card-title text-center">${bill.short_title}</h5>
                        <p class="card-text">Full Title: ${bill.title}</p>
                        <p class="card-text">Full Text: ${bill.full_text}</p>
                        <a href="public_comments.html?id=${bill.bill_id}" class="btn btn-primary d-block mx-auto">Make a Comment</a>
                    </div>
                `;
                billList.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading JSON data:", error);
        });
});
