# Modelo de Datos No Relacional (MongoDB) - Business Dashboard para PyMEs (V3)

Este documento detalla la arquitectura de persistencia y el modelo de datos basado en documentos para el proyecto **Business Dashboard para PyMEs**. Al utilizar un motor No Relacional como **MongoDB** junto con el ODM **Mongoose**, la estructura se define mediante colecciones de documentos flexibles, optimizando la velocidad de lectura y permitiendo almacenar estructuras analíticas complejas sin la rigidez de las claves foráneas (FK) o primarias (PK) tradicionales de SQL.

> **Nota de alcance:** este documento describe únicamente las colecciones de **MongoDB**. Los archivos binarios (`.csv`, `.xlsx`) asociados a los datasets **nunca** se almacenan en MongoDB — se persisten en **MinIO** (Object Storage) y se referencian desde el documento `datasets` mediante los campos `bucket` y `objectKey`. El detalle completo de esa arquitectura (patrón `StorageProvider`, organización del bucket, flujos de carga/procesamiento/eliminación) vive en [`docs/srs.md` §6](./srs.md#6-decisiones-arquitectónicas-almacenamiento-y-procesamiento-de-datasets).

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
│  refreshToken (String)                                                 │
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
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  COLECCIÓN: datasets                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  _id (ObjectId)                                                                             │
│  originalFilename (String)                                                                  │
│  extension (String)                                                                         │
│  mimeType (String)                                                                          │
│  size (Number) -> [Bytes]                                                                   │
│  bucket (String) -> [Bucket único de la plataforma: "datasets"]                             │
│  objectKey (String) -> [Índice Único, ruta física del objeto en MinIO]                      │
│  status (String) -> ["uploading","uploaded","processing","ready","failed","deleted"]        │
│  company (ObjectId) -> [Referencia lógica a "companies._id"]                                │
│  uploadedBy (ObjectId) -> [Referencia lógica a "users._id"]                                 │
│  createdAt / updatedAt (Date)                                                               │
└──────────────────────────────────┬──────────────────────────────────────────────────────────┘
                                   │
                                   │ (Un dataset genera exactamente 1 análisis)
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   COLECCIÓN: analyses                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  _id (ObjectId)                                                                              │
│  datasetId (ObjectId) -> [Referencia lógica a "datasets._id"]                                │
│  companyId (ObjectId) -> [Referencia lógica a "companies._id"]                               │
│  status (String) -> ["processing","completed","failed"]                                      │
│  profile (Embedded Document)                                                                 │
│     ├── metadata                                                                             │
│     ├── quality                                                                              │
│     ├── cleaning                                                                             │
│     ├── transformation                                                                       │
│     ├── analytics                                                                            │
│     ├── insights                                                                             │
│     └── generatedAt                                                                          │
│  errorMessage (String, opcional)                                                             │
│  createdAt / updatedAt (Date)                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
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
- **`refreshToken`**: Hash del Refresh Token activo del usuario. Se utiliza para la renovación segura del Access Token y se almacena cifrado mediante `bcrypt` (`String`, opcional).
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

Funciona como el registro histórico de las interacciones de carga de archivos (`.csv` o `.xlsx`) por parte del usuario. Almacena **exclusivamente metadatos**: el archivo binario nunca pasa por MongoDB, se persiste en MinIO y este documento guarda únicamente las coordenadas necesarias para ubicarlo (`bucket` + `objectKey`).

- **`_id`**: Identificador único del dataset (`ObjectId`). Se genera **antes** de subir el archivo, porque `objectKey` lo embebe.
- **`originalFilename`**: Nombre original del archivo subido, tal cual lo envió el usuario (`String`, requerido). Es puramente informativo/de visualización — nunca se usa para nombrar el objeto físico en MinIO.
- **`extension`**: Extensión original del archivo (`csv`, `xlsx`, etc.) utilizada para construir el `objectKey` dentro del almacenamiento de objetos (`String`, requerido).
- **`mimeType`**: Tipo MIME reportado y validado por `multer` al momento de la carga (`String`, requerido).
- **`size`**: Tamaño del archivo en bytes (`Number`, requerido).
- **`bucket`**: Nombre del bucket de MinIO donde reside el objeto (`String`, requerido). En esta versión siempre es `"datasets"` — un único bucket para toda la plataforma.
- **`objectKey`**: Ruta/clave física única del objeto dentro del bucket (`String`, requerido, único, indexado). Formato: `companies/{companyId}/{datasetId}.{extension}`. Nunca se deriva del nombre original del archivo.
- **`status`**: Estado del flujo de carga y procesamiento (`String`, valores admitidos: `"uploading"`, `"uploaded"`, `"processing"`, `"ready"`, `"failed"`, `"deleted"`,). Ver la máquina de estados completa en `docs/srs.md §6.4`.
- **`company`**: Referencia lógica a la empresa dueña de la información (`ObjectId`, requerido, indexado).
- **`uploadedBy`**: Referencia lógica al usuario que realizó la carga (`ObjectId`, requerido).
- **`createdAt` / `updatedAt`**: Marcas de tiempo del ciclo de vida del documento, gestionadas por Mongoose (`Date`).

### 2.4 Colección `analyses`

Representa el resultado completo del procesamiento realizado por el microservicio de Analytics.

A diferencia de las primeras iteraciones del proyecto, el sistema ya no persiste únicamente un conjunto reducido de KPIs, sino un **perfil analítico completo** (`AnalysisProfile`) listo para ser consumido directamente por el frontend.

Todo el documento se genera una única vez durante el procesamiento del dataset y posteriormente se considera inmutable.

- **`_id`**: Identificador único del análisis (`ObjectId`).
- **`datasetId`**: Referencia lógica al dataset procesado (`ObjectId`, requerido, indexado).
- **`companyId`**: Referencia lógica a la empresa propietaria (`ObjectId`, requerido, indexado).
- **`status`**: Estado del procesamiento (`String`, valores: `"processing"`, `"completed"`, `"failed"`).
- **`profile`**: Documento embebido que contiene el resultado completo del motor analítico.
- **`errorMessage`**: Mensaje descriptivo en caso de error durante el procesamiento (`String`, opcional).
- **`createdAt / updatedAt`**: Marcas de tiempo gestionadas automáticamente por Mongoose.

El documento `profile` se encuentra organizado en los siguientes bloques:

### metadata

Información descriptiva del dataset.

- cantidad de filas
- cantidad de columnas
- tipos de datos
- diccionario de datos
- estadísticas generales

### quality

Métricas de calidad del dataset.

- score de calidad
- completitud
- consistencia
- columnas con mayor cantidad de valores faltantes

### cleaning

Resumen del proceso automático de limpieza.

- filas descartadas
- duplicados
- normalizaciones realizadas
- valores corregidos

### transformation

Información sobre las transformaciones aplicadas.

- columnas generadas
- conversiones de tipos
- normalizaciones
- variables derivadas

### analytics

Resultados cuantitativos generados automáticamente.

Incluye:

- gráficos
- series temporales
- distribuciones
- rankings
- comparaciones

Cada gráfico contiene:

- tipo
- título
- etiquetas
- series
- puntos

permitiendo que el frontend los renderice dinámicamente mediante Recharts sin lógica adicional.

### insights

Conclusiones generadas por el motor analítico.

Se divide en:

- Executive Summary
- Business Insights agrupados por categoría
- recomendaciones
- observaciones relevantes

Esta estructura permite incorporar nuevos tipos de análisis sin modificar el esquema principal del documento.

---

## 3. Justificación del Diseño e Implicancias No Relacionales

1. **Documento Analítico Embebido**: Todo el resultado del procesamiento se almacena dentro de un único documento `Analysis`. Esto permite que el frontend obtenga toda la información necesaria mediante una sola consulta, eliminando cálculos adicionales y múltiples lecturas sobre la base de datos.
2. **Modelo Preparado para Evolución**: El subdocumento `profile` está organizado en módulos (`metadata`, `quality`, `cleaning`, `transformation`, `analytics` e `insights`), permitiendo incorporar nuevos motores analíticos sin modificar la estructura principal de la colección.
3. **Frontend completamente desacoplado**: Los gráficos, KPIs, métricas e insights ya se almacenan en el formato esperado por la interfaz. El frontend únicamente renderiza el contenido recibido, sin recalcular estadísticas ni depender del tipo de dataset analizado.
4. **Desacoplamiento del Almacenamiento Binario (MinIO + `StorageProvider`)**: MongoDB queda reservado exclusivamente para metadatos estructurados; el peso de los archivos (`.csv`/`.xlsx`) recae en MinIO, un Object Storage compatible con S3. La colección `datasets` nunca contiene un buffer, un `Buffer` de Node ni chunks de GridFS — solo `bucket` + `objectKey`, que son coordenadas de lectura. Esta separación evita que el tamaño de la base de datos operacional crezca con el volumen de archivos subidos, y permite escalar o migrar el backend de almacenamiento (MinIO → S3, por ejemplo) sin tocar ni el esquema ni la lógica de negocio del módulo de Dataset.

---

## 4. Evolución del Modelo Analítico

La colección `analyses` fue diseñada siguiendo un enfoque **schema-flexible**, aprovechando las capacidades documentales de MongoDB.

El bloque `profile` actúa como un contrato entre el motor de Analytics y el frontend.

Gracias a esta decisión arquitectónica:

- pueden incorporarse nuevos motores analíticos sin modificar el resto del sistema;
- los dashboards permanecen independientes de la estructura interna de los datasets;
- el frontend únicamente interpreta un modelo uniforme (`AnalysisProfile`), independientemente del tipo de archivo procesado.

Este diseño facilita futuras incorporaciones como:

- modelos predictivos;
- detección automática de anomalías;
- clustering de clientes;
- segmentación de productos;
- recomendaciones basadas en IA;
- generación automática de dashboards especializados.
