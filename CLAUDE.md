# Business Dashboard — AI Development Guidelines

## Purpose

This document defines the architectural decisions, coding standards, and development conventions that every AI assistant should follow when contributing to this repository.

The objective is to ensure consistency across the entire codebase while maintaining a scalable, production-ready architecture.

---

# Project Overview

Business Dashboard is a Full Stack Business Intelligence platform designed for Small and Medium-sized Businesses (SMBs).

The platform allows users to upload Excel or CSV datasets and automatically generate dashboards, KPIs, reports, and business insights.

The architecture intentionally separates business operations from analytical processing through independent services.

---

# Repository Structure

```text
business-dashboard/

├── frontend/
│
├── api/
│
├── analytics/
│
├── docs/
│
├── docker-compose.yml
│
├── README.md
│
└── CLAUDE.md
```

---

# Architecture

```text
                 React + TypeScript

                        │

                        ▼

             Express API (Node.js)

        ┌───────────────┼───────────────┐

        ▼               ▼               ▼

    MongoDB           MinIO       FastAPI (Python)
   (metadata)     (file storage)         │
                        ▲                │
                        └── reads files ─┘
                                  │

                           Pandas / NumPy
```

---

# Responsibilities

## Frontend

Responsible for:

- User Interface
- Authentication flow
- Dashboard visualization
- Forms
- API consumption

The frontend must never contain business logic.

---

## Express API

Responsible for:

- Authentication
- Authorization
- Business logic
- CRUD operations
- Dataset lifecycle management
- File uploads persisted through the StorageProvider abstraction
- Communication with Analytics Service
- Data persistence
- API documentation

The Express API is the single entry point to the platform.

---

## Analytics Service

Responsible for:

- Reading dataset files directly from MinIO
- Dataset processing
- Data cleaning
- KPI calculation
- Statistical analysis
- Machine Learning
- Future AI features

The Analytics Service never communicates directly with MongoDB.

All communication with MongoDB must occur through HTTP requests from the Express API. Express notifies the Analytics Service with dataset coordinates only (`datasetId`, `bucket`, `objectKey`) — it never forwards the file itself. The Analytics Service reads the object directly from MinIO using those coordinates, and reports results back to Express via a callback.

---

# Frontend Architecture

The frontend is a Vite + React 19 + TypeScript SPA. It does not use a `src/` documentation split like the backend `api/` — everything below lives directly inside `frontend/src/`.

```text
frontend/
├── public/
│
└── src/
    ├── assets/          # images, icons, fonts, static files
    ├── components/
    │   ├── ui/          # generic, brand-agnostic primitives (Button, Card, Input, Modal...)
    │   ├── layout/      # structural pieces reused across layouts (Navbar, Sidebar, Header)
    │   └── charts/      # Recharts wrapper components (BarChart, LineChart, KpiCard...)
    ├── layouts/         # page shells that compose route groups (AuthLayout, DashboardLayout)
    ├── pages/           # route-level components, one subfolder per business module
    │   ├── auth/
    │   ├── companies/
    │   ├── datasets/
    │   └── dashboard/
    ├── router/          # react-router-dom route trees and route guards
    ├── hooks/           # reusable custom hooks, usually wrapping React Query
    ├── contexts/        # React Context providers (auth/session, theme, UI state)
    ├── services/        # axios instance + typed API-calling functions, one file per backend module
    ├── types/           # shared TS interfaces/types mirroring the API's OpenAPI contracts
    ├── constants/       # enums, route paths, static config values
    ├── utils/           # stateless helper functions
    ├── App.tsx
    ├── main.tsx
    └── index.css        # Tailwind entry point + @theme design tokens
```

Future contributions must respect this layout. Do not scatter components, pages, or API calls outside the folder they belong to.

---

# Frontend Layer Responsibilities

## Components

Reusable, presentational UI pieces. Split by purpose:

- `ui/` — generic primitives with no business meaning (Button, Input, Card, Modal, Badge...).
- `layout/` — structural chrome reused across layouts (Navbar, Sidebar, Header, Footer).
- `charts/` — Recharts wrapper components (see "Data Visualization" below).

