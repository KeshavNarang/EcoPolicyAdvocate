function showComments(interest, billId) {
    const commentsURL = `comments/${interest}_comments.json`;

    fetch(commentsURL)
        .then(response => response.json())
        .then(data => {
            if (typeof data === 'object' && data !== null) {
                const commentText = data[billId];
                if (commentText) {
                    // Create a container to display the comment
                    const commentContainer = document.createElement('div');
                    commentContainer.classList.add('comment-container');

                    // Create a button to toggle comment visibility
                    const toggleCommentButton = document.createElement('button');
                    toggleCommentButton.textContent = 'Make a Comment';

                    // Create an editable text box for the comment
                    const commentTextArea = document.createElement('textarea');
                    commentTextArea.value = commentText;
                    // Set the default width and height
                    commentTextArea.style.width = '100%'; // Adjust as needed
                    commentTextArea.style.height = '100px'; // Adjust as needed
                    commentTextArea.style.display = 'none';

                    // Create a button to send an email
                    const sendEmailButton = document.createElement('button');
                    sendEmailButton.textContent = 'Send an Email';
                    sendEmailButton.style.display = 'none';
                    sendEmailButton.addEventListener('click', () => {
                        // Implement email sending logic here
                        // You can open a modal or perform any other action as needed
                        alert('Email sending logic goes here');
                    });

                    // Add a click event listener to the toggle button
                    toggleCommentButton.addEventListener('click', () => {
                        if (commentTextArea.style.display === 'none') {
                            commentTextArea.style.display = 'block';
                            sendEmailButton.style.display = 'block';
                            toggleCommentButton.textContent = 'Hide the Comment';
                        } else {
                            commentTextArea.style.display = 'none';
                            sendEmailButton.style.display = 'none';
                            toggleCommentButton.textContent = 'Make a Comment';
                        }
                    });

                    // Append the toggle button, comment text area, and send email button to the container
                    commentContainer.appendChild(toggleCommentButton);
                    commentContainer.appendChild(commentTextArea);
                    commentContainer.appendChild(sendEmailButton);

                    // Insert the comment container above the "Make a Comment" button
                    const makeCommentButton = document.querySelector(`[data-bill-id="${billId}"]`);
                    makeCommentButton.parentNode.insertBefore(commentContainer, makeCommentButton);
                } else {
                    console.error(`No comment found for bill ID ${billId} in ${interest}_comments.json`);
                }
            } else {
                console.error(`Invalid data structure in ${interest}_comments.json`);
            }
        })
        .catch(error => {
            console.error(`Error loading comments from ${interest}_comments.json:`, error);
        });
}
document.addEventListener("DOMContentLoaded", () => {
    const billList = document.getElementById("billList");
    const selectedInterestsArray = JSON.parse(localStorage.getItem("selectedInterestsArray"));

    if (selectedInterestsArray) {
        const billIdSet = new Set();

        const fetchPromises = selectedInterestsArray.map(interest => {
            const dataURL = `bills/${interest}_data.json`;
            return fetch(dataURL)
                .then(response => response.json())
                .then(data => {
                    return data.map(bill => {
                        if (!billIdSet.has(bill.bill_id)) {
                            billIdSet.add(bill.bill_id);
                            // Create an array to store the sources
                            const sources = [interest];
                            const card = document.createElement('div');
                            card.classList.add('card', 'mb-3');
                            card.style.border = '2px solid #ccc';
                            card.style.boxShadow = '3px 3px 5px #888';
                            card.innerHTML = `
                                <div class="card-body">
                                    <h6 class="card-subtitle mb-2 text-muted text-center">${bill.bill_id}</h6>
                                    <h5 class="card-title text-center">${bill.short_title}</h5>
                                    <p>Summary: ${bill.title}</p>
                                    <p>Full Text: <a href="${bill.full_text}" target="_blank">${bill.full_text}</a></p>
                                    <p class="card-text">Source: ${sources.join(', ')}</p>
                                    <button class="btn btn-primary d-block mx-auto" 
                                        data-bill-id="${bill.bill_id}" 
                                        onclick="showComments('${interest}', '${bill.bill_id}')">
                                        Make a Comment
                                    </button>
                                </div>
                            `;
                            return { card, sources };
                        } else {
                            return null;
                        }
                    });
                })
                .catch(error => {
                    console.error(`Error loading JSON data for interest '${interest}':`, error);
                    return [];
                });
        });

        Promise.all(fetchPromises)
            .then(cardsArrays => {
                const allCards = cardsArrays.flat().filter(item => item !== null);
                allCards.forEach(({ card, sources }) => {
                    // Append the card to the billList
                    billList.appendChild(card);
                    // Update the sources for each bill
                    card.querySelector('.card-text').textContent = `Source: ${sources.join(', ')}`;
                });
            })
            .catch(error => {
                console.error("Error handling fetched data:", error);
            });
    } else {
        console.error("No interests selected.");
    }
});
