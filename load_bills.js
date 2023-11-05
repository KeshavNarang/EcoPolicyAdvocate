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
                                        onclick="toggleComment(this, '${interest}', '${bill.bill_id}')">
                                        Make a Comment
                                    </button>
                                    <div class="comment-container" style="display: none;">
                                        <textarea style="width: 100%; height: 100px;"></textarea>
                                        <button style="display: none;">Send an Email</button>
                                    </div>
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

function toggleComment(button, interest, billId) {
    const commentContainer = button.parentElement.querySelector('.comment-container');
    const toggleButton = button.querySelector('button');
    if (commentContainer.style.display === 'none') {
        commentContainer.style.display = 'block';
        toggleButton.textContent = 'Hide the Comment';
    } else {
        commentContainer.style.display = 'none';
        toggleButton.textContent = 'Make a Comment';
    }
}
