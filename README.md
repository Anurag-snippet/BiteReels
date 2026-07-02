# BiteReels 🍔🎬

**Live Demo:** [https://bitereels.onrender.com](https://bitereels.onrender.com)

A full-stack, short-form food video social network inspired by Instagram Reels and Zomato. Built for food lovers to discover delicacies through highly interactive vertical reels and for food partners/restaurants to share their culinary creations.

## 🚀 Features

- **Endless Food Feed**: Vertical scrolling food reel feed with autoplay on intersection, fully optimized for all devices (mobile, tablet, laptop, and desktop).
- **Instagram-Style Visuals & Interactions**:
  - Custom outline and filled vector SVG icons mirroring Instagram.
  - Haptic-style keyframe animations: heart-beat bounce for Likes, and pop scale for Saves.
  - Interactive slide-up bottom drawer for reading and posting comments.
- **Dual-Auth Architecture**:
  - **Guest Access**: Allows guests to browse the home feed, prompting a modern sign-in modal if they attempt to like, comment, or save.
  - **Consumer Accounts**: User login/registration to like, save, and comment on food items.
  - **Business Accounts**: Food Partner dashboard to manage business profiles, post new culinary videos (integrated with ImageKit cloud media delivery), and view their store layout.
- **Responsive Navigation**: Adaptive left sidebar for desktop/tablet viewports and sleek fixed bottom navigation bar for mobile interfaces.
- **RESTful API**: Express-based backend serving API endpoints for handling data, uploads, and role-based authentication.
- **Database Storage**: MongoDB database management powered by Mongoose schemas.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite (Fast HMR)
- **Icons**: Custom SVG vector paths
- **Styling**: Vanilla CSS with custom media queries for full responsiveness
- **Routing**: React Router DOM v7

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT Cookies (`jsonwebtoken`) & `bcryptjs`
- **File Uploads**: `multer` & ImageKit SDK for fast CDN delivery

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
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```
Start the backend server:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
