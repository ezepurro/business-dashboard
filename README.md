# 📊 Business Dashboard

> A modern Business Intelligence platform for Small and Medium-sized Enterprises (SMEs), transforming Excel and CSV files into interactive dashboards, KPIs, and automated business insights.

> **Project Status:** 🚧 Active Development (v1.0.0)

---

# Overview

Business Dashboard is a Full Stack Business Intelligence platform designed to help small and medium-sized businesses transform raw spreadsheet data into actionable business insights.

The application enables users to upload Excel or CSV datasets, automatically process them through a dedicated Analytics Engine, generate KPIs, visualize business metrics, inspect data quality, review transformations, and explore analytical reports through an interactive dashboard.

The project follows a modular service-oriented architecture, separating business logic from analytical processing to ensure scalability, maintainability, and future AI integration.

For a complete description of the software architecture, functional requirements, data model, and analytical pipeline, see:

- [`docs/srs.md`](docs/srs.md) — Software Requirements Specification (SRS)
- [`docs/database_model.md`](docs/database_model.md) — MongoDB Data Model

---

# Current Progress

## ✅ Completed

- Project architecture
- Express + TypeScript backend
- MongoDB integration
- Mongoose data models
- JWT Authentication
- Refresh Token authentication flow
- Password hashing with bcrypt
- Request validation using express-validator
- Modular OpenAPI (Swagger) documentation
- Docker development environment
- Database seed script
- Company Management Module (CRUD + admin listing with pagination)
- Dataset storage architecture design (MinIO + `StorageProvider` abstraction)
- Dataset Module (upload, listing, retrieval and soft deletion)
- MinIO integration
- FastAPI Analytics Engine
- Dataset profiling
- Automatic data quality assessment
- Automatic data cleaning suggestions
- Automatic data type transformations
- Analytics history
- Interactive analysis viewer
- Business insights generation
- Charts generation
- Executive summary generation
- React Analytics Dashboard

## 🚧 In Progress

- Business KPI Engine improvements
- Advanced business metrics
- Dashboard customization

## 📅 Planned

- Predictive analytics
- AI-powered recommendations
- Scheduled reports
- Dashboard sharing
- Natural language querying
- Forecasting models

---

# Features

## Dataset Storage

Datasets are stored using a hybrid storage architecture:

- MongoDB stores dataset metadata.
- MinIO stores the original files.
- Express never stores binary files inside MongoDB.
- Future analytics services will read datasets directly from MinIO using object coordinates.

## Authentication

- User registration
- Secure login
- JWT Access Tokens
- Refresh Token rotation
- HttpOnly Cookie authentication
- Password hashing (bcrypt)
- Role-based authorization
- Protected routes

## Business Intelligence

- Excel / CSV upload
- Dataset management
- Automatic dataset profiling
- Data quality evaluation
- Automatic data cleaning
- Automatic semantic transformations
- Interactive charts
- Business insights generation
- Executive summaries
- KPI generation
- Analysis history

## Future Features

- PDF report generation
- Excel export
- Custom dashboards
- Time period comparison
- Forecasting models
- AI recommendations
- Natural language querying

---

# Architecture

```text
                 React + TypeScript

                        │

                        ▼

             Express API (Node.js)

        ┌───────────────┼───────────────┐

        ▼               ▼               ▼

    MongoDB           MinIO     Analytics Engine (FastAPI)
   (metadata)     (file storage)         │
                        ▲                │
                        └── reads files ─┘
                                  │

                           Pandas / NumPy
```

> 📖 For a complete description of the system architecture, UML diagrams, software requirements, API contracts, and analytics workflow, see the [Software Requirements Specification](docs/srs.md).

## Responsibilities

### Frontend

- User Interface
- Authentication
- Dashboard visualization
- Charts
- Forms
- API consumption

### Express API

- Authentication
- Business logic
- Company management
- Dataset management
- File uploads, persisted to MinIO through a `StorageProvider` abstraction
- Authorization
- Notifying the Analytics Service (dataset coordinates only, never the file itself)
- Dataset metadata persistence (MongoDB)
- OpenAPI documentation

### Analytics Service

