# Shree Ganesh Autodeal — Architecture & UML

Full-stack two-wheeler dealership platform composed of three tiers:

- **Flutter Admin App** (`mobile-app/`) — owner inventory, documents, reports
- **React Customer Catalog** (`Autodeal-web-app/`) — public vehicle browsing
- **Spring Boot Backend** (`ShreeGaneshAutodeal-backend/`) — REST API, messaging, real-time

Supporting infrastructure: PostgreSQL, Redis, RabbitMQ, Supabase Storage, Groq LLM + Gemini, SMTP/Brevo.

> All diagrams are written in **Mermaid** and render on GitHub, GitLab, and VS Code (Markdown Preview Mermaid Support).

---

## 1. System Architecture (Context / Deployment)

```mermaid
flowchart TB
    subgraph Clients["Clients"]
        A["React Customer Web App<br/>React 19 · Vite · Redux Toolkit · STOMP"]
        B["Flutter Admin App<br/>Dart · http · image_picker"]
    end

    subgraph Edge["Edge / Security"]
        SEC["Spring Security Chain<br/>AdminApiKeyFilter · X-ADMIN-KEY"]
    end

    subgraph API["Spring Boot Backend (Java 21)"]
        CAT["CatalogController<br/>/api/catalog · public"]
        ADM["AdminController<br/>/api/admin · key-protected"]
        SUBC["SubscribeController<br/>/api/subscribers · public"]
        WS["WebSocketConfig STOMP /ws<br/>VehicleWebSocketService /topic/inventory"]
        SVC["Service Layer"]
        REPO["Spring Data JPA Repositories"]
        MQC["RabbitMQ Sender / Receiver"]
    end

    subgraph Infra["Infrastructure"]
        PG[("PostgreSQL<br/>source of truth")]
        RD[("Redis<br/>catalog cache + OTP TTL")]
        RMQ[["RabbitMQ<br/>vehicle_create · vehicle_sold · vehicle_llm_description"]]
        SB[("Supabase Storage<br/>images / documents")]
        GROQ[["Groq API<br/>LLM copywriting"]]
        GEM[["Gemini API<br/>promo image"]]
        SMTP[["SMTP / Brevo<br/>email + OTP"]]
        GEO[["Geo-IP API<br/>click region"]]
    end

    A -->|"REST GET"| CAT
    A -->|"STOMP subscribe"| WS
    A -->|"OTP POST"| SUBC
    B -->|"REST + X-ADMIN-KEY"| SEC --> ADM
    CAT --> SVC
    ADM --> SVC
    SUBC --> SVC
    SVC --> REPO --> PG
    SVC --> RD
    SVC --> SB
    SVC --> MQC --> RMQ --> WS
    SVC --> GROQ
    SVC --> GEM
    SVC --> SMTP
    SVC --> GEO
    WS -->|"/topic/inventory"| A
```

---

## 2. Backend Layered Architecture

```mermaid
flowchart TD
    subgraph Web["Web Layer"]
        AC[AdminController]
        CC[CatalogController]
        SC[SubscribeController]
        GEH[GlobalExceptionHandler]
    end
    subgraph Security
        AKF[AdminApiKeyFilter]
        SECC[SecurityConfig]
    end
    subgraph Service["Service Layer"]
        VS[VehicleService]
        CS[CategoryService]
        VCS[VehicleClickService]
        SS[SubscriberService]
        NS[NotificationService]
        LLM[LLMService]
        GEM[GeminiService]
        PROMO[PromoImageService]
        STORE[SupabaseStorageService]
        OTP[OtpService]
        EMAIL[EmailService]
        WSS[VehicleWebSocketService]
    end
    subgraph Messaging
        RS[RabbitmqSender]
        RR[RabbitmqReceiver]
    end
    subgraph Persistence["Persistence (JPA)"]
        VR[VehicleRepository]
        CR[CategoryRepository]
        IMR[VehicleImageRepository]
        DR[VehicleDocumentRepository]
        SRR[SaleRecordRepository]
        CLR[VehicleClickRepository]
        SUBSR[SubscriberRepository]
        SPEC[VehicleSpecifications]
    end
    subgraph CrossCutting["Cross-cutting"]
        CACHE[RedisCacheConfig · CacheKeys]
        MQC[RabbitMQConfig]
        WSC[WebSocketConfig]
        SUP[SupabaseProperties]
    end

    AKF --> AC
    SECC --> AKF
    AC --> VS & CS & VCS
    CC --> VS & CS & NS & VCS
    SC --> SS
    VS --> LLM & GEM & PROMO & STORE & RS & NS & WSS & VR & IMR & DR & SRR
    CS --> CR
    VCS --> CLR & VR
    VCS --> RESOLV[ClientIpResolver · RegionResolver · IpAddressHasher]
    SS --> OTP & SUBSR
    SS --> EMAIL
    NS --> SUBSR & VR & EMAIL
    RR --> NS & VS & WSS
    VS -.-> CACHE
```

