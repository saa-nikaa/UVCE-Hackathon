document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Register
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      alert("Registered successfully! Please login.");
      window.location.href = "login.html";
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      alert("Login successful!");
      window.location.href = "dashboard.html";
    });
  }
});
