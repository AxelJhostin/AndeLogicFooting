# Trazabilidad normativa

## Propósito

Cada verificación implementada debe enlazarse a una fuente autorizada, una edición concreta, una cláusula o referencia verificable, parámetros y pruebas. Este registro no reproduce texto, tablas ni ecuaciones protegidas por derechos de autor.

No se implementará una fila marcada como pendiente. Las referencias se completan únicamente a partir de documentos oficiales o acceso autorizado.

## Registro inicial

| ID | Perfil | Verificación | Fuente / edición | Cláusula o tabla | Módulo previsto | Casos | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NEC-FTG-001 | NEC-SE-GC + NEC-SE-HM | Datos geotécnicos y presión de contacto | `NEC-SRC-002` + `NEC-SRC-003` | NEC-SE-GC, capítulos 6 y 7: referencia de alcance; criterio exacto pendiente | `standards/nec` | `NEC-FTG-001` | Fuente localizada; mapeo pendiente |
| NEC-FTG-002 | NEC-SE-HM + referencia complementaria | Cortante unidireccional | `NEC-SRC-003`; fuente complementaria autorizada pendiente | NEC-SE-HM, capítulo 5 como marco; cláusula aplicable a zapatas pendiente | `standards/nec` | `NEC-FTG-002` | Bloqueada por referencia complementaria |
| NEC-FTG-003 | NEC-SE-HM + referencia complementaria | Cortante por punzonamiento | `NEC-SRC-003`; fuente complementaria autorizada pendiente | NEC-SE-HM lista punzonamiento en otros elementos; cláusula aplicable a zapatas pendiente | `standards/nec` | `NEC-FTG-003` | Bloqueada por referencia complementaria |
| NEC-FTG-004 | NEC-SE-HM + referencia complementaria | Flexión y acero inferior | `NEC-SRC-003`; fuente complementaria autorizada pendiente | NEC-SE-HM, capítulo 4 como marco; criterio de zapatas pendiente | `standards/nec` | `NEC-FTG-004` | Bloqueada por referencia complementaria |
| NEC-FTG-005 | Guía práctica NEC 2015 | Acero mínimo y requerido de referencia por metro | `NEC-SRC-004` | Sección 1.10.5, ejemplo de zapata | `domain/footing/minimum-reinforcement` + `domain/footing/required-reinforcement` | `NEC-FTG-008`, `NEC-FTG-009` | Implementada como referencia de guía; no es verificación NEC completa |
| NEC-FTG-006 | Guía práctica NEC 2015 | Resistencia de cortante unidireccional de referencia | `NEC-SRC-004` | Sección 1.10.1, ejemplo de zapata; hormigón de peso normal y carga centrada uniforme en el motor | `domain/footing/one-way-shear-guide-check` | `NEC-FTG-010` | Motor puro implementado como referencia de guía; integración y validación completa pendientes |
| NEC-FTG-007 | Guía práctica NEC 2015 | Resistencia de punzonamiento de referencia para columna interior | `NEC-SRC-004` | Secciones 1.10.2-1.10.4; menor de las alternativas indicadas para columna interior rectangular, con hormigón de peso normal | `domain/footing/punching-shear-guide-check` | `NEC-FTG-011` | Implementada como referencia de guía; contraste y matriz NEC pendientes |
| NEC-FTG-008 | Guía práctica NEC 2015 | Longitud de desarrollo a tracción de referencia | `NEC-SRC-004` | Sección 1.10.6; barra sin recubrimiento especial, otros casos y hormigón de peso normal | `domain/footing/development-length-guide-check` | `NEC-FTG-012` | Implementada como referencia de guía; contraste y matriz NEC pendientes |
| NEC-FTG-009 | NEC-SE-GC + equilibrio | Contacto lineal de zapata combinada | `NEC-SRC-002` + `AXC-COMB-001` | NEC-SE-GC 2014, secciones 6.4, 7.1, 7.2.1 y 7.3 | `domain/combined-footing` | `NEC-FTG-015` a `018` | Demanda implementada; contacto parcial y asentamientos excluidos |
| NEC-FTG-010 | Guía práctica NEC 2015 | Cortante, punzonamiento, flexión, acero y desarrollo de combinada | `NEC-SRC-004` | Secciones 1.10.1 a 1.10.6 adaptadas a demandas de equilibrio | `domain/combined-footing` | `NEC-FTG-015` a `018` | Referencia de guía; contraste independiente pendiente |
| NEC-FTG-011 | USACE + NEC-SE-GC + equilibrio | Definición y contacto de zapata con viga centradora | `PUB-SRC-007` + `NEC-SRC-002` + `AXC-STRAP-001` | USACE EM 1110-1-1905, 2-5.d.(2); NEC-SE-GC 2014, 6.4, 7.1 y 7.2.1 | `domain/strap-footing` | `NEC-FTG-019` a `022` | Equilibrio implementado; USACE se usa como fuente técnica pública, no como normativa ecuatoriana |
| NEC-FTG-012 | Guía práctica NEC 2015 | Cortante, flexión, acero y desarrollo de bases y viga centradora | `NEC-SRC-004` | Secciones 1.10.1, 1.10.5 y 1.10.6 aplicadas a demandas independientes | `domain/strap-footing` | `NEC-FTG-019` a `022` | Referencia de guía; punzonamiento en encuentros no evaluado |

