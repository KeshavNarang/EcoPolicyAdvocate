// js/public_comments.js
document.addEventListener('DOMContentLoaded', function () {
    // Get the bill_id from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('id');

    // Fetch the generated_comments.json file
    fetch('generated_comments.json') // Replace with the path to your JSON file
        .then(response => response.json())
        .then(data => {
            const commentContainer = document.getElementById('comment-container');
            
            // Check if the billId exists in the generated comments data
            if (data.hasOwnProperty(billId)) {
                const comment = document.createElement('div');
                comment.classList.add('card', 'mb-3');
                comment.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${billId}</h5>
                        <p class="card-text">${data[billId]}</p>
                    </div>
                `;
                commentContainer.appendChild(comment);
            } else {
                const noComment = document.createElement('div');
                noComment.innerHTML = '<p>No public comments available for this bill.</p>';
                commentContainer.appendChild(noComment);
            }
        });
});
