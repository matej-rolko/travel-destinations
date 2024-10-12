function createCard(destination) {
    // Create card container
    const card = document.createElement('div');
    card.classList.add('card');

    // Create image element
    const img = document.createElement('img');
    img.classList.add('card', 'img');
    img.src = destination.image_url;

    // Create card content container
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    // Create country element
    const country = document.createElement('div');
    country.classList.add('country');
    country.textContent = destination.country;

    // Create visited date element
    const visited = document.createElement('div');
    visited.classList.add('visited');
    visited.textContent = destination.visitedDates;

    // Create title element
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = destination.title;

    // Create description element
    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = destination.description;

    // Append all elements to card content
    cardContent.appendChild(country);
    cardContent.appendChild(visited);
    cardContent.appendChild(title);
    cardContent.appendChild(description);

    // Append image and card content to card
    card.appendChild(img);
    card.appendChild(cardContent);

    // Add card to the DOM, e.g., to a container with id "card-container"
    document.getElementById('card-container').appendChild(card);
}