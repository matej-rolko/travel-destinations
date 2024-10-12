/* eslint-disable no-undef */
async function getDestinations() {
    try {
        const response = await fetch(
            "http://localhost:3000/api/v1/destinations",
        );

        if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}`);
        }

        const result = await response.json();

        result.data.forEach((d) => createCard(d));
        console.log(result.data);

        return result;
    } catch (e) {
        console.log(e);
    }
}

getDestinations();

function createCard(destination) {
    // Create card container
    const card = document.createElement("div");
    card.classList.add("card");

    // Create image element
    const img = document.createElement("img");
    img.classList.add("card", "img");
    img.src = "/src/frontend/public/images/copenhagen.jpg";

    // Create card content container
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    // Create country element
    const country = document.createElement("div");
    country.classList.add("country");
    country.textContent = destination.country;

    // Create visited date element
    // const visited = document.createElement("div");
    // visited.classList.add("visited");
    // visited.textContent = destination.visitedDates;

    // Create title element
    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = destination.title;

    // Create description element
    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent = destination.description;

    // Append all elements to card content
    cardContent.appendChild(country);
    // cardContent.appendChild(visited);
    cardContent.appendChild(title);
    cardContent.appendChild(description);

    // Append image and card content to card
    card.appendChild(img);
    card.appendChild(cardContent);

    // Add card to the DOM, e.g., to a container with id "card-container"
    document.querySelector(".card-list").appendChild(card);
}
