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
| SkyCiv Foundation — verificación pública | Casos reproducibles de presión, cortante unidireccional, punzonamiento, flexión, transferencia y desarrollo | La verificación pública localizada corresponde a ACI 318-14; no valida ACI 318-25 ni NEC 2014. |
| SkyCiv — calculador gratuito | Ejecución reproducible en navegador | La interfaz localizada inicia con ACI 2019; se debe capturar la selección exacta en cada caso. |
| ASDIP — calculador gratuito | Segundo cálculo independiente en navegador | La página declara “latest ACI 318”, pero eso no identifica una edición; cada ejecución queda bloqueada hasta confirmarla. |
| Tekla Tedds | Tercer contraste cuando el módulo y la edición sean compatibles | Tedds 2023 documenta ACI 318-19 re-aprobada en 2022; cualquier otra versión requiere verificación y revisión de boletines. |

La documentación pública de SkyCiv compara resultados manuales y del programa y deja visibles diferencias asociadas a supuestos como la profundidad efectiva. Los boletines de Tekla de mayo de 2026 documentan correcciones de errores potencialmente no conservadores en fuerzas cortantes y momentos de cimentaciones. Esa evidencia confirma que ningún proveedor debe ser el único oráculo.

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

## Fuentes iniciales

- [SkyCiv — ACI 318 Verification #1](https://skyciv.com/docs/skyciv-foundation/isolated-footings/verification-2/aci-318-verification-1/)
- [ASDIP Foundation — User's Manual](https://www.asdipsoft.com/documentation/ASDIP%20Foundation%20Users%20Manual.pdf)
- [ASDIP — Free Concrete Footing Calculator](https://www.asdipsoft.com/free-footing-calculator/)
- [Tekla Tedds — actualización ACI de 2023](https://support.tekla.com/doc/tekla-tedds/2023/rel_concrete_design_calculations_aci318)
- [Tekla Tedds — Engineering library update, May 2026](https://support.tekla.com/nl/doc/tekla-tedds/2026/rel_may_2026_engineering_library_release_notes)
