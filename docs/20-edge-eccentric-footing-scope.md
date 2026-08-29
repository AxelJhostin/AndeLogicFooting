# Zapata aislada excéntrica de borde sin viga centradora

## Decisión de alcance

El sexto modelo de AndeLogic es una **zapata aislada rectangular con una columna alineada a un borde**, sin viga centradora. La columna queda centrada en la dirección transversal y una de sus caras coincide con el borde exterior de la zapata. La orientación izquierda o derecha es una entrada explícita y ambos casos son imágenes especulares.

El caso incluido requiere:

- una columna rectangular completamente apoyada, con una cara alineada al borde exterior;
- carga vertical de servicio y carga última declaradas, sin momento transferido adicional ni fuerza horizontal;
- excentricidad únicamente en el eje longitudinal, producida por la posición de la columna;
- zapata rectangular de espesor constante;
- presión de contacto longitudinal lineal y uniforme transversalmente;
- compresión en toda la base, con la resultante dentro del tercio central;
- columna centrada en el ancho transversal.

No se aproxima contacto parcial. Si una presión extrema resulta negativa, el motor bloquea el caso.

## Fuentes registradas

| ID | Fuente | Edición y referencia | Uso |
| --- | --- | --- | --- |
| `NEC-SRC-002` | NEC-SE-GC, Geotecnia y Cimentaciones | NEC 2014, secciones 6.4, 7.1, 7.2.1 y 7.3 | Excentricidad, equilibrio de presiones, capacidad admisible externa y asentamientos. |
| `PUB-SRC-008` | USACE EM 1110-1-1905, *Geotechnical Design of Shallow Foundations on Soils* | 31 julio 2025, capítulo 5, párrafos 5-2 y 5-4 | Reconoce acciones verticales y momentos, exige incluir el peso de la cimentación y trata parámetros equivalentes para cimentaciones excéntricas. |
| `NEC-SRC-004` | Guía práctica de hormigón armado conforme NEC 2015 | Secciones 1.10.1, 1.10.5 y 1.10.6 | Referencia seccional para cortante, flexión, acero y desarrollo; no libera cumplimiento NEC. |
| `AXC-ECC-001` | Desarrollo propio de estática de AndeLogic | Versión 1, 2026-08-29 | Presión lineal, integración de reacción, cortante y momento para contacto completo. |

USACE se usa como fuente técnica pública complementaria y no como normativa ecuatoriana. La presión y las demandas son resultados de equilibrio. Las resistencias se mantienen como referencias de guía en validación.

## Geometría y contacto autorizados

Con `x` desde el borde izquierdo, longitud excéntrica `L`, ancho transversal `B` y centroide `xc=L/2`, la posición de la columna es:

- borde izquierdo: `xp = cL/2`;
- borde derecho: `xp = L-cL/2`.

Para una carga vertical total `P` y momento respecto del centroide `M=Pcol(xp-xc)`:

- `e=M/P`;
- `qprom=P/(B L)`;
- `qizq=qprom(1-6e/L)`;
- `qder=qprom(1+6e/L)`;
- `q(x)=qizq+(qder-qizq)x/L`.

En servicio, `P` incluye la carga de columna, peso propio y relleno; los pesos distribuidos actúan en el centroide y no añaden momento. En la combinación última se usa únicamente la carga última declarada, sin inventar factores para pesos permanentes.

Se exige `|e| <= L/6`, `qizq >= 0` y `qder >= 0` tanto en servicio como en la combinación última. La comparación bruta o neta se realiza en ambos extremos contra la capacidad admisible declarada.

## Demandas estructurales

La reacción ascendente por unidad longitudinal es `w(x)=Bq(x)=w0+kx`. Para una única carga puntual última en `xp`:

- `V(x)=w0x+kx²/2-Pu` cuando `x>=xp`;
- `M(x)=w0x²/2+kx³/6-Pu(x-xp)` cuando `x>=xp`.

Antes de la columna se omite el término de `Pu`. El motor comprueba `V(L)=0` y `M(L)=0`, localiza las raíces de cortante y evalúa las secciones a distancia `d` de las caras que permanezcan dentro de la zapata.

La flexión longitudinal se obtiene integrando cada voladizo hasta su cara de columna. En la dirección transversal se integra `q(x)` a lo largo de `L` y se trata cada lado como un voladizo desde la cara transversal de la columna. El cortante, acero y desarrollo utilizan los módulos públicos de referencia ya registrados.

## Punzonamiento de borde

La cara exterior de la columna coincide con el borde de la zapata, por lo que el perímetro crítico no es el perímetro cerrado de una columna interior. AndeLogic mostrará el punzonamiento como **no evaluado** en este modelo hasta registrar una fuente específica, sus coeficientes, geometría del perímetro y casos independientes. No se reutiliza silenciosamente la resistencia de columna interior.

## Caso manual AXC-ECC-001

Para borde izquierdo, `B=2.40 m`, `L=0.60 m`, columna `0.40 × 0.45 m`, `Pserv=160 kN`, `Pu=240 kN`, `h=0.50 m`, `γc=24 kN/m³` y sin relleno:

- `A=1.44 m²`;
- `xp=0.225 m`, `xc=0.300 m`;
- `Wz=17.28 kN`, `Pserv,total=177.28 kN`;
- `Mserv=-12.00 kN·m`, `eserv=-0.067690 m`;
- `qserv,izq=206.444444 kPa`, `qserv,der=39.777778 kPa`;
- `eu=-0.075 m`, menor que `L/6=0.100 m`;
- `qu,izq=291.666667 kPa`, `qu,der=41.666667 kPa`;
- `V(L)=0` y `M(L)=0`.

El caso derecho debe producir las mismas magnitudes con las presiones extremas intercambiadas.

## Exclusiones

Quedan fuera: contacto parcial, resultante fuera del tercio central, momento adicional transmitido por la columna, excentricidad biaxial, columna de esquina, columna separada del borde, fuerza horizontal, deslizamiento, volcamiento independiente, punzonamiento de borde, asentamientos, interacción suelo-estructura, espesor variable y detalle constructivo definitivo.
