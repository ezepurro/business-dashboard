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

              ┌─────────┴─────────┐

              ▼                   ▼

         MongoDB           FastAPI (Python)

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
- File uploads
- Communication with Analytics Service
- Data persistence
- API documentation

The Express API is the single entry point to the platform.

---

## Analytics Service

Responsible for:

- Dataset processing
- Data cleaning
- KPI calculation
- Statistical analysis
- Machine Learning
- Future AI features

The Analytics Service never communicates directly with MongoDB.

All communication must occur through HTTP requests from the Express API.

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
validators/
utils/
scripts/
config/
openapi/
types/
tests/
```

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

MongoDB runs inside its own container.

The backend container communicates with MongoDB through the Docker network.

Do not assume `localhost` inside containers.

---

# Current Modules

Implemented:

- Authentication
- User management
- OpenAPI documentation
- MongoDB models

Next modules:

- Company
- Dataset
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