- Reads dataset files directly from MinIO (never through Express)
- Dataset processing
- Data cleaning
- KPI calculation
- Statistical analysis
- Dataset profiling
- Data dictionary generation
- Quality scoring
- Cleaning recommendations
- Data transformations
- Business insights
- Chart generation
- Executive summaries

---

# Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query
- Recharts

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- express-validator
- Swagger / OpenAPI
- Multer
- MinIO SDK (Object Storage client, behind a `StorageProvider` abstraction)

## Analytics

- Python
- FastAPI
- Pandas
- NumPy
- OpenPyXL
- Pydantic
- Scikit-learn (future)

## Infrastructure

- Docker
- Docker Compose
- MinIO (S3-compatible Object Storage)

---

# API Documentation

The backend exposes an OpenAPI (Swagger) specification for all REST endpoints.

After starting the backend, the documentation is available at:

```text
http://localhost:3000/api/docs
```

The OpenAPI specification is maintained inside the backend under:

```text
api/openapi/
```

using a modular organization based on:

- Components
- Schemas
- Paths

---

# Running the Project

## Requirements

- Docker Desktop
- Node.js 22+
- npm

## Start the development environment

```bash
docker compose up --build
```

## Stop the environment

```bash
docker compose down
```

---

# Environment Variables

The backend requires an `.env` file inside the `api/` directory.

Example:

```env
PORT=3000

MONGO_URI=mongodb://mongo:27017/business_dashboard

NODE_ENV=development

ANALYTICS_SERVICE_URL=http://analytics:8000

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES=15m

JWT_REFRESH_EXPIRES=7d

STORAGE_PROVIDER=minio

MINIO_ENDPOINT=minio

MINIO_PORT=9000

MINIO_USE_SSL=false

MINIO_ACCESS_KEY=your_minio_access_key

MINIO_SECRET_KEY=your_minio_secret_key

MINIO_BUCKET=datasets

ANALYTICS_SERVICE_URL=http://analytics:8000

```

> `MINIO_*` and `INTERNAL_API_KEY` back the Dataset module's storage architecture — see [`docs/srs.md` §6](docs/srs.md#6-decisiones-arquitectónicas-almacenamiento-y-procesamiento-de-datasets) for the full design.

===

Also, the frontend requires an `.env` file inside the `frontend/` directory.

Example:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# Development Principles

The project follows modern software engineering practices:

- Clean Architecture
- SOLID Principles
- Separation of Concerns
- Modular Design
- Service-oriented Architecture
- Strong TypeScript typing
- RESTful API design
- OpenAPI-first documentation

---

# Development Roadmap

## Phase 1

- ✅ Project setup
- ✅ Express API
- ✅ MongoDB
- ✅ Mongoose
- ✅ Docker
- ✅ Authentication

## Phase 2

- ✅ Company Module
- ✅ Analysis Module

## Phase 3

- ✅ Dataset storage architecture
- ✅ Dataset Module
- ✅ MinIO integration
- ✅ OpenAPI documentation

## Phase 4

- ✅ Frontend general development

## Phase 5

- ✅ Analytics microservice
- ✅ Express ↔ FastAPI integration

## Phase 6

- Business KPI Engine improvements
- Advanced dashboards

## Phase 7

- Reports

## Phase 8

- AI Recommendations
- Natural Language Analytics

---

# Learning Objectives

This project is also intended to deepen practical experience in:

- Software Architecture
- Full Stack Development
- React
- Node.js
- Express
- MongoDB
- Python
- FastAPI
- Docker
- Business Intelligence
- Data Analytics
- Artificial Intelligence

---

# Future Vision

The long-term goal is to evolve Business Dashboard into a complete Business Intelligence platform capable of:

- Automated dataset profiling
- Business KPI generation
- Executive summaries
- Interactive dashboards
- Historical analysis
- Predictive analytics
- AI-powered business insights
- Natural language analytics
- Decision support systems
- Automated reporting

---

# Contributing

This project is currently being developed as a personal portfolio project.

Suggestions, ideas, and feedback are always welcome.

---

# License

This project is licensed under the MIT License.

---

> **Note:** Business Dashboard is actively developed as a portfolio project focused on modern Full Stack development, Business Intelligence, scalable software architecture, and AI-assisted analytics.
