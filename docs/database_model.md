# Modelo de Datos No Relacional (MongoDB) - Business Dashboard para PyMEs (V2)

Este documento detalla la arquitectura de persistencia y el modelo de datos basado en documentos para el proyecto **Business Dashboard para PyMEs**. Al utilizar un motor No Relacional como **MongoDB** junto con el ODM **Mongoose**, la estructura se define mediante colecciones de documentos flexibles, optimizando la velocidad de lectura y permitiendo almacenar estructuras analíticas complejas sin la rigidez de las claves foráneas (FK) o primarias (PK) tradicionales de SQL.

---

## 1. Diagrama de Estructura de Documentos (Mapeo de Colecciones)

A continuación, se representa de manera visual cómo se estructuran y vinculan las colecciones de forma lógica en MongoDB utilizando un formato textual de árbol/cajas estructuradas.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          COLECCIÓN: users                              │
├────────────────────────────────────────────────────────────────────────┤
│  _id (ObjectId)                                                        │
│  username (String) -> [Índice Único]                                   │
│  name (String)                                                         │
│  email (String) -> [Índice Único]                                      │
│  passwordHash (String)                                                 │
│  role (String) -> ["admin", "user"]                                    │
│  status (String) -> ["active", "suspended", "pending"]                 │
│  createdAt / updatedAt (Date)                                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   │ (Un usuario administra N empresas)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        COLECCIÓN: companies                            │
├────────────────────────────────────────────────────────────────────────┤
│  _id (ObjectId)                                                        │
│  name (String)                                                         │
│  industry (String) -> [Permite null]                                   │
│  currency (String) -> [Default: "USD"]                                 │
│  foundedAt (Date) -> [Permite null]                                    │
│  owner (ObjectId) -> [Referencia lógica a "users._id"]                 │
│  createdAt / updatedAt (Date)                                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   │ (Una empresa posee N datasets cargados)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         COLECCIÓN: datasets                            │
├────────────────────────────────────────────────────────────────────────┤
│  _id (ObjectId)                                                        │
│  filename (String)                                                     │
│  storagePath (String)                                                  │
│  status (String) -> ["pending", "processed", "failed"]                 │
│  companyId (ObjectId) -> [Referencia lógica a "companies._id"]         │
│  uploadedAt (Date)                                                     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   │ (Un dataset genera exactamente 1 análisis)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        COLECCIÓN: analyses                             │
├────────────────────────────────────────────────────────────────────────┤
│  _id (ObjectId)                                                        │
│  datasetId (ObjectId) -> [Referencia lógica a "datasets._id"]          │
│  companyId (ObjectId) -> [Denormalización para búsquedas rápidas]      │
│  status (String) -> ["success", "error"]                               │
│  kpis (Embedded Document / Object)                                     │
│     ├── totalRevenue (Number)                                          │
│     ├── averageTicket (Number)                                         │
│     ├── topSellingProduct (String)                                     │
│     └── totalOrders (Number)                                           │
│  monthlyTrends (Array of Objects)                                      │
│     └── [ { month: String, revenue: Number }, ... ]                    │
│  errorMessage (String, Opcional)                                       │
│  createdAt (Date)                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Especificación Detallada de Esquemas (Estilo Mongoose)

### 2.1 Colección `users`

Almacena las credenciales, perfiles y permisos de los usuarios de la plataforma. El campo de email y username cuentan con índices únicos para agilizar la autenticación y las consultas de perfil.

- **`_id`**: Identificador único autogenerado por MongoDB (`ObjectId`).
- **`username`**: Nombre de usuario único para identificación en la plataforma (`String`, requerido, único, indexado).
- **`name`**: Nombre completo del usuario (`String`, requerido).
- **`email`**: Dirección de correo electrónico (`String`, requerido, único, indexado).
- **`passwordHash`**: Contraseña encriptada mediante la librería `bcrypt` (`String`, requerido).
- **`role`**: Control de acceso y permisos (`String`, requerido, valores admitidos: `"admin"`, `"user"`).
- **`status`**: Estado del ciclo de vida de la cuenta (`String`, requerido, valores admitidos: `"active"`, `"suspended"`, `"pending"`).
- **`createdAt` / `updatedAt`**: Marcas de tiempo de creación y modificación automática gestionadas por Mongoose (`Date`).

### 2.2 Colección `companies`

