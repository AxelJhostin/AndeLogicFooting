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

**Avance:** existe el modelo serializable de memoria; falta conectarlo a una salida imprimible estructurada y a las instantáneas de resultados.

## E. Prelanzamiento

- Cerrar la matriz de contrastes externos y todas sus discrepancias.
- Pruebas exploratorias con estudiantes e ingenieros jóvenes.
- Solicitar revisión técnica humana cuando esté disponible como capa adicional de confianza.
- Corregir problemas de interpretación, unidades y mensajes de error.
- Crear página oficial del producto en el portal AndeLogic.

## Postergar deliberadamente

- Escritorio con Tauri.
- Cuentas, sincronización, colaboración y licencias.
- IA asistente.
- Cargas excéntricas, zapatas combinadas y análisis geotécnico avanzado.

Estas ideas permanecen fuera hasta que el flujo axial centrado sea correcto, claro y validado.
