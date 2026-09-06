# Shree Ganesh Autodeal

Last updated: September 2026

Shree Ganesh Autodeal is a full-stack two-wheeler dealership platform with a Flutter admin app, a React customer catalog, and a Spring Boot backend. The owner can manage inventory, images, vehicle documents, categories, and sales from the mobile app, while customers can browse available vehicles through the public web catalog and subscribe to email alerts for newly listed inventory.

The backend includes Redis-backed caching for read-heavy catalog and reporting endpoints, RabbitMQ-backed asynchronous task processing for subscriber email notifications and Groq LLM vehicle description generation, transaction-safe event dispatching, targeted cache eviction on inventory mutations, and API-key based protection for admin APIs.

---

## Live Customer Website

[Visit the website](https://autodeal-taupe.vercel.app/)

---

## Current Project Structure

```text
Autodeal/
|
|-- ShreeGaneshAutodeal-backend/
|   `-- ShreeGaneshAutodeal/       # Spring Boot API
|
|-- Autodeal-web-app/              # React + Vite customer catalog
|
|-- mobile-app/                    # Flutter admin application
|
|-- supabase/
|   `-- schema.sql                 # PostgreSQL schema
|
|-- screenshots/                   # Mobile app screenshots
|
|-- .github/
|   `-- workflows/
|       |-- backend-unit-tests.yml
|       `-- web-app-unit-tests.yml
|
`-- README.md
```

---

## Screenshots

<p align="center">

  <img src="screenshots/inventory.jpeg" width="220"/>

  <img src="screenshots/vehicle-details.jpeg" width="220"/>

  <img src="screenshots/upload-document.jpeg" width="220"/>

</p>

<p align="center">

  <img src="screenshots/add-bike.jpeg" width="220"/>

  <img src="screenshots/sales-report.jpeg" width="220"/>

</p>

---

## Features

### Flutter Admin App

- Add, edit, and delete vehicles
- Upload multiple vehicle images
- Upload RC, insurance, invoice, and other documents
- Manage categories
- Mark vehicles as sold
- View sales reports
- Share vehicle details
- Manage inventory from mobile
- Send an API key with protected admin requests
- Centralized HTTP client with API error handling
- Multipart file uploads for images and documents

### React Customer Catalog

- Browse vehicle inventory
- Search vehicles
- Filter by category and status
- View vehicle images and detailed specifications
- Subscribe to vehicle availability email notifications with OTP verification
- Responsive customer-facing layout
- Access public catalog APIs without authentication
- Unit testing with Vitest and React Testing Library

### Spring Boot Backend

- REST APIs for admin, customer catalog, and newsletter subscriber flows
- API-key based authentication for admin APIs
- Public access for customer catalog and subscriber APIs
- DTO-first API responses
- Pagination, search, and dynamic filtering
- PostgreSQL persistence through Spring Data JPA
- Supabase Storage integration for vehicle media and documents
- **RabbitMQ Asynchronous Messaging**:
  - `vehicle_create` queue: Dispatches new vehicle alerts to all active subscribers via email in the background
  - `vehicle_llm_description` queue: Asynchronously generates rich sales copy via Groq LLM without blocking vehicle creation
- **Transaction-Safe Post-Commit Dispatch**:
  - Leverages Spring `TransactionSynchronizationManager.afterCommit()` to ensure RabbitMQ messages are only dispatched *after* the database transaction has committed, eliminating race conditions
- **Subscriber Onboarding with OTP Verification**:
  - Secure 6-digit OTP generation stored in Redis with a 5-minute TTL
  - Instant OTP email delivery via Brevo / Gmail SMTP
  - Verification activates the subscriber for inventory alerts
- **Groq LLM Integration**:
  - Automated automotive sales copywriting powered by Groq API
  - Formats vehicle specifications (brand, model, variant, year, km, price) into compelling dealership sales pitches
- Centralized exception handling with structured JSON error responses
- Redis-backed cache for high-read catalog endpoints
- Targeted cache eviction on inventory mutations
- Comprehensive unit and slice tests (110 backend unit tests, 54 web app tests)
- GitHub Actions CI pipeline for automated backend and frontend testing

---

## Tech Stack

| Layer | Current Stack |
| --- | --- |
| Backend | Java 21, Spring Boot 4.1.0, Spring MVC, Spring Data JPA, Hibernate, Maven |
| Messaging | RabbitMQ via Spring AMQP (`spring-boot-starter-amqp`) |
| Email | Spring Mail (`spring-boot-starter-mail`) via Brevo / Gmail SMTP |
| LLM | Groq API (`llama-3.3-70b-versatile` / configured model) |
| Security | Spring Security, API key authentication |
| Testing | JUnit 5 (Jupiter), Mockito, MockMvc, AssertJ, H2 in-memory DB |
| Cache | Redis through Spring Cache and Spring Data Redis |
| Database | PostgreSQL-compatible schema, H2 for tests |
| Storage | Supabase Storage |
| Web | React 19, Vite 8, TypeScript 6, Tailwind CSS 4 |
| Web Testing | Vitest, React Testing Library, jsdom |
| Mobile | Flutter, Dart, Provider, http, image_picker, file_picker |
| CI/CD | GitHub Actions |

---

## Architecture

```text
               React Customer Web App                    Flutter Admin App
                        |                                       |
                        | Public GET / Subscriber POST          | X-ADMIN-KEY
                        v                                       v
                Public / Subscriber APIs                   Admin APIs
                        \                                     /
                         \                                   /
                          v                                 v
                                 Spring Boot Backend
                                          |
                      +-------------------+-------------------+
                      |                                       |
                   Database                               Cache & Store
                      |                                       |
                PostgreSQL (Source of truth)             Redis Cache & OTP Store
                                                         Supabase Storage (Media/Docs)
                                          |
                      +-------------------+-------------------+
                      |
             Transaction-Safe Post-Commit Hooks
                      |
                      v
             RabbitMQ Message Broker
             |
             +---> Queue: "vehicle_create"
             |        |
             |        v
             |     RabbitmqReceiver.sendNotifications()
             |        |
             |        v
             |     EmailService (SMTP / Brevo) -> Active Subscribers
             |
             +---> Queue: "vehicle_llm_description"
                      |
                      v
                   RabbitmqReceiver.generateVehicleDescription()
                      |
                      v
                   LLMService (Groq API) -> Updates Vehicle Description in DB
```

PostgreSQL remains the source of truth. Redis is used for catalog response caching and short-lived OTP tokens. RabbitMQ reliably offloads external network calls (email sending and Groq LLM completion) to asynchronous background threads.

---

## API Security

The backend uses a lightweight **API key authentication model** for the Flutter admin application.

The admin API key is stored as a backend environment variable and configured in the Flutter admin application's API client.

### Request Flow

```text
Flutter Admin App

        |
        | X-ADMIN-KEY: <admin-api-key>
        v

Spring Security Filter Chain

        |
        v

Admin API Key Filter

        |
        +---- Invalid / Missing Key ----> 401 Unauthorized
        |
        +---- Valid Key ----------------> ADMIN authentication
                                            |
                                            v
                                       Admin Controller
```

The API key is validated before protected admin requests reach the controller.

### Public vs Admin APIs

| API Area | Authentication | Client | Purpose |
| --- | --- | --- | --- |
| `/api/catalog/**` GET | None | React Web App / Public | Browse vehicles & categories |
| `/api/subscribers/**` POST | None | React Web App / Public | Request & verify OTP for newsletter |
| `/api/admin/**` | Admin API key | Flutter Admin App | Inventory, media, docs, sales |

Only the public catalog GET APIs are intended to be accessed without authentication.

Admin GET endpoints are also protected because they may expose private inventory, documents, or sales information.

### Protected Admin Operations

The following API operations require the admin API key:

```text
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

GET    /api/admin/vehicles
POST   /api/admin/vehicles
GET    /api/admin/vehicles/{id}
PUT    /api/admin/vehicles/{id}
DELETE /api/admin/vehicles/{id}

POST   /api/admin/vehicles/{id}/images
GET    /api/admin/vehicles/{id}/images

POST   /api/admin/vehicles/{id}/documents
GET    /api/admin/vehicles/{id}/documents
DELETE /api/admin/documents/{id}

POST   /api/admin/vehicles/{id}/sales
GET    /api/admin/sales/report
```

### Admin Request Header

Flutter sends the API key using:

```http
X-ADMIN-KEY: <admin-api-key>
```

For example:

```http
POST /api/admin/vehicles

Content-Type: application/json
X-ADMIN-KEY: <admin-api-key>
```

### API Key Configuration

The backend reads the key from an environment variable:

```env
ADMIN_API_KEY=<strong-random-secret>
```

The Spring Boot configuration maps it to:

```properties
admin.api-key=${ADMIN_API_KEY}
```

The API key must not be committed to source control.

> **Security note:** an API key embedded in a mobile application can potentially be extracted through reverse engineering. This approach is intended as a lightweight protection mechanism for the current single-admin application. HTTPS is required in production.

---

## Flutter API Client

The Flutter application uses a centralized `ApiClient` for communication with the backend.

The API client automatically sends the admin API key with:

- GET requests
- POST requests
- PUT requests
- DELETE requests
- Multipart document uploads
- Multipart vehicle image uploads

The common request headers are:

```dart
{
  'Content-Type': 'application/json',
  'X-ADMIN-KEY': adminKey,
}
```

Multipart requests explicitly attach the same API key header before uploading files.

### Exception Handling

The Flutter API client handles:

- HTTP errors
- `401 Unauthorized`
- `404 Not Found`
- `409 Conflict`
- `413 Payload Too Large`
- Server-side error messages
- Connection failures
- Invalid JSON responses
- Multipart upload failures

API errors are represented through an `ApiException` containing the server message and optional HTTP status code.

---

## Multipart File Uploads

Vehicle images and documents are uploaded using `multipart/form-data`.

Multipart requests allow the application to send both regular fields and binary files in the same HTTP request.

For example, a document upload can contain:

```text
POST /api/admin/vehicles/{id}/documents

Headers:

    X-ADMIN-KEY: <admin-api-key>

Fields:

    title
    type

File:

    document.pdf
```

Vehicle image uploads similarly contain image files together with fields such as `startOrder` and `altText`.

---

## Redis Implementation

The Spring Boot backend uses Redis through Spring Cache.

### Cache Coverage

| Cache | API / Service Path | TTL | Evicted When |
| --- | --- | ---: | --- |
| `categories` | Category list | 30 min | Category create, update, delete |
| `vehicle-searches` | Paginated vehicle search/listing | 2 min | Vehicle/category mutations, image upload, mark sold |
| `public-vehicle-details` | Public vehicle detail | 5 min | Vehicle update/delete, image upload, mark sold |
| `admin-vehicle-details` | Admin vehicle detail with private data | 2 min | Vehicle/document/category mutations |
| `vehicle-images` | Vehicle image list | 5 min | Vehicle update/delete, image upload |
| `vehicle-documents` | Vehicle document list | 5 min | Document upload/delete, vehicle delete |
| `sales-reports` | Sales report dashboard | 1 min | Vehicle create/update/delete, mark sold |

### Cache Safety

- Cache keys are deterministic for paginated vehicle filters.
- Response DTOs are serializable, so Redis stores API-safe payloads instead of JPA entities.
- Mutations evict related cache entries to avoid stale inventory data.
- Redis errors fail open: the API falls back to database reads and logs cache failures instead of failing the request.
- Tests use `spring.cache.type=none`, so CI/local tests do not require Redis.

### Redis Environment Variables

```env
CACHE_TYPE=redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TIMEOUT=2s
```

To run Redis locally:

```bash
docker run --name autodeal-redis -p 6379:6379 -d redis:7-alpine
```

To run the backend without Redis during development:

```env
CACHE_TYPE=simple
```

---

## Redis Impact Analysis

These numbers are based on the repository/service query paths in the current backend. Actual latency will depend on deployment, network distance, database size, and Redis placement.

| Endpoint | Before Redis | Warm Redis Hit | Query Reduction |
| --- | ---: | ---: | ---: |
| `GET /api/catalog/categories` | 1 category query | 0 DB queries | 100% per hit |
| `GET /api/catalog/vehicles?page=0&size=24` | About 2 DB queries: page select + count | 0 DB queries | 100% per hit |
| `GET /api/catalog/vehicles/{id}` | About 3 DB queries: vehicle, category, images | 0 DB queries | 100% per hit |
| `GET /api/admin/vehicles/{id}` | About 5 DB queries: vehicle, category, images, documents, sales | 0 DB queries | 100% per hit |
| `GET /api/admin/sales/report` | About 4 DB queries: sales rows + 3 status counts | 0 DB queries | 100% per hit |

Example repeated-load impact inside a TTL window:

| Scenario | Without Redis | With Redis | Reduction |
| --- | ---: | ---: | ---: |
| 1,000 identical catalog page requests | About 2,000 DB queries | About 2 DB queries after first cache fill | About 99.9% |
| 1,000 identical public detail requests | About 3,000 DB queries | About 3 DB queries after first cache fill | About 99.9% |
| 1,000 identical sales report requests | About 4,000 DB queries | About 4 DB queries after first cache fill | About 99.9% |

Resume-ready bullet:

> Integrated Redis-backed caching in a Spring Boot 4 backend for catalog, vehicle detail, media, and sales report APIs with deterministic cache keys, TTL-based policies, targeted eviction, and fail-open error handling, reducing repeated read-query load by about 99.9% within cache TTL windows.

---

## Backend Environment Variables

```env
PORT=8080

DB_URL=
DB_USERNAME=
DB_PASSWORD=
JPA_DDL_AUTO=update

CORS_ALLOWED_ORIGINS=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=

GROQ_API_KEY=
GROQ_API_URL=
GROQ_MODEL=

CACHE_TYPE=redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TIMEOUT=2s

ADMIN_API_KEY=
```

For local development, keep secrets in `application-local.properties` or environment variables and do not commit them to Git.

The backend uses:

```properties
spring.config.import=optional:file:application-local.properties
```

The API key is configured through:

```properties
admin.api-key=${ADMIN_API_KEY}
```

For tests, a test-specific value can be supplied through `src/test/resources/application.properties`:

```properties
admin.api-key=test-admin-key
spring.cache.type=none
```

Note: the backend defaults to `PORT=8080`, while the web app currently defaults to `http://localhost:9090` if `VITE_API_BASE_URL` is not set. Keep them aligned by either setting `PORT=9090` for local backend runs or setting `VITE_API_BASE_URL=http://localhost:8080`.

---

## API Overview

### Public Catalog & Subscriptions

These endpoints are public and do not require an API key:

```text
GET  /api/catalog/categories
GET  /api/catalog/vehicles
GET  /api/catalog/vehicles/{id}
POST /api/catalog/vehicles/sendTestNotification/{id}

POST /api/subscribers/request-otp
POST /api/subscribers/verify-otp
```

### Admin

All admin endpoints require:

```http
X-ADMIN-KEY: <admin-api-key>
```

```text
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

GET    /api/admin/vehicles
POST   /api/admin/vehicles
GET    /api/admin/vehicles/{id}
PUT    /api/admin/vehicles/{id}
DELETE /api/admin/vehicles/{id}

POST   /api/admin/vehicles/{id}/images
GET    /api/admin/vehicles/{id}/images

POST   /api/admin/vehicles/{id}/documents
GET    /api/admin/vehicles/{id}/documents
DELETE /api/admin/documents/{id}

POST   /api/admin/vehicles/{id}/sales
GET    /api/admin/sales/report
```

### HTTP Status Codes for Protected Admin APIs

```text
200 OK

    Valid admin key and successful request.

201 Created

    Resource successfully created.

204 No Content

    Resource successfully deleted.

400 Bad Request

    Invalid request data.

401 Unauthorized

    Missing or invalid admin API key.

404 Not Found

    Requested resource does not exist.

409 Conflict

    Request conflicts with existing data.

413 Payload Too Large

    Uploaded file/request exceeds configured limits.

500 Internal Server Error

    Unexpected server-side failure.
```

---

## Run Locally

### Backend

```bash
cd ShreeGaneshAutodeal-backend/ShreeGaneshAutodeal
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd ShreeGaneshAutodeal-backend\ShreeGaneshAutodeal
.\mvnw.cmd spring-boot:run
```

Before starting the backend, configure the required environment variables in your environment or `application-local.properties`:

```env
DB_URL=jdbc:postgresql://<host>:<port>/<dbname>
DB_USERNAME=<username>
DB_PASSWORD=<password>
ADMIN_API_KEY=<secure-admin-key>
RABBITMQ_URL=amqp://<user>:<password>@<host>:<port>
REDIS_URL=redis://<user>:<password>@<host>:<port>
GROQ_API_KEY=<groq-api-key>
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=llama-3.3-70b-versatile
SUPABASE_URL=<supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<supabase-key>
SUPABASE_STORAGE_BUCKET=vehicle-documents
MAIL_USERNAME=<smtp-user>
MAIL_PASSWORD=<smtp-password>
app.mail.from=noreply@shreeganeshautodeal.com
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### React Web App

```bash
cd Autodeal-web-app

npm install

npm run dev
```

The React application uses the public catalog APIs and does not need the admin API key.

### Flutter Mobile App

```bash
cd mobile-app

flutter pub get

flutter run
```

The Flutter application uses the admin API key for protected `/api/admin/**` requests.

---

## Verification

### Running Backend Unit Tests

Run the complete 110-test backend test suite:

```powershell
cd ShreeGaneshAutodeal-backend\ShreeGaneshAutodeal

.\mvnw.cmd test
```

### Running React Web App Unit Tests

The React web application uses **Vitest** and **React Testing Library** for unit testing (54 tests).

Run the frontend unit test suite:

```bash
cd Autodeal-web-app

npm run test:run
```

To run Vitest in watch mode during development:

```bash
npm test
```

The frontend tests cover React component rendering, user interactions, API client behavior, and edge cases.

### Test Suite Breakdown

| Test Suite | Focus / Layer | Framework / Tools |
| --- | --- | --- |
| `VehicleCard.test.tsx` | Vehicle card rendering, interactions, pricing and edge cases | Vitest, React Testing Library |
| `VehicleDetails.test.tsx` | Vehicle detail rendering and user interactions | Vitest, React Testing Library |
| `api-client.test.ts` | API client requests, responses and error handling | Vitest |
| `CategoryServiceTest` | Category CRUD, slug generation, name/slug uniqueness, string normalization | JUnit 5, Mockito |
| `VehicleServiceTest` | Vehicle lifecycle, async RabbitMQ message queueing, post-commit dispatch, image/document management | JUnit 5, Mockito |
| `RabbitmqSenderTest` | Asynchronous message dispatching to `vehicle_create` and `vehicle_llm_description` queues | JUnit 5, Mockito |
| `RabbitmqReceiverTest` | Queue listener delegation to notification and vehicle services with error isolation | JUnit 5, Mockito |
| `NotificationServiceTest` | Active subscriber querying, parameter mapping, and notification dispatch | JUnit 5, Mockito |
| `LLMServiceTest` | Automotive sales prompt generation from Vehicle entity and VehicleRequest DTO | JUnit 5 |
| `EmailServiceTest` | SimpleMailMessage OTP delivery and MimeMessage vehicle alert HTML rendering | JUnit 5, Mockito |
| `SubscriberServiceTest` | Email normalization, OTP generation/validation, subscriber status lifecycle | JUnit 5, Mockito |
| `OtpServiceTest` | Redis-backed 6-digit OTP generation, 5-minute TTL expiration, and one-time verification | JUnit 5, Mockito |
| `SubscribeControllerTest` | REST endpoint validation for OTP request and OTP verification flows | MockMvc, Mockito |
| `SupabaseStorageServiceTest` | File type validation, null/empty file guards, storage configuration guards | JUnit 5, Mockito |
| `AdminControllerTest` | Admin REST APIs for categories, vehicles, multipart document/image uploads, sales | MockMvc, Mockito |
| `CatalogControllerTest` | Public REST catalog endpoints, filtered vehicle searches, details, test notification | MockMvc, Mockito |
| `GlobalExceptionHandlerTest` | Global error translation (404, 400, 413) and validation error maps | JUnit 5 |
| `VehicleSpecificationsTest` | Dynamic JPA Specifications matching (search, slug, status, price range) | Spring Boot Test, H2 |
| `SupabasePropertiesTest` | Supabase property configuration state verification | JUnit 5 |
| `CacheKeysTests` | Deterministic cache key generation for Redis | JUnit 5 |
| `ShreeGaneshAutodealApplicationTests` | Spring Boot context load sanity check | Spring Boot Test |

### Security Verification

The API-key security layer should be verified for at least the following cases:

```text
Public catalog GET without API key

    -> Allowed

Admin GET without API key

    -> 401 Unauthorized

Admin POST without API key

    -> 401 Unauthorized

Admin request with incorrect API key

    -> 401 Unauthorized

Admin request with valid API key

    -> Allowed

Admin multipart upload without API key

    -> 401 Unauthorized

Admin multipart upload with valid API key

    -> Allowed
```

For Spring Boot context tests, the test environment should provide a non-production API key:

```properties
admin.api-key=test-admin-key

spring.cache.type=none
```

Do not use the production API key in tests.

---

## GitHub Actions

Automated testing is configured using **GitHub Actions** for both the backend and the React web application.

The repository contains separate workflows:

```text
.github/
└── workflows/
    ├── backend-unit-tests.yml
    └── web-app-unit-tests.yml
```

### Backend Unit Test Workflow

The backend workflow automatically runs the Spring Boot unit test suite using Java 21 and Maven.

It runs for repository pushes and pull requests.

The backend test command is:

```bash
./mvnw test
```

### React Web App Unit Test Workflow

The frontend workflow automatically runs the Vitest unit test suite using Node.js 20.

The workflow is configured for pushes and pull requests targeting:

```text
main
develop
```

The frontend project is located one level inside the repository:

```text
Autodeal-web-app/
```

The workflow uses the frontend directory as its working directory and installs dependencies using the frontend `package-lock.json`.

The CI test commands are:

```bash
npm ci
npm run test:run
```

This ensures that React unit tests are automatically executed whenever changes are pushed or pull requests are opened against the configured branches.

---

## Database Model

```text
categories
    |
    v
vehicles
    |-- vehicle_images
    |-- vehicle_documents
    `-- sale_records
```

Important indexes in `supabase/schema.sql`:

- `idx_vehicles_status`
- `idx_vehicles_category`
- `idx_vehicles_brand_model`
- `idx_sale_records_sale_date`

---

## Future Enhancements

- JWT authentication and role-based access control if multiple admin/user roles are introduced
- Customer accounts, favorites, and test-ride bookings
- Payment gateway integration
- Analytics dashboard
- Docker Compose for backend, PostgreSQL, and Redis
- End-to-end testing
- Production observability for cache hit ratio and Redis latency
- API key rotation and secure admin credential management