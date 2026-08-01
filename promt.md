Quiero que generes un archivo Microsoft Excel (.xlsx) extremadamente realista que simule la base de datos de ventas de una PyME.

Este dataset será utilizado para probar un sistema de análisis automático de datos (Business Dashboard), por lo que NO quiero un dataset perfectamente limpio. Quiero que tenga inconsistencias reales que aparecen habitualmente en empresas.

No quiero código Python.

No quiero CSV.

Quiero directamente el archivo .xlsx.

Contexto

El sistema donde se utilizará este archivo posee los siguientes módulos:

Inspection Engine
Profiling Engine
Quality Engine
Cleaning Engine
Transformation Engine
Analytics Engine

El objetivo es poner a prueba todos ellos.

Cantidad de datos

Generar aproximadamente:

entre 300 y 500 registros

No menos de 300.

Hojas del Excel

Quiero varias hojas.

Hoja 1

Ventas

Debe contener la información principal.

Hoja 2

Clientes

Información de clientes.

Hoja 3

Productos

Catálogo de productos.

La hoja principal será únicamente Ventas.

Formato de la hoja Ventas

NO comenzar directamente en la fila 1.

Quiero algo similar a un archivo exportado desde un ERP.

Ejemplo:

Empresa: TechNova S.A.

Reporte Comercial

Período: Enero-Junio 2025

(una fila vacía)

TABLA

Es decir:

título
subtítulo
información adicional
fila vacía
recién después comienza la tabla

Esto permitirá probar el Header Detector.

Footer

Al finalizar la tabla agregar algo como:

TOTAL GENERAL

Cantidad total

Importe total

o

Fin del Reporte

o

Reporte generado automáticamente

Esto permitirá probar el Footer Detector.

Columnas

Incluir como mínimo:

ID Pedido
Fecha
Cliente
ID Cliente
Producto
SKU
Categoría
Cantidad
Precio Unitario
Descuento
Total Venta
Canal de Venta
Método de Pago
Estado
Región
Provincia
Ciudad
Vendedor
Cliente Fidelizado
Observaciones
Datos

Simular una empresa que vende productos físicos.

Ejemplos:

notebooks
teclados
mouse
sillas
escritorios
monitores
impresoras
accesorios
Fechas

Generar fechas durante todo un año.

No utilizar un único formato.

Mezclar formatos como:

2025-01-18

18/01/2025

18-01-2025

01/18/2025

Monedas

No usar siempre el mismo formato.

Mezclar:

1200

1200.50

$1200

$ 1.200,50

USD 350

ARS 125000

Booleanos

Mezclar valores como:

Si

Sí

SI

si

No

NO

False

True

0

1

Texto

Agregar inconsistencias reales.

Ejemplos:

espacios:

" Juan Perez"

"Juan Perez "

" Juan Perez "

Mayúsculas:

ONLINE

Online

online

OnLine

Categorías:

Tecnología

tecnologia

TECNOLOGIA

Tecnologia
Regiones

No usar siempre el mismo nombre.

Ejemplo:

Buenos Aires

Bs As

Provincia Buenos Aires

CABA

Capital Federal

Métodos de pago

Mezclar:

MercadoPago

Mercado Pago

mercado pago

MP

Transferencia

Transferencia Bancaria

Tarjeta

Tarjeta Crédito

Credito

Débito

Estados

Mezclar:

Pagado

PAGADO

pagado

Pendiente

Cancelado

En proceso

Devuelto

Valores faltantes

Agregar algunos.

Pero pocos.

Entre 1% y 3%.

No generar columnas enteras vacías.

Duplicados

Agregar algunos registros duplicados.

No muchos.

Entre 3 y 8.

Filas vacías

Agregar algunas filas completamente vacías distribuidas por el archivo.

Columnas innecesarias

Agregar alguna columna sin nombre (Unnamed).

Agregar una columna completamente vacía.

Agregar columnas auxiliares típicas de exportaciones.

Ejemplo:

Unnamed: 17

Aux

Extra

IDs

Mezclar formatos.

P000123

000123

PED-00045

12345

SKU

Mezclar:

NB-120

nb120

NB120

SKU-0012

Valores numéricos

Agregar algunos números escritos como texto.

Ejemplo:

"15"

"20"

"100"

Otros como números reales.

Outliers

Agregar algunos.

Ejemplo:

Un monitor:

Precio habitual:

350

Uno solo:

35000

o

3
Distribución

No hacer datos completamente uniformes.

Debe haber:

productos vendidos mucho más que otros
regiones con muchas ventas
clientes frecuentes
vendedores con distinto rendimiento

Debe parecer un negocio real.

Correlaciones

Generar relaciones naturales.

Por ejemplo:

ciertos productos se venden más online.
otros más en tienda física.
determinadas regiones compran ciertas categorías.
determinados vendedores venden más.
clientes fidelizados compran más.
los descuentos aumentan el volumen de compra.

Esto permitirá probar el Analytics Engine.

Observaciones

Agregar textos variados.

Ejemplos:

Entrega urgente

Cliente VIP

Retiro en tienda

Pago pendiente

Facturar a nombre de empresa

Calidad

Quiero un dataset que, visualmente, parezca una exportación real de un ERP o un sistema de gestión.

No quiero datos aleatorios sin sentido.

Debe contener suficientes inconsistencias para poner a prueba:

Header Detection
Footer Detection
Sheet Detection
Profiling
Semantic Classification
Quality Scoring
Cleaning
Transformation
Analytics
Detección de outliers
Correlaciones
Estadísticas descriptivas

El resultado final debe ser únicamente un archivo .xlsx listo para descargar, sin código fuente ni explicaciones adicionales.
