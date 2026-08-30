# Plan de endurecimiento y liberación técnica

## Decisión de producto

El catálogo de AndeLogic Zapatas queda congelado en ocho familias de cimentación superficial: aislada, corrida, combinada rectangular, medianera, trapezoidal, excéntrica de borde, esquina biaxial y losa de cimentación. No se añadirán nuevas geometrías durante esta fase.

El objetivo deja de ser ampliar el inventario y pasa a ser demostrar, con evidencia reproducible, qué partes del producto pueden liberarse y cuáles deben permanecer como referencia, advertencia o resultado no evaluado.

## Puertas de calidad

Cada familia debe superar cinco puertas independientes:

1. **Alcance:** hipótesis, entradas, bloqueos y exclusiones documentados.
2. **Motor:** casos manuales, bordes geométricos, invariantes numéricos y resultados finitos automatizados.
3. **Trazabilidad:** cada módulo enlazado a fuente, edición, referencia y condición de aplicabilidad.
4. **Contraste externo:** evidencia compatible conforme a `09-external-benchmark-protocol.md`, sin discrepancias abiertas.
5. **Revisión de liberación:** interfaz, memoria, persistencia, accesibilidad y revisión técnica profesional.

Una puerta aprobada no compensa otra pendiente. En particular, muchas pruebas internas no sustituyen fuentes externas independientes.

## Estado inicial de la fase

Las ocho familias tienen alcance, motor, formulario, resultados, memoria, ejemplos y regresiones internas. El perfil completo continúa en `pending-review` porque no se ha completado el banco externo exigido y existen verificaciones estructurales que todavía son referencias de guía o resultados `not-evaluated`.

Prioridades:

1. registrar un caso externo compatible por familia para contacto y equilibrio;
2. completar dos comparadores de software independientes por caso principal;
3. resolver la discrepancia documentada de punzonamiento antes de cambiar esa fórmula;
4. contrastar cortante, flexión, acero y desarrollo por alcance, sin extrapolar columna interior a borde o esquina;
5. mantener placa, punzonamiento y armado de la losa como no evaluados hasta disponer de modelo y evidencia específicos;
6. solicitar revisión profesional solo después de entregar al revisor una matriz reproducible y sin discrepancias ocultas.

## Invariantes transversales automatizados

Para toda tipología y ejemplo calculable:

- ningún resultado numérico puede ser `NaN` o infinito;
- las entradas canónicas permanecen sin mutación después de analizar;
- los informes conservan perfil, fuentes, trazabilidad y límites;
- los motores con presión no uniforme cierran fuerza y momentos dentro de su tolerancia declarada;
- todo caso fuera de alcance termina en un bloqueo explícito o `not-evaluated`;
- cargar un ejemplo solo reemplaza el snapshot de su propia familia.

## Criterio de liberación

La aplicación no se describirá como diseño normativo aprobado mientras alguna familia tenga una puerta bloqueada. El catálogo de validación del código es la fuente operativa del estado; este documento explica la política y el registro `07-validation-case-register.md` conserva los casos.

El cierre de esta fase requiere:

- ocho familias presentes en el catálogo y sin tipologías desconocidas;
- todas las regresiones e invariantes internos aprobados;
- evidencia externa mínima completa por módulo que se pretenda liberar;
- cero discrepancias numéricas o normativas bloqueantes;
- revisión profesional registrada con alcance, fecha y versión revisada;
- compilación, persistencia e interfaz verificadas en escritorio y móvil.
