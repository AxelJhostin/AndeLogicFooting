# Roadmap del Producto 01

## A. Fundamento documental

- Confirmar nombre de trabajo y repositorio.
- Obtener fuentes normativas autorizadas y registrar edición, cláusulas y parámetros.
- Elaborar los primeros casos manuales de zapata aislada.
- Cerrar el alcance de carga axial centrada y las exclusiones.

**Salida:** una especificación que permite implementar sin inventar criterios técnicos.

## B. Motor NEC

- Modelar entradas, unidades, resultados y advertencias.
- Implementar presión de contacto, cortante unidireccional, punzonamiento y flexión.
- Implementar pruebas antes de cada pantalla.
- Comparar con los casos documentados.

**Salida:** motor NEC puro y testeado, sin interfaz de producción.

## C. Perfil ACI

- Implementar como paquete separado, nunca como condicional disperso.
- Registrar diferencias de parámetros, factores y referencias frente a NEC.
- Completar banco de casos equivalente.

**Salida:** dos perfiles verificables o, si ACI no está listo, un perfil NEC publicado sin fingir soporte internacional.

## D. Aplicación e informe

- Construir flujo de entrada, revisión y resultados.
- Mostrar el estado de cada verificación y los resultados intermedios relevantes.
- Generar memoria imprimible con identidad de versión.
- Incorporar biblioteca local IndexedDB y exportación/importación de `ProjectDocument` JSON versionado.
- Revisar accesibilidad, móvil y rendimiento.

## E. Prelanzamiento

- Revisión técnica externa.
- Pruebas exploratorias con estudiantes e ingenieros jóvenes.
- Corregir problemas de interpretación, unidades y mensajes de error.
- Crear página oficial del producto en el portal AndeLogic.

## Postergar deliberadamente

- Escritorio con Tauri.
- Cuentas, sincronización, colaboración y licencias.
- IA asistente.
- Cargas excéntricas, zapatas combinadas y análisis geotécnico avanzado.

Estas ideas permanecen fuera hasta que el flujo axial centrado sea correcto, claro y validado.
