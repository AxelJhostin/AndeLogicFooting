# Zapata combinada trapezoidal para dos columnas

## Decisión de alcance

El quinto modelo de AndeLogic es una **zapata combinada trapezoidal**, simétrica respecto de su eje longitudinal y con dos columnas interiores alineadas sobre ese eje. El ancho cambia linealmente desde `B1` en el extremo izquierdo hasta `B2` en el extremo derecho.

El caso incluido requiere:

- dos columnas rectangulares interiores, separadas y alineadas;
- planta trapezoidal con lados longitudinales rectos y anchos extremos positivos;
- espesor constante;
- cargas verticales declaradas, sin momentos ni fuerzas horizontales;
- presión de contacto lineal en la dirección longitudinal y uniforme transversalmente en cada sección;
- contacto completo, sin tracción del suelo;
- perímetros completos de punzonamiento contenidos dentro del trapecio.

## Fuentes registradas

| ID | Fuente | Edición y referencia | Uso |
| --- | --- | --- | --- |
| `NEC-SRC-002` | NEC-SE-GC, Geotecnia y Cimentaciones | NEC 2014, secciones 6.4, 7.1, 7.2.1 y 7.3 | Equilibrio, excentricidad, capacidad admisible externa y asentamientos. |
| `USACE-COMB-002` | USACE EM 1110-1-1905, *Geotechnical Design of Shallow Foundations on Soils* | 31 julio 2025, 2-5.d.(1) | Reconoce zapatas combinadas rectangulares, trapezoidales o en T y relaciona presión uniforme con coincidencia de centroides. |
| `NEC-SRC-004` | Guía práctica de hormigón armado conforme NEC 2015 | Secciones 1.10.1 a 1.10.6 | Referencia seccional para cortante, punzonamiento, flexión, acero y desarrollo. |
| `AXC-TRAP-001` | Desarrollo propio de estática de AndeLogic | Versión 1, 2026-08-29 | Propiedades del trapecio, presión lineal y viga longitudinal con carga cuadrática. |

USACE se usa como fuente técnica pública complementaria y no como normativa ecuatoriana. Las resistencias continúan identificadas como referencias de guía en validación.

## Geometría y presión autorizadas

Con `x` desde el extremo izquierdo y ancho local `B(x) = B1 + kB x`, donde `kB = (B2-B1)/L`:

- `A = ∫B(x)dx = L(B1+B2)/2`
- `Q = ∫xB(x)dx = B1L²/2 + kB L³/3`
- `J = ∫x²B(x)dx = B1L³/3 + kB L⁴/4`
- `x̄ = Q/A`

La presión longitudinal se representa como `q(x)=a+bx`. Sus coeficientes se obtienen sin aproximación resolviendo:

- `aA + bQ = P`
- `aQ + bJ = M0`

`P` es la carga vertical total y `M0` su momento respecto al extremo izquierdo. Para servicio, el peso propio y el relleno actúan en el centroide geométrico. Para la combinación última se usan únicamente las cargas últimas declaradas, sin inventar factores.

Se exige `q(0) >= 0` y `q(L) >= 0`. La comparación bruta o neta se realiza en ambos extremos contra la capacidad admisible declarada.

## Viga longitudinal y revisiones locales

La reacción ascendente por unidad de longitud es:

- `w(x)=q(x)B(x)=c0+c1x+c2x²`
- `V(x)=c0x+c1x²/2+c2x³/3−ΣPu,i`
- `M(x)=c0x²/2+c1x³/6+c2x⁴/12−ΣPu,i(x−xi)`

Los extremos, centros de columna y raíces de cortante determinan los momentos gobernantes. El cortante longitudinal se revisa a distancia `d` de cada cara usando el ancho local de la sección.

En cada columna, la dirección transversal se trata como dos voladizos desde la cara de la columna con ancho local `B(xi)`. El punzonamiento integra la presión lineal dentro del perímetro crítico y se bloquea si ese perímetro sale de los bordes inclinados.

## Caso manual AXC-TRAP-001

Para `B1=1.50 m`, `B2=2.50 m`, `L=6.00 m`:

- `A=12.00 m²`;
- `x̄=3.25 m`.

Con columnas en `x1=0.75 m` y `x2=5.0357142857 m`, cargas de servicio `P1=500 kN`, `P2=700 kN`, cargas últimas `Pu1=750 kN`, `Pu2=1050 kN`, `h=0.50 m`, `γc=24 kN/m³` y sin relleno:

- la resultante de las columnas coincide con `x̄=3.25 m`;
- `Wz=144 kN` y `Pserv=1344 kN`;
- `qserv=112 kPa` uniforme;
- `qu=150 kPa` uniforme;
- `V(L)=0` y `M(L)=0`.

El motor incluye además casos no coincidentes, para los cuales obtiene una presión lineal por equilibrio siempre que toda la base permanezca comprimida.

## Exclusiones

Quedan fuera: contacto parcial, columnas de borde o esquina, momentos transferidos, fuerzas horizontales, trapecios asimétricos respecto del eje longitudinal, espesor variable, más de dos columnas, losas, asentamientos e interacción suelo-estructura.

## Ejemplos rápidos disponibles

- `trapezoidal-reference-centroid`: reproducción uniforme de `AXC-TRAP-001`.
- `trapezoidal-linear-pressure`: segunda columna gobernante y presión creciente.
- `trapezoidal-contact-loss`: bloqueo por presión extrema negativa.

La variación demuestra que el motor resuelve `q(x)` por equilibrio y no presupone presión uniforme.
