# Finance Tracker App - Backend

## Overview
The backend of the Finance Tracker App is responsible for handling user authentication, transaction management, and all server-side logic. It provides a secure and efficient API for the frontend to interact with.

---

## Features
- Secure user authentication using JWT.
- APIs for managing user data and transactions.
- Logic to compute the user's current balance.
- Data validation and error handling.

---

## Technologies Used
- **Node.js**: For building the server-side application.
- **Express.js**: For creating RESTful APIs.
- **MongoDB**: For database storage (hosted on MongoDB Atlas).
- **JWT**: For secure authentication.
- **bcrypt**: For hashing passwords.

---

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/finance-tracker-backend.git
   cd finance-tracker-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=<server-port>
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Run in development mode**:
   ```bash
   npm run dev
   ```

---

## Deployment
- Deploy the backend on **Render**, **Cyclic**, or another cloud platform.
- Ensure to update the environment variables accordingly for production.

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).
