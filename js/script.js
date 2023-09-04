// js/script.js
document.addEventListener('DOMContentLoaded', function () {
    fetch('climate_change_bills.json') // Replace with the path to your JSON file
        .then(response => response.json())
        .then(data => {
            const billList = document.getElementById('bill-list');
            
            data.forEach(bill => {
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');
                card.style.border = '2px solid #ccc';
                card.style.boxShadow = '3px 3px 5px #888';
                card.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted text-center">${bill.bill_id}</h6>
                        <h5 class="card-title text-center">${bill.title}</h5>
                        <p class="card-text">Summary: ${bill.summary}</p>
                        <a href="public_comments.html?id=${bill.bill_id}" class="btn btn-primary d-block mx-auto">Make a Comment</a>
                    </div>
                `;
                billList.appendChild(card);
            });
        });
});