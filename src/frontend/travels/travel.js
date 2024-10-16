async function getTravel() {
    try {
        const response = await fetch("ww.w.com");

        if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}`);
        }

        const result = await response.json();

        return result;
    } catch (e) {
        console.log(e);
    }
}

const travelDestinations = [
    {
        id: 1,
        destination: "Copenhagen",
        location: "CPHBusiness, Lyngby",
        description: "We are studing there!",
        year: 2022,
    },
    {
        id: 2,
        destination: "Roskild",
        location: "CPHBusiness, Lyngby",
        description: "We are studing there!",
        year: 2025,
    },
    {
        id: 3,
        destination: "Alborg",
        location: "CPHBusiness, Lyngby",
        description: "We are studing there!",
        year: 2023,
    },
    {
        id: 4,
        destination: "Aarhus",
        location: "CPHBusiness, Lyngby",
        description: "We are studing there!",
        year: 2020,
    },
];

function createAndAppendTravelCard(
    destination,
    location,
    imgUrl,
    year,
    parentId,
) {
    // Find the parent element by its ID
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
        console.error("Parent element not found");
        return;
    }

    // Create the anchor element
    const anchor = document.createElement("a");
    anchor.href = "#";
    anchor.classList.add("travel-list__card-cont");

    // Create the list item element
    const listItem = document.createElement("li");
    listItem.classList.add("travel-list__card");

    // Create the destination paragraph
    const destinationPara = document.createElement("p");
    destinationPara.textContent = "Destination: ";
    listItem.appendChild(destinationPara);

    // Create the destination heading
    const destinationHeading = document.createElement("h3");
    destinationHeading.textContent = destination;
    listItem.appendChild(destinationHeading);

    // Create the image container div
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("travel-list__img-cont");

    // Create the image element
    const imgElement = document.createElement("img");
    imgElement.src = imgUrl;
    imgContainer.appendChild(imgElement);
    listItem.appendChild(imgContainer);

    // Create the location paragraph
    const locationPara = document.createElement("p");
    locationPara.textContent = "Location: ";
    listItem.appendChild(locationPara);

    // Create the location heading
    const locationHeading = document.createElement("h5");
    locationHeading.textContent = location;
    listItem.appendChild(locationHeading);

    // Create the year paragraph
    const yearPara = document.createElement("p");
    yearPara.textContent = "Year: ";
    listItem.appendChild(yearPara);

    // Create the year heading
    const yearHeading = document.createElement("h5");
    yearHeading.textContent = year;
    listItem.appendChild(yearHeading);

    // Append the list item to the anchor
    anchor.appendChild(listItem);

    // Append the anchor to the parent element
    parentElement.appendChild(anchor);
}

function listAllTheTravelDestination(travelDestinations) {
    const list = document.getElementById("list");

    if (travelDestinations && Array.isArray(travelDestinations)) {
        travelDestinations.map((travel) => {
            createAndAppendTravelCard(
                travel.destination,
                travel.location,
                "https://picsum.photos/200",
                travel.year,
                "list",
            );
        });
    }
    return;
}

listAllTheTravelDestination(travelDestinations);

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
        const travelDestination = {
            title,
            address,
            country,
            description,
        };

        try {
            const response = await fetch("ww.ww.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(travelDestination),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Post successfull", result);
        } catch (e) {
            console.log("Post unsuccessfull", e);
        }
    } else {
        console.log("Please fill in all the required fields");
    }
}

async function updateTravelDestination(e, destinationId) {
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
        const travelDestination = {
            title,
            address,
            country,
            description,
        };

        try {
            const response = await fetch(`ww.w.com/${destinationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(travelDestination),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Update successful", result);
        } catch (e) {
            console.log("Update unsuccessful", e);
        }
    } else {
        console.log("Please fill in all the required fields");
    }
}

async function deleteTravelDestinations(destinationId) {
    try {
        const response = await fetch(`www.w.com/${destinationId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Http error! statuscode: ${response.status}`);
        }

        const result = await response.json();
        console.log("Delete successful", result);
    } catch (e) {
        console.log("Delete unsuccessful");
    }
}
