# UNITECH - Educational Resource & Management Platform

UNIO is a cutting-edge educational platform designed to bridge the gap between students and academic resources. It provides a seamless interface for accessing study materials, managing academic progress, and leveraging AI to enhance the learning experience. Built with a modern tech stack, UNIO ensures a fast, responsive, and intuitive user experience for both students and administrators.

## 🚀 Live Demo

[**🔴 Live Link**](https://unitech-ruvf.onrender.com/)

---

## 🛠 Technologies Used

### Frontend

- **React.js (Vite):** Fast and modern UI library for building interactive interfaces.
- **Redux Toolkit:** Efficient state management for authentication and user data.
- **Tailwind CSS:** Utility-first CSS framework for rapid and responsive styling.
- **Framer Motion:** For smooth animations and enhanced user interactions.
- **Axios:** For seamless HTTP requests to the backend.
- **React Router DOM:** For client-side routing and navigation.

### Backend

- **Node.js & Express.js:** Robust runtime and framework for building scalable RESTful APIs.
- **MongoDB (Mongoose):** NoSQL database for flexible data storage.
- **JWT (JSON Web Tokens):** Secure authentication and session management.
- **Passport.js:** Google OAuth integration for easy sign-ins.
- **ImageKit:** Cloud-based image and file storage solution.
- **Multer:** Middleware for handling file uploads.

---

## ✨ Features

### 👤 For Users (Students)

1.  **Secure Authentication:**
    - Sign up and Log in via Email/Password.
    - Quick access using **Google OAuth**.
2.  **Personalized Dashboard:**
    - View subjects tailored to your specific **Branch**, **Year**, and **Semester**.
3.  **Resource Access:**
    - Browse and view **Notes**, **Syllabus**, and **Study Materials**.
    - Built-in PDF viewer for reading documents directly in the browser.
4.  **Profile Management:**
    - Update personal details (Name, Branch, Year, Semester).
    - Upload and change profile pictures.
5.  **AI Assistant:**
    - Integrated AI Chat features to assist with doubt clearing and learning.

### 🛡️ For Admins

1.  **Resource Management:**
    - Upload PDFs and study materials directly to the platform.
    - Organize resources by Subject and Category.
2.  **Content Creation:**
    - Create and manage notes and educational content.
3.  **Secure Access:**
    - Role-based access control to protect administrative routes.

---

## � Screenshots

|                              Dashboard                                 |                              Ai assistant                        |
| :--------------------------------------------------------------------: | :--------------------------------------------------------------: |
| ![Landing Page](https://via.placeholder.com/600x400?text=Landing+Page) | ![Dashboard](https://via.placeholder.com/600x400?text=Dashboard) |



---

## �💻 How to Run Locally

Follow these steps to set up the project on your local machine.

### Prerequisites

- Node.js installed
- MongoDB installed or a generic MongoDB URI

### 1. Clone the Repository

```bash
git clone https://github.com/xsid-69/UNIO.git
cd UNIO
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies.

```bash
cd backend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `backend` root and add the following keys:

```env
PORT=3000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
NODE_ENV=development

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImageKit (File Storage)
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

**Start the Server:**

```bash
npm start
# OR if you have nodemon installed
npx nodemon Server.js
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd ../frontend
npm install
```

**Start the Application:**

```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or the port specified by Vite).

---

## 🏗️ Project Structure & Architecture

### Directory Structure

```bash
UNIO
├── backend
│   ├── config/             # Database & other configurations
│   ├── controller/         # Request handlers (Business Logic)
│   ├── db/                 # Database connection logic
│   ├── middlewares/        # Auth & Error handling middlewares
│   ├── models/             # Mongoose Schemas (Data Models)
│   ├── routes/             # API Route definitions
│   ├── service/            # Helper services (e.g., ImageKit)
│   ├── src/                # Additional source files
│   ├── .env                # Environment variables
│   └── Server.js           # Entry point for Backend
│
└── frontend
    ├── public/             # Static assets
    ├── src
    │   ├── components/     # Reusable UI Components
    │   ├── context/        # Context API (if used)
    │   ├── lib/            # Utility libraries
    │   ├── pages/          # Full Page Components
    │   ├── routes/         # Routing definition (AppRoutes)
    │   ├── store/          # Redux Store slices & setup
    │   ├── App.jsx         # Main App Component
    │   └── main.jsx        # Entry point for React
    ├── .env                # Frontend Environment variables
    ├── index.html          # HTML Template
    ├── tailwind.config.js  # Tailwind CSS Config
    └── vite.config.js      # Vite Config
```

### Architecture & Flow

```text
[ Client (Frontend) ]
       |
       | (HTTP / Axios)
       v
[ Server (Backend) ]
       |
       +---> [ Routes ]
       |        |
       |        v
       +---> [ Controllers ]
       |        |
       |        v
       +---> [ Services / Models ]
                |
                v
          [ MongoDB ]
```

1.  **Frontend**: React + Vite + Tailwind CSS. Manages state via Redux Toolkit.
2.  **API Layer**: Express.js REST API.
3.  **Authentication**: JWT for sessions, Passport.js for Google OAuth.
4.  **Database**: MongoDB (Mongoose).
5.  **Storage**: ImageKit for file uploads.

### 🗄️ Database Schema

#### 👤 User Model (`users`)

| Field        | Type   | Required | Unique | Description                      |
| :----------- | :----- | :------- | :----- | :------------------------------- |
| `name`       | String | False    | True   | Full name of the user            |
| `email`      | String | True     | True   | User's email address             |
| `password`   | String | False    | False  | Hashed password (if manual auth) |
| `googleId`   | String | False    | False  | Google OAuth ID                  |
| `role`       | String | False    | False  | `user` (default) or `admin`      |
| `branch`     | String | False    | False  | Student's branch (e.g., CSE)     |
| `year`       | String | False    | False  | Academic Year                    |
| `semester`   | String | False    | False  | Current Semester                 |
| `profilePic` | String | False    | False  | URL for profile picture          |
| `avatar`     | String | False    | False  | Avatar identifier                |

#### 📚 Subject Model (`subjectsData`)

| Field      | Type   | Required | Description                        |
| :--------- | :----- | :------- | :--------------------------------- |
| `name`     | String | True     | Name of the subject                |
| `branch`   | String | True     | Branch associated with the subject |
| `semester` | Number | True     | Semester number                    |

#### 📝 Note Model (`notes`)

| Field         | Type   | Required | Index | Description             |
| :------------ | :----- | :------- | :---- | :---------------------- |
| `title`       | String | True     | False | Title of the note       |
| `description` | String | False    | False | Brief description       |
| `subject`     | String | False    | True  | Related Subject         |
| `branch`      | String | False    | True  | Branch filter           |
| `semester`    | String | False    | True  | Semester filter         |
| `pdfUrl`      | String | False    | False | URL to the PDF resource |

---

## 📄 License

This project is licensed under the MIT License.
