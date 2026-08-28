# Registro de casos de validación

## Propósito

Este registro controla los casos de referencia del motor. No deben añadirse resultados esperados inventados: cada valor proviene de un desarrollo manual trazable, bibliografía autorizada o una revisión técnica documentada.

## Casos iniciales

| ID | Perfil | Objetivo | Fuente esperada | Resultado esperado | Tolerancia | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| NEC-FTG-001 | NEC | Presión uniforme con carga axial centrada | Cálculo independiente + fuente NEC + 2 programas | Pendiente | Pendiente | Pendiente |
| NEC-FTG-002 | NEC | Cortante unidireccional en condición de aprobación | Demanda interna por equilibrio + resistencia y fuente NEC pendientes | Demanda B: 172.35 kN; demanda L: 234.90 kN en el fixture interno | `1e-10` para demanda | Demanda automatizada; aprobación pendiente |
| NEC-FTG-003 | NEC | Punzonamiento en condición de aprobación | Demanda interna por equilibrio + resistencia y fuente NEC pendientes | `b₀ = 3.668 m`; `Vᵤ = 775.36665 kN` en el fixture interno | `1e-10` para demanda | Demanda automatizada; aprobación pendiente |
| NEC-FTG-004 | NEC | Flexión y acero inferior mínimo/requerido | Demanda interna por equilibrio; acero, resistencia y fuente NEC pendientes | `Mᵤ,B = 144 kN·m`; `Mᵤ,L = 216 kN·m` en el fixture interno | `1e-10` para demanda | Demanda automatizada; aprobación pendiente |
| NEC-FTG-005 | NEC | Presión que excede capacidad admisible: debe bloquear o fallar | Caso de borde documentado | `fail` o `blocked` | No aplica | Pendiente |
| NEC-FTG-006 | NEC | Entrada con excentricidad: fuera de alcance | Caso de alcance documentado | `blocked` | No aplica | Pendiente |
| NEC-FTG-007 | NEC | Equivalencia de unidades | Fixture duplicado SI | Igualdad interna | Definida por cálculo | Pendiente |
| NEC-FTG-008 | Guía NEC 2015 | Comparación de acero mínimo por metro | Guía práctica NEC 2015, sección 1.10.5; ejemplo de zapata | Para `h = 0.50 m`, mínimo de referencia `9.00 cm²/m` | `1e-10` interno | Referencia automatizada; revisión normativa completa pendiente |
| NEC-FTG-009 | Guía NEC 2015 | Acero requerido por flexión para sección rectangular | Guía práctica NEC 2015, sección 1.10.5; ejemplo de zapata | Para `Mᵤ = 177.35 kN·m`, `b = 1.00 m`, `d = 0.425 m`, `f′c = 23.54 MPa` y `fy = 412.08 MPa`: `11.58 cm²/m` | `0.01 cm²/m` | Referencia automatizada; revisión normativa completa pendiente |
| NEC-FTG-010 | Guía NEC 2015 | Resistencia a cortante unidireccional por dirección | Guía práctica NEC 2015, sección 1.10.1 | Para `f′c = 23.54 MPa`, `d = 0.425 m` y franja `2.65 m`: resistencia de referencia `696.704 kN` | `0.001 kN` | Motor puro automatizado; integración y validación completa pendientes |
| NEC-FTG-011 | Guía NEC 2015 | Resistencia a punzonamiento para columna interior | Guía práctica NEC 2015, secciones 1.10.2-1.10.4 | Perímetro interior y alternativa más restrictiva según la geometría | `1e-10` interno | Fixture interno automatizado; contraste externo pendiente |
| NEC-FTG-012 | Guía NEC 2015 | Longitud de desarrollo a tracción | Guía práctica NEC 2015, sección 1.10.6 | Ejemplo local reproducido con una barra de 20 mm | `0.001 m` | Fixture interno automatizado; contraste externo pendiente |
| NEC-FTG-013 | Guía NEC 2015 | Cadena completa de zapata centrada | Fixture `NEC-FTG-REF-001` y referencias por módulo | Contacto, cortantes, flexión, acero y desarrollo alcanzan sus referencias internas | Tolerancias por módulo | Automatizado; evidencia externa pendiente |
| NEC-FTG-014 | Guía NEC 2015 | Fallas controladas | Fixtures `NEC-FTG-REF-002` y `NEC-FTG-REF-003` | Capacidad de suelo superada y acero insuficiente se identifican sin ambigüedad | No aplica | Automatizado |

## Plantilla obligatoria por caso

Cada caso se conserva en un fixture legible y contiene:

- Identificador y objetivo de la prueba.
- Perfil, edición normativa, versión del motor y referencias del registro de trazabilidad.
- Entradas originales con unidad, valores canónicos SI y decisiones del usuario.
- Resultados intermedios y finales esperados, estado, tolerancia y precisión.
- Fuente, cálculo manual o revisor que aprobó el valor, con fecha.
- Observaciones y límites del caso.

El caso de referencia se revisa cuando cambia el perfil normativo, la implementación o una interpretación técnica.

## Cola de contrastes externos

| ID | Perfil exacto | Módulo | Fuente | Uso | Estado |
| --- | --- | --- | --- | --- | --- |
| EXT-NEC-PUB-001 | NEC 2014 por confirmar en el caso | Contacto o cortante | Publicación técnica pública identificada | Contraste auxiliar con hipótesis y unidades completas | Pendiente de registrar autor y caso |

Un caso externo no pasa a “Aprobado” con una captura aislada. Debe incluir todos los datos de identidad definidos en `09-external-benchmark-protocol.md`.
