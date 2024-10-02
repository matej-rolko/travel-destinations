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


// Log in button functionility to render login page
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  window.location.href = "/src/frontend/login/login.html";
})