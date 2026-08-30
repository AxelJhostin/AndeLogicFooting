# Protocolo de contraste externo

## Decisión

AndeLogic no tratará a otro programa como una fuente infalible. Cada módulo se liberará mediante una cadena de evidencia reproducible:

1. Fuente normativa pública, oficial o consultada con autorización, con edición y referencia exactas.
2. Implementación pura de AndeLogic y desarrollo independiente del caso.
3. Contraste del mismo caso con al menos dos implementaciones externas independientes.
4. Explicación y resolución de toda discrepancia antes de aprobar el caso.

Este proceso permite avanzar sin depender de una revisión profesional inmediata. Una revisión humana futura sigue siendo recomendable antes de aplicar el producto a proyectos reales, pero no sustituye pruebas, trazabilidad ni contrastes numéricos.

## Regla de identidad del caso

Dos resultados solo pueden compararse cuando coinciden expresamente:

- tipo y geometría de zapata;
- edición normativa y sistema de unidades;
- cargas de servicio, cargas factorizadas y combinaciones;
- inclusión o exclusión de peso propio, relleno y sobrecarga;
- hipótesis de presión de contacto;
- propiedades de suelo, hormigón y acero;
- recubrimiento, diámetro de barras y definición de profundidad efectiva;
- secciones críticas y convenciones de signos.

Si uno de estos datos no puede confirmarse, el resultado se registra como evidencia insuficiente y no como coincidencia.

## Comparadores candidatos

| Fuente | Uso previsto | Límite conocido |
| --- | --- | --- |
| NEC — portal oficial | Fuente primaria de documentos y alcance ecuatoriano | Debe identificarse la sección exacta aplicable a cada módulo. |
| Publicación técnica de profesional identificado | Desarrollo o caso reproducible | Solo sirve si registra autor, fecha, unidades, hipótesis y resultados intermedios. |
| Software de terceros | Contraste numérico auxiliar | Nunca valida por sí solo una regla NEC; versión y parámetros deben quedar registrados. |

Las publicaciones y programas externos pueden diferir por supuestos como profundidad efectiva, peso propio o secciones críticas. Esa evidencia confirma que ninguna fuente secundaria ni proveedor debe ser el único oráculo.

## Datos obligatorios de cada observación

- ID de caso, módulo y métrica.
- Fuente, clase de fuente, producto y versión.
- Perfil normativo y edición exacta.
- Firma de supuestos y unidad canónica.
- Valor sin redondeo de presentación, cuando esté disponible.
- URL, informe, captura o archivo que permita reconstruir la evidencia.
- Fecha de captura y responsable de transcripción.

Las capturas y reportes de terceros no se publican si su licencia no lo permite. El repositorio conserva metadatos, valores derivados permitidos y enlaces de procedencia.

## Política numérica

Cada métrica define una tolerancia absoluta y una relativa antes de observar el resultado. Una comparación aprueba cuando satisface al menos una de ellas. No se amplía una tolerancia después del cálculo para ocultar una discrepancia.

El resultado global puede ser:

- `approved`: contexto compatible, evidencia mínima completa y todos los valores dentro de tolerancia;
- `insufficient-evidence`: faltan fuentes independientes o clases de evidencia exigidas;
- `blocked`: hay mezcla de perfiles, unidades, supuestos o una diferencia fuera de tolerancia.

Redondeo, modelación de profundidad efectiva o peso propio pueden explicar una diferencia, pero la explicación debe convertirse en un supuesto explícito y en un caso de regresión.

## Puerta de liberación por módulo

Un módulo normativo se habilita en la interfaz únicamente cuando:

1. su fila de trazabilidad normativa está completa;
2. tiene casos de aprobación, falla, borde y equivalencia de unidades;
3. al menos un caso principal incluye una referencia pública o cálculo independiente y dos programas externos;
4. todas las comparaciones conservan versión, evidencia y tolerancia;
5. no queda ninguna discrepancia bloqueante;
6. el informe muestra método, entradas, resultados intermedios y límites.

La pérdida posterior de confianza en una versión externa no altera resultados históricos: invalida la evidencia afectada, bloquea nuevas liberaciones y genera un caso de regresión.

La puerta transversal se representa en `app/src/validation/release-gate.ts`. El catálogo exige tres evidencias externas por cada una de las ocho familias y rechaza estados incoherentes, duplicados, ausencias o tipologías inesperadas. Marcar una puerta como aprobada no sustituye el registro de evidencias.

## Fuentes iniciales

- [Portal oficial de la NEC](https://www.mit.gob.ec/norma-ecuatoriana-de-la-construccion/)
