/* eslint-disable no-undef */
function createTravelCard(travel) {
    // Create the card container
    const card = document.createElement("div");
    card.classList.add("card");

    // Create the image element
    const img = document.createElement("img");
    img.classList.add("card-img");
    img.src = "./images/copenhagen.jpg";
    img.alt = travel.altText;

    // Create the card content container
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    // Create the country element
    const country = document.createElement("div");
    country.classList.add("country");
    country.textContent = travel.country;

    // Create the visited date element
    const visited = document.createElement("div");
    visited.classList.add("visited");
    visited.textContent = travel.visitedDates;

    // Create the title element
    const title = document.createElement("a");
    title.classList.add("card-title");
    title.textContent = travel.title;
    title.href = "#";

    // Create the description element
    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent =
        travel.description +
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut posuere nulla. Vestibulum viverra ipsum eget odio facilisis, ornare vehicula orci tincidunt. Etiam eu aliquet eros.";

    const editButton = document.createElement("img");
    editButton.classList.add("edit-button");
    editButton.src = "./images/edit-icon.png";
    editButton.title = "Edit";

    const deleteButton = document.createElement("img");
    deleteButton.classList.add("delete-button");
    deleteButton.src = "./images/delete-icon.png";
    deleteButton.title = "Delete";
    deleteButton.addEventListener("click", () =>
        deleteTravelDestinations(travel._id),
    );

    // Append elements to the card content
    cardContent.appendChild(country);
    cardContent.appendChild(visited);
    cardContent.appendChild(title);
    cardContent.appendChild(description);

    cardContent.appendChild(editButton);
    cardContent.appendChild(deleteButton);

    // Append the image and card content to the card
    card.appendChild(img);
    card.appendChild(cardContent);

    // Append the card to a container with id 'travel-cards-container'
    document.getElementById("travels-cards").appendChild(card);
}

async function getTravel() {
    try {
        const token = getCookie("token");

        const response = await fetch(
            "http://localhost:3000/api/v1/destinations",
            {
                method: "GET",
                headers: {
                    token: token,
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}`);
        }

        const result = await response.json();

        result.data.forEach((d) => createTravelCard(d));

        console.log(result.data);
        return result;
    } catch (e) {
        console.log(e);
    }
}
getTravel();

const travelForm = document.getElementById("travelForm");
travelForm.addEventListener("submit", (e) => postTravelDestinations(e));

async function postTravelDestinations(e) {
    e.preventDefault();

    const title = travelForm["title"].value;
    const address = travelForm["address"].value;
    const country = travelForm["country"].value;
    const description = travelForm["description"].value;
    //   const picture = destinationForm["picture"].files[0];

    if (
        title.trim() &&
        address.trim() &&
        country.trim() &&
        description.trim()
    ) {
        const travelDestination = new URLSearchParams({
            title,
            address,
            country,
            description,
            image_url: "blank/blank",
        }).toString();

        try {
            const token = getCookie("token");
            const response = await fetch(
                "http://localhost:3000/api/v1/destinations",
                {
                    method: "POST",
                    headers: {
                        token: token,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: travelDestination,
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Post successfull", result);
            window.location.reload(true);
        } catch (e) {
            console.log("Post unsuccessfull", e);
        }
    } else {
        console.log("Please fill in all the required fields");
    }
}

// async function updateTravelDestination(e, destinationId) {
//     e.preventDefault();

//     const title = destinationForm["title"].value;
//     const address = destinationForm["address"].value;
//     const country = destinationForm["country"].value;
//     const description = destinationForm["description"].value;
//     //   const picture = destinationForm["picture"].files[0];

//     if (
//         title.trim() &&
//         address.trim() &&
//         country.trim() &&
//         description.trim()
//     ) {
//         const travelDestination = {
//             title,
//             address,
//             country,
//             description,
//         };

//         try {
//             const response = await fetch(`ww.w.com/${destinationId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(travelDestination),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("Update successful", result);
//         } catch (e) {
//             console.log("Update unsuccessful", e);
//         }
//     } else {
//         console.log("Please fill in all the required fields");
//     }
// }

async function deleteTravelDestinations(destinationId) {
    try {
        const token = getCookie("token");

        const response = await fetch(
            `http://localhost:3000/api/v1/destinations/${destinationId}`,
            {
                method: "DELETE",
                headers: { token: token },
            },
        );

        if (!response.ok) {
            throw new Error(`Http error! statuscode: ${response.status}`);
        }

        const result = await response.json();
        console.log("Delete successful", result);
        alert("User has been succesfully deleted");
        window.location.replace("./travel.html");
    } catch (e) {
        console.log("Delete unsuccessful", e);
    }
}
