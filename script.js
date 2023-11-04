document.addEventListener("DOMContentLoaded", function () {
    const nonprofitButtons = document.querySelectorAll('.nonprofit-button');
    const interestButtons = document.querySelectorAll('.interest-button');
    const selectedInterests = document.getElementById("selected-interests");
    const interestsList = selectedInterests.querySelector("ul");

    const selectedInterestsArray = [];
    const manuallySelectedInterests = [];

    const interestsForNonprofits = {
        '350': ["Coal", "Oil", "Natural Gas", "Solar", "Wind", "Geothermal", "Deforestation", "Environmental Justice"],
        'Acterra': ["Electric Vehicles", "Building Electrification", "Bike Lanes"],
        'Sierra Club': ["Tobacco", "Wildlife", "National Park", "Environmental Justice", "Clean Air", "Clean Water", "Fracking", "Climate Resilience"],
        'ClimateHealthNow': ["Asthma", "Climate Health", "Environmental Justice", "Healthcare Sustainability", "Healthcare Decarbonization"],
        'GreenTeamPower': ["Drought", "Flood", "Wildfire", "Coal", "Oil", "Natural Gas", "Solar", "Wind", "Hydropower", "Geothermal", "Conservation", "Sustainable Agriculture"],
		'SunriseMovement': ["Coal", "Oil", "Natural Gas", "Solar", "Wind", "Geothermal", "Hydropower", "Clean Air", "Clean Water", "Environmental Justice", "Affordable Housing"],
		'YouthVsApocalypse': ["Coal", "Oil", "Natural Gas", "Solar", "Wind", "Geothermal", "Clean Air", "Climate Education", "Environmental Justice"]
    };

    // Function to set interests for a nonprofit
    function setInterestsForNonprofit(organization) {
        const interests = interestsForNonprofits[organization];
        interests.forEach((interest) => {
            const interestButton = document.querySelector(`.interest-button[data-interest="${interest}"]`);
            if (interestButton) {
                if (!selectedInterestsArray.includes(interest) && !manuallySelectedInterests.includes(interest)) {
                    interestButton.classList.add("selected");
                    selectedInterestsArray.push(interest);
                }
            }
        });
    }

    // Function to update the interests list
    function updateInterestsList() {
		/*
		interestsList.innerHTML = "";
        selectedInterestsArray.forEach((interest) => {
            const listItem = document.createElement("li");
            listItem.textContent = interest;
            interestsList.appendChild(listItem);
        });
		*/
		localStorage.setItem("selectedInterestsArray", JSON.stringify(selectedInterestsArray));
    }

    // Event listener for nonprofit buttons
    nonprofitButtons.forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const organization = button.getAttribute('data-nonprofit');

            if (button.classList.contains('active')) {
                setInterestsForNonprofit(organization);
            } else {
                const interests = interestsForNonprofits[organization];
                interests.forEach((interest) => {
                    const interestButton = document.querySelector(`.interest-button[data-interest="${interest}"]`);
                    if (interestButton) {
                        const otherNonprofits = Array.from(nonprofitButtons)
                            .filter((nonprofit) => nonprofit !== button && nonprofit.classList.contains('active'));
                        const otherNonprofitSelected = otherNonprofits.some((nonprofit) =>
                            interestsForNonprofits[nonprofit.getAttribute('data-nonprofit')].includes(interest)
                        );
                        if (!otherNonprofitSelected && !manuallySelectedInterests.includes(interest)) {
                            interestButton.classList.remove("selected");
                            const index = selectedInterestsArray.indexOf(interest);
                            if (index > -1) {
                                selectedInterestsArray.splice(index, 1);
                            }
                        }
                    }
                });
            }

            updateInterestsList();
        });
    });

    interestButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const interest = button.getAttribute("data-interest");
			const wasManuallySelected = button.getAttribute("data-manual") === "true";

			button.classList.toggle("selected");

			if (button.classList.contains("selected")) {
				if (!selectedInterestsArray.includes(interest)) {
					selectedInterestsArray.push(interest);
				}
			} else {
				if (!wasManuallySelected) {
					const index = selectedInterestsArray.indexOf(interest);
					if (index > -1) {
						selectedInterestsArray.splice(index, 1);
					}
				}
			}

			// Update the interests list immediately
			updateInterestsList();
		});
	});
	
	/*
	document.getElementById("toggle").addEventListener("click", function () {
		// Toggle the 'hidden' class on all paragraphs
		var paragraphs = document.querySelectorAll(".hidden");
		for (var i = 0; i < paragraphs.length; i++) {
			if (paragraphs[i].style.display === "block") {
				paragraphs[i].style.display = "none";
			} else {
				paragraphs[i].style.display = "block";
			}
		}
	});
	
	document.getElementById("form-dropdown").addEventListener("click", function () {
		var newsContent = document.getElementById("news-content");
		if (newsContent.style.display === "none" || newsContent.style.display === "") {
			newsContent.style.display = "block";
		} else {
			newsContent.style.display = "none";
		}
	});
	*/
	
	var navLinks = document.querySelectorAll('.navbar a');
	var headerHeight = 120;

	// Add a click event listener to each navigation link
	navLinks.forEach(function (link) {
		link.addEventListener('click', function (event) {
			event.preventDefault(); // Prevent the default jump

			var targetId = this.getAttribute('href').substring(1); // Get the target ID
			var targetElement = document.getElementById(targetId); // Get the target element

			if (targetElement) {
				var offsetTop = targetElement.offsetTop - headerHeight; // Adjust for header
				window.scrollTo({
					top: offsetTop,
					behavior: 'smooth' // Smooth scrolling
				});
			}
		});
	});
	
	const interestsSection = document.querySelector('.interests-section');
    const submitButton = document.querySelector('.submit-button'); // Select the submit button

    let interestsActivated = false;

    // Function to set the interests section as active
    function activateInterestsSection() {
        interestsActivated = true;
        interestsSection.classList.add('active');
        submitButton.style.display = 'block'; // Display the submit button
    }

    // Add click event listener to activate the interests section
    interestsSection.addEventListener('click', function (event) {
        if (!interestsActivated) {
            activateInterestsSection();
        }
    });

    // Add click event listeners to the nonprofit buttons
    nonprofitButtons.forEach((button) => {
        button.addEventListener('click', activateInterestsSection);
    });
	
	// index.html
	document.getElementById("bill-submit").addEventListener("click", function () {
	  // Print the interestsList before storing it
	  console.log("Interests List (in index.html):", selectedInterestsArray);
	});


    // Initialize interests list
    updateInterestsList();
});