// js/public_comments.js
document.addEventListener('DOMContentLoaded', function () {
    // Get the bill_id from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('id');

    // Fetch the generated_comments.json file
    fetch('generated_comments.json') // Replace with the path to your JSON file
        .then(response => response.json())
        .then(data => {
            // Fetch the climate_change_bills.json file
            fetch('climate_change_bills.json') // Replace with the path to your JSON file
                .then(response => response.json())
                .then(bills => {
                    const bill = bills.find(bill => bill.bill_id === billId);

                    if (bill) {
                        const titleElement = document.querySelector('h2');
                        const summaryElement = document.getElementById('summary');

                        titleElement.textContent = bill.bill_id;
                        summaryElement.textContent = `Summary: ${bill.summary}`;

                        // Toggle Summary Functionality
                        const toggleSummaryButton = document.getElementById('toggleSummary');
                        let isSummaryVisible = true;

                        toggleSummaryButton.addEventListener('click', function () {
                            if (isSummaryVisible) {
                                summaryElement.style.display = 'none';
                                isSummaryVisible = false;
                            } else {
                                summaryElement.style.display = 'block';
                                isSummaryVisible = true;
                            }
                        });
                    } else {
                        // Handle the case where the bill with the specified ID is not found
                        console.error('Bill not found.');
                    }
                });
        });
});