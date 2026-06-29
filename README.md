# Zomato Insta Clone 🍔📱

A full-stack web application clone inspired by Zomato and Instagram features. Built with modern web technologies including React (Vite) on the frontend and Node.js with Express & MongoDB on the backend.

## 🚀 Features

- **User Authentication**: Secure signup and login functionality using JWT & bcrypt.
- **Media Uploads**: Image uploading and management integrated with ImageKit.
- **Responsive Frontend**: Modern component-based user interface built with React and Vite.
- **RESTful API**: Express-based backend serving API endpoints for handling data and authentication.
- **Database Storage**: MongoDB database management powered by Mongoose schemas.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Linting**: ESLint

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **File Uploads**: `multer` & ImageKit SDK

## 📦 Project Structure

```text
zomatoClone/
├── backend/            # Express server API & MongoDB models
│   ├── src/            # Controllers, models, routes, middleware
│   ├── .env.example    # Environment variables template
│   ├── server.js       # Entry point for backend server
│   └── package.json
└── frontend/           # React frontend application
    ├── src/            # UI components, pages, hooks, styles
    ├── public/         # Static assets
    └── package.json
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (Local or MongoDB Atlas)

### 1. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on `.env.example` and configure your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```
Start the backend server:
```bash
npm start
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