---

## 3. UML Class Diagram — Domain Model

```mermaid
classDiagram
    class Category {
        +Long id
        +String name
        +String slug
        +String description
        +Instant createdAt
        +Instant updatedAt
    }
    class Vehicle {
        +Long id
        +String title
        +String registrationNumber
        +String brand
        +String modelName
        +String variantName
        +Integer manufactureYear
        +Integer registrationYear
        +Integer kilometersDriven
        +FuelType fuelType
        +Integer ownerSerial
        +String color
        +BigDecimal price
        +String description
        +VehicleStatus status
        +String thumbnailUrl
        +String location
        +Instant createdAt
        +Instant updatedAt
        +addImage(VehicleImage)
        +addDocument(VehicleDocument)
        +addSale(SaleRecord)
        +replaceImages(List)
    }
    class VehicleImage {
        +Long id
        +String imageUrl
        +String altText
        +Integer displayOrder
    }
    class VehicleDocument {
        +Long id
        +DocumentType type
        +String title
        +String fileUrl
        +String storagePath
        +String contentType
        +Long fileSize
        +Instant uploadedAt
    }
    class SaleRecord {
        +Long id
        +BigDecimal salePrice
        +LocalDate saleDate
        +String buyerName
        +String buyerPhone
        +String notes
        +Instant createdAt
    }
    class VehicleClick {
        +Long id
        +String ipHash
        +String country
        +String region
        +String city
        +String userAgent
        +String referrer
        +String source
        +Instant clickedAt
    }
    class Subscriber {
        +Long id
        +String email
        +SubscriberStatus status
        +LocalDateTime verifiedAt
        +LocalDateTime createdAt
    }
    class VehicleStatus {
        <<enumeration>>
        AVAILABLE
        RESERVED
        SOLD
    }
    class FuelType {
        <<enumeration>>
        PETROL
        ELECTRIC
        HYBRID
        OTHER
    }
    class DocumentType {
        <<enumeration>>
        RC
        INSURANCE
        PUC
        NOC
        FORM_29
        FORM_30
        SALE_INVOICE
        OTHER
    }
    class SubscriberStatus {
        <<enumeration>>
        ACTIVE
        UNSUBSCRIBED
    }

    Category "1" --> "0..*" Vehicle : categorizes
    Vehicle "1" *-- "0..*" VehicleImage : images
    Vehicle "1" *-- "0..*" VehicleDocument : documents
    Vehicle "1" *-- "0..*" SaleRecord : sales
    Vehicle "1" o-- "0..*" VehicleClick : analytics
    Vehicle --> VehicleStatus
    Vehicle --> FuelType
    VehicleDocument --> DocumentType
    Subscriber --> SubscriberStatus
```

---

## 4. UML Class Diagram — Controllers & Services

