# 🏠🚚 MoveInBD — Housing, Logistics & Transport Platform

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-4.19-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-indigo.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-blue.svg)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-ISC-brightgreen.svg)]()

> **MoveInBD** is a unified API platform for property rentals, house-shifting logistics, transport bookings, and mess utility bill management.

---



## 📌 Features & Architecture Highlights

- **Strict 3 Primary Roles (RBAC)**: Enforces role permissions across `TENANT_USER`, `PROVIDER` (Property Owners / Drivers), and `ADMIN`.
- **Housing & Property Rentals**: Complete property listing CRUD with soft deletes (`deletedAt`), keyword search (`?q=`), filtering (city, type, rent range), sorting, and pagination.
- **Logistics & Travel Fleet**: Management of moving vans, pickups, microbuses, and cars with real-time availability tracking.
- **Mess Utility Bill Splitting**: Automatic calculation of monthly utility bills (electricity, gas, water, internet) split evenly across active mess tenants with payment tracking.
- **Concurrency-Safe Escrow Bookings**: Housing lease applications and vehicle bookings handled atomically via Prisma `$transaction` with escrow holding state (`HELD`, `RELEASED`, `REFUNDED`).
- **Multi-Gateway Payment Integration**: Real payment integration using **Stripe Checkout** & **SSLCommerz** with webhook verification, payment session creation, and callback handling.
- **Admin Dashboard & System Audit Logs**: Comprehensive platform analytics, provider identity verification, and system activity audit logs.
- **Interactive Documentation**: Embedded Swagger UI served live at `/api-docs`.
- **Vercel Serverless Ready**: Native ESModule (`ESNext`) setup configured for seamless serverless deployment.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Runtime & Framework** | Node.js (v20+), TypeScript, Express.js | Core REST API server |
| **Database & ORM** | PostgreSQL (Neon DB), Prisma ORM 7 | Relational database, multi-file schema models, transactions |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs | Secure password hashing & Bearer Token RBAC authorization |
| **Validation** | Zod | Server-side request body and param validation |
| **Security & Middleware** | Helmet, CORS, Express-Rate-Limit, Cookie-Parser | Security headers, rate limiting (100 req/15m), CORS management |
| **Payment Gateways** | Stripe, SSLCommerz | Payment sessions, webhooks, callback handling |
| **API Documentation** | Swagger UI (`swagger-ui-express`, `swagger-jsdoc`) | Interactive API explorer at `/api-docs` |
| **Deployment** | Vercel Serverless Functions | Production API hosting |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- **Node.js** (v20.0.0 or higher)
- **npm** (v10.0.0 or higher)
- **PostgreSQL Database** (e.g. [Neon PostgreSQL](https://neon.tech))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/hurayrakhan/L2-solution-6.git
cd L2-solution-6
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root directory (refer to `.env.example`):

```env
NODE_ENV=development
PORT=8000
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

# JWT Authentication
JWT_SECRET=your_jwt_access_secret_key_minimum_256bit
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_256bit
JWT_REFRESH_EXPIRES_IN=30d

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_51...
SSLCOMMERZ_STORE_ID=sandbox_store_id
SSLCOMMERZ_STORE_PASSWORD=sandbox_store_password
SSLCOMMERZ_IS_LIVE=false

# Client & Server URLs
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:8000
```

### 3. Database Migration & Prisma Client
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:8000`. You can visit `http://localhost:8000/api-docs` to view the interactive Swagger API documentation.

### 5. Build & Run for Production
```bash
npm run build
npm start
```

---

## 🔑 Evaluation Demo Credentials

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@moveinbd.com` | `AdminPass123!` |
| **PROVIDER** | `owner@moveinbd.com` | `OwnerPass123!` |
| **TENANT_USER** | `tenant@moveinbd.com` | `TenantPass123!` |

---

## 📋 REST API Endpoints Specification (28 APIs)

All API responses follow a standardized JSON structure:
- **Success**: `{ "success": true, "message": "...", "meta": {...}, "data": {...} }`
- **Error**: `{ "success": false, "message": "...", "errors": [...] }`

### 1. Authentication Module (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register a new user (`TENANT_USER`, `PROVIDER`, `ADMIN`) |
| `POST` | `/api/v1/auth/login` | Public | Login with email & password, returns JWT tokens |
| `POST` | `/api/v1/auth/refresh-token` | Public | Generate a new access token using a refresh token |

### 2. User & Profile Module (`/api/v1/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/users/me` | Authenticated | Retrieve profile details of the logged-in user |
| `PATCH` | `/api/v1/users/me` | Authenticated | Update profile details (name, phone, avatar) |

### 3. Property Management Module (`/api/v1/properties`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/properties` | `PROVIDER` | Add a new house, flat, or room listing |
| `GET` | `/api/v1/properties` | Public | List properties with filter, sort & pagination (`?page=1&limit=10&city=Dhaka`) |
| `GET` | `/api/v1/properties/search` | Public | Search properties by keyword query (`?q=Dhanmondi`) |
| `GET` | `/api/v1/properties/:id` | Public | Retrieve detailed property information by ID |
| `PATCH` | `/api/v1/properties/:id` | `PROVIDER` | Update property details |
| `DELETE` | `/api/v1/properties/:id` | `PROVIDER` | Soft delete property listing (`deletedAt`) |

### 4. Mess Utility Splitting Module (`/api/v1/utilities`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/utilities` | `PROVIDER` | Create monthly utility bill & split shares among tenants |
| `GET` | `/api/v1/utilities` | `TENANT_USER` | List tenant's monthly utility bills and share breakdown |
| `PATCH` | `/api/v1/utilities/:id/pay` | `TENANT_USER` | Mark utility share bill as paid |

### 5. Logistics & Fleet Vehicle Module (`/api/v1/vehicles`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/vehicles` | `PROVIDER` | Add vehicle (Pickup, Van, Microbus) to logistics fleet |
| `GET` | `/api/v1/vehicles` | Public | List all available logistics & transport vehicles |
| `DELETE` | `/api/v1/vehicles/:id` | `PROVIDER` | Soft delete vehicle record |

### 6. Concurrency-Safe Booking Module (`/api/v1/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/bookings` | `TENANT_USER` | Create property rental or vehicle booking (uses `$transaction`) |
| `GET` | `/api/v1/bookings/my-bookings` | Authenticated | View logged-in user's booking history |
| `PATCH` | `/api/v1/bookings/:id/status` | `PROVIDER` / `ADMIN` | Update booking status & escrow state (`CONFIRMED`, `COMPLETED`, `CANCELLED`) |

### 7. Multi-Gateway Payment Module (`/api/v1/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/payments/stripe/create-checkout-session` | `TENANT_USER` | Create a Stripe Checkout Payment Session |
| `POST` | `/api/v1/payments/stripe/webhook` | Public | Handle Stripe payment event webhooks |
| `POST` | `/api/v1/payments/sslcommerz/initiate` | `TENANT_USER` | Initiate SSLCommerz payment session (bKash/Cards) |
| `POST` | `/api/v1/payments/sslcommerz/success` | Public | SSLCommerz payment success callback |

### 8. System Administration Module (`/api/v1/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard-stats` | `ADMIN` | Retrieve platform-wide analytics & revenue summary |
| `GET` | `/api/v1/admin/users` | `ADMIN` | List all registered system users |
| `PATCH` | `/api/v1/admin/users/:id/verify-provider` | `ADMIN` | Approve and verify service provider accounts |
| `GET` | `/api/v1/admin/audit-logs` | `ADMIN` | Inspect system activity audit logs |

---

## 🗄️ Database Architecture (Prisma Multi-File Models)

```
prisma/
├── prisma.config.ts        # Prisma 7 configuration file
└── models/
    ├── schema.prisma       # Datasource & generator config
    ├── enums.prisma        # System Enums (Role, BookingStatus, PaymentStatus, etc.)
    ├── user.prisma         # User & Provider Profile models
    ├── property.prisma     # Property listing & photos
    ├── utility.prisma      # Utility Bills & Tenant shares
    ├── vehicle.prisma      # Fleet vehicles
    ├── booking.prisma      # House-shifting & rental bookings
    ├── payment.prisma      # Payment transactions
    └── auditLog.prisma     # System activity logs
```

---

## 🚀 Deployment (Vercel Serverless)

The project includes pre-configured serverless handlers for Vercel deployment:

- **Entry Point**: `api/index.ts`
- **Config**: `vercel.json`
- **Build Command**: `npm run build` (`prisma generate && tsc`)

---

## 📝 License

This project is licensed under the **ISC License**.
