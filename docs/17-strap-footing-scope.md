# Zapata medianera con viga centradora

## Decisión de alcance

El cuarto modelo de AndeLogic es una **zapata medianera con viga centradora**, también denominada *strap footing*. Consta de dos zapatas rectangulares separadas: una exterior con columna excéntrica hacia el lindero y una interior con columna centrada. Una viga rígida transfiere el momento de excentricidad entre ambas.

El caso incluido requiere:

- dos zapatas rectangulares que no se superponen;
- columna exterior excéntrica en un solo eje y completamente contenida en su zapata;
- columna interior centrada;
- cargas verticales declaradas, sin momentos ni fuerzas horizontales adicionales;
- viga centradora rígida cuyo tramo libre no está en contacto con el suelo;
- presión uniforme calculada por separado bajo cada zapata;
- reacciones positivas en ambas bases.

## Fuentes registradas

| ID | Fuente | Edición y referencia | Uso |
| --- | --- | --- | --- |
| `NEC-SRC-002` | NEC-SE-GC, Geotecnia y Cimentaciones | NEC 2014, secciones 6.4, 7.1, 7.2.1 y 7.3 | Excentricidades, equilibrio de presiones, capacidad admisible externa y asentamientos. |
| `USACE-STRAP-001` | USACE EM 1110-1-1905, *Geotechnical Design of Shallow Foundations on Soils* | 31 julio 2025, párrafo 2-5.d.(2), página impresa 7 | Definición de *strap footing*: dos zapatas, presiones aproximadamente iguales, viga rígida y sin transferencia directa al suelo. |
| `NEC-SRC-004` | Guía práctica de hormigón armado conforme NEC 2015 | Secciones 1.10.1, 1.10.5 y 1.10.6 | Referencia seccional para cortante, flexión, acero y desarrollo; no libera cumplimiento NEC. |
| `AXC-STRAP-001` | Desarrollo propio de estática de AndeLogic | Versión 1, 2026-08-28 | Momento excéntrico, cortante transferido y reacciones de las dos bases. |

## Cadena de cálculo autorizada

Con `e` como distancia entre el centro de la zapata exterior y el centro de su columna, y `S` como distancia entre centros de zapatas:

- `M = Pext × e`
- `Vstrap = M / S`
- `Rext = Pext + Vstrap`
- `Rint = Pint − Vstrap`
- `qext = Rext / Aext`
- `qint = Rint / Aint`

Estas expresiones satisfacen `Rext + Rint = Pext + Pint` y el equilibrio de momentos. Se aplican por separado a cargas de servicio y últimas declaradas. En servicio, los pesos de cada zapata se agregan a su reacción y el peso del tramo libre de la viga se reparte por mitades únicamente para el contacto bruto. No se inventan factores para incorporarlos a la combinación última.

Cada zapata se revisa como una placa rectangular bajo presión uniforme:

- cortante unidireccional a distancia `d` de cada cara;
- flexión en las caras de columna para las proyecciones libres;
- acero requerido, mínimo y colocado en ambas direcciones;
- desarrollo disponible declarado.

La viga centradora se documenta con:

- momento extremo `Mu = Pu,ext × e`;
- cortante transferido `Vu = Mu/S`;
- referencia seccional de cortante;
- acero longitudinal requerido por flexión y acero colocado declarado.

## Revisión pendiente explícita

El punzonamiento alrededor de una columna atravesada por la viga centradora no se presenta como una columna interior aislada. La transferencia de cortante y momento de la viga cruza el perímetro crítico y requiere un modelo de nudo y una referencia específica. Hasta registrarla, la interfaz muestra `Fuera de alcance` para punzonamiento, sin aproximarlo silenciosamente.

También quedan fuera: columna de esquina, excentricidad biaxial, contacto parcial, viga apoyada en suelo, interacción suelo-estructura, asentamientos, diseño de nudos, estribos, anclajes y plano constructivo.

## Caso manual AXC-STRAP-001

Para `Pext = 600 kN`, `Pint = 900 kN`, `e = 0.30 m` y `S = 5.00 m`:

- `M = 180 kN·m`;
- `Vstrap = 36 kN`;
- `Rext = 636 kN`;
- `Rint = 864 kN`;
- `Rext + Rint = 1500 kN`.

Para `Pu,ext = 900 kN` y `Pu,int = 1350 kN`:

- `Mu = 270 kN·m`;
- `Vu = 54 kN`;
- `Ru,ext = 954 kN`;
- `Ru,int = 1296 kN`.

Este caso es una regresión de equilibrio interno. El modelo continúa como referencia en validación hasta completar contrastes externos compatibles.

## Ejemplos rápidos disponibles

- `strap-reference-transfer`: reproducción de `AXC-STRAP-001`.
- `strap-longer-spacing`: mayor separación, cargas y geometría alternativas.
- `strap-interior-reaction-loss`: bloqueo por reacción interior no positiva.

Los ejemplos mantienen expresamente el tramo libre de la viga sin apoyo en el suelo.
