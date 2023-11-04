document.addEventListener("DOMContentLoaded", () => {
    const billList = document.getElementById("billList");
	const selectedInterestsArray = JSON.parse(localStorage.getItem("selectedInterestsArray"));
	
	if (selectedInterestsArray) {
		console.log(selectedInterestsArray);
		
		const fetchPromises = selectedInterestsArray.map(interest => {
            const dataURL = `bills/${interest}_data.json`;
            return fetch(dataURL)
                .then(response => response.json())
                .then(data => {
                    return data.map(bill => {
                        const card = document.createElement('div');
                        card.classList.add('card', 'mb-3');
                        card.style.border = '2px solid #ccc';
                        card.style.boxShadow = '3px 3px 5px #888';
                        card.innerHTML = `
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted text-center">${bill.bill_id}</h6>
                                <h5 class="card-title text-center">${bill.short_title}</h5>
                                <p class="card-text">Full Title: ${bill.title}</p>
                                <p class="card-text">Full Text: ${bill.full_text}</p>
                                <a href="public_comments.html?id=${bill.bill_id}" class="btn btn-primary d-block mx-auto">Make a Comment</a>
                            </div>
                        `;
                        return card;
                    });
                })
                .catch(error => {
                    console.error(`Error loading JSON data for interest '${interest}':`, error);
                    return []; // Return an empty array if there was an error.
                });
        });

        // Wait for all fetch operations to complete and then add the cards to the billList
        Promise.all(fetchPromises)
            .then(cardsArrays => {
                const allCards = cardsArrays.flat(); // Flatten the array of arrays
                allCards.forEach(card => billList.appendChild(card));
            })
            .catch(error => {
                console.error("Error handling fetched data:", error);
            });
    }

	else {
		console.error("No interests selected.");
		// Handle the case where the variable is not available
	}
});