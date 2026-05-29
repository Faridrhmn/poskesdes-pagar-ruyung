# Poskesdes API Implementation Guide

## API Files Created

All API files are in the `api/` folder and ready to be uploaded to `https://api.vadr.my.id/bidan/`

### Backend (PHP) Files:

1. **`api/db.php`** - Database configuration and authentication utilities
2. **`api/admin.php`** - Admin authentication (already working)
3. **`api/pasien.php`** - Patient management
4. **`api/anc.php`** - ANC (Antenatal Care) records
5. **`api/kb.php`** - KB (Family Planning) records
6. **`api/lansia.php`** - Elderly patient records
7. **`api/jadwal.php`** - Schedule/appointments
8. **`api/education.php`** - Education materials

### Frontend (TypeScript) Files:

1. **`lib/api.ts`** - API utilities and TypeScript interfaces

## API Endpoints

### Admin Authentication
- `POST /admin.php/login` - Login
- `POST /admin.php/register` - Create new admin (requires auth)
- `PUT /admin.php/change-password` - Change password (requires auth)

### Pasien (Patients)
- `GET /pasien.php` - Get all patients
- `GET /pasien.php/{id}` - Get single patient
- `POST /pasien.php` - Create patient (requires auth)
- `PUT /pasien.php/{id}` - Update patient (requires auth)
- `DELETE /pasien.php/{id}` - Delete patient (requires auth)

### ANC Records
- `GET /anc.php` - Get all ANC records
- `GET /anc.php/{id}` - Get single record
- `GET /anc.php/pasien/{pasien_id}` - Get records by patient
- `POST /anc.php` - Create record (requires auth)
- `DELETE /anc.php/{id}` - Delete record (requires auth)

### KB Records
- `GET /kb.php` - Get all KB records
- `GET /kb.php/{id}` - Get single record
- `GET /kb.php/pasien/{pasien_id}` - Get records by patient
- `POST /kb.php` - Create record (requires auth)
- `DELETE /kb.php/{id}` - Delete record (requires auth)

### Lansia Records
- `GET /lansia.php` - Get all Lansia records
- `GET /lansia.php/{id}` - Get single record
- `GET /lansia.php/pasien/{pasien_id}` - Get records by patient
- `POST /lansia.php` - Create record (requires auth)
- `DELETE /lansia.php/{id}` - Delete record (requires auth)

### Jadwal (Schedule)
- `GET /jadwal.php` - Get all schedules
- `GET /jadwal.php/upcoming?limit=5` - Get upcoming schedules
- `GET /jadwal.php/{id}` - Get single schedule
- `POST /jadwal.php` - Create schedule (requires auth)
- `PUT /jadwal.php/{id}` - Update schedule (requires auth)
- `DELETE /jadwal.php/{id}` - Delete schedule (requires auth)

### Education Materials
- `GET /education.php` - Get all materials
- `GET /education.php/{id}` - Get single material
- `POST /education.php` - Create material (requires auth)
- `PUT /education.php/{id}` - Update material (requires auth)
- `DELETE /education.php/{id}` - Delete material (requires auth)

## Frontend Usage Examples

### Import the API

```typescript
import { pasienApi, ancApi, kbApi, lansiaApi, jadwalApi, educationApi } from '@/lib/api'
```

### Get all patients

```typescript
const patients = await pasienApi.getAll()
```

### Create a new patient

```typescript
const newPatient = await pasienApi.create({
  id: 'P-001',
  nama: 'Ibu Siti',
  no_hp: '08123456789',
  tgl_daftar: '2024-01-15',
  usia_kehamilan: 12
})
```

### Get ANC records for a patient

```typescript
const ancRecords = await ancApi.getByPasien('P-001')
```

### Create ANC record

```typescript
const newAncRecord = await ancApi.create({
  id: 'ANC-001',
  pasien_id: 'P-001',
  pasien_nama: 'Ibu Siti',
  tanggal: '2024-01-15',
  kunjungan_ke: 1,
  k_status: 'K1',
  td: '120/80',
  // ... other fields
})
```

### Get upcoming schedules

```typescript
const upcomingSchedules = await jadwalApi.getUpcoming(5)
```

## Authentication

All write operations (POST, PUT, DELETE) require authentication. The token is automatically included from localStorage when using the API utilities.

### How it works:

1. User logs in via `admin.php/login`
2. Token is saved to localStorage
3. API utilities automatically include the token in requests that require auth
4. Token is valid for 24 hours

## Error Handling

All API functions throw errors if the request fails. Use try-catch:

```typescript
try {
  const patients = await pasienApi.getAll()
  // Handle success
} catch (error) {
  console.error('Failed to fetch patients:', error)
  // Handle error
}
```

## Next Steps

1. Upload all `api/*.php` files to `https://api.vadr.my.id/bidan/`
2. Make sure the database tables are created (run `database.sql`)
3. Create an admin user in the `admins` table
4. Update the frontend components to use the API instead of localStorage

## Database Setup

Run the `database.sql` file to create all tables:
- `pasien`
- `anc_records`
- `kb_records`
- `lansia_records`
- `jadwal`
- `education_materials`
- `admins` (from `admin.sql`)

## Security Notes

- All write operations require authentication
- GET operations are public (no auth required)
- Tokens expire after 24 hours
- Change the `project_secret()` in `db.php` for production
- Database credentials are in `db.php`

