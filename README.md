
Saraha App Backend

A secure and feature-rich backend system for a Saraha-style anonymous messaging platform, built with Node.js, Express, and MongoDB.

Features

Authentication & Security
	•	User Registration and Login
	•	Email verification
	•	Two-Factor Authentication (2FA) for login using OTP
	•	Password Hashing using bcrypt
	•	JWT Authentication (Access and Refresh Tokens)
	•	Account lock after multiple failed login attempts

Password Management
	•	Update Password (Authenticated users only)
	•	Forget Password with OTP verification
	•	Reset Password via email

Messaging
	•	Send messages anonymously
	•	Get all messages for a user
	•	Get a specific message by ID

Profile
	•	Search for a user profile
	•	Get user profile link
	•	Track profile visits
	•	View profile viewers

Validation & Error Handling
	•	Request validation using Joi
	•	Centralized error handling
	•	Custom error responses

Tech Stack
	•	Backend: Node.js, Express.js
	•	Database: MongoDB, Mongoose
	•	Authentication: JWT
	•	Validation: Joi
	•	Email Service: Nodemailer

Project Structure

src/
│
├── common/
├── database/
├── modules/
│   ├── auth/
│   ├── profileViews/
│   ├── messages/
│
├── config/

Environment Variables

Create a .env file and add:

PORT=3000
MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

API Endpoints

Auth
	•	POST /signup
	•	POST /login
	•	POST /confirm-login

Password
	•	PATCH /update-password
	•	POST /forget-password
	•	POST /verify-reset-otp
	•	POST /reset-password

Two-Factor Authentication
	•	POST /enable-2fa
	•	POST /verify-2fa

Messages
	•	POST /messages
	•	GET /messages
	•	GET /messages/:id

Profile
	•	GET /users/search
	•	GET /users/:id
	•	GET /track-view/:profileOwnerId
	•	GET /get-views

Running the Project

npm install
npm run dev

Author

Shahd Ayman Galal
GitHub: https://github.com/shahdayman52
LinkedIn: https://www.linkedin.com/in/shahd-ayman-466125221
:::
