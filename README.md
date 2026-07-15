# 📊 Business Dashboard

> A modern Business Intelligence platform for Small and Medium-sized Enterprises (SMEs), transforming Excel and CSV files into interactive dashboards, KPIs, and automated business insights.

> **Project Status:** 🚧 Active Development

---

# Overview

Business Dashboard is a Full Stack Business Intelligence platform designed to help small and medium-sized businesses transform raw spreadsheet data into actionable business insights.

The application enables users to upload Excel or CSV datasets, automatically process them, generate KPIs, visualize business metrics, and explore analytical reports through an intuitive dashboard.

The project follows a modular service-oriented architecture, separating business logic from analytical processing to ensure scalability, maintainability, and future AI integration.

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
- Dataset storage architecture design (MinIO + `StorageProvider` abstraction, upload/processing/delete flows — see [`docs/srs.md`](docs/srs.md#6-decisiones-arquitectónicas-almacenamiento-y-procesamiento-de-datasets))

## 🚧 In Progress

- Dataset Module implementation (upload, MinIO integration, FastAPI notification)

## 📅 Planned

- Analytics microservice (FastAPI)
- Dashboard generation
- AI-powered business analysis
- Reporting
- Predictive analytics

---

# Features

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

- Company management
- CSV / Excel upload, stored in MinIO (Object Storage) via a `StorageProvider` abstraction — never in MongoDB
- Dataset processing
- KPI generation
- Interactive dashboards
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

    MongoDB           MinIO       FastAPI (Python)
   (metadata)     (file storage)         │
                        ▲                │
                        └── reads files ─┘
                                  │

                           Pandas / NumPy
```

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
- OpenAPI documentation

### Analytics Service

- Reads dataset files directly from MinIO (never through Express)
- Dataset processing
- Data cleaning
- KPI calculation
- Statistical analysis
- Forecasting (future)
- AI-powered analysis (future)

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

## Infrastructure

- Docker
- Docker Compose
- MinIO (S3-compatible Object Storage)

---

# Project Structure

```text
business-dashboard/

├── frontend/
│
├── api/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── storage/          (StorageProvider abstraction, MinIO implementation)
│   ├── validators/
│   ├── utils/
│   ├── config/
│   ├── openapi/
│   ├── types/
│   └── tests/
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

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES_IN=15m

REFRESH_TOKEN_EXPIRES_IN=7d

STORAGE_PROVIDER=minio

MINIO_ENDPOINT=minio

MINIO_PORT=9000

MINIO_USE_SSL=false

MINIO_ACCESS_KEY=your_minio_access_key

MINIO_SECRET_KEY=your_minio_secret_key

MINIO_BUCKET=datasets

ANALYTICS_SERVICE_URL=http://analytics:8000

INTERNAL_API_KEY=your_internal_api_key
```

> `MINIO_*` and `INTERNAL_API_KEY` back the Dataset module's storage architecture — see [`docs/srs.md` §6](docs/srs.md#6-decisiones-arquitectónicas-almacenamiento-y-procesamiento-de-datasets) for the full design.

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

## Phase 3

- ✅ Dataset storage architecture (MinIO + `StorageProvider`)
- 🚧 Dataset upload implementation

## Phase 4

- Analytics microservice

## Phase 5

- Express ↔ FastAPI integration

## Phase 6

- Interactive dashboards

## Phase 7

- Reports

## Phase 8

- Artificial Intelligence features

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

- Predictive Analytics
- AI-powered Insights
- Business Recommendations
- Natural Language Analytics
- Decision Support Systems

---

# Contributing

This project is currently being developed as a personal portfolio project.

Suggestions, ideas, and feedback are always welcome.

---

# License

This project is licensed under the MIT License.

---

> **Note:** Business Dashboard is actively developed as a portfolio project focused on modern Full Stack development, Business Intelligence, scalable software architecture, and AI-assisted analytics.
