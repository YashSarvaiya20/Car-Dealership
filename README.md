# Car Dealership Inventory Management System

A full-stack Car Dealership Inventory Management System built with Spring Boot (Java 17) and React (Vite + Tailwind CSS), utilizing MongoDB as the primary database.

## Project Overview
This application provides functionalities for car inventory management, secure user registration and login, roles-based authorization (User/Admin), searching vehicles, and processing vehicle transactions (purchasing and restocking).

## Tech Stack
### Backend
- **Java 17** & **Spring Boot 3**
- **Spring Security** with **JWT Authentication**
- **Spring Data MongoDB**
- **Jakarta Validation**
- **JUnit 5** & **Mockito** (for TDD)

### Frontend
- **React** (Vite build tool)
- **Tailwind CSS** (v4.x using `@tailwindcss/vite`)
- **Axios** (for API calls)
- **React Router** & **Context API**

---

## Folder Structure
```text
Car-Dealership/
├── backend/
│   ├── src/
│   │   ├── main/java/com/incubyte/dealership/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── security/
│   │   │   └── exception/
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   └── assets/
│   └── package.json
└── README.md
```

---

## Installation & Setup

### Backend (Spring Boot)
1. Ensure Java 17 is installed.
2. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
3. Build the application using the Maven wrapper:
   ```bash
   ./mvnw clean package
   ```
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend (React + Vite)
1. Ensure Node.js (v18+) is installed.
2. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## MongoDB Configuration

The application is configured to connect to MongoDB using the `SPRING_DATA_MONGODB_URI` environment variable, falling back to local MongoDB by default:
- **Local MongoDB**: `mongodb://localhost:27017/dealership`
- **Atlas MongoDB**: Set the `SPRING_DATA_MONGODB_URI` environment variable to your connection string.

### Running MongoDB Locally
We have provided a Docker Compose setup for local development. To start the local MongoDB and Mongo Express dashboard:
```bash
docker compose up -d
```
- MongoDB URL: `mongodb://localhost:27017`
- Mongo Express GUI: `http://localhost:8081`

To stop the services:
```bash
docker compose down
```

---

## AI Usage & Design Decisions
### Step 1: Project Setup
- **AI Assisted Files**: `backend/pom.xml`, `backend/src/main/java/com/incubyte/dealership/DealershipApplication.java`, `frontend/vite.config.js`, `frontend/src/App.jsx`, `frontend/src/index.css`.
- **Design Decision**: Initialized clean backend Spring Boot 3 structure and React Vite frontend with Tailwind v4 `@tailwindcss/vite` plugin for optimized CSS compilation.

### Step 2: MongoDB Configuration
- **AI Assisted Files**: `docker-compose.yml`, `backend/src/main/resources/application.yml`, `backend/src/test/java/com/incubyte/dealership/DealershipApplicationTests.java`.
- **Design Decision**: Bypassed live MongoDB dependency for integration testing by injecting a `@MockBean MongoClient` in context configuration. This ensures that context loading tests execute successfully without requiring a running database server on development machines, while keeping environment-driven Atlas config intact for deployments.

