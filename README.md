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

### Step 3: Security Configuration
- **AI Assisted Files**: `backend/src/main/java/com/incubyte/dealership/security/SecurityConfig.java`.
- **Design Decision**: Set up stateless session management and disabled CSRF, which is standard for decoupled JWT-based Single Page Applications. Configured endpoint authorization rules where authentication endpoints (`/api/auth/**`) and vehicle search/read endpoints (`GET /api/vehicles/**`) are publicly permitted, while write/transaction endpoints are restricted. Decoupled password encryption configuration into a reusable `BCryptPasswordEncoder` bean.
### Step 4: User Entity
- **AI Assisted Files**: `backend/src/main/resources/application.yml`, `backend/src/main/java/com/incubyte/dealership/entity/Role.java`, `backend/src/main/java/com/incubyte/dealership/entity/User.java`.
- **Design Decision**: Created the `Role` enum to represent `USER` and `ADMIN` authorization roles in a type-safe manner. Configured the `User` entity to map to the `users` collection and utilized Lombok to minimize boilerplate. Enabled `spring.data.mongodb.auto-index-creation = true` to automatically register unique email indexes in MongoDB. In `DealershipApplicationTests`, we excluded MongoDB autoconfiguration classes so tests can boot cleanly without database dependencies.

### Step 5: Registration Tests
- **AI Assisted Files**: `backend/src/main/java/com/incubyte/dealership/exception/DuplicateEmailException.java`, `backend/src/main/java/com/incubyte/dealership/exception/ApiErrorResponse.java`, `backend/src/main/java/com/incubyte/dealership/exception/GlobalExceptionHandler.java`, `backend/src/main/java/com/incubyte/dealership/dto/request/RegisterRequest.java`, `backend/src/test/java/com/incubyte/dealership/service/AuthServiceTests.java`, `backend/src/test/java/com/incubyte/dealership/controller/AuthControllerTests.java`.
- **Design Decision**: Declared all necessary interfaces, DTOs, custom exception structures, and controller skeletons so that our test code compiles correctly. Wrote unit tests for `AuthService` verifying business requirements (successful persistence, password encoding, and duplicate checks) and slice tests for `AuthController` checking routing, schema validation, and exception translation. Excluded Mongo configurations in the controller slice test environment to ensure tests execute in isolation.

### Step 6: Registration Implementation
- **AI Assisted Files**: `backend/src/main/java/com/incubyte/dealership/service/AuthService.java`.
- **Design Decision**: Implemented registration business logic, validating email uniqueness through the repository before mapping request models to `User` entities. Cryptographically hashed plain-text passwords using the configured `PasswordEncoder` bean to prevent storage of raw passwords in the database. Assumed the default user registration assigns the `Role.USER` privilege. Performed manual DTO mapping to construct `UserResponse` objects securely without exposing passwords. Satisfied constructor dependencies inside `DealershipApplicationTests` by injecting a `@MockBean UserRepository`.

### Step 7: Login Tests
- **AI Assisted Files**: `backend/src/main/java/com/incubyte/dealership/dto/request/LoginRequest.java`, `backend/src/main/java/com/incubyte/dealership/dto/response/LoginResponse.java`, `backend/src/main/java/com/incubyte/dealership/exception/GlobalExceptionHandler.java`, `backend/src/test/java/com/incubyte/dealership/service/AuthServiceTests.java`, `backend/src/test/java/com/incubyte/dealership/controller/AuthControllerTests.java`.
- **Design Decision**: Declared DTO stubs and method skeletons for the login flow. Created unit tests in `AuthServiceTests` to check password matches via the password encoder and user retrievals from database records. Wrote slice tests in `AuthControllerTests` to verify validation error handling (HTTP 400), authentication failures (HTTP 401), and successful token structures (HTTP 200). Added a generic `AuthenticationException` handler in `GlobalExceptionHandler` to enforce consistent REST mapping for standard security exceptions.

### Step 8: Login Implementation
- **AI Assisted Files**: `backend/src/main/java/com/incubyte/dealership/service/AuthService.java`, `backend/src/main/java/com/incubyte/dealership/exception/GlobalExceptionHandler.java`.
- **Design Decision**: Implemented user authentication validation logic. Checked user existence by querying `userRepository.findByEmail` and verified hashed passwords using `passwordEncoder.matches`. Threw `BadCredentialsException` on mismatch, which our updated `GlobalExceptionHandler` translates to a secure HTTP 401 Unauthorized response structure. Returned a stub token (`"mock-jwt-token"`) for successful logins to be replaced by a cryptographic JWT in Step 9.

### Step 9: JWT Authentication
- **AI Assisted Files**: `backend/src/main/java/com/incubyte/dealership/security/JwtUtil.java`, `backend/src/main/java/com/incubyte/dealership/security/CustomUserDetailsService.java`, `backend/src/main/java/com/incubyte/dealership/security/JwtFilter.java`, `backend/src/main/java/com/incubyte/dealership/security/SecurityConfig.java`, `backend/src/main/java/com/incubyte/dealership/service/AuthService.java`, `backend/src/test/java/com/incubyte/dealership/controller/AuthControllerTests.java`, `backend/src/test/java/com/incubyte/dealership/service/AuthServiceTests.java`.
- **Design Decision**: Set up secure stateless token authentication using JJWT 0.11.5. Configured `JwtUtil` with a 256-bit symmetric signing key to generate, extract claims from, and validate JWT tokens. Created `CustomUserDetailsService` to bind MongoDB credentials to Spring Security's authorization context. Wrote `JwtFilter` to intercept requests, read the Authorization Bearer header, populate the security context, and register it in `SecurityConfig`. Updated unit tests to mock `JwtUtil` and slice tests to mock `CustomUserDetailsService` to run tests in isolation.

### Step 10: Vehicle Entity
- **AI Assisted Files**: `backend/src/main/java/com/incubyte/dealership/entity/Vehicle.java`.
- **Design Decision**: Created the `Vehicle` entity class mapped to the `vehicles` MongoDB collection. Supported domain attributes (`id`, `make`, `model`, `category`, `price`, `quantity`) and integrated Lombok annotations to prevent boilerplate code.
