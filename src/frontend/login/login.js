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



// Sign up button functionility to render signup page
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", () => {
  window.location.href = "/src/frontend/signup/signup.html";
})