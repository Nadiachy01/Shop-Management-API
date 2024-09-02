# User Management API

## Description
This project is a RESTful API for user management built using Node.js, Express, and MongoDB. It includes functionalities for user registration (signup), login, and error handling. The API is designed to handle user authentication and manage user data securely.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

1. **Initialize the project:**
   ```bash
   npm init -y
2. **Install dependencies:**
   ```bash
   npm install express mongoose morgan body-parser bcrypt jsonwebtoken dotenv jest supertest --save
   npm install --save-dev nodemon
3. **Add following environment variables to the nodemon.json file:**
   ```bash
   MONGO_ATLAS_URI=your_mongodb_connection_string
   JWT_KEY=your_jwt_secret_key
   MONGO_ATLAS_PW=your_mongodb_password
## USAGE
To run the application, use the following command:

1. **Run your server with:**
   ```bash
   node server.js

The API will be available at http://localhost:3000.

## API Endpoints
## POST /user/signup

Registers a new user.

- Request:
   ```json
   {
  "username": "newtestuser",
  "email": "newtestuser@example.com",
  "password": "newtestpassword"
   }

- Status Codes:

- 201 Created: User successfully created.
- 409 Conflict: Email already exists.

## POST /user/login
## Logs in a user.

- Request:
   ```json
   {
  "email": "testuser@example.com",
  "password": "testpassword"
   }

- Status Codes:
- 200 OK: Authentication successful.
- 401 Unauthorized: Authentication failed.

## Testing

1. **Run your tests with:**
   ```bash
   npm test

