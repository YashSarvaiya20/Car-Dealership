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

## AI Usage & Design Decisions
To be updated dynamically throughout development.
