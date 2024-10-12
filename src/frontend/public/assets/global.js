/* eslint-disable no-undef */
const navLogInOutBtn = document.getElementById("navLogInOutBtn");

function navLogInOutBtnFunctionalities() {
    navLogInOutBtn.innerText = getCookie("token") ? "Log Out" : "Log in";

    if (navLogInOutBtn.innerText === "Log Out") {
        navLogInOutBtn.style.cursor = "pointer";
        navLogInOutBtn.addEventListener("click", logOut);
        // navLogInOutBtn.href = "/src/frontend/public/index.html";
    } else {
        navLogInOutBtn.href =
            "/src/frontend/public/loginSignup/loginSignup.html";
    }
}
navLogInOutBtnFunctionalities();

// Log out functionality
async function logOut() {
    const token = getCookie("token");

    try {
        const response = await fetch(
            "http://localhost:3000/api/v1/auth/logout",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                }),
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Login successful:", result);
        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.replace("/src/frontend/public/index.html");
    } catch (error) {
        console.log("Logout failed:", error);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}