Components must not call `axios` or `services/` directly. They receive data via props or consume a hook. They must not contain routing or data-fetching logic.

---

## Pages

Route-level components, one subfolder per business module (`auth/`, `companies/`, `datasets/`, `dashboard/`), mirroring the Express API's module boundaries.

Pages orchestrate data-fetching (via `hooks/`) and compose `components/` into a screen. They must not define reusable UI markup — that belongs in `components/`.

---

## Layouts

Structural shells (`AuthLayout`, `DashboardLayout`) that wrap groups of pages with shared chrome. Wired in through `router/`, never re-implemented per page.

---

## Router

Centralizes all `react-router-dom` route definitions and route guards (e.g. `RequireAuth`). No page or component should implement its own navigation guard — that logic lives exclusively in `router/`.

---

## Hooks

Encapsulate reusable stateful logic, most commonly wrapping React Query (`useQuery` / `useMutation`) around a `services/` call — e.g. `useAuth`, `useDatasets`, `useCompanies`. Hooks are the bridge between `services/` and the UI; components should consume hooks rather than calling `services/` directly.

---

## Contexts

Global, cross-cutting **client** state only — auth/session, theme, UI toggles. Server data (anything that comes from the API) must never live in Context; that is React Query's responsibility.

---

## Services

One file per backend module (`authService.ts`, `companyService.ts`, `datasetService.ts`...), each exporting typed functions that wrap a shared `axios` instance. Mirrors the Express API's module boundaries. Services never touch React state and are never imported directly by components.

---

## Types

TypeScript interfaces/types mirroring the request/response contracts exposed by the Express API's `openapi/` schemas. Keep these in sync with the backend `contracts/` and `types/` folders rather than re-inventing shapes.

---

## Constants / Utils

`constants/` holds enums, route paths and static config values. `utils/` holds stateless helper functions (formatters, validators). Neither may depend on React or call `services/`.

---

# Styling — TailwindCSS

Tailwind CSS v4 is wired through the `@tailwindcss/vite` plugin — there is no `tailwind.config.js`. The design system lives as CSS variables declared with `@theme` inside `src/index.css`.

**The product's branding is not defined yet** — no final colors, fonts, spacing scale, or logo exist. This makes semantic Tailwind theme variables mandatory, not a style preference:

- Never hardcode raw design values in a component: no hex/rgb colors, no arbitrary values (`bg-[#1a2b3c]`, `text-[15px]`), and no raw Tailwind palette classes (`bg-blue-500`, `text-red-600`).
- Always reference **semantic tokens** defined once in `src/index.css` under `@theme`, e.g. `--color-primary`, `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-danger`, `--color-success`, `--font-sans`, `--font-heading`. Consume them through the generated utilities (`bg-primary`, `text-foreground`, `border-border`, `font-sans`...).
- When real branding is decided, only `src/index.css` should need to change — colors, fonts, and radii propagate automatically because every component already points at the token, not a literal value.
- If a token you need doesn't exist yet, add it to `@theme` first, then consume it — do not reach for a raw value "just this once."
- The UI must be responsive (mobile, tablet, desktop — see SRS RNF-04). Use Tailwind's responsive variants (`sm:`, `md:`, `lg:`, `xl:`) rather than custom media queries.

---

# Data Visualization — Recharts

- All charts live in `components/charts/`, wrapping Recharts primitives (`BarChart`, `LineChart`, `PieChart`...) behind typed, project-specific components (e.g. `RevenueLineChart`). Pages must never import Recharts primitives directly.
- Chart series colors must come from the same `@theme` tokens as the rest of the UI (e.g. `--color-chart-1` … `--color-chart-n`), never hardcoded hex values — charts must restyle automatically once branding is defined, exactly like everything else.
- Keep data-shaping (aggregating, sorting, formatting API responses into chart-ready arrays) inside `hooks/` or `utils/`. Chart components only receive data already shaped for rendering.

