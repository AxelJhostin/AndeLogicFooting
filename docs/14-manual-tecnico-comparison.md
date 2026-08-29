# Comparación con el manual técnico externo de zapatas

## Documento comparado

- Archivo recibido: `/Users/hernandezaxel/Downloads/manual_tecnico_calculo_zapatas.md`.
- Estado de la fuente: especificación técnica externa sin autor, fecha, edición normativa, cláusulas comprobables ni casos numéricos independientes identificados.
- Uso dentro del producto: lista de temas a revisar. No autoriza cambiar fórmulas ni declarar compatibilidad NEC/ACI.

## Veredicto ejecutivo

El manual describe una secuencia de cálculo amplia y útil como mapa de funcionalidades futuras. Sin embargo, supera el alcance vigente de AndeLogic Zapatas, limitado a zapata aislada rectangular, columna centrada, carga axial centrada y presión uniforme.

> Actualización 2026-08-28: el alcance vigente incorpora además zapata corrida bajo muro centrado mediante una franja de `1.00 m`. Su definición, fuentes y exclusiones se registran en `docs/15-strip-footing-scope.md`; esta tabla se conserva como fotografía de la comparación original del módulo aislado.

> Segunda actualización 2026-08-28: se incorpora zapata combinada rectangular para dos columnas interiores alineadas, con presión longitudinal lineal y contacto completo. Su alcance y derivación se registran en `docs/16-combined-footing-scope.md`; no se adopta del manual externo ninguna ecuación sin fuente y prueba propias.

Hay coincidencias en contacto centrado, demanda de cortante unidireccional, punzonamiento, flexión, acero mínimo/requerido y desarrollo. Existen tres diferencias que deben revisarse antes de usar el manual como contraste: definición de peralte efectivo, coeficiente de columna interior en punzonamiento y expresión de longitud de desarrollo.

## Comparación por tema

| Tema | Manual externo | AndeLogic actual | Comparación / decisión |
| --- | --- | --- | --- |
| Alcance | Incluye carga concéntrica, momentos uniaxiales/biaxiales, despegue, deslizamiento y volcamiento. | Solo carga axial centrada, columna centrada y presión uniforme. | El manual es más amplio. Esas acciones quedan fuera de la primera versión. |
| Contacto centrado | Suma carga de columna, peso propio y relleno; compara con capacidad admisible. | Hace lo mismo, con base bruta o neta declarada y esfuerzo removido explícito. | Coincidencia conceptual para el caso centrado. |
| Relleno y sobrecarga | Propone volumen de relleno que descuenta la columna y añade sobrecarga superficial. | Usa profundidad de relleno declarada sobre toda el área; no modela columna/pedestal ni sobrecarga. | Diferencia de modelo geométrico; requiere definición antes de ampliar el módulo. |
| Presión con momento | Incluye excentricidad, núcleo central, distribución trapezoidal/triangular y despegue. | No acepta momentos ni presión no uniforme. | Funcionalidad ausente por decisión de alcance, no error. |
| Peralte efectivo `d` | Declara `d = h - r - φb`. | Calcula `d = h - recubrimiento - φb/2`. | Diferencia crítica. Si el recubrimiento llega a la cara de barra, el centroide queda a medio diámetro adicional; el significado de `r` en el manual es ambiguo. |
| Cortante unidireccional | Sección a `d` y resistencia de referencia proporcional a `√f′c·b·d`; integra presión uniforme o variable. | Demanda uniforme en ambas direcciones y referencia de guía con ese tipo de sección/resistencia. | Coincide para presión uniforme. La presión variable queda fuera de alcance. |
| Punzonamiento: demanda | Perímetro a `d/2` y reacción exterior al perímetro. | Perímetro a `d/2` y demanda por área exterior con presión uniforme. | Coincide algebraicamente para carga centrada y presión uniforme. |
| Punzonamiento: resistencia | Incluye tres alternativas y usa `αs = 40` para columna interior. | Incluye tres alternativas de guía, pero el código actual define coeficiente interior `0.4`. | **Discrepancia bloqueante.** No se puede decidir con este manual; requiere fuente primaria/guía autorizada, unidades y caso independiente. |
| Flexión | Sección en cara de columna e integración de presión uniforme/trapezoidal. | Demanda en cara de columna con presión uniforme y diagrama B/L. | Coincide en el caso concéntrico. |
| Acero requerido y mínimo | Usa `φ = 0.90`, sección rectangular y `ρmin = 0.0018`. | Implementa expresiones equivalentes como referencia de guía y compara con acero declarado. | Coincidencia funcional limitada; AndeLogic no lo presenta como aprobación NEC. |
| Distribución de acero | Propone banda central y franjas laterales en zapata rectangular. | Distribuye barras por separación máxima; no diseña bandas. | Capacidad aún no implementada. |
| Aplastamiento y espigas | Incluye transferencia por aplastamiento y dowels. | No implementado; conexión columna-zapata fuera del alcance actual. | Funcionalidad futura, no se añade sin trazabilidad. |
| Desarrollo | Usa modificadores `ψ`, `λ`, posible gancho y longitud geométrica. | Usa referencia simplificada de guía para barra recta y largo declarado. | Diferencia crítica de expresión y supuestos; no combinar fórmulas sin fuente trazable. |
| Predimensionamiento automático | Sugiere peralte inicial y bucle de ajuste. | Usuario declara B, L y h; motor informa el resultado. | Ausente deliberadamente. Una propuesta automática futura debe ser transparente. |
| Asentamientos | Los reconoce como parte del diseño geotécnico. | Fuera de alcance. | Coinciden en que son necesarios para un diseño completo; AndeLogic no los estima. |

## Hallazgos prioritarios

### P0 — revisar antes de elevar el estado técnico

1. **Punzonamiento:** rastrear la expresión de la alternativa por ubicación de columna. El manual indica `40`; el código contiene `0.4`. No se cambia por esta comparación, pero se abre revisión de trazabilidad y caso independiente.
2. **Peralte efectivo:** documentar si el recubrimiento se mide hasta la cara de barra o su centroide. Ajustar etiqueta, dibujo y prueba del motor conforme a la definición aprobada.
3. **Longitud de desarrollo:** contrastar la expresión implementada contra la propuesta del manual, con unidades, modificadores y condiciones. Mantenerlas como no equivalentes hasta entonces.

### P1 — candidatas para una versión posterior

- Separar cargas permanentes, variables y sobrecarga superficial.
- Definir volumen de relleno incluyendo/excluyendo columna, pedestal y excavación.
- Distribución de acero por bandas.
- Aplastamiento y espigas.
- Recomendación de dimensiones/peralte, separada de la verificación.

### Fuera del alcance del Producto 01

- Excentricidad, momentos uniaxiales/biaxiales, presión trapezoidal/triangular y despegue.
- Deslizamiento y volcamiento.
- Capacidad portante interna, estratigrafía, agua y asentamientos.

## Qué hace AndeLogic que el manual no deja resuelto

- Explicita base bruta o neta y esfuerzo removido.
- Mantiene proyectos locales versionados, exportables e importables.
- Separa el motor de la interfaz y lo cubre con pruebas automáticas.
- Distingue demanda, referencia de guía y aprobación normativa.
- Conserva límites visibles para no hacer pasar un cálculo centrado por uno excéntrico.

## Siguiente paso técnico seguro

Crear tres fichas de revisión: `PUN-COEF-INTERIOR`, `D-EFFECTIVE-DEFINITION` y `LD-EXPRESSION-COMPARISON`. Cada una debe tener fuente primaria o guía autorizada, unidades, hipótesis y caso numérico independiente antes de tocar el código.
