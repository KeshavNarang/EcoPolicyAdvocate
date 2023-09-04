// js/public_comments.js
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const billId = params.get('id');
    
    fetch('../climate_change_bills.json') // Replace with the path to your JSON file
        .then(response => response.json())
        .then(data => {
            const bill = data.find(b => b.bill_id === billId);
            if (bill) {
                document.getElementById('bill-id').textContent = bill.bill_id;
                document.getElementById('bill-title').textContent = bill.title;
                document.getElementById('bill-summary').textContent = bill.summary;
            }
        });
});
