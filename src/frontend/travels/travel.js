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

        listAllTheTravelDestination(result.data);
        console.log(result.data);

        return result;
    } catch (e) {
        console.log(e);
    }
}

getTravel();

// const travelDestinations = [
//     {
//         id: 1,
//         destination: "Copenhagen",
//         location: "CPHBusiness, Lyngby",
//         description: "We are studing there!",
//     },
//     {
//         id: 2,
//         destination: "Roskild",
//         location: "CPHBusiness, Lyngby",
//         description: "We are studing there!",
//     },
//     {
//         id: 3,
//         destination: "Alborg",
//         location: "CPHBusiness, Lyngby",
//         description: "We are studing there!",
//     },
//     {
//         id: 4,
//         destination: "Aarhus",
//         location: "CPHBusiness, Lyngby",
//         description: "We are studing there!",
//     },
// ];

function listAllTheTravelDestination(travelDestinations) {
    const list = document.getElementById("list");

    if (travelDestinations && Array.isArray(travelDestinations)) {
        travelDestinations.map((travel) => {
            const li = document.createElement("li");
            li.innerText = travel.country;
            list.appendChild(li);
        });
    }
    return;
}

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

// async function deleteTravelDestinations(destinationId) {
//     try {
//         const response = await fetch(`www.w.com/${destinationId}`, {
//             method: "DELETE",
//         });

//         if (!response.ok) {
//             throw new Error(`Http error! statuscode: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log("Delete successful", result);
//     } catch (e) {
//         console.log("Delete unsuccessful");
//     }
// }
