# Inventory Management System (IMS)

Multi-company inventory platform with role-based access, purchases, sales, stock, staff, products, and vendors.

| Layer | Stack |
|-------|--------|
| **Frontend** | React 19 · Vite 7 · Tailwind CSS 4 · Redux Toolkit · TanStack Query · React Router |
| **Backend** | PHP 8.2+ · REST API · PHP sessions · Composer |
| **Data** | MySQL 8 |
| **Cache / OTP** | Redis (signup & verification OTP) |

---

## Overview

IMS is a full-stack **single-page application** for day-to-day retail and wholesale operations:

- **Companies** onboard via signup and email OTP verification.
- **Staff** are managed per company with roles and approval workflow.
- **Purchases** follow a draft → finalize → verify (or reject) flow and update stock when verified.
- **Sales** record line items and reduce stock.
- **Dashboard** shows KPIs and charts (sales vs purchases, date ranges, drill-down lists).
- **Sidebar navigation** is driven by **permissions** loaded at login (not only role name).

The React app talks to the PHP API through Vite’s `/api` proxy. Authentication uses **PHP sessions** with optional **Remember me** (longer-lived session cookie).

---

## Features

### Authentication & onboarding

- Company registration and super-admin signup
- Email OTP verification before full access
- **Login with password** (see [Login](#login))
- Session verify on protected routes, logout with confirmation
- Remember me (stores username locally; extended session on server)

### Dashboard

- Summary cards (sales, purchases, stock-related stats)
- Bar chart: sales vs purchases (e.g. last 7 days)
- Line chart with presets and custom date range
- Detail pages for sales and purchase breakdowns

### Stock

- List stock by product with search and filters
- Stock statistics for the company

### Staff

- List, search, and filter staff
- Create and update staff (name, email, phone, role, password)
- Approve / reject pending staff
- Soft delete with confirmation (role-gated)

### Vendors

- Vendor catalog per company
- Create, update, delete (with confirmation)
- Approve / reject workflow where applicable

### Products & categories

- Product catalog with categories
- Add, edit, delete products; set selling price
- Approve / reject product entries (role-gated)
- Category listing for purchase and sale flows

### Purchases

- Purchase list with filters and stats
- **Wizard**: vendor + date → line items → auto total → finalize
- Status workflow: **draft**, **completed**, **rejected**
- Role-based **verify** / **reject** / edit / delete
- Stock updates when purchases are verified

### Sales

- Sales list and detail views
- Create sale with product search and line items
- Stock decremented on completed sales

### Access control

- Roles: `superadmin`, `admin`, `manager`, `salesperson`
- Fine-grained permissions (e.g. `CREATE_PURCHASE`, `CREATE_SALE`, `VIEW_STOCK`)
- Sidebar items appear only when the user’s permission set matches (e.g. Purchase hidden for salesperson)

---

## User roles

| Role | Typical access |
|------|----------------|
| **Superadmin** | Full company control: dashboard, staff, vendors, products, purchases (including verify/delete), stock, sales |
| **Admin** | Same as superadmin except some destructive actions reserved for superadmin |
| **Manager** | Dashboard, reports, stock, purchases (create), staff (create/view), vendors, products (add) |
| **Salesperson** | Stock view, create sales — **no** purchase or staff management in sidebar |

Permissions are defined in `Backend/src/config/rolesandpermissions.php`.

---

## Login

Sign in at **`/login`**. Every account must authenticate with a **password**.

| Field | Description |
|-------|-------------|
| **Email or phone** | One identifier in the username field. Client accepts a valid **email** or Nepal mobile **`97` / `98` + 8 digits** (10 digits total). |
| **Password** | Required. Checked on the server with `password_verify` against the stored hash. |
| **Role** | Not typed at login. It is stored on the user record and returned in the session after a successful login; it controls permissions and UI. |

Optional **Remember me** keeps the username in `localStorage` and can extend the session cookie (about 30 days).

> **Note:** The login API currently resolves users by **email**. For demo accounts below, use the **email** column plus the shared password. Phone numbers are the registered contact on each staff profile.

After changing roles or permissions in config, **log out and log in again** so the session picks up the new permission list.

---

## Demo accounts

Seed data (two demo companies) after running migrations:

```bash
php Backend/scripts/seed_demo_data.php
```

**Password for all demo users:** `Password@1`

Full list: [`Backend/migrations/DEMO_SEED_CREDENTIALS.md`](Backend/migrations/DEMO_SEED_CREDENTIALS.md)

### Himalayan Traders Pvt Ltd

| Role | Email | Phone | Password |
|------|-------|-------|----------|
| Superadmin | suman@himalayantraders.demo | 9811000010 | `Password@1` |
| Admin | anita@himalayantraders.demo | 9811000011 | `Password@1` |
| Manager | bikash@himalayantraders.demo | 9811000012 | `Password@1` |
| Salesperson | rita@himalayantraders.demo | 9811000013 | `Password@1` |

### Valley Retail Co

| Role | Email | Phone | Password |
|------|-------|-------|----------|
| Superadmin | nabin@valleyretail.demo | 9812000010 | `Password@1` |
| Admin | priya@valleyretail.demo | 9812000011 | `Password@1` |
| Manager | kiran@valleyretail.demo | 9812000012 | `Password@1` |
| Salesperson | sita@valleyretail.demo | 9812000013 | `Password@1` |

Use **superadmin**, **admin**, or **manager** to see **Purchase** in the sidebar. **Salesperson** accounts only see stock and sales-related access.

---

## Getting started

### Prerequisites

- PHP 8.2+ with extensions for MySQL, JSON, session
- Composer
- Node.js 18+ and npm
- MySQL 8
- Redis (for OTP during signup)

### Database migrations

Run against your IMS database (in order):

1. `Backend/migrations/001_purchase_status.sql`
2. `Backend/migrations/002_add_rejected_status.sql`
3. `Backend/migrations/003_staff_product_vendor.sql`

Then optionally seed demo data:

```bash
php Backend/scripts/seed_demo_data.php
```

### Backend

```bash
cd Backend
composer install
```

Create `Backend/.env` (or use your existing env loader) with at least:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Redis and mail settings used by `envConfig.php` / `mailConfig.php`

Serve the API (example — adjust path to match your machine):

```bash
cd Backend/public
php -S localhost:8000
```

The Vite dev server proxies `/api` to `http://localhost:8000` (see `client/vite.config.js`).

### Frontend

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`), go to **Login**, and use a demo **email** + **`Password@1`**.

---

## Project structure

```
Inventory-Management-System/
├── Backend/
│   ├── public/          # API entry (index.php)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── config/      # roles, DB, Redis, mail
│   │   └── routes/Api.php
│   ├── migrations/
│   └── scripts/seed_demo_data.php
└── client/
    └── src/
        ├── Components/  # UI modules (Purchase, Sales, Staff, …)
        ├── pages/
        ├── api/         # API clients
        ├── Stores/      # Redux
        └── config/      # dashnav, icons
```

---

## Main app routes (frontend)

| Path | Description |
|------|-------------|
| `/` | Landing |
| `/login` | Login (email/phone + password) |
| `/signup` | Registration |
| `/web/dashboard` | Dashboard |
| `/web/stock` | Stock |
| `/web/staff` | Staff management |
| `/web/vendor` | Vendors |
| `/web/product` | Products |
| `/web/purchase` | Purchases |
| `/web/sale` | Sales |

---

## License

See repository license if present; otherwise treat as private project code.
