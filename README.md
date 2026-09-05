# 🏠🚚 MoveInBD — Housing, Logistics & Transport Platform

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-4.19-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-indigo.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-blue.svg)](https://neon.tech/)

> **MoveInBD** is a unified RESTful API platform for property rentals, house-shifting logistics, transport fleet bookings, and mess utility bill management in Bangladesh.

---

## 📌 Core Features

- **Strict 3 Primary Roles**: Role-based access control (`TENANT_USER`, `PROVIDER`, `ADMIN`).
- **Housing & Property Listings**: Property CRUD, keyword search (`?q=`), filtering (city, type, rent range), sorting, and soft deletes (`deletedAt`).
- **House-Shifting & Transport Fleet**: Moving vehicle fleet listing (pickups, vans, cars, microbuses) and concurrency-safe bookings via `$transaction`.
- **Mess Utility Bill Splitting**: Monthly utility calculation split evenly across active mess tenants with payment status tracking.
- **Payment Integration**: Multi-gateway support for **Stripe** & **SSLCommerz** with webhook verification and escrow status tracking (`HELD`, `RELEASED`, `REFUNDED`).
- **Admin Dashboard & Audit Logs**: System statistics, provider identity verification, and activity audit logging.
- **Interactive Documentation**: Embedded Swagger UI served live at `/api-docs`.

---

## 🛠️ Tech Stack

- **Runtime & Framework**: Node.js (v20+), TypeScript, Express.js
- **Database & ORM**: PostgreSQL (Neon DB), Prisma ORM 7
- **Authentication & Validation**: JWT, bcryptjs, Zod
- **Payment Gateways**: Stripe, SSLCommerz
- **Deployment**: Vercel Serverless Functions

---

## 🚀 How to Run Locally

### 1. Installation
```bash
git clone https://github.com/hurayrakhan/L2-solution-6.git
cd L2-solution-6
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=8000
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

JWT_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

STRIPE_SECRET_KEY=sk_test_...
SSLCOMMERZ_STORE_ID=sandbox_store_id
SSLCOMMERZ_STORE_PASSWORD=sandbox_store_password
```

### 3. Database Migration & Start Server
```bash
# Push Prisma schema to PostgreSQL
npm run prisma:generate
npm run prisma:push

# Run development server
npm run dev
```

Visit `http://localhost:8000/api-docs` to access the live Swagger API explorer.

---

## 🔑 Demo Evaluation Credentials

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@moveinbd.com` | `AdminPass123!` |
| **PROVIDER** | `owner@moveinbd.com` | `OwnerPass123!` |
| **TENANT_USER** | `tenant@moveinbd.com` | `TenantPass123!` |

---

## 📄 License
ISC License
