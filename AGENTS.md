# AGENTS.md

## Proyecto

**Business Dashboard para PyMEs**

Este repositorio implementa una plataforma de Business Intelligence
destinada a pequeñas y medianas empresas. El objetivo es transformar
archivos CSV/Excel en dashboards con KPIs, gráficos y análisis
automáticos.

## Objetivo principal

Construir una aplicación Full Stack con arquitectura profesional y
escalable, utilizando un backend principal en Node.js/Express y un
microservicio de analítica en Python.

## Stack tecnológico

### Frontend

-   React
-   Typescript
-   Tailwind CSS
-   React Router
-   Axios
-   React Query
-   Recharts

### API principal

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   JWT
-   Multer

### Analítica

-   Python
-   FastAPI
-   Pandas
-   NumPy
-   OpenPyXL

### Infraestructura

-   Docker
-   Docker Compose

## Arquitectura

Frontend (React) ↓ Express API ├── MongoDB └── FastAPI (Python) ↓ Pandas
/ NumPy

### Responsabilidades

#### React

-   UI
-   Dashboards
-   Formularios
-   Visualización

#### Express

-   Autenticación
-   CRUD
-   Uploads
-   Comunicación con Python
-   Persistencia

#### FastAPI

-   Procesamiento de datasets
-   Limpieza de datos
-   KPIs
-   Estadísticas
-   Predicciones (futuro)

## Principios

-   Mantener separación estricta entre frontend, backend y analítica.
-   Express nunca realiza cálculos con Pandas.
-   FastAPI nunca accede directamente a MongoDB.
-   Toda comunicación entre Express y FastAPI será mediante HTTP.
-   Priorizar código limpio, modular y tipado.
-   Evitar lógica duplicada.

## MVP

-   Registro/Login
-   Gestión de empresas
-   Subida de CSV/Excel
-   Procesamiento automático
-   Dashboard
-   Historial de análisis

## Roadmap

1.  Arquitectura base
2.  Autenticación
3.  CRUD Empresas
4.  Upload de archivos
5.  Servicio FastAPI
6.  Integración Express ↔ FastAPI
7.  Dashboard
8.  Reportes
9.  IA y predicciones

## Convenciones

### API Express

-   controllers/
-   routes/
-   middleware/
-   models/
-   services/
-   utils/

### Analytics

-   routers/
-   services/
-   schemas/
-   utils/

### Frontend

-   components/
-   pages/
-   hooks/
-   services/
-   types/
-   utils/

## Objetivo para asistentes IA

Al colaborar sobre este proyecto:

-   Respetar la arquitectura definida.
-   Priorizar soluciones escalables.
-   Evitar acoplamiento innecesario.
-   Mantener buenas prácticas de Clean Code y SOLID.
-   Sugerir mejoras incrementales.
-   Justificar decisiones arquitectónicas.
-   No introducir dependencias pesadas sin una razón clara.
-   Favorecer TypeScript estricto y tipado consistente.
-   Documentar endpoints, modelos y decisiones relevantes.

## Visión

Este proyecto está pensado como la principal pieza del portfolio del
desarrollador. Las decisiones deben asemejarse a un producto real que
pueda crecer hacia una plataforma completa de Business Intelligence con
capacidades de IA.
