# AGENTS.md

## Project

**Business Dashboard for SMBs (PyMEs)**

This repository implements a Business Intelligence platform aimed at small and medium-sized businesses. The objective is to transform CSV/Excel files into dashboards featuring KPIs, charts, and automated analysis.

## Main Objective

Build a Full Stack application with a professional and scalable architecture, utilizing a primary backend in Node.js/Express and an analytics microservice in Python.

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query
- Recharts

### Main API

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Multer

### Analytics

- Python
- FastAPI
- Pandas
- NumPy
- OpenPyXL

### Infrastructure

- Docker
- Docker Compose

## Architecture

Frontend (React) ↓ Express API ├── MongoDB └── FastAPI (Python) ↓ Pandas / NumPy

### Responsibilities

#### React

- UI
- Dashboards
- Forms
- Visualization

#### Express

- Authentication
- CRUD operations
- Uploads
- Python communication
- Persistence

#### FastAPI

- Dataset processing
- Data cleaning
- KPIs
- Statistics
- Predictions (future feature)

## Principles

- Maintain strict separation between frontend, backend, and analytics.
- Express never performs calculations using Pandas.
- FastAPI never accesses MongoDB directly.
- All communication between Express and FastAPI must be via HTTP.
- Prioritize clean, modular, and strongly-typed code.
- Avoid duplicated logic.

## MVP

- Registration/Login
- Company management
- CSV/Excel upload
- Automated processing
- Dashboard
- Analysis history

## Roadmap

1.  Base architecture
2.  Authentication
3.  Company CRUD
4.  File upload
5.  FastAPI service
6.  Express ↔ FastAPI integration
7.  Dashboard
8.  Reports
9.  AI and predictions

## Conventions

### Express API

- controllers/
- routes/
- middleware/
- models/
- services/
- utils/

### Analytics

- routers/
- services/
- schemas/
- utils/

### Frontend

- components/
- pages/
- hooks/
- services/
- types/
- utils/

## Objective for AI Assistants

When collaborating on this project:

- Respect the defined architecture.
- Prioritize scalable solutions.
- Avoid unnecessary coupling.
- Maintain Clean Code and SOLID best practices.
- Suggest incremental improvements.
- Justify architectural decisions.
- Do not introduce heavy dependencies without a clear reason.
- Favor strict TypeScript and consistent typing.
- Document endpoints, models, and relevant decisions.

## Vision

This project is designed as the centerpiece of the developer's portfolio. Decisions should align with a real-world product that can scale into a comprehensive Business Intelligence platform with AI capabilities.
