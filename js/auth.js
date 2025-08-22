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

      // Encode password before saving (demo purpose)
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
        // Save session
        sessionStorage.setItem("loggedInUser", JSON.stringify(userData));

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
  sessionStorage.removeItem("loggedInUser");
  alert("👋 Logged out successfully!");
  window.location.href = "login.html";
}

// ============================
// CHECK LOGIN STATUS
// ============================
function checkLogin() {
  const user = sessionStorage.getItem("loggedInUser");
  if (!user) {
    alert("⚠️ Please login to access this page!");
    window.location.href = "login.html";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Register new user
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if email already exists
      if (users.some((u) => u.email === email)) {
        alert("Email already registered! Please login.");
        window.location.href = "login.html";
        return;
      }

      users.push({ name, phone, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registered successfully! Please login.");
      window.location.href = "login.html";
    });
  }

  // Login existing user
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid email or password!");
      }
    });
  }
});
