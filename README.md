# Shree Ganesh Autodeal

Catalog management system for a two-wheeler resale shop.

## Structure

- `ShreeGaneshAutodeal-backend/ShreeGaneshAutodeal` - Spring Boot API.
- `web-app` - React public catalog for customers.
- `mobile-app` - Flutter owner/admin app.
- `supabase/schema.sql` - Optional SQL schema for Supabase.

## Backend Environment

The backend runs on local H2 by default. To use Supabase Postgres and Storage, set:

```powershell
$env:SUPABASE_DB_URL="jdbc:postgresql://<host>:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USER="postgres"
$env:SUPABASE_DB_PASSWORD="<database-password>"
$env:SUPABASE_URL="https://<project-ref>.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
$env:SUPABASE_STORAGE_BUCKET="vehicle-documents"
```

Create a public Supabase Storage bucket named `vehicle-documents`, or change `SUPABASE_STORAGE_BUCKET`.

## Run

```powershell
cd ShreeGaneshAutodeal-backend\ShreeGaneshAutodeal
.\mvnw.cmd spring-boot:run
```

```powershell
cd web-app
npm install
npm run dev
```

```powershell
cd mobile-app
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
```
