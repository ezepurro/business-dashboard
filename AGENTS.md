# AGENTS.md

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
└── AGENTS.md
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
- File uploads, persisted to object storage through the `StorageProvider` abstraction
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

---

## Models

Responsible for:

- Mongoose schemas
- Persistence
- Relationships
- Indexes

Do not perform business logic inside models.

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
- The first implementation is `MinIOStorageProvider`. Future implementations (`LocalStorageProvider`, `S3StorageProvider`) live in `storage/providers/` and are wired in through `storage/storage.factory.ts` — the only file allowed to know which concrete provider is active.
- There is **one** bucket for the whole platform. Never create a bucket per company.
- The physical object key is always generated (`companies/<companyId>/<datasetId>.<ext>`) — never derived from the original filename, which is stored in MongoDB purely for display.
- `storage/` code must not import Express types, `ApiError`, or any HTTP concept — it is a persistence-adjacent layer, not an HTTP layer. Storage implementations throw their own error type; services translate it into an `ApiError`.
- The Analytics Service reads and writes objects directly against MinIO — Express never proxies file bytes to or from it.

See [`docs/srs.md` §6](docs/srs.md#6-decisiones-arquitectónicas-almacenamiento-y-procesamiento-de-datasets) for the full design: bucket layout, the Dataset status machine, the upload/processing/delete sequences, and the callback contract with the Analytics Service.

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

- OWNER
- ADMIN
- VIEWER

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

MongoDB and MinIO each run inside their own container.

The backend container communicates with MongoDB and MinIO through the Docker network.

Do not assume `localhost` inside containers.

---

# Current Modules

Implemented:

- Authentication
- User management
- Company management (CRUD + admin listing with pagination)
- OpenAPI documentation
- MongoDB models
- Dataset storage architecture (MinIO + `StorageProvider` — design only, not yet implemented)

Next modules:

- Dataset (implementation: storage layer, upload/processing/delete flows)
- Analysis
- Dashboard
- Analytics integration

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
