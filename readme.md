# maThECH Backend

![Project Logo](https://iili.io/JYuoQyl.png)

Powerful backend API serving as the backbone for maThECH quiz generator website. Handles API requests, seamlessly integrates with the frontend. Provides a robust platform to support the quiz generation features and user authentication.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Environment Variables](#environment-variables)
  - [Starting the Server](#starting-the-server)
- [API Endpoints](#api-endpoints)

## Introduction

maThECH Backend is the server-side component of the maThECH quiz generator website. It is built with Node.js and Express, utilizing MongoDB as the database. The backend provides essential functionalities such as user authentication, account management, and OTP-based features.

## Features

- User Authentication (Sign up, Login, Logout)
- Account Management (Edit Details, Deactivate Account, Activate Account)
- OTP (One-Time Password) Generation and Sending
- Quiz Generation API (if applicable)

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB server running (with necessary connection details)

### Installation

1. Clone the repository:

   ```bash
   git clone git@gitlab.com/bsmcs-4a-thesis/thesis-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mathech-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```dotenv
PORT=3000
MONGODB_URL=your_mongodb_connection_url
MONGODB_COLLECTION=your_mongodb_collection_name
GOOGLE_GMAIL_CLIENT_USERNAME=your_gmail_username
GOOGLE_GMAIL_CLIENT_PASSWORD=your_gmail_password
```

### Starting the Server

Run the following command to start the server:

```bash
npm start
```
or
```bash
nodemon start
```

The server will be running at `http://localhost:3000` by default.

## API Endpoints

- `/user/check-exists` (POST): Check if an account with the provided email or mobile number exists.
- `/user/signup` (POST): Create a new user account.
- `/user/login` (POST): User login with email/mobile and password.
- `/user/details` (GET): Retrieve user details (requires authentication).
- `/user/edit/:id` (PATCH): Edit user details (requires authentication).
- `/user/deactivate/:id` (PATCH): Deactivate user account (requires authentication).
- `/user/activate/:id` (PATCH): Activate user account.
- `/otp/send` (POST): Generate and send a one-time verification code.

For detailed API documentation, refer to [API Documentation](link_to_api_documentation).