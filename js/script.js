// js/script.js
document.addEventListener('DOMContentLoaded', function () {
    fetch('../climate_change_bills.json') // Replace with the path to your JSON file
        .then(response => response.json())
        .then(data => {
            const billList = document.getElementById('bill-list');
            
            data.forEach(bill => {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-3');
                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${bill.title}</h5>
                            <p class="card-text">${bill.summary}</p>
                            <a href="public_comments.html?id=${bill.bill_id}" class="btn btn-primary">View Comment</a>
                        </div>
                    </div>
                `;
                billList.appendChild(card);
            });
        });
});
