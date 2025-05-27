# 🧾 Rwalent – Frontend

Welcome to the **frontend** of **Rwalent**, a modern and secure web platform that streamlines **user registration, authentication, and feature access** for your application. Built with **React** and styled using **Tailwind CSS**, this frontend communicates with a powerful **Spring Boot backend** via REST APIs and JWT for secure data exchange.

## 🚀 Features

- 🔐 **User Authentication (JWT-based)**
- 🧍 **User Registration and Login**
- 🧭 **Role-Based Navigation (Admin/User)**
- 📱 **Responsive UI** (Mobile-First)
- 📨 **API Integration** with Spring Boot Backend
- 💾 **Token Persistence** using `localStorage`
- 🧩 **Modular Component Structure**
- 🎨 **Tailwind CSS Styling**

---

## 🛠️ Tech Stack

| Tech               | Description                             |
|--------------------|-----------------------------------------|
| React.js           | UI library for building the SPA         |
| Tailwind CSS       | Utility-first CSS for styling           |
| Axios              | For making HTTP requests                |
| React Router DOM   | Page routing in React                   |
| JWT                | For secure user authentication          |
| Vite               | Fast React bundler                      |

---

## 📁 Project Structure

rwalent-frontend/
│
├── public/ # Static files (favicon, index.html)
├── src/
│ ├── assets/ # Images, logos, etc.
│ ├── components/ # Reusable components (Navbar, Footer, etc.)
│ ├── pages/ # Route-level components (Home, Login, Register)
│ ├── services/ # API calls (Axios config, authService)
│ ├── context/ # Authentication context
│ ├── App.jsx # Main App component
│ └── main.jsx # App root render point
│
├── .env # Environment variables
├── package.json # Project metadata and dependencies
├── tailwind.config.js
└── README.md

yaml
Copy
Edit

---

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js >= 16
- npm or yarn
- Access to the Rwalent backend (Spring Boot)

---

### 📦 Install Dependencies

```bash
npm install
# or
yarn install
🧪 Configure Environment
Create a .env file at the root:

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:8080/api
🏃 Run the App
bash
Copy
Edit
npm run dev
# or
yarn dev
Frontend runs at http://localhost:5173

🔐 Authentication Flow
POST /auth/login: Login with email & password → receives JWT

Token stored in localStorage

Axios interceptors add token to every secured request

js
Copy
Edit
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
📄 Sample Routes
Route	Description
/	Home
/login	Login form
/register	Registration form
/dashboard	User dashboard (secured)
/admin	Admin-only route

🧪 Testing
Test your components and integration with:

bash
Copy
Edit
npm run test
(Configure Vitest or Jest as needed)

🚀 Build for Production
bash
Copy
Edit
npm run build
📬 Future Improvements
🧠 Forgot Password & Reset Flow

📄 Profile & Settings Page

✨ UI Enhancements with Animations

📲 PWA Support

🌍 i18n – Multi-language support

🤝 Contributing
Contributions are welcome!

Fork the repo

Create a branch: git checkout -b feature/feature-name

Commit changes: git commit -m 'Add feature'

Push to the branch: git push origin feature-name

Open a pull request

📜 License
This project is licensed under the MIT License.

👤 Author
Mucyo Ivan
📧 mucyoivan25@gmail.com
🌐 GitHub • LinkedIn
