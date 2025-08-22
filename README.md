# UVCE-Hackathon
# 🌾 AgriConnect – Empowering Farmers Digitally

AgriConnect is a **web-based platform** designed to **empower farmers** and **buyers** by providing a **secure marketplace** for crops, an **equipment rental hub**, **AI-powered advisory**, and a **community forum** for collaboration.  
The platform ensures **secure authentication**, smooth navigation, and a **modern dashboard** for managing activities efficiently.

---

## 🚀 Features

### 👤 User Management
- Secure **user authentication** (Registration & Login)
- Password encryption for better security *(future enhancement)*
- Role-based access for **farmers**, **buyers**, and **admins**

### 📊 Dashboard
- Personalized dashboard for farmers
- Displays total earnings, crop listings, equipment rentals, and community rank
- Quick access to Marketplace, Equipment Hub, AI Advisory, and Community Forum

### 🛒 Marketplace
- Farmers can **list crops** with price and quantity
- Buyers can **browse**, **bid**, and **purchase crops**
- Real-time crop availability tracking

### 🚜 Equipment Hub
- Rent or lend farming equipment
- View available tools with pricing and usage details

### 🤖 AI-Powered Advisory
- AI-driven recommendations on:
  - Weather-based crop selection
  - Fertilizer usage
  - Pest control tips
  - Water management strategies

### 💬 Community Forum
- Farmers, buyers, and experts can interact
- Share experiences, tips, and agricultural news

---

## 🛠️ Tech Stack

| **Category**      | **Technology** |
|--------------------|---------------|
| **Frontend**      | HTML5, CSS3, JavaScript |
| **Backend**       | Node.js / Express.js *(Optional for future)* |
| **Database**      | MySQL / MongoDB *(Pluggable)* |
| **Authentication**| JSON Web Tokens (JWT) / LocalStorage *(currently local)* |
| **UI Icons**      | FontAwesome |
| **Version Control** | Git & GitHub |

---

## 📂 Project Structure

AgriConnect/
│
│── index.html          # Homepage
│── register.html       # Registration page
│── login.html          # Login page
│── dashboard.html      # User dashboard
│── marketplace.html    # Marketplace for crops
│── equipment.html      # Equipment rental hub
│── advisory.html       # AI advisory section
│── community.html      # Community forum
│
│── css/
│   │── style.css       # Main styling file
│
│── js/
│   │── auth.js         # Handles login & registration
│   │── dashboard.js    # Manages dashboard data
│   │── marketplace.js  # Handles marketplace actions
│
│── assets/
│   │── logo.png        # Project logo
│   │── images/         # UI images & illustrations
│
│── README.md          # Project documentation

