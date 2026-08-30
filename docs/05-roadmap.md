# Roadmap del Producto 01

## A. Fundamento documental

- Confirmar nombre de trabajo y repositorio.
- Obtener fuentes normativas autorizadas y registrar edición, cláusulas y parámetros.
- Elaborar los primeros casos independientes de zapata aislada y definir sus comparadores externos.
- Cerrar el alcance de carga axial centrada y las exclusiones.

**Salida:** una especificación que permite implementar sin inventar criterios técnicos.

## B. Motor NEC

- Modelar entradas, unidades, resultados y advertencias.
- Implementar presión de contacto, cortante unidireccional, punzonamiento y flexión.
- Implementar pruebas antes de cada pantalla.
- Comparar con los casos documentados y al menos dos implementaciones externas compatibles.

**Salida:** motor NEC puro y testeado, sin interfaz de producción.

## C. Biblioteca de evidencia pública

- Registrar fuentes técnicas públicas compatibles con el alcance ecuatoriano: autor, fecha, URL, hipótesis y unidades.
- Convertir cada caso confirmado en una prueba de regresión independiente.
- Documentar discrepancias sin tratarlas como equivalencias normativas.

**Salida:** un perfil NEC verificable con evidencia pública trazable, sin afirmar soporte internacional.

## D. Aplicación e informe

- Construir flujo de entrada, revisión y resultados.
- Mostrar el estado de cada verificación y los resultados intermedios relevantes.
- Generar memoria imprimible con identidad de versión.
- Incorporar biblioteca local IndexedDB y exportación/importación de `ProjectDocument` JSON versionado.
- Revisar accesibilidad, móvil y rendimiento.
- Mantener una biblioteca probada de ejemplos rápidos para todas las tipologías activas.

**Avance:** existen memoria completa por tipología, láminas técnicas, persistencia local y una biblioteca de 24 ejemplos rápidos probados. La impresión sigue basada en HTML/CSS y las referencias técnicas continúan en validación.

## E. Prelanzamiento

- Mantener congelado el catálogo en ocho familias y rechazar tipologías inesperadas en la puerta de liberación.
- Ejecutar las invariantes transversales de pureza, finitud, trazabilidad y límites sobre todos los ejemplos calculables.
- Cerrar la matriz de contrastes externos y todas sus discrepancias.
- Pruebas exploratorias con estudiantes e ingenieros jóvenes.
- Solicitar revisión técnica humana cuando esté disponible como capa adicional de confianza.
- Corregir problemas de interpretación, unidades y mensajes de error.
- Crear página oficial del producto en el portal AndeLogic.

## Postergar deliberadamente

- Escritorio con Tauri.
- Cuentas, sincronización, colaboración y licencias.
- IA asistente.
- Cargas generales con momentos transferidos, contacto parcial y análisis geotécnico avanzado. La excentricidad biaxial está disponible únicamente en el alcance axial de zapata de esquina documentado en `22-corner-biaxial-footing-scope.md`.

## Ampliaciones modulares implementadas — 2026-08-28

- Zapata corrida bajo muro centrado mediante franja de `1.00 m`.
- Zapata combinada rectangular para dos columnas interiores alineadas, con presión longitudinal lineal y contacto completo.
- Zapata medianera con dos bases rectangulares y viga centradora rígida sin contacto con el suelo.
- Zapata combinada trapezoidal para dos columnas interiores, con ancho variable y presión longitudinal lineal.
- Zapata aislada excéntrica de borde sin viga centradora, con presión lineal, control del tercio central y contacto completo.
- Zapata de esquina con dos caras de columna junto a linderos, plano de presión, interacción del núcleo biaxial y contacto completo.
- Losa de cimentación rectangular con 2 a 24 columnas, plano de contacto biaxial, equilibrio global y pantalla rígida–Winkler preliminar.

Estas ampliaciones conservan estado de referencia en validación. La pantalla Winkler de la losa no libera un análisis geotécnico de asentamientos, interacción suelo-estructura avanzada, contacto parcial ni diseño estructural de placa.

El inventario cerrado se mantiene en `18-footing-types-roadmap.md`. No quedan tipologías pendientes dentro del Producto 01.

La biblioteca rápida de referencia, variación y borde para las ocho familias está implementada y documentada en `21-quick-example-library.md`.

Las extensiones permanecen fuera del alcance mientras se completa el plan de endurecimiento de `24-validation-hardening-plan.md`.
