/* eslint-disable no-undef */
async function getTravel() {
    try {
        const response = await fetch(
            "http://localhost:3000/api/v1/destinations",
        );

        if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}`);
        }

        const result = await response.json();

        result.data.forEach((d) => createTravelCard(d));

        console.log(result.data)

        // createCard(result.data);

        // listAllTheTravelDestination(result.data);

        console.log(result.data);

        return result;
    } catch (e) {
        console.log(e);
    }
}

getTravel();

function createTravelCard(travel) {
    // Create the card container
    const card = document.createElement('div');
    card.classList.add('card');

    // Create the image element
    const img = document.createElement('img');
    img.classList.add('card', 'img');
    img.src = './images/copenhagen.jpg';
    img.alt = travel.altText;

    // Create the card content container
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    // Create the country element
    const country = document.createElement('div');
    country.classList.add('country');
    country.textContent = travel.country;

    // Create the visited date element
    const visited = document.createElement('div');
    visited.classList.add('visited');
    visited.textContent = travel.visitedDates;

    // Create the title element
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = travel.title;

    // Create the description element
    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = travel.description;

     // Create the update button element
     const updateBtn = document.createElement("button");
     updateBtn.classList.add('button');
     updateBtn.textContent = "Update";

     // Create the delete button element
     const deleteBtn = document.createElement("button");
     deleteBtn.classList.add('button');
     deleteBtn.textContent = "Delete";

    // Append elements to the card content
    cardContent.appendChild(country);
    cardContent.appendChild(visited);
    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(updateBtn)
    cardContent.appendChild(deleteBtn)

    // Append the image and card content to the card
    card.appendChild(img);
    card.appendChild(cardContent);

    // Append the card to a container with id 'travel-cards-container'
    document.getElementById('travels-cards').appendChild(card);
}