```mermaid
classDiagram
    direction LR
    class AdminController {
        +categories()
        +createVehicle(VehicleRequest)
        +updateVehicle(id, VehicleRequest)
        +uploadVehicleImages(id, files)
        +uploadVehicleDocument(id, file)
        +generateAiShare(id)
        +markSold(id, SaleRecordRequest)
        +salesReport(from, to)
        +clicksReport(from, to)
        +getRedisStats()
    }
    class CatalogController {
        +categories()
        +vehicles(filters)
        +vehicle(id)
        +trackClick(id, source, request)
    }
    class SubscribeController {
        +requestOtp(OtpRequest)
        +verifyOtp(OtpVerificationRequest)
    }
    class VehicleService {
        +search(...)
        +getPublicDetail(id)
        +getAdminDetail(id)
        +createSync(VehicleRequest)
        +createAsync(VehicleRequest)
        +update(id, VehicleRequest)
        +delete(id)
        +generateAndSaveAiDescription(id)
        +generateAiShare(id)
        +uploadDocument(...)
        +uploadImages(...)
        +markSold(id, SaleRecordRequest)
        +salesReport(from, to)
        -sendPostCommit(Runnable)
    }
    class CategoryService
    class VehicleClickService {
        +recordClick(id, source, request)
        +report(vehicleId, from, to)
    }
    class SubscriberService {
        +requestOtp(email)
        +verifyOtp(email, otp)
    }
    class OtpService {
        +generateOtp(email)
        +verifyOtp(email, otp)
    }
    class NotificationService {
        +notifySubscribers(vehicleId)
    }
    class EmailService {
        +sendOtpEmail(email, otp)
        +sendVehicleAddNotification(...)
    }
    class LLMService {
        +generateAiDescription(Vehicle)
        +buildPrompt(Vehicle)
    }
    class GeminiService {
        +generatePromoImage(...)
        +downloadBikeImage(url)
    }
    class PromoImageService {
        +generatePromoImage(vehicle, image)
        +downloadBikeImage(url)
    }
    class SupabaseStorageService {
        +uploadVehicleDocument(...)
        +uploadVehicleImage(...)
    }
    class VehicleWebSocketService {
        +publishVehicleAdded(id)
        +publishVehicleSold(id)
    }
    class RabbitmqSender {
        +sendVehicleCreated(id)
        +sendGenerateDescription(id)
        +sendVehicleSold(id)
    }
    class RabbitmqReceiver {
        +sendNotifications(id)
        +generateVehicleDescription(id)
        +broadcastVehicleSold(id)
    }

    AdminController --> VehicleService
    AdminController --> CategoryService
    AdminController --> VehicleClickService
    CatalogController --> VehicleService
    CatalogController --> CategoryService
    CatalogController --> NotificationService
    CatalogController --> VehicleClickService
    SubscribeController --> SubscriberService
    VehicleService --> LLMService
    VehicleService --> GeminiService
    VehicleService --> PromoImageService
    VehicleService --> SupabaseStorageService
    VehicleService --> RabbitmqSender
    VehicleService --> NotificationService
    VehicleClickService --> OtpService : uses resolvers
    SubscriberService --> OtpService
    SubscriberService --> EmailService
    NotificationService --> EmailService
    RabbitmqReceiver --> NotificationService
    RabbitmqReceiver --> VehicleService
    RabbitmqReceiver --> VehicleWebSocketService
```

---

## 5. Sequence — Async Vehicle Creation + Real-Time Broadcast

