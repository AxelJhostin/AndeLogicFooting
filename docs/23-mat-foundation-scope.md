# Losa de cimentación rectangular · evaluación rígida–Winkler preliminar

## Estado

Alcance técnico cerrado para la primera implementación. Caso manual: `AXC-MAT-001`. Derivación de equilibrio: `AXC-MAT-DER-001`.

## Modelo incluido

- losa rectangular rígida de dimensiones `B × L` y espesor constante;
- entre 2 y 24 columnas rectangulares, completamente contenidas y sin superposición;
- cargas axiales verticales de servicio y últimas declaradas por columna;
- peso propio y relleno uniforme centrados en servicio;
- plano lineal de presión que satisface fuerza vertical y los dos momentos;
- contacto completo en las cuatro esquinas y comparación bruta o neta con capacidad admisible externa;
- proyecciones globales de equilibrio en X y Y, sin interpretarlas como diseño de franjas de placa;
- estimación rígida–Winkler de asentamiento por `s=q/k`, únicamente cuando el usuario declara `k` y la base de presión aplicable;
- comparación opcional con límites de asentamiento total y diferencial declarados por el estudio geotécnico.

## Fuente pública y límites

La referencia pública principal es **FHWA NHI-06-089, Soils and Foundations Reference Manual, Vol. II**, secciones 2.6, 6.6 y 8.6: una losa soporta múltiples columnas o muros; debe revisar capacidad y asentamientos; las deformaciones suelen controlar; y un enfoque común usa una cimentación Winkler con `q = k·s`. La misma fuente advierte que `k` no es una propiedad intrínseca y depende también de rigidez, forma y profundidad. PDF oficial: <https://www.fhwa.dot.gov/engineering/geotech/pubs/010943.pdf>.

La **NEC-SE-GC 2014**, secciones 6.4 y 7, aporta el marco ecuatoriano para excentricidad, equilibrio, capacidad y losas de cimentación. La capacidad admisible, el módulo de balasto y los límites de asentamiento son entradas externas; AndeLogic no los genera.

Quedan expresamente fuera:

- flexión, cortante y armado de placa;
- punzonamiento por columna;
- rigidez finita, resortes no uniformes, elementos finitos e interacción suelo-estructura avanzada;
- muros, cargas distribuidas, momentos de columna, fuerzas horizontales, torsión y sismo;
- contacto parcial, levantamiento, no linealidad y consolidación calculada internamente;
- losas sobre pilotes, cabezales, capiteles, pedestales, vigas embebidas y espesor variable.

Estos límites aparecen como resultados `not-evaluated`, no como verificaciones omitidas silenciosamente.

## Derivación AXC-MAT-DER-001

Para el centroide `(L/2,B/2)` y columnas `i` en `(xi,yi)`:

```text
P = ΣPi + cargas centradas
My = ΣPi(xi−L/2)
Mx = ΣPi(yi−B/2)
ex = My/P
ey = Mx/P
q(x,y) = P/A + My(x−L/2)/Iy + Mx(y−B/2)/Ix
A = B·L; Iy=B·L³/12; Ix=L·B³/12
```

Las cuatro esquinas usan `q=q̄[1+sx·6ex/L+sy·6ey/B]`. El contacto completo exige `6|ex|/L+6|ey|/B≤1`.

Para un módulo de balasto declarado `k`:

```text
s(x,y)=qseleccionada(x,y)/k
```

La estimación es una pantalla rígida preliminar. No representa deformación de placa ni asentamiento geotécnico estratificado.

## Caso manual AXC-MAT-001

```text
L=8.00 m; B=6.00 m; h=0.70 m; γc=24 kN/m³
qadm,bruta=150 kPa; k=15000 kN/m³
columnas:
C1 (x=2.0,y=1.5): Ps=600 kN, Pu=900 kN
C2 (x=6.0,y=1.5): Ps=800 kN, Pu=1200 kN
C3 (x=2.0,y=4.5): Ps=700 kN, Pu=1050 kN
C4 (x=6.0,y=4.5): Ps=900 kN, Pu=1350 kN
```

Servicio:

```text
A=48.000 m²; W=806.400 kN; P=3806.400 kN
My=800.000 kN·m; Mx=300.000 kN·m
ex=0.210172 m; ey=0.078815 m; κ=0.236444
q̄=79.300 kPa
qBL=60.550; qBR=85.550; qTL=73.050; qTR=98.050 kPa
utilización=98.05/150=0.653667
smax=6.536667 mm; smin=4.036667 mm; Δs=2.500000 mm
```

Última declarada:

```text
P=4500.000 kN; My=1200.000 kN·m; Mx=450.000 kN·m
ex=0.266667 m; ey=0.100000 m; κ=0.300000
qBL=65.625; qBR=103.125; qTL=84.375; qTR=121.875 kPa
```

## Criterios de aceptación

1. Reproducir todos los valores de `AXC-MAT-001` y cerrar fuerza y dos momentos.
2. Permitir agregar, editar y retirar columnas sin fórmulas en React.
3. Bloquear columnas fuera de la losa, superpuestas, IDs repetidos y contacto parcial.
4. Informar asentamiento como no evaluado cuando `k=0`.
5. Marcar placa, punzonamiento y armado como no evaluados en resultados y memoria.
6. Ofrecer referencia, variación simétrica y bloqueo biaxial como ejemplos rápidos.

