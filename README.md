# Shree Ganesh Autodeal

A complete inventory management and digital showroom platform for a two-wheeler dealership.

The system enables the dealership owner to manage inventory through a Flutter mobile application while customers can browse available vehicles through a modern React web application. The backend is developed using Spring Boot and stores images and documents securely in Supabase Storage.

---

## Features

### Admin Mobile Application
- Add new vehicles
- Edit vehicle information
- Delete vehicles
- Upload multiple vehicle images
- Upload RC and insurance documents
- Categorize vehicles
- Mark vehicles as sold
- View sales reports
- Manage inventory from mobile

### Customer Web Application
- Browse available vehicles
- Search vehicles
- Filter by category
- Filter by price
- View multiple vehicle images
- View detailed specifications
- Responsive design

### Backend
- REST APIs
- Pagination
- Vehicle search
- Dynamic filtering
- Image upload
- Document upload
- Sales management
- Exception handling
- DTO-based architecture

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- Maven

**Database**
- MySQL

**Storage**
- Supabase Storage

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Mobile**
- Flutter
- Dart

---

## Project Architecture

```
                    +----------------------+
                    | Flutter Admin App    |
                    +----------+-----------+
                               |
                               v
                     REST APIs (Spring Boot)
                               |
        +----------------------+--------------------+
        |                                           |
        v                                           v
     MySQL Database                         Supabase Storage
        |                                           |
        v                                           v
 Vehicle Data                             Images & Documents

                               ^
                               |
                      React Customer Website
```

---

## Folder Structure

```
Autodeal
│
├── backend
├── web-app
├── mobile-app
└── database
```

---

## Main Functionalities

**Inventory Management**
- Add vehicles
- Update vehicle details
- Delete vehicles

**Vehicle Media**
- Multiple images
- Thumbnail support
- Document upload

**Sales**
- Mark sold
- Sales reports
- Buyer information

**Customer Catalog**
- Search
- Filters
- Vehicle details

---

## Database

```
Categories
    |
Vehicles
    |
    +----------------------+
    |                      |
VehicleImages      VehicleDocuments
    |
SaleRecords
```

---

## Installation

### Backend
```bash
git clone <repository>
cd backend
mvn spring-boot:run
```

### React
```bash
cd web-app
npm install
npm run dev
```

### Flutter
```bash
cd mobile-app
flutter pub get
flutter run
```

---

## Environment Variables

**Backend**
```
DB_URL=
DB_USERNAME=
DB_PASSWORD=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=
```

---

## API Overview

```
GET     /vehicles
POST    /vehicles
PUT     /vehicles/{id}
DELETE  /vehicles/{id}
POST    /vehicles/{id}/images
GET     /vehicles/{id}/images
POST    /vehicles/{id}/documents
POST    /vehicles/{id}/sales
```

---

## Developer Guide

### Chapter 1 — Project Overview

The project consists of three independent modules.

```
Flutter App
    ↓
Spring Boot APIs
    ↓
Database + Supabase
    ↓
React Website
```

### Chapter 2 — Backend Architecture

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Each layer has one responsibility.

#### Config Package

**Purpose:** Contains application configuration.

- **AppCorsProperties** — Stores CORS configuration.
- **WebConfig** — Registers allowed origins.
- **SupabaseProperties** — Reads:
  - URL
  - Service Key
  - Bucket

#### Domain Layer

Contains all JPA entities.

**Vehicle** — Represents a bike in inventory.

**Relationships**
```
Vehicle
├── Category
├── VehicleImage
├── VehicleDocument
└── SaleRecord
```

**Fields**
- Brand
- Model
- Fuel Type
- Price
- Status
- Category

**VehicleImage**

Stores:
- URL
- Display Order
- Alt Text

Relationship: Many Images → One Vehicle

**VehicleDocument**

Stores:
- RC
- Insurance
- Invoice
- Other files

**SaleRecord**

Stores:
- Sale Price
- Buyer
- Date

#### DTO Layer

**Purpose:** Never expose entities directly.

```
Controller
    ↓
DTO
    ↓
Service
    ↓
Entity
```

DTOs include:
- VehicleRequest
- VehicleResponse
- VehicleSummaryResponse
- CategoryResponse
- SalesReportResponse
- etc.

#### Repository Layer

**Repositories**
- VehicleRepository
- VehicleImageRepository
- VehicleDocumentRepository
- SaleRecordRepository
- CategoryRepository

**Responsibilities**
- CRUD
- Search
- Pagination
- Specifications

#### Service Layer

Business logic resides here.

**VehicleService**

Responsibilities:
```
Create Vehicle
    ↓
Validate
    ↓
Save Vehicle
    ↓
Upload Images
    ↓
Upload Documents
    ↓
Return DTO
```

**SupabaseStorageService**

Responsible for:
```
Receive Multipart File
    ↓
Generate Path
    ↓
Upload to Supabase
    ↓
Return Public URL
    ↓
Store URL in Database
```

**CategoryService**

Handles:
- CRUD
- Duplicate validation

#### Controller Layer

**AdminController**

Contains:
- Vehicle CRUD
- Category CRUD
- Document Upload
- Image Upload
- Sales
- Reports

**CatalogController**

Contains:
- Public APIs
- Vehicle Listing
- Vehicle Details
- Search
- Filters

---

## Database Design

```
Category
    ↓
Vehicle
    ↓
VehicleImages
    ↓
VehicleDocuments
    ↓
SaleRecords
```

**Foreign Keys**
- category_id
- vehicle_id

---

## Image Upload Flow

```
Flutter
    ↓
Image Picker
    ↓
Multipart Request
    ↓
Spring Boot
    ↓
Supabase
    ↓
Public URL
    ↓
VehicleImage Table
```

---

## Vehicle Creation Flow

```
Flutter Form
    ↓
VehicleRequest DTO
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
MySQL
    ↓
VehicleResponse
```

---

## Sales Flow

```
Vehicle
    ↓
Mark Sold
    ↓
SaleRecord
    ↓
Inventory Updated
    ↓
Report Generated
```

---

## Exception Handling

**GlobalExceptionHandler**

Handles:
- Validation
- Entity Not Found
- Storage Errors
- Duplicate Entries
- Generic Exceptions

---

## Deployment Guide

**Backend**
```
Spring Boot
    ↓
MySQL
    ↓
Supabase
```

**Frontend**
```
React
    ↓
Vercel
```

**Mobile**
```
Flutter APK
```

---

## Coding Standards
- DTO-first architecture
- Layered services
- Repository pattern
- Constructor injection
- Exception handling
- RESTful APIs
- Stateless backend

---

## Future Enhancements
- JWT Authentication
- Role-Based Access Control
- Customer Login
- Favorites/Wishlist
- Booking Test Ride
- Push Notifications
- Payment Gateway
- Vehicle Comparison
- Analytics Dashboard
- Docker Compose
- CI/CD Pipeline
- Unit & Integration Testing
- Cloud Deployment (AWS/GCP/Azure)