---

# Frontend State & Data Fetching

- Server state (anything from the API) is managed exclusively through `@tanstack/react-query`. Components must never fetch data with `useEffect` + `axios` directly.
- `axios` is only ever called from `services/`; `hooks/` wrap those calls with `useQuery`/`useMutation` and expose loading/error state to pages and components.
- Global client-only state (auth/session, theme) belongs in `contexts/`, consumed through a corresponding hook (e.g. `useAuthContext`).

---

# Backend Architecture

The Express backend intentionally does **not** use a `src/` directory.

All backend folders live directly inside `/api`.

Example:

```text
api/

controllers/
routes/
middleware/
models/
services/
storage/
validators/
utils/
scripts/
config/
contracts/
openapi/
types/
tests/
```

`storage/` holds the `StorageProvider` abstraction and its implementations (e.g. `MinIOStorageProvider`). It exists as its own top-level folder — a peer to `services/` — because it is the Dependency Inversion boundary between business logic and the object-storage SDK, not a business rule. See the "File Storage" section below.

Future contributions must respect this layout.

Do not introduce an additional `src/` folder.

---

# Layer Responsibilities

## Controllers

Responsible for:

- Receiving HTTP requests
- Calling services
- Returning HTTP responses
- Managing cookies
- Handling status codes

Controllers should remain thin.

Business logic must never be implemented here.

---

## Services

Responsible for:

- Business rules
- Database interaction
- Authentication logic
- Token generation
- External service communication

Services contain the application's business logic.
Services are the only layer allowed to orchestrate interactions between MongoDB and the StorageProvider.

---

## Models

Responsible for:

- Mongoose schemas
- Persistence
- Relationships
- Indexes

Do not perform business logic inside models.
Models should remain persistence-only objects. Status transitions, ownership validation and storage operations belong to services.

---

## Middleware

Responsible for:

- Authentication
- Authorization
- Validation
- Error handling

Middleware should remain reusable.

---

## Validators

All request validation must be implemented using:

- express-validator

Validation logic should remain outside controllers.

---

## Utils

Responsible for:

- Stateless helper functions
- JWT utilities
- Password hashing helpers
- Generic reusable utilities

Utilities should not access the database.

---

# Persistence

MongoDB is accessed exclusively through Mongoose.

Rules:

- Never use the native MongoDB driver.
- Never perform raw database operations inside controllers.
- Keep persistence logic inside services and models.
- Use indexes whenever appropriate.

---

# File Storage

MongoDB never stores binary files. Every uploaded file (`.csv`, `.xlsx`) is persisted in **MinIO** (S3-compatible Object Storage). MongoDB stores only the metadata needed to locate it (`bucket`, `objectKey`, `mimeType`, `size`, ...).

Rules:

- The Dataset module must never know whether files are stored in MinIO, on local disk, or in Amazon S3 — it depends exclusively on the `StorageProvider` interface (`upload`, `download`, `delete`, `exists`), following the Dependency Inversion Principle.
- The active implementation is `MinIOStorageProvider`. Future implementations (`LocalStorageProvider`, `S3StorageProvider`) live in `storage/providers/` and are wired in through `storage/storage.factory.ts` — the only file allowed to know which concrete provider is active.
- There is **one** bucket for the whole platform. Never create a bucket per company.
- The physical object key is always generated (`companies/<companyId>/<datasetId>.<ext>`) — never derived from the original filename, which is stored in MongoDB purely for display.
- Object keys are generated through the shared `buildDatasetObjectKey()` helper. Storage providers must never construct keys manually.
- `storage/` code must not import Express types, `ApiError`, or any HTTP concept — it is a persistence-adjacent layer, not an HTTP layer. Storage implementations throw their own error type; services translate it into an `ApiError`.
- The Analytics Service reads and writes objects directly against MinIO — Express never proxies file bytes to or from it.

