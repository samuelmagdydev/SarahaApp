<h1 align="center" id="title">Saraha App - Backend</h1>

<p align="center">
  <img src="https://s3.amazonaws.com/neowin/news/images/uploaded/2017/08/1503923425_sarahah_story.jpg" alt="project-logo" width="200">
</p>

## 📝 Introduction

**SarahaApp** is a modern social messaging backend built using **Node.js**, **Express**, and **MongoDB**.  
It allows users to send and receive **anonymous or non-anonymous messages**, manage their accounts, upload images via **Cloudinary**, and communicate in real time using **Socket.io**.

This project is the backend API for the Saraha platform, providing secure authentication, media uploads, message handling, and more.

---

## ⚙️ Technologies Used

This project uses the following technologies and tools:

- **Node.js** – Runtime environment  
- **Express.js** – Web application framework  
- **MongoDB + Mongoose** – Database and ODM  
- **JWT (jsonwebtoken)** – Authentication and token management  
- **bcryptjs** – Password hashing  
- **dotenv** – Environment configuration  
- **multer & cloudinary** – Image upload and storage  
- **express-async-handler** – Error handling middleware  
- **morgan** – Logging requests  
- **uuid** – Generate unique IDs  
- **cors** – Enable cross-origin resource sharing  

---

## 🚀 Features

### 🔐 Authentication
- Register, login, and logout securely  
- Password hashing using **bcrypt**  
- Token-based authentication with **JWT** (access & refresh tokens)  
- Role-based access control for users and admins  

### 💬 Messaging System
- Send messages to other users anonymously or with identity  
- Upload images or attachments with messages  
- View received messages and attachments  
- Real-time notifications with **Socket.io**

### 👤 User Management
- Profile creation and updates  
- Upload profile pictures using Cloudinary  
- Manage user tokens and sessions  
- Block or report users (optional feature)

### ☁️ File Upload
- Image uploads via **Multer** and **Cloudinary**  
- File validation for supported formats  
- Auto-deletion of temporary files

### ⚠️ Error Handling & Validation
- Centralized error handling middleware  
- Input validation using custom validation schemas  
- Meaningful and structured error responses  

### 🧠 Other Utilities
- Token refresh system  
- Request logging with **morgan**  
- Clean and modular project structure  

---

## 📘 API Documentation

You can explore and test all SarahaApp API endpoints using Postman:

👉 [View Postman Collection](https://www.postman.com/your-link-here)


----
## 🛠️ Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/samuelmagdydev/SarahaApp.git
   cd SarahaApp

   
2.Install dependencies:

- npm install

3.Create a .env file in the root directory and add the following variables:

- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- CLOUDINARY_NAME=your_cloudinary_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret

4.Start the application:

- For production:npm start

- For development (with nodemon): npm run dev




