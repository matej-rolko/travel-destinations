/* eslint-disable no-undef */
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => handleLogin(e));

function handleLogin(e) {
    e.preventDefault();

    const username = loginForm["username"];
    const password = loginForm["password"];

    authenticateUser(username, password);
}

async function authenticateUser(username, password) {
    if (username.trim() && password.trim()) {
        try {
            const response = await fetch("ww.ww.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Login successful:", result);
        } catch (error) {
            console.log("Login failed:", error);
        }
    }
}

//  Signup Functionilities
const signupForm = document.getElementById("signupForm");
const signUpFormMsg = document.getElementById("signUpFormMsg");

signupForm.addEventListener("submit", (e) => handleSignup(e));

function handleSignup(e) {
    e.preventDefault();

    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_Name").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("SignUpUsername").value;
    const password = document.getElementById("SignUpPassword").value;
    const created = new Date().toISOString();
    const isAdmin = true;

    console.log(username);

    signUp(first_name, last_name, email, username, password, created, isAdmin);
}

async function signUp(
    first_name,
    last_name,
    email,
    username,
    password,
    created,
    isAdmin,
) {
    console.log({
        first_name,
        last_name,
        email,
        username,
        password,
        created,
        isAdmin,
    });
    if (
        first_name.trim() &&
        last_name.trim() &&
        email &&
        username.trim() &&
        password.trim() &&
        created &&
        isAdmin
    ) {
        const signUpUserDetails = new URLSearchParams({
            first_name,
            last_name,
            email,
            username,
            password,
            created,
            isAdmin,
        }).toString();

        console.log(signUpUserDetails);

        try {
            const response = await fetch("http://localhost:3000/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: signUpUserDetails,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Success: ", result);

            alert('"User has been succesfully created";');
            window.location.replace("./loginSignup.html");
        } catch (e) {
            console.log("Unsuccessfull: ", e);
            signUpFormMsg.style.color = "red";
            signUpFormMsg.innerText = e;
        }
    } else {
        console.log("Signup information is not valid");
    }
}

const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");

// Switch to Signup Form
switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none"; // Hide Login Form
    signupForm.style.display = "block"; // Show Signup Form
});

// Switch to Login Form
switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.style.display = "none"; // Hide Signup Form
    loginForm.style.display = "block"; // Show Login Form
});
