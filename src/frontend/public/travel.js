function createTravelCard(travel) {
    // Create the card container
    const card = document.createElement('div');
    card.classList.add('card');

    // Create the image element
    const img = document.createElement('img');
    img.classList.add('card', 'img');
    img.src = travel.imageSrc;
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

    // Append elements to the card content
    cardContent.appendChild(country);
    cardContent.appendChild(visited);
    cardContent.appendChild(title);
    cardContent.appendChild(description);

    // Append the image and card content to the card
    card.appendChild(img);
    card.appendChild(cardContent);

    // Append the card to a container with id 'travel-cards-container'
    document.getElementById('travel-cards-container').appendChild(card);
}