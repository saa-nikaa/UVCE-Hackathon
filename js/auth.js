document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // ============================
  // REGISTER USER
  // ============================
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!name || !phone || !email || !password) {
        alert("⚠️ Please fill in all fields!");
        return;
      }

      // Check if user already exists
      if (localStorage.getItem(email)) {
        alert("⚠️ User already registered! Please login.");
        window.location.href = "login.html";
        return;
      }

      // Encrypt password (basic encoding)
      const encryptedPassword = btoa(password);

      const user = {
        name: name,
        phone: phone,
        email: email,
        password: encryptedPassword,
      };

      // Save user to localStorage
      localStorage.setItem(email, JSON.stringify(user));

      alert("✅ Registration successful! Please login.");
      window.location.href = "login.html";
    });
  }

  // ============================
  // LOGIN USER
  // ============================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        alert("⚠️ Please enter both email and password!");
        return;
      }

      const storedUser = localStorage.getItem(email);

      if (!storedUser) {
        alert("❌ User not found! Please register first.");
        window.location.href = "register.html";
        return;
      }

      const userData = JSON.parse(storedUser);
      const decryptedPassword = atob(userData.password);

      if (password === decryptedPassword) {
        // Save currently logged-in user
        localStorage.setItem("currentUser", JSON.stringify(userData));

        alert(`✅ Welcome back, ${userData.name}!`);
        window.location.href = "dashboard.html";
      } else {
        alert("❌ Incorrect password! Try again.");
      }
    });
  }
});

// ============================
// LOGOUT USER
// ============================
function logoutUser() {
  localStorage.removeItem("currentUser");
  alert("👋 Logged out successfully!");
  window.location.href = "login.html";
}

// ============================
// CHECK LOGIN STATUS
// ============================
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("⚠️ Please login to access this page!");
    window.location.href = "login.html";
  }
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  alert("👋 Logged out successfully!");
  window.location.href = "index.html"; // Redirect to homepage instead of login
}
