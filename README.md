# Shree Ganesh Autodeal

**Shree Ganesh Autodeal** is a full-stack two-wheeler dealership platform consisting of a Flutter-based admin application, a React-based customer catalog, and a Spring Boot backend.

The platform allows dealership administrators to manage vehicle inventory, images, documents, categories, and sales, while customers can browse available vehicles through the public web catalog.

The backend provides REST APIs, API-key based authentication for protected admin operations, PostgreSQL persistence, Supabase Storage integration, Redis-backed caching, centralized exception handling, and automated unit testing.

---

## Live Customer Website

**Live Website:** https://autodeal-taupe.vercel.app/

---

# Project Architecture

```text
Shree Ganesh Autodeal
│
├── ShreeGaneshAutodeal-backend/
│   └── ShreeGaneshAutodeal/
│       ├── src/
│       ├── pom.xml
│       └── mvnw
│
├── Autodeal-web-app/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── mobile-app/
│   └── Flutter Admin Application
│
├── supabase/
│   └── schema.sql
│
├── screenshots/
│   └── Mobile Application Screenshots
│
└── .github/
    └── workflows/
        ├── backend-unit-tests.yml
        └── web-app-unit-tests.yml
```

---

# Features

## Flutter Admin Application

The mobile application provides dealership administrators with tools to manage the complete vehicle inventory.

### Vehicle Management

- Add new vehicles
- Edit existing vehicles
- Delete vehicles
- Mark vehicles as sold
- Manage vehicle categories
- Search and filter inventory
- View vehicle details

### Vehicle Media

- Upload multiple vehicle images
- Upload RC documents
- Upload insurance documents
- Upload invoices
- Upload additional vehicle documents
- Manage uploaded vehicle media

### Sales Management

- Mark vehicles as sold
- Track sold vehicles
- View sales information
- Generate sales reports

### Admin Security

- API-key based authentication
- Protected admin APIs
- Centralized HTTP client
- API error handling
- Secure communication with the backend

---

# React Customer Web Application

The React application provides the public-facing vehicle catalog for customers.

### Catalog

- Browse available vehicles
- Search vehicles
- Filter vehicles by category
- Filter vehicles by availability/status
- View vehicle specifications
- View vehicle pricing
- View vehicle images
- View detailed vehicle information

### User Experience

- Responsive customer-facing interface
- Modern vehicle catalog layout
- Interactive vehicle cards
- Detailed vehicle pages
- Image gallery
- Image preview and zoom functionality
- Mobile-friendly design

### Frontend Testing

The React application includes automated unit tests using:

- Vitest
- React Testing Library
- jsdom
- Testing Library Jest DOM

The test suite covers component rendering, user interactions, API client behavior, edge cases, and UI-specific logic.

---

# Spring Boot Backend

The backend exposes REST APIs used by both the Flutter admin application and the React customer catalog.

## API Features

- RESTful API architecture
- Admin vehicle management
- Public vehicle catalog
- Category management
- Vehicle search
- Pagination
- Dynamic filtering
- Vehicle image management
- Vehicle document management
- Sales reporting

## Security

- API-key based authentication for admin APIs
- Public access for customer catalog APIs
- Protected administrative operations

## Database

The application uses a PostgreSQL-compatible database schema.

Database responsibilities include:

- Vehicle persistence
- Category persistence
- Vehicle status
- Vehicle pricing
- Vehicle images
- Vehicle documents
- Sales information

## Supabase Storage

Supabase Storage is used for:

- Vehicle images
- RC documents
- Insurance documents
- Invoices
- Other vehicle documents

## Redis Caching

Redis is used for caching read-heavy catalog and reporting endpoints.

The backend also implements targeted cache eviction when inventory data changes to prevent stale catalog information.

## Exception Handling

The backend uses centralized exception handling to provide consistent API error responses.

---

# AI Vehicle Description Generation

The backend integrates with the Groq LLM API to generate AI-assisted vehicle descriptions.

The generated descriptions can be based on vehicle information such as:

- Brand
- Model
- Category
- Manufacturing year
- Mileage
- Engine information
- Pricing
- Vehicle specifications

