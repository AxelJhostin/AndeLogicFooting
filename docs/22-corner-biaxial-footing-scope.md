# Zapata de esquina con excentricidad biaxial

## Estado

Alcance técnico cerrado para la primera implementación. Este documento es la ficha previa obligatoria de la fórmula y del caso manual `AXC-CORNER-001`.

## Modelo incluido

- base rectangular rígida de dimensiones `B × L` y espesor constante;
- una columna rectangular con dos caras coincidentes con dos bordes adyacentes de la base;
- cuatro orientaciones: inferior izquierda, inferior derecha, superior izquierda y superior derecha;
- carga axial vertical declarada en servicio y carga axial vertical última declarada;
- peso propio de la zapata y relleno uniforme centrado únicamente en contacto de servicio;
- presión plana lineal sobre toda la base, obtenida por equilibrio de fuerza y de los dos momentos;
- comparación bruta o neta con una capacidad admisible declarada externamente;
- demandas direccionales de cortante unidireccional y flexión mediante integración de la presión plana en franjas completas;
- armado mínimo, acero requerido y desarrollo como referencias públicas trazables.

## Límites y bloqueo seguro

- El modelo exige compresión en las cuatro esquinas, tanto en servicio como en la combinación última declarada.
- El contacto parcial, el levantamiento, la redistribución no lineal y la interacción suelo-estructura no se aproximan: el caso se bloquea.
- No se generan combinaciones ni factores de carga.
- No se admiten momentos adicionales de columna, fuerzas horizontales ni torsión.
- El punzonamiento de esquina se informa como `no evaluado`: el perímetro está truncado en dos direcciones y no se reutiliza la referencia de columna interior o de borde.
- Las demandas direccionales integran franjas completas y no sustituyen un análisis de placa cuando este sea exigible.
- La capacidad admisible y los asentamientos siguen siendo datos o revisiones del estudio geotécnico aplicable.

## Fuentes y derivación registrada

### Fuente geotécnica pública

- **FHWA NHI-06-089, Soils and Foundations Reference Manual, Vol. II, 2006**, sección 6.4.1: define `e = M/V`, las dimensiones efectivas `B′ = B − 2eB`, `L′ = L − 2eL` y `A′ = B′L′` para excentricidad en dos direcciones; también establece que, para una zapata sobre suelo, la excentricidad debe conservar presión de compresión en la base. PDF oficial: <https://www.fhwa.dot.gov/engineering/geotech/pubs/010943.pdf>.
- **FHWA NHI-06-089**, sección 6.6: documenta el enfoque práctico de base rígida con distribución lineal de presiones para el análisis estructural.

### Fuente ecuatoriana pública

- **NEC-SE-GC 2014**, secciones 6.4, 7.1, 7.2.1 y 7.3: requisitos geotécnicos de cimentaciones superficiales, consideración de excentricidad, estado límite de falla y presiones de contacto. Copia oficial registrada en `docs/11-local-nec-reference-manifest.md`.

### Derivación propia identificada

Identificador: **AXC-CORNER-DER-001**.

Para coordenadas centradas `ξ = x − L/2`, `η = y − B/2`, una base rectangular rígida y contacto completo:

```text
q(x,y) = P/A + My·ξ/Iy + Mx·η/Ix
A = B·L
Iy = B·L³/12
Ix = L·B³/12
ex = My/P
ey = Mx/P
```

La expresión satisface por integración `∫A q dA = P`, `∫A q·ξ dA = My` y `∫A q·η dA = Mx`. En las cuatro esquinas:

```text
q(sx,sy) = q̄ [1 + sx·6ex/L + sy·6ey/B],  sx,sy ∈ {−1,+1}
```

Por tanto, la condición biaxial de núcleo central rectangular es:

```text
6|ex|/L + 6|ey|/B ≤ 1
```

No es correcto verificar únicamente `|ex| ≤ L/6` y `|ey| ≤ B/6` por separado. La interacción aditiva controla la esquina de presión mínima.

Las cargas centradas adicionales de servicio modifican `P`, pero no `Mx` ni `My`. Para la carga de columna situada en `(xp, yp)`:

```text
My = Pcol(xp − L/2)
Mx = Pcol(yp − B/2)
```

## Caso manual AXC-CORNER-001

### Entradas

```text
B = 0.525 m                 L = 0.525 m
cB = 0.450 m               cL = 0.450 m
esquina = inferior izquierda
h = 0.500 m                γc = 24 kN/m³
Pserv = 40 kN              Pu = 60 kN
relleno = 0
qadm,bruta = 450 kPa
```

La columna tiene centro `xp = yp = 0.225 m`; el centroide de la base está en `0.2625 m` en ambos ejes.

### Servicio

```text
A = 0.525·0.525 = 0.275625 m²
Wz = 0.275625·0.500·24 = 3.307500 kN
P = 40 + 3.307500 = 43.307500 kN
My = Mx = 40(0.225 − 0.2625) = −1.500000 kN·m
ex = ey = −1.5/43.3075 = −0.034636 m
q̄ = 43.3075/0.275625 = 157.124717 kPa
6|ex|/L + 6|ey|/B = 0.791681
margen de núcleo = 1 − 0.791681 = 0.208319
```

Presiones brutas de servicio:

```text
inferior izquierda = 281.517331 kPa
inferior derecha   = 157.124717 kPa
superior izquierda = 157.124717 kPa
superior derecha   = 32.732102 kPa
```

La presión máxima utiliza `281.517331/450 = 0.625594`, por lo que el contacto queda dentro de la capacidad declarada.

### Última declarada

```text
P = 60 kN
My = Mx = 60(0.225 − 0.2625) = −2.250000 kN·m
ex = ey = −0.037500 m
q̄u = 60/0.275625 = 217.687075 kPa
6|ex|/L + 6|ey|/B = 0.857143
margen de núcleo = 0.142857
```

Presiones últimas:

```text
inferior izquierda = 404.275996 kPa
inferior derecha   = 217.687075 kPa
superior izquierda = 217.687075 kPa
superior derecha   = 31.098154 kPa
```

Comprobaciones de equilibrio esperadas: reacción integrada `60.000000 kN`, momento integrado en `x` `−2.250000 kN·m` y momento integrado en `y` `−2.250000 kN·m`.

## Criterios de aceptación

1. `AXC-CORNER-001` reproduce área, pesos, momentos, excentricidades, interacción del núcleo y cuatro presiones dentro de tolerancia numérica.
2. El caso espejo intercambia las esquinas sin cambiar presión mínima, máxima ni utilización.
3. Un caso que cumple cada límite uniaxial por separado pero viola la interacción biaxial debe bloquearse.
4. Un proyecto anterior a este modelo se normaliza con entradas predeterminadas sin perder sus demás datos.
5. La memoria muestra fórmula, sustitución y resultado de las cuatro presiones, además de la suma de la interacción biaxial.
6. La interfaz ofrece tres ejemplos: referencia, espejo y bloqueo por pérdida de contacto.