```mermaid
sequenceDiagram
    participant F as Flutter Admin
    participant AC as AdminController
    participant VS as VehicleService
    participant DB as PostgreSQL
    participant MQ as RabbitMQ
    participant R as RabbitmqReceiver
    participant LLM as Groq LLM
    participant NS as NotificationService
    participant WSS as VehicleWebSocketService
    participant W as React Web

    F->>AC: POST /api/admin/vehicles (X-ADMIN-KEY)
    AC->>VS: createAsync(request)
    VS->>DB: save(vehicle)
    Note over VS: registerSynchronization(afterCommit)
    VS-->>AC: VehicleDetailResponse (~343ms)
    AC-->>F: 201 Created
    Note over DB,MQ: transaction commits → afterCommit fires
    VS->>MQ: sendVehicleCreated(id) + sendGenerateDescription(id)
    par vehicle_create
        MQ->>R: sendNotifications(id)
        R->>NS: notifySubscribers(id)
        NS->>W: email to ACTIVE subscribers
        R->>WSS: publishVehicleAdded(id)
        WSS-->>W: STOMP /topic/inventory {VEHICLE_CREATED}
        W->>W: Redux upsert (filters re-checked)
    and vehicle_llm_description
        MQ->>R: generateVehicleDescription(id)
        R->>VS: generateAndSaveAiDescription(id)
        VS->>LLM: chat completion
        LLM-->>VS: sales copy
        VS->>DB: update description
    end
```

**Mark-as-sold** mirrors this: `markSold → afterCommit → vehicle_sold queue → publishVehicleSold → VEHICLE_SOLD → Redux removes item`.

---

## 6. Real-Time Inventory State Flow (React)

```mermaid
flowchart LR
    REST["useVehicles()<br/>GET /api/catalog/vehicles"] --> STORE["Redux vehiclesSlice.items"]
    WS["useInventoryWebSocket()<br/>@stomp/stompjs → /topic/inventory"] --> EVT{"event.type"}
    EVT -->|VEHICLE_CREATED| GET["getVehicle(id)"]
    GET --> MATCH{"matches filters?"}
    MATCH -->|yes| UPSERT["vehicleUpserted()"]
    MATCH -->|no| REMOVE["vehicleRemoved()"]
    EVT -->|VEHICLE_SOLD| REMOVE
    STORE --> UI["VehicleCard grid + VehicleDrawer"]
    UPSERT --> STORE
    REMOVE --> STORE
```

---

## 7. Frontend Module Architecture

### React Web App (`Autodeal-web-app/src`)

```mermaid
flowchart TD
    App[App.tsx] --> Layout[layout: Header · HeroBanner · Footer · SubscribeForm · TrustTicker]
    App --> Filters[filters: FilterPanel · CategoryRail]
    App --> Vehicle[vehicle: VehicleCard · VehicleDrawer · VehicleDetails]
    App --> Hooks["hooks: useVehicles · useVehicle · useInventoryWebSocket · useReveal"]
    Hooks --> Store["store: store · vehiclesSlice · hooks"]
    Hooks --> API["api: api-client · subscribe-client · websockets/connect-ws"]
    App --> i18n[i18n: LanguageProvider · translations]
    API --> Models["models: vehicle · singleVehicle · category · filters · vehicleSort"]
    API --> Utils["utils: formatter · vehicleFilters · whatsapp · constants"]
```

### Flutter Admin App (`mobile-app/lib`)

```mermaid
flowchart TD
    main[main.dart] --> Home[screens/home/admin_home.dart]
    Home --> Inventory[screens/inventory: inventory_page · vehicle_card · vehicle_details_bottomsheet]
    Home --> Form[screens/vehicle: vehicle_form_screen + steps/basic·specs·pricing·photos·review]
    Home --> Reports[screens/reports: reports_page]
    Inventory --> Services["services: api_client · vehicle_service · category_service · report_service"]
    Form --> Services
    Reports --> Services
    Form --> Dialogs[dialogs: mark_sold · upload_document · confirm]
    Inventory --> Components["components: ai_share_flow · shareVehicle · document_viewer_screen"]
    Services --> Models["models: vehicle · vehicle_draft · category · sales_report · vehicle_click_report"]
    Services -.X-ADMIN-KEY.-> Backend[(Spring Boot)]
```

---

## 8. Entity-Relationship (Data Model)

