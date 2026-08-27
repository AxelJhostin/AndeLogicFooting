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
| ACI-FTG-001 | ACI CODE-318-25 SI | Presión de contacto / interacción con dato geotécnico | Acceso autorizado pendiente | Pendiente | `standards/aci318_25` | `ACI-FTG-001` | Pendiente |
| ACI-FTG-002 | ACI CODE-318-25 SI | Cortante unidireccional | Acceso autorizado pendiente | Pendiente | `standards/aci318_25` | `ACI-FTG-002` | Pendiente |
| ACI-FTG-003 | ACI CODE-318-25 SI | Cortante por punzonamiento | Acceso autorizado pendiente | Pendiente | `standards/aci318_25` | `ACI-FTG-003` | Pendiente |
| ACI-FTG-004 | ACI CODE-318-25 SI | Flexión y acero inferior | Acceso autorizado pendiente | Pendiente | `standards/aci318_25` | `ACI-FTG-004` | Pendiente |

## Criterio para completar una fila

Para cambiar una fila a “Lista para implementar” se debe registrar:

- URL, documento autorizado o copia de archivo permitida; edición y fecha de consulta.
- Cláusula, sección o tabla exacta y la interpretación técnica revisada.
- Parámetros, unidades y límites de aplicación.
- Función pura que aplicará la regla y al menos un caso de aceptación independiente.
- Revisión por una persona competente y fecha.

Una referencia ambigua bloquea la implementación, no se resuelve mediante una aproximación de IA o una equivalencia supuesta entre normas.

## Inventario de fuentes localizado

| ID | Documento | Evidencia registrada | Uso permitido por ahora | Estado |
| --- | --- | --- | --- | --- |
| NEC-SRC-001 | Portal oficial de la Norma Ecuatoriana de la Construcción | El portal del Ministerio indica que la NEC es obligatoria y lista NEC-SE-GC y NEC-SE-HM como documentos descargables. Consulta: 2026-08-27. | Fuente de procedencia y seguimiento. | Registrada |
| NEC-SRC-002 | NEC-SE-GC — Geotecnia y Cimentaciones | PDF oficial alojado por el Ministerio; portada editorial de diciembre de 2014. El índice identifica capítulos 6 “Cimentaciones” y 7 “Zapatas aisladas, combinadas y losas”. | Delimitar alcance geotécnico y registrar referencias exactas durante el mapeo. | Registrada; falta hash local y revisión técnica |
| NEC-SRC-003 | NEC-SE-HM — Estructuras de Hormigón Armado | PDF oficial alojado por el Ministerio; portada editorial de diciembre de 2014. El índice incluye capítulos 4 (flexión), 5 (cortante) y 6.3 (cimentaciones). El documento se apoya en ACI 318 y señala remisiones específicas para cimentaciones sísmicas. | Fijar el marco NEC y determinar las referencias complementarias necesarias. | Registrada; falta la fuente complementaria exacta para el motor de zapatas |
| ACI-SRC-001 | ACI CODE-318-25 | Publicación oficial de ACI identificada por la editorial. | Solo planificar perfil y obtener acceso autorizado. | Pendiente de acceso autorizado |

En la fase de implementación, cada archivo fuente se conservará con URL, fecha de descarga, edición declarada y huella criptográfica. Eso impide que un enlace actualizado silenciosamente cambie el significado de una versión ya publicada.

## Decisión de compatibilidad

La evidencia actual no permite anunciar una equivalencia entre la NEC 2014 y ACI CODE-318-25. El perfil internacional ACI 318-25 continuará independiente. Para el perfil Ecuador se debe aprobar, documentar y validar la edición complementaria aplicable a las verificaciones de zapata; hasta entonces, el motor permanece bloqueado.

## Enlaces de procedencia

- [Portal oficial de la NEC — Ministerio de Infraestructura y Tecnología](https://www.mit.gob.ec/norma-ecuatoriana-de-la-construccion/)
- [NEC-SE-GC — Geotecnia y Cimentaciones (PDF oficial)](https://www.mit.gob.ec/wp-content/uploads/downloads/2026/03/4.-NEC-SE-GC-Geotecnia-y-Cimentaciones.pdf)
- [NEC-SE-HM — Estructuras de Hormigón Armado (PDF oficial)](https://www.mit.gob.ec/wp-content/uploads/downloads/2026/03/5.-NEC-SE-HM-Estructuras-de-Hormigon-Armado.pdf)
- [ACI CODE-318-25 — American Concrete Institute](https://www.concrete.org/store/productdetail.aspx?itemid=31825)
