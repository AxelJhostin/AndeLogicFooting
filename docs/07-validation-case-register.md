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
| NEC-FTG-015 | Equilibrio + NEC-SE-GC | Zapata combinada simétrica | Caso manual `AXC-COMB-001` en `16-combined-footing-scope.md` | `qserv = 112 kPa`, `qu = 150 kPa`, `M+ = 150 kN·m`, `M− = -450 kN·m` | `1e-9` | Automatizado; contraste externo pendiente |
| NEC-FTG-016 | Equilibrio + NEC-SE-GC | Zapata combinada con cargas distintas | Equilibrio de fuerza y momento | `V(L)=0`, `M(L)=0` y presión extrema mayor junto a la carga gobernante | `1e-9` | Automatizado |
| NEC-FTG-017 | Alcance combinado | Pérdida de contacto completo | Resultante fuera del núcleo central | El motor devuelve entrada inválida y no analiza contacto parcial | No aplica | Automatizado |
| NEC-FTG-018 | Alcance combinado | Columnas superpuestas o fuera de la base | Geometría incompatible | El motor bloquea el caso | No aplica | Automatizado |
| NEC-FTG-019 | Equilibrio + fuente pública | Caso manual de zapata medianera `AXC-STRAP-001` | `17-strap-footing-scope.md` | Servicio: `M=180 kN·m`, `V=36 kN`, `Rₑ=636 kN`, `Rᵢ=864 kN`; última: `Mᵤ=270 kN·m`, `Vᵤ=54 kN`, `Rᵤ,ₑ=954 kN`, `Rᵤ,ᵢ=1296 kN` | `1e-10` | Automatizado |
| NEC-FTG-020 | Equilibrio medianero | Conservación de fuerza vertical | Identidad independiente | `Rᵤ,ₑ + Rᵤ,ᵢ = Pᵤ,ₑ + Pᵤ,ᵢ` | `1e-10` | Automatizado |
| NEC-FTG-021 | Alcance medianero | Reacción interior nula o levantamiento | Condición física declarada | Entrada inválida; no se calcula contacto parcial | No aplica | Automatizado |
| NEC-FTG-022 | Alcance medianero | Bases superpuestas o columna exterior fuera de su base | Geometría incompatible | Entrada inválida antes del análisis estructural | No aplica | Automatizado |
| NEC-FTG-023 | Equilibrio + fuente pública | Caso manual trapezoidal `AXC-TRAP-001` | `19-trapezoidal-footing-scope.md` | `A=12 m²`, `x̄=3.25 m`, `Wz=144 kN`, `qserv=112 kPa`, `qu=150 kPa`, `V(L)=M(L)=0` | `1e-8` | Automatizado |
| NEC-FTG-024 | Equilibrio trapezoidal | Resultante distinta del centroide | Sistema integral de fuerza y momento | Presión extrema mayor hacia la columna gobernante y equilibrio final nulo | `1e-8` | Automatizado |
| NEC-FTG-025 | Alcance trapezoidal | Pérdida de contacto completo | Presión extrema negativa | El motor devuelve entrada inválida y no recorta el área activa | No aplica | Automatizado |
| NEC-FTG-026 | Alcance trapezoidal | Perímetro crítico fuera del borde inclinado | Geometría local del trapecio | El motor bloquea el caso antes de calcular punzonamiento | No aplica | Automatizado |
| NEC-FTG-027 | Equilibrio + fuente pública | Caso manual excéntrico `AXC-ECC-001` | `20-edge-eccentric-footing-scope.md` | `qserv=206.444444 → 39.777778 kPa`, `qu=291.666667 → 41.666667 kPa`, `V(L)=M(L)=0` | `1e-8` | Preparado para automatizar |
| NEC-FTG-028 | Simetría excéntrica | Borde izquierdo frente a borde derecho | Identidad geométrica independiente | Iguales magnitudes y presiones extremas intercambiadas | `1e-8` | Preparado para automatizar |
| NEC-FTG-029 | Alcance excéntrico | Resultante fuera del tercio central | Condición `|e|>L/6` | Entrada inválida; no se calcula contacto parcial | No aplica | Preparado para automatizar |
| NEC-FTG-030 | Punzonamiento de borde | Perímetro truncado por el lindero | Alcance de `20-edge-eccentric-footing-scope.md` | Resultado explícito `not-evaluated`; no reutiliza columna interior | No aplica | Preparado para automatizar |

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