```mermaid
erDiagram
    CATEGORIES ||--o{ VEHICLES : categorizes
    VEHICLES ||--o{ VEHICLE_IMAGES : has
    VEHICLES ||--o{ VEHICLE_DOCUMENTS : has
    VEHICLES ||--o{ SALE_RECORDS : sold_via
    VEHICLES ||--o{ VEHICLE_CLICKS : tracked_by
    SUBSCRIBERS {
        bigint id PK
        varchar email UK
        varchar status
    }
    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar slug UK
        varchar description
    }
    VEHICLES {
        bigint id PK
        varchar title
        varchar registration_number UK
        varchar brand
        varchar model_name
        int manufacture_year
        numeric price
        varchar status
        bigint category_id FK
        varchar thumbnail_url
    }
    VEHICLE_IMAGES {
        bigint id PK
        bigint vehicle_id FK
        varchar image_url
        int display_order
    }
    VEHICLE_DOCUMENTS {
        bigint id PK
        bigint vehicle_id FK
        varchar type
        varchar file_url
        varchar storage_path
    }
    SALE_RECORDS {
        bigint id PK
        bigint vehicle_id FK
        numeric sale_price
        date sale_date
    }
    VEHICLE_CLICKS {
        bigint id PK
        bigint vehicle_id FK
        varchar ip_hash
        varchar region
        varchar source
        timestamp clicked_at
    }
```

---

## 9. Key Architectural Decisions

- **Single Spring Boot backend, two client classes.** Key-protected admin CRUD (Flutter) and public read-heavy catalog (React). The split is enforced in `SecurityConfig` + `AdminApiKeyFilter`: `/api/catalog/**` and `/api/subscribers/**` are `permitAll`, `/api/admin/**` is `authenticated`.
- **Transactional post-commit dispatch.** `TransactionSynchronizationManager.afterCommit()` ensures RabbitMQ messages publish only after the DB transaction commits, eliminating race conditions between the database and consumers.
- **RabbitMQ fan-out.** Slow external I/O (subscriber email, Groq LLM description) is offloaded from the request thread (~9.6x faster vehicle creation) and also drives WebSocket inventory events.
- **Redis.** Fail-open response cache (7 named caches with TTL + targeted eviction) plus short-lived OTP storage (5-minute TTL).
- **PostgreSQL is the source of truth**; Supabase Storage holds vehicle media and documents.
- **React state.** Redux stores inventory; REST hydrates it and STOMP patches it via `vehicleUpserted` / `vehicleRemoved`.
- **Newer modules (beyond README).** Vehicle-click analytics (`VehicleClick`, `RegionResolver`, `ClientIpResolver`, `IpAddressHasher`) and AI promo-image sharing (`GeminiService` / `PromoImageService`, `AiShareResponse`).

---

## Queue Reference

| Queue | Producer | Consumer | Purpose |
| --- | --- | --- | --- |
| `vehicle_create` | `RabbitmqSender.sendVehicleCreated` | `RabbitmqReceiver.sendNotifications` | Email new inventory to active subscribers + broadcast `VEHICLE_CREATED` |
| `vehicle_sold` | `RabbitmqSender.sendVehicleSold` | `RabbitmqReceiver.broadcastVehicleSold` | Broadcast `VEHICLE_SOLD` to web clients |
| `vehicle_llm_description` | `RabbitmqSender.sendGenerateDescription` | `RabbitmqReceiver.generateVehicleDescription` | Generate + persist Groq LLM sales copy |

## Cache Reference

| Cache | TTL | Evicted When |
| --- | ---: | --- |
| `categories` | 30 min | Category create/update/delete |
| `vehicle-searches` | 2 min | Vehicle/category mutations, image upload, mark sold |
| `public-vehicle-details` | 5 min | Vehicle update/delete, image upload, mark sold |
| `admin-vehicle-details` | 2 min | Vehicle/document/category mutations |
| `vehicle-images` | 5 min | Vehicle update/delete, image upload |
| `vehicle-documents` | 5 min | Document upload/delete, vehicle delete |
| `sales-reports` | 1 min | Vehicle create/update/delete, mark sold |