See [`docs/srs.md` §6](docs/srs.md#6-decisiones-arquitectónicas-almacenamiento-y-procesamiento-de-datasets) for the full design: bucket layout, the Dataset status machine, the upload/processing/delete sequences, and the callback contract with the Analytics Service.

- Dataset status transitions are managed exclusively by `DatasetService`. Storage providers must never modify dataset metadata or perform business logic.
- Dataset ownership is inherited from its parent `Company`. Authorization must always validate ownership through the associated company rather than trusting dataset identifiers alone.

---

# Dataset Module

The Dataset module is responsible for managing the complete lifecycle of uploaded business datasets.

Responsibilities:

- Upload datasets
- Persist metadata
- Generate object keys
- Store files through the StorageProvider abstraction
- Validate company ownership
- List datasets
- Retrieve datasets
- Perform logical deletion

The Dataset module must never perform analytical processing.

Analytical processing belongs exclusively to the Analytics Service.

---

# Authentication

Authentication is implemented using:

- JWT Access Tokens
- Refresh Tokens
- HttpOnly Cookies
- bcrypt password hashing

Rules:

- Never expose Refresh Tokens in JSON responses.
- Access Tokens are returned to the client.
- Refresh Tokens remain stored in HttpOnly cookies.
- Cookie management belongs to controllers.
- Token generation belongs to services.
- Authentication middleware must validate JWTs before protected routes.

---

# Authorization

The system supports role-based authorization.

User roles:

- USER
- ADMIN

Protected routes must validate both:

- Authentication
- Authorization

---

# API Documentation

The project follows an OpenAPI-first approach.

Documentation lives inside:

```text
api/openapi/
```

Structure:

```text
openapi/

components/
paths/
schemas/
index.ts
swagger.ts
```

Rules:

- Keep documentation modular.
- Reuse schemas whenever possible.
- Avoid duplicated response definitions.
- Do not use inline JSDoc endpoint documentation.
- Every public endpoint must be documented.

---

# TypeScript Guidelines

Always prefer:

- strict typing
- explicit interfaces
- enums instead of magic strings
- reusable types

Avoid:

- any
- unnecessary type assertions
- duplicated interfaces

---

# Coding Standards

Prefer:

- Small functions
- Single Responsibility Principle
- Dependency inversion
- Modular code
- Readable naming
- Early returns

Avoid:

- Deep nesting
- Large controllers
- Business logic inside routes
- Duplicated code

---

# Error Handling

Errors should be:

- Consistent
- Predictable
- Centralized

Business errors should be handled by services.

Unexpected errors should reach the global error middleware.

---

# Docker

Development uses Docker Compose.

MongoDB, MinIO and the Express API run inside independent Docker containers orchestrated through Docker Compose.

The backend container communicates with MongoDB and MinIO through the Docker network.

Do not assume `localhost` inside containers.

---

# Current Modules

Implemented:

- Authentication (JWT + Refresh Tokens)
- User management
- Company management (CRUD + admin listing with pagination)
- Dataset module
  - Dataset CRUD
  - File upload
  - Ownership validation
  - MinIO integration
  - StorageProvider abstraction
  - Logical deletion
- OpenAPI documentation
- MongoDB models
- Frontend scaffold (Vite + React 19 + TypeScript, TailwindCSS v4, React Router, Axios, React Query, Recharts) and folder structure per "Frontend Architecture" above

Next modules:

- Frontend: auth flow (login/register pages, `AuthContext`, `RequireAuth` guard)
- Frontend: companies & datasets screens consuming the existing Express API
- Frontend: `@theme` design tokens in `src/index.css` (placeholder/neutral values until branding is defined)
- Analytics Service (FastAPI)
- Dataset processing pipeline
- Analysis module
- Dashboard module
- AI-powered business insights

---

# Development Philosophy

When generating code:

- Respect the existing architecture.
- Prefer incremental improvements.
- Avoid unnecessary dependencies.
- Keep solutions scalable.
- Maintain consistency with existing conventions.
- Document relevant architectural decisions.
- Favor readability over clever implementations.
- Prioritize maintainability over premature optimization.

Every contribution should move the project closer to a production-ready Business Intelligence platform.
