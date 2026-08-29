# Zapata combinada rectangular para dos columnas

## Decisión de alcance

El tercer tipo de cimentación de AndeLogic es una **zapata combinada rectangular para dos columnas interiores alineadas**. Las columnas se ubican sobre el eje transversal de la zapata y transmiten únicamente cargas verticales de servicio y últimas declaradas.

El caso incluido requiere:

- dos columnas rectangulares interiores, separadas y alineadas con el eje longitudinal;
- zapata de ancho, longitud y espesor constantes;
- cargas verticales sin momentos ni fuerzas horizontales transferidas;
- distribución lineal de presión a lo largo de la base;
- contacto completo, sin tracción del suelo;
- hormigón de peso normal para las referencias de resistencia disponibles.

Se bloquean el contacto parcial, levantamiento, columnas de borde o esquina, perímetros de punzonamiento truncados, zapatas trapezoidales, vigas de equilibrio, más de dos columnas, pedestales, asentamientos e interacción suelo-estructura.

## Fuentes registradas antes de implementar

| ID | Fuente | Edición y ubicación | Uso autorizado |
| --- | --- | --- | --- |
| `NEC-SRC-002` | NEC-SE-GC, Geotecnia y Cimentaciones | NEC 2014, PDF oficial local, páginas PDF 48-52; secciones 6.4, 7.1, 7.2.1 y 7.3 | Exigir excentricidad explícita, equilibrio de presiones, capacidad admisible del informe geotécnico y revisión externa de asentamientos. |
| `NEC-SRC-004` | Guía práctica para diseño de hormigón armado conforme NEC 2015 | Guía de diseño 2, secciones 1.10.1 a 1.10.6 | Referencia pública para resistencia seccional, acero y desarrollo; no libera cumplimiento NEC. |
| `AXC-COMB-001` | Desarrollo propio de equilibrio estático de AndeLogic | Versión 1, 2026-08-28 | Presiones lineales, reacciones, cortantes y momentos del modelo rígido de viga. |

La NEC-SE-GC 6.4 exige considerar la excentricidad entre la resultante y el centroide y acepta distribuciones de contacto que satisfagan equilibrio local y general. No prescribe en esas páginas un algoritmo completo de diseño estructural para la zapata combinada. Por ello las demandas siguientes se identifican como equilibrio calculado y las resistencias como referencias de guía en validación.

## Cadena de cálculo autorizada

Con `x` medido desde el extremo izquierdo, `L` longitud, `B` ancho y `xc = L/2`:

1. **Contacto de servicio**
   - `Pserv = P1 + P2 + Wzapata + Wrelleno`
   - `Mserv = P1(x1-xc) + P2(x2-xc)`
   - `eserv = Mserv / Pserv`
   - `qprom = Pserv/(B L)`
   - `qizq = qprom(1 - 6 eserv/L)`
   - `qder = qprom(1 + 6 eserv/L)`
   - La base neta resta uniformemente el esfuerzo geoestático removido a ambos extremos.
   - Se exige `qmin >= 0`; la presión máxima de la base declarada se compara con `qadm`.

2. **Presión última declarada**
   - Repite el equilibrio anterior con `Pu1` y `Pu2`, sin inventar combinaciones ni factores para el peso propio.
   - Se exige contacto completo también para la distribución última.

3. **Viga longitudinal**
   - La reacción ascendente por unidad de longitud es `w(x) = B q(x) = w0 + kx`.
   - `V(x) = w0 x + kx²/2 - ΣPu,i`, incluyendo únicamente las columnas ubicadas a la izquierda de la sección.
   - `M(x) = w0 x²/2 + kx³/6 - ΣPu,i(x-xi)`.
   - Los extremos y raíces de cortante determinan los momentos positivo y negativo gobernantes.

4. **Cortante unidireccional**
   - Longitudinal: valor absoluto de `V(x)` en secciones a distancia `d` de cada cara de columna.
   - Transversal: cada lado trabaja como voladizo desde la cara transversal de la columna, usando la mayor presión última local.
   - La resistencia se compara con la referencia de la Guía NEC 2015, sección 1.10.1.

5. **Flexión y acero**
   - Longitudinal: máximo momento positivo para acero inferior y valor absoluto del mínimo negativo para acero superior.
   - Transversal por metro: `Mu = qlocal a²/2`, con `a = (B-c)/2`.
   - El acero requerido y mínimo usa la referencia pública de la sección 1.10.5; el colocado se obtiene de diámetro y separación declarados.

6. **Punzonamiento por columna**
   - El perímetro completo se ubica a `d/2` de las caras.
   - `Vu,i = max(Pu,i - Rinterior,i, 0)`, integrando la presión lineal dentro del área crítica.
   - La resistencia conserva las alternativas de las secciones 1.10.2 a 1.10.4 para columna interior. Un perímetro que alcance un borde queda fuera de alcance.

7. **Desarrollo**
   - La longitud requerida y su comparación usan la referencia de la sección 1.10.6 con los factores unitarios ya declarados por el perfil.

## Caso manual de regresión AXC-COMB-001

Para `B = 2.00 m`, `L = 6.00 m`, columnas cuadradas de `0.40 m` en `x1 = 1.00 m` y `x2 = 5.00 m`, `Pserv,1 = Pserv,2 = 600 kN`, `Pu,1 = Pu,2 = 900 kN`, `h = 0.50 m`, peso del hormigón `24 kN/m³` y sin relleno:

- `Wzapata = 144 kN`, `Pserv = 1344 kN` y `qserv = 112 kPa` uniforme;
- `qu = 150 kPa` uniforme y `w = 300 kN/m`;
- `V(6 m) = 0` y `M(6 m) = 0` por equilibrio;
- `M(1 m) = M(5 m) = +150 kN·m`;
- `M(3 m) = -450 kN·m`, valor longitudinal gobernante.

Estas cifras son un desarrollo independiente de estática y se usan como regresión interna. Aún se requieren contrastes externos compatibles antes de elevar el estado técnico de la tipología.

