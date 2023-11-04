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
                            const card = document.createElement('div');
                            card.classList.add('card', 'mb-3');
                            card.style.border = '2px solid #ccc';
                            card.style.boxShadow = '3px 3px 5px #888';

                            const interestsText = selectedInterestsArray.join(', '); // Concatenate all interests
                            card.innerHTML = `
                                <div class="card-body">
                                    <h6 class="card-subtitle mb-2 text-muted text-center">${bill.bill_id}</h6>
                                    <h5 class="card-title text-center">${bill.short_title}</h5>
                                    <p class="card-text">Full Title: ${bill.title}</p>
                                    <p class="card-text">Full Text: ${bill.full_text}</p>
                                    <p class="card-text">Source: ${interestsText}</p> <!-- Display all interests -->
                                    <a href="javascript:void(0);" class="btn btn-primary d-block mx-auto" onclick="showComments('${interest}', '${bill.bill_id}')">Make a Comment</a>
                                </div>
                            `;
                            return card;
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
                const allCards = cardsArrays.flat().filter(card => card !== null);
                allCards.forEach(card => billList.appendChild(card));
            })
            .catch(error => {
                console.error("Error handling fetched data:", error);
            });
    } else {
        console.error("No interests selected.");
    }
});

function showComments(interest, billId) {
    const commentsURL = `comments/${interest}_comments.json`;

    fetch(commentsURL)
        .then(response => response.json())
        .then(data => {
            const comment = data.find(comment => comment.bill_id === billId);

            if (comment) {
                const editableField = document.createElement('textarea');
                editableField.value = comment.commentText;
                const modal = document.createElement('div');
                modal.appendChild(editableField);
                // Append the modal to the document or display it as needed
                // ...
            } else {
                console.error(`No comment found for bill ID ${billId} in ${interest}_comments.json`);
            }
        })
        .catch(error => {
            console.error(`Error loading comments from ${interest}_comments.json:`, error);
        });
}
