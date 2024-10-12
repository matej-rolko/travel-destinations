/* eslint-disable no-undef */
function createTravelCard(travel) {
    // Create the card container
    const card = document.createElement("div");
    card.classList.add("card");

    // Create the image element
    const img = document.createElement("img");
    img.classList.add("card", "img");
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
    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = travel.title;

    // Create the description element
    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent = travel.description;

    // Create the update button element
    const updateBtn = document.createElement("button");
    updateBtn.classList.add("button");
    updateBtn.textContent = "Update";

    // Create the delete button element
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () =>
        deleteTravelDestinations(travel._id),
    );

    // Append elements to the card content
    cardContent.appendChild(country);
    cardContent.appendChild(visited);
    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(updateBtn);
    cardContent.appendChild(deleteBtn);

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


const destinationForm = document.getElementById("destinationForm");
destinationForm.addEventListener("submit", (e) => postTravelDestinations(e));

async function postTravelDestinations(e) {
    e.preventDefault();

    const title = destinationForm["title"].value;
    const address = destinationForm["address"].value;
    const country = destinationForm["country"].value;
    const description = destinationForm["description"].value;
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
            const response = await fetch(
                "http://localhost:3000/api/v1/destinations",
                {
                    method: "POST",
                    headers: {
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
        const response = await fetch(
            `http://localhost:3000/api/v1/destinations/${destinationId}`,
            {
                method: "DELETE",
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
