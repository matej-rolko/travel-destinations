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
    } catch (e) {
      console.log("Login failed:", error);
    }
  }
}


//  Signup Functionilities
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", (e) => signUp(e));

function signup(e) {
  e.preventDefault();

  const firstName = form["firstName"].value;
  const lastName = form["lastName"].value;
  const username = form["username"].value;
  const password = form["password"].value;

  signUp(firstName, lastName, username, password);
}

async function signUp(firstName, lastName, username, password) {
  if (
    firstName.trim() &&
    lastName.trim() &&
    username.trim() &&
    password.trim()
  ) {
    try {
      const response = await fetch("www.dd.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpUserDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success: ", result);
    } catch (e) {
      console.log("Unsuccessfull: ", e);
    }
  } else {
    console.log("Signup information is not valid");
  }
}




const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

// Switch to Signup Form
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    loginForm.style.display = 'none'; // Hide Login Form
    signupForm.style.display = 'block'; // Show Signup Form
});

// Switch to Login Form
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    signupForm.style.display = 'none'; // Hide Signup Form
    loginForm.style.display = 'block'; // Show Login Form
});