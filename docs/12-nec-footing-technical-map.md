# Mapa técnico local de zapatas NEC

## Propósito

Este documento es un índice de trabajo para AndeLogic Zapatas. Permite localizar rápidamente las fuentes locales que afectan el alcance de la zapata aislada rectangular, sin copiar ni reproducir normas, tablas o figuras.

No es una norma, una memoria de cálculo ni una autorización para implementar una regla. Antes de convertir un tema en código se debe completar la fila de trazabilidad, registrar los supuestos, crear pruebas y actualizar el registro de casos.

## Convenciones

- Las páginas indican el número de página del archivo PDF local, no la paginación impresa.
- `Primaria` identifica NEC oficial; `Apoyo` identifica guía pública local usada para orientar ejemplos y localizar procedimientos.
- `Estado` describe la situación dentro del producto, no un nivel de cumplimiento de una norma.

## Fuentes activas

| ID | Fuente local | Edición declarada | Rol |
| --- | --- | --- | --- |
| NEC-SRC-002 | `NEC-SE-GC-Geotecnia-y-Cimentaciones.pdf` | NEC 2014 | Primaria: datos geotécnicos, cimentaciones superficiales y capacidad declarada. |
| NEC-SRC-003 | `NEC-SE-HM-Estructuras-de-Hormigon-Armado.pdf` | NEC 2014 | Primaria: materiales, flexión, cortante, refuerzo y requisitos de hormigón armado. |
| NEC-SRC-005 | `NEC-SE-CG-Cargas-No-Sismicas.pdf` | NEC 2014 | Primaria: clasificación de cargas, combinaciones y pesos unitarios de referencia. |
| NEC-SRC-004 | `Guia-practica-diseno-hormigon-armado.pdf` | Guía NEC 2015 | Apoyo: ejemplo público completo de cimentación y secuencia de diseño. |
| NEC-SRC-006 | `Guia-practica-estudios-geotecnicos-cimentacion.pdf` | Guía NEC 2015 | Apoyo: capacidad de carga, asentamientos y criterios de estudio geotécnico. |

Las huellas SHA-256 y las rutas locales de estos archivos constan en [el manifiesto local](11-local-nec-reference-manifest.md).

## Mapa por módulo del producto

| Tema | Fuentes y ubicación local | Uso dentro de AndeLogic | Estado |
| --- | --- | --- | --- |
| Alcance de cimentación y datos del subsuelo | NEC-SE-GC, PDF 43-50, capítulo 6; guía geotécnica, PDF 62-77, capítulo 3 | Mantener capacidad admisible como entrada del informe geotécnico; separar capacidad y asentamientos. | Contacto centrado implementado; asentamientos fuera de alcance. |
| Zapatas aisladas y geometría superficial | NEC-SE-GC, PDF 51-52, capítulo 7 | Delimitar zapata aislada, profundidad de desplante, ancho y longitud. | Alcance activo; combinadas y losas excluidas. |
| Capacidad admisible, base bruta/neta y excavación | NEC-SE-GC, PDF 46-49; guía geotécnica, PDF 67-72 | Explicar la base de presión comparada y exigir que coincida con el informe del suelo. | Contacto de servicio implementado con base declarada. |
| Asentamientos y servicio geotécnico | NEC-SE-GC, PDF 48-49; guía geotécnica, PDF 72-77 | Registrar como revisión indispensable del estudio geotécnico, sin estimarla en la aplicación inicial. | Fuera de alcance. |
| Cargas de servicio y últimas | NEC-SE-CG, PDF 14-24, capítulos 2 y 3 | Documentar cargas declaradas y combinaciones externas; no inventar combinaciones en la interfaz. | Entradas de servicio y última separadas; combinador pendiente. |
| Pesos unitarios de referencia | NEC-SE-CG, PDF 25-26, apéndice de cargas muertas | Revisar coherencia de los pesos declarados de hormigón y relleno. | Entradas explícitas; no se autocompletan desde la norma. |
| Materiales, barras y colocación | NEC-SE-HM, PDF 40-45, sección 3.4; guía de hormigón, PDF 10-16 | Validar futuras restricciones de materiales, diámetros, recubrimiento y disposición. | Diámetro y recubrimiento son entradas; validación completa pendiente. |
| Flexión y sección de hormigón armado | NEC-SE-HM, PDF 46-50, capítulo 4; guía de hormigón, PDF 87-88, sección 1.10.5 | Demanda en cara de columna y referencia pública de acero mínimo/requerido. | Demanda y referencias de guía implementadas; perfil NEC no liberado. |
| Cortante unidireccional | NEC-SE-HM, capítulo 5 (índice PDF 8); guía de hormigón, PDF 79-81, sección 1.10.1 | Sección crítica, demanda por equilibrio y resistencia de referencia para hormigón de peso normal. | Demanda visible; motor de resistencia de guía pendiente de integración. |
| Punzonamiento | NEC-SE-HM, referencias de cortante y punzonamiento; guía de hormigón, PDF 82-86, secciones 1.10.2-1.10.4 | Perímetro crítico, demanda y alternativas de comprobación. | Demanda y resistencia de referencia implementadas para columna interior centrada; validación completa pendiente. |
| Refuerzo mínimo, requerido y distribución | NEC-SE-HM, capítulos 3 y 4; guía de hormigón, PDF 87-89 | Comparar acero declarado, mínimo y requerido por dirección. | Referencias de guía y comparación implementadas; detallado pendiente. |
| Longitud de desarrollo y anclaje | NEC-SE-HM, PDF 75 y 110-111; guía de hormigón, PDF 89, sección 1.10.6 | Determinar si una barra desarrolla la demanda disponible con la geometría real. | Referencia implementada; el largo disponible es una entrada explícita. |
| Aplastamiento columna-zapata | Guía de hormigón, PDF 90, sección 1.10.7; NEC-SE-HM por confirmar | Evaluar transferencia local en la interfaz solo cuando la referencia primaria esté cerrada. | Pendiente. |

## Secuencia técnica de consulta

1. Confirmar que el caso sigue dentro del alcance: zapata aislada rectangular, columna centrada y presión uniforme.
2. Revisar geotecnia en NEC-SE-GC antes de usar una capacidad admisible o una base neta/bruta.
3. Tomar cargas y combinaciones declaradas desde NEC-SE-CG o el análisis estructural externo; no generarlas por aproximación.
4. Consultar NEC-SE-HM para materiales, flexión, cortante, refuerzo y desarrollo.
5. Usar las guías NEC solo para ubicar un ejemplo público, contrastar resultados y definir casos reproducibles.
6. Registrar la decisión exacta en [trazabilidad normativa](06-normative-traceability.md), agregar un caso a [validación](07-validation-case-register.md) y recién entonces implementar.

## Próximos módulos, en orden

1. Integrar en pantalla la resistencia de referencia a cortante unidireccional ya probada.
2. Cerrar la referencia exacta y las pruebas para resistencia a punzonamiento.
3. Implementar longitud de desarrollo como un módulo separado de refuerzo.
4. Resolver los casos de borde, unidades y contrastes externos de cada módulo antes de liberarlo como verificación.

## Límites que el mapa no cambia

- No calcula capacidad portante ni asentamientos: provienen del estudio geotécnico.
- No habilita excentricidad, presión trapezoidal, zapatas combinadas, corridas o losas.
- No convierte referencias de guía en una certificación NEC.
- No incorpora texto, tablas, figuras ni ecuaciones de las fuentes locales al repositorio.
