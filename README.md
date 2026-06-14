# HR Integration Platform

A full-stack HR Integration Platform that simulates how modern integration providers such as Merge.dev or Finch connect companies with HRIS and Payroll systems.

The platform allows administrators to create companies, manage integrations, import employees from external providers, simulate synchronization events, and audit synchronization activity through detailed logs.

---

## Features

### Authentication & Authorization

* JWT Authentication
* Role-based access control
* Admin, Developer and Viewer roles
* Protected API routes

### Company Management

* Create companies
* View companies
* Associate integrations with companies

### Integrations

* Create HRIS integrations
* Supported providers:

  * Workday
  * ADP
  * BambooHR
* Prevent duplicate integrations
* Track integration status
* Track last synchronization timestamp

### Employee Management

* Import employees from providers
* CSV Upload support
* CSV Template generation
* Provider-specific normalization
* Employee search
* Employee filtering
* Pagination

### Simulated Provider Sync

* Simulate external provider updates
* Generate configurable amounts of mock employees
* Automatic employee upserts
* Update integration synchronization metadata
* Create synchronization audit logs

### Sync Logs

* Track synchronization activity
* Success and failure status
* Inserted records count
* Updated records count
* User tracking
* Filtering
* Pagination

### Security

* JWT Authentication
* Zod request validation
* Helmet security headers
* Rate limiting
* Environment-based CORS configuration

---

## Architecture

```text
Company
   │
   ▼
Integration
   │
   ▼
Provider Payload
   │
   ▼
Normalization Layer
   │
   ▼
Canonical Employee Model
   │
   ▼
MongoDB
   │
   ▼
Sync Logs
```

---

## Supported Providers

### Workday

Input:

```json
{
  "workerId": "WD-1001",
  "first_name": "John",
  "last_name": "Doe",
  "work_email": "john.doe@company.com"
}
```

Normalized:

```json
{
  "externalId": "WD-1001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com"
}
```

### ADP

Input:

```json
{
  "associateId": "ADP-1001",
  "givenName": "Jane",
  "familyName": "Smith",
  "email": "jane.smith@company.com"
}
```

Normalized:

```json
{
  "externalId": "ADP-1001",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@company.com"
}
```

---

## Tech Stack

### Frontend

* React
* React Router
* React Hook Form
* Zod
* Axios
* React Toastify
* Vite

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* Bcrypt
* Zod

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Environment Variables

### Backend

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

CLIENT_URLS=http://localhost:5173,https://your-app.vercel.app
```

### Frontend

```env
VITE_API_URL=https://your-render-api.onrender.com/api
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>

cd project
```

### Backend

```bash
cd backend

npm install

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Seed Demo Data

Create demo data:

```bash
cd backend

npm run seed
```

Demo credentials:

```text
Email: admin@demo.com

Password: 123456
```

Seed creates:

* Demo Admin User
* Demo Company
* Workday Integration

---

## API Endpoints

### Auth

```http
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

### Companies

```http
POST /api/companies

GET /api/companies
```

### Integrations

```http
POST /api/integrations

GET /api/integrations

POST /api/integrations/:integrationId/simulate-sync
```

### Employees

```http
POST /api/employees/import

GET /api/employees
```

### Sync Logs

```http
GET /api/sync-logs
```

### Dashboard

```http
GET /api/dashboard
```

---

## Future Improvements

* GitHub Actions CI/CD
* Unit Testing
* Integration Testing
* Provider Credential Management
* Scheduled Synchronizations
* Webhook Processing
* Real Provider API Integrations
* Soft Deletes
* Audit Trails
* Multi-Tenant Support

---

## Demo

Frontend:

```text
https://your-vercel-app.vercel.app
```

Backend:

```text
https://your-render-api.onrender.com
```

---

## Author

Leandro Cadena

Full Stack Software Developer

Focused on backend systems, integrations, distributed architectures, APIs, ETL pipelines and cloud-native applications.
