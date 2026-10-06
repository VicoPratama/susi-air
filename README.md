# Susi Air - Pilot Operations Web App (Fullstack Developer Technical Assessment)

A fullstack mobile-first web application for **Susi Air Pilot Operations** built with **Nuxt 3 (Vue 3 + Pinia + SCSS + TypeScript)** and **NestJS (Node.js + TypeScript)**.

---

## 🚀 Architecture & Repository Structure

```
.
├── nuxt/                           # Frontend Nuxt 3 Application (Mobile-First)
│   ├── assets/scss/                # Susi Air Design System & Brand Palette
│   ├── components/                 # Reusable UI (AppHeader, LimitCards, FlightHoursChart, DocumentsList, BottomNav)
│   ├── composables/                # useApi client wrapper with auth injection
│   ├── middleware/                 # auth.global.ts route protection
│   ├── pages/                      # /login, /, /schedule, /logbook, /more
│   ├── public/                     # Static assets (susiair-logo.png)
│   ├── stores/                     # Pinia auth & profile state management
│   └── types/                      # Frontend TypeScript interfaces
│
├── nest/                           # Backend NestJS REST API
│   ├── src/
│   │   ├── common/                 # Guards (JwtAuthGuard), Filters (HttpExceptionFilter), Decorators (@Public)
│   │   ├── data/                   # Seed JSON files (mock-flight-hours, mock-documents, mock-schedules)
│   │   └── modules/
│   │       ├── auth/               # POST /auth/login (JWT issuance)
│   │       ├── pilot/              # GET /pilot/me (Pilot profile)
│   │       ├── flight-hours/       # GET /flight-hours, GET /flight-hours/summary (rollingWindowBluffing)
│   │       ├── documents/          # GET /documents (Expiry status calculation)
│   │       └── schedules/          # GET /schedules (Monthly calendar & duty legend)
│   └── test/
│
├── mock-flight-hours.json          # Provided flight hours dataset
├── mock-documents.json             # Provided documents dataset
├── mock-schedules.json             # Provided monthly schedule dataset
├── susiair-logo.png                # Official Susi Air branding asset
└── package.json                    # Workspace root scripts
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js**: `v20+` or `v24+`
- **npm**: `v10+` or `v11+`

### 1. Running Both Apps Concurrently (or Independently)

#### Option A: Run from Root
```bash
# Run Frontend (Nuxt 3)
npm run dev:nuxt

# In a separate terminal, run Backend (NestJS)
npm run dev:nest
```

#### Option B: Run within respective folders
```bash
# 1. Backend (NestJS on port 3001)
cd nest
npm install
npm run start:dev

# 2. Frontend (Nuxt 3 on port 3000)
cd nuxt
npm install
npm run dev
```

- **Frontend URL**: `http://localhost:3000/login`
- **Backend API**: `http://127.0.0.1:3001`

---

## 🔑 Crew Credentials for Testing

| Field | Value |
|---|---|
| **Username** | `johndoe` |
| **Password** | `susiairtest` |

---

## ⚙️ Environment Variables

### Frontend (`/nuxt`)
Create `.env` inside `nuxt/` (optional, defaults are preconfigured):
```env
NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001
```

### Backend (`/nest`)
Create `.env` inside `nest/` (optional, defaults are preconfigured):
```env
PORT=3001
JWT_SECRET=susiair_pilot_jwt_secret_key_2026
```

---

## 📌 Implementation Details & Brief Compliance

### 1. Server-Side Rolling Sum Calculation (`rollingWindowBluffing`)
- Defined in `nest/src/modules/flight-hours/flight-hours.service.ts`.
- Preceded by the required comment: `// this is a rolling sum calculation :)`.
- Implements the exact 15-day range centered around **15 May 2026** (7 days before today, today, 7 days after today).
- Supports all toggles: `1w` (7d, limit 40h), `1m` (30d, limit 100h), `3m` (90d, limit 300h), `6m` (180d, limit 600h), `1y` (365d, limit 1050h).
- Treats unrecorded/missing days as 0 without breaking array continuity.

### 2. Document Expiry Calculations
- Dynamic calculation based on `today = 2026-05-15`.
- Status categorization:
  - **`safe` (Green)**: `daysRemaining > 30`
  - **`soon` (Amber)**: `0 < daysRemaining <= 30`
  - **`expired` (Red)**: `daysRemaining <= 0`

### 3. Roster Schedule Calendar
- Monthly selector with previous/next controls for April, May, and June 2026.
- Dynamic background tinting and borders based on `base_color` and `base_name`.
- Checkmark indicator (✓) when `count_logbooks === count_schedules`, otherwise displays the pending duty count badge.
- Interactive modal with *"Detail page coming soon"* placeholder for individual date inspections.

---

## 🛠️ Main Choices & Rationale

1. **SCSS with Structured Design System Tokens:**
   - Designed to strictly follow Susi Air's corporate identity (`#0E2138` navy, `#E63757` brand red, `#F5F6F8` surface).
   - High accessibility with clean contrast for cockpit/operational environments.
2. **SVG Interactive Rolling Trend Chart:**
   - Hand-crafted reactive SVG chart with cubic bezier smoothing, glowing gradients, horizontal red regulatory line, and touch/hover tooltips without heavy external canvas charting libraries.
3. **Modular NestJS Architecture:**
   - Proper separation of Modules, Controllers, Services, and DTOs with `class-validator`.
   - Global `HttpExceptionFilter` and `JwtAuthGuard` applied across all endpoints, with public login exemption.
4. **Pinia Auth Store & Composable Integration:**
   - Centralized authentication state with cookie persistence and automatic bearer token injection into API requests.

---

## 🔮 What I Would Change / Add With More Time

1. **Persistent Database Layer (SQLite / PostgreSQL with Prisma/TypeORM):**
   - Currently, data is seeded in-memory from the provided JSON files. With more time, a migration-driven Prisma schema with proper relational models would be implemented.
2. **Full Electronic Logbook (eLog) Subsystem:**
   - Implement end-to-end log entry submissions with block times, takeoffs/landings, and digital signatures.
3. **Flight Leg & Crew Pairing Drill-Down:**
   - Expand the Schedule date click from placeholder into a full route leg viewer (e.g. MKW - BXM - MKW flight rotations).
4. **PWA & Offline Capability:**
   - Add service workers and IndexedDB caching for offline roster access in remote airstrips.