This reduces manual effort when creating vehicle listings.

---

# Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | Java 21 |
| Backend Framework | Spring Boot |
| Backend Build Tool | Maven |
| Backend Security | Spring Security |
| Backend Testing | JUnit 5, Mockito, MockMvc, AssertJ |
| Test Database | H2 |
| Frontend | React 19 |
| Frontend Build Tool | Vite |
| Frontend Language | TypeScript |
| Styling | Tailwind CSS |
| Frontend Testing | Vitest, React Testing Library, jsdom |
| Mobile | Flutter, Dart |
| Mobile State Management | Provider |
| Database | PostgreSQL |
| Storage | Supabase Storage |
| Cache | Redis |
| AI | Groq LLM |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

---

# Testing

The project contains automated tests for both the frontend and backend.

```text
                         Automated Testing
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
             React Web App                Spring Boot API
                 │                             │
                 ▼                             ▼
              Vitest                    JUnit 5 / Mockito
                 │                             │
                 ▼                             ▼
       React Testing Library               MockMvc
                 │                             │
                 ▼                             ▼
               jsdom                          H2
                 │                             │
                 └──────────────┬──────────────┘
                                │
                                ▼
                         GitHub Actions
                                │
                                ▼
                        Automated CI Checks
```

---

# Frontend Unit Testing

The React application uses **Vitest** as the unit testing framework.

React Testing Library is used to test components from a user's perspective, while `jsdom` provides the browser-like DOM environment required for React component rendering.

## Install Dependencies

From the frontend directory:

```bash
cd Autodeal-web-app
npm install
```

## Run Tests

Run the complete test suite:

```bash
npm run test:run
```

## Run Tests in Watch Mode

For development:

```bash
npm test
```

## Run a Specific Test File

```bash
npx vitest run src/vehicle/VehicleCard.test.tsx
```

## Build the Application

```bash
npm run build
```

---

# Backend Unit Testing

The Spring Boot backend uses:

- JUnit 5
- Mockito
- MockMvc
- AssertJ
- H2

The tests cover service logic, controllers, exception handling, specifications, configuration, cache key generation, and storage-related functionality.

## Run Backend Tests

### Linux / macOS

```bash
cd ShreeGaneshAutodeal-backend/ShreeGaneshAutodeal
./mvnw test
```

### Windows

```powershell
cd ShreeGaneshAutodeal-backend\ShreeGaneshAutodeal
.\mvnw.cmd test
```

---

# GitHub Actions CI

GitHub Actions is configured to automatically execute unit tests for both the React frontend and Spring Boot backend.

The project contains separate workflows:

```text
.github/
└── workflows/
    ├── web-app-unit-tests.yml
    └── backend-unit-tests.yml
```

This keeps frontend and backend testing independently configurable and allows each application layer to have its own CI pipeline.

---

## Frontend GitHub Actions Workflow

The frontend workflow is responsible for running the React/Vitest test suite.

The workflow:

1. Checks out the repository
2. Sets up Node.js 20
3. Uses the frontend `package-lock.json`
4. Installs dependencies using `npm ci`
5. Runs the Vitest unit tests

The frontend project is located at:

```text
Autodeal-web-app/
```

The workflow uses:

```yaml
defaults:
  run:
    working-directory: ./Autodeal-web-app
```

The dependency cache points to:

```text
./Autodeal-web-app/package-lock.json
```

### Frontend CI Command

```bash
npm ci
npm run test:run
```

---

## Backend GitHub Actions Workflow

The backend workflow is responsible for running the Spring Boot test suite.

The workflow:

1. Checks out the repository
2. Sets up Java 21
3. Uses the Temurin JDK distribution
4. Enables Maven dependency caching
5. Runs the Maven test suite

### Backend CI Command

```bash
./mvnw test
```

---

# Continuous Integration Flow

```text
                         GitHub Repository
                                │
                         Push / Pull Request
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
        Frontend Workflow                 Backend Workflow
                │                               │
                ▼                               ▼
          Node.js 20                         Java 21
                │                               │
                ▼                               ▼
             npm ci                         Maven
                │                               │
                ▼                               ▼
          Vitest Tests                    JUnit Tests
                │                               │
                ▼                               ▼
          Pass / Fail                       Pass / Fail
```

