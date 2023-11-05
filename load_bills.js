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

                    // Create a paragraph to display the comment text
                    const commentParagraph = document.createElement('p');
                    commentParagraph.textContent = commentText;

                    // Append the comment paragraph to the container
                    commentContainer.appendChild(commentParagraph);

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
                                    <a href="javascript:void(0);" class="btn btn-primary d-block mx-auto" 
                                        data-bill-id="${bill.bill_id}" 
                                        onclick="showComments('${interest}', '${bill.bill_id}')">
                                        Make a Comment
                                    </a>
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
