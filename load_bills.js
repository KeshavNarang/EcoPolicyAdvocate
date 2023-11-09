document.addEventListener("DOMContentLoaded", () => {
    const billList = document.getElementById("billList");
    const selectedInterestsArray = JSON.parse(localStorage.getItem("selectedInterestsArray"));

    if (selectedInterestsArray) {
        const billIdSet = new Set();
        const billSources = {}; // Object to store sources for each bill

        const fetchPromises = selectedInterestsArray.map(interest => {
            const dataURL = `bills/${interest}_data.json`;
            return fetch(dataURL)
                .then(response => response.json())
                .then(data => {
                    return data.map(bill => {
                        if (!billIdSet.has(bill.bill_id)) {
                            billIdSet.add(bill.bill_id);
                            // Update the sources for this bill
                            if (!billSources[bill.bill_id]) {
                                billSources[bill.bill_id] = [interest];
                            } else {
                                billSources[bill.bill_id].push(interest);
                            }
                            // Create a card for the bill
                            const card = document.createElement('div');
                            card.classList.add('card', 'mb-3');
                            card.style.border = '2px solid #ccc';
                            card.style.boxShadow = '3px 3px 5px #888';
                            card.innerHTML = `
                                <div class="card-body">
                                    <h6 class="card-subtitle mb-2 text-muted text-center ${getBillIDStyle(bill.bill_id)}">
                                        ${bill.bill_id} (source: ${billSources[bill.bill_id].join(', ')})
                                    </h6>
                                    <h5 class="card-title text-center">${bill.short_title}</h5>
                                    <p>Summary: ${bill.title}</p>
                                    <p>Full Text: <a href="${bill.full_text}" target="_blank">${bill.full_text}</a></p>
                                    <button class="btn btn-primary d-block mx-auto"
                                        data-bill-id="${bill.bill_id}"
                                        onclick="toggleComment(this, '${interest}', '${bill.bill_id}')">
                                        Make a Comment
                                    </button>
                                    <div class="comment-container" style="display: none;">
                                        <textarea style="width: 100%; height: 100px;"></textarea>
                                        <button style="display: none;">Send an Email</button>
                                    </div>
                                </div>
                            `;
                            return { card };
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
                if (allCards.length > 0) {
                    allCards.forEach(({ card }) => {
                        // Append the card to the billList
                        billList.appendChild(card);
                    });
                } else {
                    const message = document.createElement('p');
                    message.textContent = `Sorry, there are no ${selectedInterestsArray.length === 1 ? 'bill' : 'bills'} for the selected topic${selectedInterestsArray.length === 1 ? '' : 's'} this time`;
                    billList.appendChild(message);
                }
            })
            .catch(error => {
                console.error("Error handling fetched data:", error);
            });
    } else {
        console.error("No interests selected.");
    }
});

function toggleComment(button, interest, billId) {
    const commentContainer = button.parentElement.querySelector('.comment-container');
    const toggleButton = button;
    if (commentContainer.style.display === 'none') {
        commentContainer.style.display = 'block';
        toggleButton.textContent = 'Hide the Comment';
        showComments(interest, billId);
    } else {
        commentContainer.style.display = 'none';
        toggleButton.textContent = 'Make a Comment';
    }
}

function showComments(interest, billId) {
    const commentsURL = `comments/${interest}_comments.json`;

    fetch(commentsURL)
        .then(response => response.json())
        .then(data => {
            if (typeof data === 'object' && data !== null) {
                const commentText = data[billId];
                if (commentText) {
                    const commentContainer = document.querySelector(`.comment-container`);
                    const commentTextArea = commentContainer.querySelector('textarea');
                    commentTextArea.value = commentText;

                    // Show the comment container and the "Send Email" button
                    commentContainer.style.display = 'block';
                    commentContainer.querySelector('button').style.display = 'block';
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

function getBillIDStyle(billID) {
    if (billID.startsWith('hr')) {
        return 'house-rep';
    } else if (billID.startsWith('s')) {
        return 'senate';
    } else {
        return '';
    }
}