Automated testing helps catch regressions before changes are merged into the main development branches.

---

# Test Coverage Areas

## Frontend

Frontend unit tests focus on:

- Component rendering
- Vehicle card behavior
- Vehicle detail rendering
- User interactions
- Image interactions
- Pricing display
- Category display
- API client behavior
- API error handling
- Null and edge-case data
- Customer-facing UI behavior

## Backend

Backend tests cover:

- Category CRUD operations
- Vehicle CRUD operations
- Vehicle search
- Pagination
- Filtering
- Vehicle status handling
- Image management
- Document management
- Sales reporting
- Controller endpoints
- Multipart uploads
- Exception handling
- Validation errors
- Dynamic JPA Specifications
- Redis cache key generation
- Supabase Storage validation
- Application context loading

---

# Development Setup

## Prerequisites

Make sure the following are installed:

- Node.js 20+
- npm
- Java 21
- Maven / Maven Wrapper
- Flutter SDK
- Git
- PostgreSQL-compatible database
- Redis

---

# Frontend Setup

Navigate to the React application:

```bash
cd Autodeal-web-app
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run unit tests:

```bash
npm run test:run
```

Build the application:

```bash
npm run build
```

---

# Backend Setup

Navigate to the Spring Boot application:

```bash
cd ShreeGaneshAutodeal-backend/ShreeGaneshAutodeal
```

Run the application on Linux/macOS:

```bash
./mvnw spring-boot:run
```

Run the application on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Run backend tests:

```powershell
.\mvnw.cmd test
```

---

# Environment Configuration

Environment variables and secrets should be configured separately for local development and CI/CD environments.

Typical backend configuration includes:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
SUPABASE_URL
SUPABASE_KEY
SUPABASE_BUCKET
GROQ_API_KEY
REDIS_HOST
REDIS_PORT
ADMIN_API_KEY
```

The React application can use Vite environment variables where required.

Do not commit production credentials, API keys, or secrets to the repository.

---

# Verification

Before submitting changes, the following checks should pass.

## Frontend

```bash
cd Autodeal-web-app

npm ci
npm run test:run
npm run build
```

## Backend

```bash
cd ShreeGaneshAutodeal-backend/ShreeGaneshAutodeal

./mvnw test
```

On Windows:

```powershell
.\mvnw.cmd test
```

---

# Repository CI Structure

The repository intentionally keeps frontend and backend CI workflows separate:

```text
.github/workflows/
│
├── web-app-unit-tests.yml
│   │
│   ├── Node.js 20
│   ├── npm ci
│   └── npm run test:run
│
└── backend-unit-tests.yml
    │
    ├── Java 21
    ├── Maven
    └── ./mvnw test
```

This allows frontend and backend tests to evolve independently while both remain automatically validated through GitHub Actions.

---

# Deployment

## Frontend

The React application is deployed using Vercel.

Live application:

https://autodeal-taupe.vercel.app/

## Backend

The Spring Boot backend can be deployed to a Java-compatible cloud hosting environment with access to:

- PostgreSQL
- Redis
- Supabase Storage
- Required environment variables
- Groq API

---

# Project Goals

The primary goals of the project are:

- Provide a simple inventory management system for dealership administrators
- Provide customers with a modern vehicle browsing experience
- Centralize vehicle images and documents
- Provide reliable REST APIs
- Improve catalog performance through Redis caching
- Automate vehicle description generation using AI
- Maintain reliable application behavior through automated unit testing
- Automatically validate frontend and backend changes using GitHub Actions

---

# Future Improvements

Potential future improvements include:

- Customer authentication
- Customer enquiries and lead management
- WhatsApp integration
- Advanced analytics dashboards
- Vehicle comparison
- Favorites / wishlist
- Improved image optimization
- Automated deployment pipelines
- Increased frontend and backend test coverage
- End-to-end testing
- Performance monitoring
- Production observability

---

# License

This project is currently maintained for the Shree Ganesh Autodeal platform.