## Criterio para completar una fila

Para cambiar una fila a “Lista para implementar” se debe registrar:

- URL, documento autorizado o copia de archivo permitida; edición y fecha de consulta.
- Cláusula, sección o tabla exacta y la interpretación técnica revisada.
- Parámetros, unidades y límites de aplicación.
- Función pura que aplicará la regla y al menos un caso de aceptación independiente.
- Caso independiente y contrastes externos aprobados conforme a `09-external-benchmark-protocol.md`.

Una referencia ambigua bloquea la implementación, no se resuelve mediante una aproximación de IA o una equivalencia supuesta entre normas.

## Inventario de fuentes localizado

| ID | Documento | Evidencia registrada | Uso permitido por ahora | Estado |
| --- | --- | --- | --- | --- |
| NEC-SRC-001 | Portal oficial de la Norma Ecuatoriana de la Construcción | El portal del Ministerio indica que la NEC es obligatoria y lista NEC-SE-GC y NEC-SE-HM como documentos descargables. Consulta: 2026-08-27. | Fuente de procedencia y seguimiento. | Registrada |
| NEC-SRC-002 | NEC-SE-GC — Geotecnia y Cimentaciones | PDF oficial alojado por el Ministerio; portada editorial de diciembre de 2014. El índice identifica capítulos 6 “Cimentaciones” y 7 “Zapatas aisladas, combinadas y losas”. | Delimitar alcance geotécnico y registrar referencias exactas durante el mapeo. | Registrada; falta hash local y revisión técnica |
| NEC-SRC-003 | NEC-SE-HM — Estructuras de Hormigón Armado | PDF oficial alojado por el Ministerio; portada editorial de diciembre de 2014. El índice incluye capítulos 4 (flexión), 5 (cortante) y 6.3 (cimentaciones). | Fijar el marco NEC y determinar las referencias públicas complementarias necesarias. | Registrada; falta la fuente exacta para la resistencia de zapatas |
| NEC-SRC-004 | Guía práctica para el diseño de estructuras de hormigón armado de conformidad con NEC 2015 | Copia local con huella en `11-local-nec-reference-manifest.md`; sección 1.10.5 incluye un ejemplo de diseño de zapata y de acero mínimo por metro. | Referencia pública auxiliar para comparar acero mínimo declarado. | Registrada; no habilita un resultado de cumplimiento NEC completo |
| PUB-SRC-007 | USACE EM 1110-1-1905 — Geotechnical Design of Shallow Foundations on Soils | Publicación oficial del 31 de julio de 2025; 2-5.d.(2) define dos bases enlazadas por viga rígida, con la viga separada del suelo. | Delimitar el modelo físico de viga centradora y contrastarlo con una fuente pública. | Registrada; no reemplaza NEC ni declara compatibilidad normativa |

En la fase de implementación, cada archivo fuente se conservará con URL, fecha de descarga, edición declarada y huella criptográfica. Eso impide que un enlace actualizado silenciosamente cambie el significado de una versión ya publicada.

## Decisión de compatibilidad

El producto no anuncia equivalencia ni compatibilidad con normas internacionales. Para el perfil Ecuador se debe aprobar, documentar y validar la fuente pública aplicable a cada verificación de zapata; hasta entonces, las verificaciones de resistencia permanecen pendientes.

## Enlaces de procedencia

- [Portal oficial de la NEC — Ministerio de Infraestructura y Tecnología](https://www.mit.gob.ec/norma-ecuatoriana-de-la-construccion/)
- [NEC-SE-GC — Geotecnia y Cimentaciones (PDF oficial)](https://www.mit.gob.ec/wp-content/uploads/downloads/2026/03/4.-NEC-SE-GC-Geotecnia-y-Cimentaciones.pdf)
- [NEC-SE-HM — Estructuras de Hormigón Armado (PDF oficial)](https://www.mit.gob.ec/wp-content/uploads/downloads/2026/03/5.-NEC-SE-HM-Estructuras-de-Hormigon-Armado.pdf)
