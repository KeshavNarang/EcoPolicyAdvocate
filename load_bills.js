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
						const label = getBillIDStyle(bill.bill_id);
						const card = document.createElement('div');
						card.classList.add('card', 'mb-3');
						card.style.border = '2px solid #ccc';
						card.style.boxShadow = '3px 3px 5px #888';
						card.innerHTML = `
							<div class="card-body" id="${bill.bill_id}">
								<h6 class="card-subtitle mb-2 text-muted text-center bill-id">
									${bill.bill_id}${label}
								</h6>
								<h5 class="card-title text-center">${bill.short_title}</h5>
								<p>Summary: ${bill.title}</p>
								<p>Full Text: <a href="${bill.full_text}" target="_blank">${bill.full_text}</a></p>
								<p class="card-text" id="sources-${bill.bill_id}">Source: ${interest}</p>
								<button class="btn btn-primary d-block mx-auto"
									data-bill-id="${bill.bill_id}"
									onclick="toggleComment(this, '${interest}', '${bill.bill_id}')">
									Make a Comment
								</button>
								<div class="comment-container" style="display: none;">
									<textarea style="width: 100%; height: 100px;"></textarea>
								</div>
							</div>
						`;
						return { card };
					} else {
						const sources = document.getElementById(`sources-${bill.bill_id}`);
						if (sources) {
							console.log(sources);
							sources.textContent += `, ${interest}`;
							const card = document.getElementById(`${bill.bill_id}`);
						}
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
        createEmailButton(button, interest, billId);
    } else {
        commentContainer.style.display = 'none';
        toggleButton.textContent = 'Make a Comment';
	const delbutton = document.querySelector('.send-email');
	if (delbutton){
		delbutton.parentNode.removeChild(delbutton);
	}
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
                    const commentContainer = document.getElementById(`${billId}`).querySelector('.comment-container');
                    const commentTextArea = commentContainer.querySelector('textarea');
                    commentTextArea.value = commentText;

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

// Modify the getBillIDStyle function to check the first two characters of the bill ID
function getBillIDStyle(billID) {
    let label = '';

    if (billID.startsWith('hr')) {
        label = ' (House of Representatives)';
    } else if (billID.startsWith('s')) {
        label = ' (Senate)';
    }

    return label;
}

function createEmailButton(button, interest, billId) {
    const commentContainer = button.parentElement.querySelector('.comment-container');
    const emailButton = document.createElement('button');
    emailButton.classList.add('send-email');
    emailButton.textContent = 'Send an Email';
    emailButton.addEventListener('click', () => sendEmail(interest, billId, commentContainer.querySelector('textarea').value));
    commentContainer.appendChild(emailButton);
}

function sendEmail(interest, billId, commentText) {
    const subject = `I urge your support for Bill ${billId}`;
    const body = commentText;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
}
