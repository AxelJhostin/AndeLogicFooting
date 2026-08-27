# Registro de casos de validación

## Propósito

Este registro controla los casos de referencia del motor. No deben añadirse resultados esperados inventados: cada valor proviene de un desarrollo manual trazable, bibliografía autorizada o una revisión técnica documentada.

## Casos iniciales

| ID | Perfil | Objetivo | Fuente esperada | Resultado esperado | Tolerancia | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| NEC-FTG-001 | NEC | Presión uniforme con carga axial centrada | Desarrollo manual revisado + fuente NEC | Pendiente | Pendiente | Pendiente |
| NEC-FTG-002 | NEC | Cortante unidireccional en condición de aprobación | Desarrollo manual revisado + fuente NEC | Pendiente | Pendiente | Pendiente |
| NEC-FTG-003 | NEC | Punzonamiento en condición de aprobación | Desarrollo manual revisado + fuente NEC | Pendiente | Pendiente | Pendiente |
| NEC-FTG-004 | NEC | Flexión y acero inferior mínimo/requerido | Desarrollo manual revisado + fuente NEC | Pendiente | Pendiente | Pendiente |
| NEC-FTG-005 | NEC | Presión que excede capacidad admisible: debe bloquear o fallar | Caso de borde documentado | `fail` o `blocked` | No aplica | Pendiente |
| NEC-FTG-006 | NEC | Entrada con excentricidad: fuera de alcance | Caso de alcance documentado | `blocked` | No aplica | Pendiente |
| NEC-FTG-007 | NEC | Equivalencia de unidades | Fixture duplicado SI | Igualdad interna | Definida por cálculo | Pendiente |
| ACI-FTG-001 | ACI 318-25 | Presión uniforme con carga axial centrada | Acceso autorizado + desarrollo revisado | Pendiente | Pendiente | Pendiente |
| ACI-FTG-002 | ACI 318-25 | Cortante unidireccional | Acceso autorizado + desarrollo revisado | Pendiente | Pendiente | Pendiente |
| ACI-FTG-003 | ACI 318-25 | Punzonamiento | Acceso autorizado + desarrollo revisado | Pendiente | Pendiente | Pendiente |
| ACI-FTG-004 | ACI 318-25 | Flexión y acero inferior | Acceso autorizado + desarrollo revisado | Pendiente | Pendiente | Pendiente |

## Plantilla obligatoria por caso

Cada caso se conserva en un fixture legible y contiene:

- Identificador y objetivo de la prueba.
- Perfil, edición normativa, versión del motor y referencias del registro de trazabilidad.
- Entradas originales con unidad, valores canónicos SI y decisiones del usuario.
- Resultados intermedios y finales esperados, estado, tolerancia y precisión.
- Fuente, cálculo manual o revisor que aprobó el valor, con fecha.
- Observaciones y límites del caso.

El caso de referencia se revisa cuando cambia el perfil normativo, la implementación o una interpretación técnica.