Permite el aislamiento de la información mediante un enfoque multi-empresa. Cada empresa queda vinculada lógicamente a un usuario administrador y cuenta con metadatos contextuales para analítica futura.

- **`_id`**: Identificador único del documento (`ObjectId`).
- **`name`**: Razón social o nombre comercial de la PyME (`String`, requerido).
- **`industry`**: Rubro comercial o sector del negocio (`String`, opcional, permite `null`).
- **`currency`**: Divisa base para la visualización de los KPIs financieros (`String`, requerido, por defecto `"USD"`).
- **`foundedAt`**: Fecha de fundación o inicio de operaciones de la PyME (`Date`, opcional, permite `null`).
- **`owner`**: Referencia lógica al identificador del usuario que la administra (`ObjectId`, requerido).
- **`createdAt` / `updatedAt`**: Marcas de tiempo del ciclo de vida del documento (`Date`).

### 2.3 Colección `datasets`

Funciona como el registro histórico de las interacciones de carga de archivos (`.csv` o `.xlsx`) por parte del usuario.

- **`_id`**: Identificador único del dataset (`ObjectId`).
- **`filename`**: Nombre original del archivo subido (`String`, requerido).
- **`storagePath`**: Ruta del servidor local (directorio `uploads/` administrado por `multer`) o URI de almacenamiento en la nube donde reside físicamente el archivo físico (`String`, requerido).
- **`status`**: Estado interno del flujo de procesamiento (`String`, valores admitidos: `"pending"`, `"processed"`, `"failed"`).
- **`companyId`**: Referencia lógica a la empresa dueña de la información (`ObjectId`, requerido).
- **`uploadedAt`**: Fecha exacta del momento de la carga (`Date`, por defecto `Date.now`).

### 2.4 Colección `analyses`

Esta colección aprovecha al máximo la flexibilidad de MongoDB al **embeber o anidar de forma directa el JSON analítico estructurado** retornado por el microservicio en Python (FastAPI + Pandas). De esta manera, el frontend no requiere realizar costosos JOINS ni cálculos en tiempo real; lee el documento directamente listo para renderizar con `Recharts`.

- **`_id`**: Identificador único del análisis (`ObjectId`).
- **`datasetId`**: Referencia al archivo origen que dio lugar a las métricas (`ObjectId`, requerido).
- **`companyId`**: Copia de referencia de la empresa (`ObjectId`). _Nota: Se introduce de manera denormalizada para permitir la rápida consulta de historiales de una empresa específica sin pasar por la colección intermedia de datasets._
- **`status`**: Resultado de la ejecución del motor matemático (`String`, valores: `"success"`, `"error"`).
- **`kpis`**: Subdocumento anidado con los indicadores estáticos (`Object`):
  - `totalRevenue`: Facturación total calculada (`Number`).
  - `averageTicket`: Valor de compra promedio por transacción (`Number`).
  - `topSellingProduct`: Nombre del producto con mayor volumen de ventas (`String`).
  - `totalOrders`: Cantidad total de transacciones registradas (`Number`).
- **`monthlyTrends`**: Matriz de objetos flexibles que representa la evolución histórica de ingresos (`Array`):
  - `month`: Nombre del mes evaluado (`String`).
  - `revenue`: Facturación registrada en dicho periodo (`Number`).
- **`errorMessage`**: Detalle del fallo en caso de que el status sea `"error"` (`String`, opcional).
- **`createdAt`**: Fecha de generación del informe analítico (`Date`).

---

## 3. Justificación del Diseño e Implicancias No Relacionales

1.  **Eliminación de Joins mediante Embebido**: Los KPIs y las series temporales de gráficos (`monthlyTrends`) se guardan directamente dentro del documento de análisis. Al ser datos de lectura frecuente e inmutables una vez procesados, MongoDB permite recuperarlos en una sola operación de E/S de base de datos.
2.  **Estrategia de Denormalización**: Al incluir `companyId` directamente en la colección `analyses`, optimizamos drásticamente el endpoint de `Historial de Análisis`, evitando requerir una consulta en cascada sobre los archivos cargados.
3.  **Flexibilidad del Esquema frente a Versiones Futuras**: En las fases de evolución del producto (IA, predicción de ventas o detección de anomalías), el subdocumento `kpis` o la colección `analyses` podrá expandirse con nuevos campos matemáticos sin necesidad de ejecutar migraciones estructurales complejas de bases de datos.
