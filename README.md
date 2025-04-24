# Flowva Hub - Backend API

_A powerful workflow automation and collaboration platform_

## 🚀 Technologies Used

- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT/GoogleAuth
- **Environment Management**: Dotenv

## 📦 Key Features

- User authentication & authorization

- Team collaboration tools

- API rate limiting & security

- Performance optimization with caching

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thobbytosin/flowva-server
   cd flowva-server
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Setup**
   ```bash
   Create .env file based on .env.example
   ```
4. **Run the server**
   ```bash
   npm start
   (development mode): npm run dev
   ```

## 📡 API Endpoints

| Endpoint                            | Method | Description             | Auth Required |
| ----------------------------------- | ------ | ----------------------- | ------------- |
| /api/v1/auth/signup                 | POST   | User registration       | No            |
| /api/v1/auth/signin                 | POST   | User Login              | Yes           |
| /api/v1/auth/google-signin          | POST   | Google Authentication   | Yes           |
| /api/v1/user/forgot-password        | POST   | User reset password     | Yes           |
| /api/v1/user/me                     | GET    | Gets user information   | Yes           |
| /api/v1/user/update-user-preference | PUT    | Updates user onboarding | Yes           |

## 📬 Contact

Project Done by - Falode Tobi
Project Link: https://github.com/Thobbytosin/flowva-server
