# Fichas de implementación de Axel Code

## Propósito

Este documento recibe criterios técnicos redactados y aprobados por Axel Hernández como autor del proyecto. No debe contener páginas copiadas, comentarios, tablas, imágenes ni texto de normas de terceros.

Cada ficha cerrada se convierte en:

- una función pura del motor;
- validación explícita de entradas y alcance;
- pruebas de aprobación, falla, borde y unidades;
- resultados intermedios auditables;
- representación gráfica e informe.

## Estado de las fichas

| ID | Módulo | Estado del criterio | Estado del código |
| --- | --- | --- | --- |
| AXC-FTG-001 | Presión de contacto de servicio | Base pública documentada; pendiente de casos propios | Implementado como contacto centrado de servicio |
| AXC-FTG-002 | Cortante unidireccional | Demanda física documentada; resistencia pendiente | Demanda implementada en ambos ejes |
| AXC-FTG-003 | Punzonamiento | Demanda física con perímetro declarado; resistencia pendiente | Demanda y gráfica implementadas |
| AXC-FTG-004 | Flexión | Demanda física en la cara de columna; resistencia pendiente | Demanda y diagrama implementados |
| AXC-FTG-005 | Refuerzo y desarrollo | Referencia pública parcial localizada; diseño completo pendiente | Acero mínimo y acero requerido de guía implementados; desarrollo pendiente |
| AXC-FTG-006 | Resistencia a cortante unidireccional | Referencia pública parcial localizada; otros casos pendientes | Motor y resultado de referencia integrados; validación completa pendiente |
| AXC-FTG-007 | Resistencia a punzonamiento | Referencia pública parcial localizada; solo columna interior centrada | Motor y resultado de referencia integrados; validación completa pendiente |
| AXC-FTG-008 | Longitud de desarrollo | Referencia pública parcial localizada; largo disponible debe ser declarado | Motor y resultado de referencia integrados; validación completa pendiente |

## Plantilla obligatoria

Copiar esta plantilla debajo de la ficha correspondiente y completar todos los campos en palabras propias.

```text
ID:
Nombre del módulo:
Versión del criterio Axel Code:
Fecha de revisión:

Objetivo físico:
Tipo de zapata permitido:
Casos excluidos:

Entradas y unidades:
- nombre:
  símbolo:
  unidad canónica:
  rango permitido:
  origen del dato:

Procedimiento definido por Axel:
1.
2.
3.

Ecuaciones autorizadas para implementar:
- identificador:
  expresión:
  definición de variables:
  condiciones de aplicación:

Estados del resultado:
- aprueba cuando:
- falla cuando:
- advertencia cuando:
- fuera de alcance cuando:

Redondeo de presentación:
Supuestos visibles en el informe:

Caso de aprobación:
- entradas:
- resultados intermedios esperados:
- resultado final esperado:
- tolerancia:

Caso de falla:
- entradas:
- resultado esperado:
- tolerancia:

Firma de revisión: Axel Hernández
```

## Primera ficha: AXC-FTG-001

Para completar presión de contacto necesitamos decidir expresamente:

1. Si la capacidad admisible ingresada es bruta o neta.
2. Qué combinaciones o cargas de servicio entran al cálculo geotécnico.
3. Si se incluye peso propio de la zapata, pedestal, relleno y sobrecarga.
4. Qué densidades son entradas obligatorias y cuáles no aplican.
5. Cómo se trata el nivel freático dentro del alcance inicial.
6. Fórmula para presión uniforme con columna centrada.
7. Criterio de aprobación frente a la capacidad admisible.
8. Un caso numérico completo calculado y revisado por Axel.

La primera implementación ya calcula la presión bruta con carga de servicio, peso propio y relleno declarado; y la presión neta al descontar el esfuerzo removido que ingrese el usuario. Se debe confirmar que la capacidad del informe use la misma base antes de comparar. La primera versión excluye momentos y excentricidades.

## Segunda ficha: AXC-FTG-002 — demanda de cortante unidireccional

La implementación interna calcula la acción por equilibrio para una zapata rectangular centrada sometida a presión última uniforme:

- recibe la carga axial última como dato declarado; no construye combinaciones de carga;
- calcula la profundidad efectiva geométrica con espesor, recubrimiento inferior y medio diámetro de barra;
- evalúa secciones en las dos direcciones a una distancia `d` desde la cara correspondiente de la columna;
- integra la presión uniforme sobre el área exterior a cada sección y reporta la demanda gobernante;
- muestra voladizo, longitud exterior cargada, área tributaria y cortante sin redondear internamente.

Este estado no calcula resistencia del hormigón, factor de reducción, utilización ni aprobación normativa. La ubicación normativa de la sección y la resistencia deben cerrarse en el perfil NEC antes de habilitar una comprobación `cumple/no cumple`.

Caso interno de equilibrio: `Pu = 900 kN`, zapata `2.00 × 3.00 m`, columna `0.40 × 0.60 m`, `h = 0.50 m`, recubrimiento `0.075 m` y barra `0.016 m`. Resulta `qᵤ = 150 kPa`, `d = 0.417 m`, `Vᵤ,B = 172.35 kN` y `Vᵤ,L = 234.90 kN`. Pendiente de revisión de Axel y contraste externo compatible.

## Tercera ficha: AXC-FTG-003 — demanda de punzonamiento

La implementación recibe la distancia de la sección crítica desde la cara de la columna como una hipótesis explícita. Con presión última uniforme, forma un perímetro rectangular, calcula su área interior y toma como demanda la reacción del suelo sobre el área exterior. El perímetro debe permanecer completamente dentro de la zapata.

No calcula resistencia, factores, tensión resistente ni resultado de aprobación. La referencia de la sección crítica y el método de resistencia deben cerrarse con fuentes NEC públicas antes de habilitar un resultado normativo.

Caso interno: `Pu = 900 kN`, zapata `2.00 × 3.00 m`, columna `0.40 × 0.60 m` y distancia declarada `0.2085 m`. Resulta `b₀ = 3.668 m`, área exterior `5.169111 m²` y `Vᵤ = 775.36665 kN`.

## Cuarta ficha: AXC-FTG-004 — demanda de flexión

La implementación trata cada proyección exterior a la cara de la columna como un voladizo bajo presión última uniforme. Calcula el momento en ambas direcciones y muestra un diagrama comparativo. No incluye peso de acero, diseño de sección, cuantía mínima, resistencia nominal ni factores.

Caso interno: `Pu = 900 kN`, zapata `2.00 × 3.00 m` y columna `0.40 × 0.60 m`. Resulta `qᵤ = 150 kPa`, `Mᵤ,B = 144 kN·m` y `Mᵤ,L = 216 kN·m`.

### Procedencia pública inicial

- NEC-SE-GC 2014, secciones 6.1 y 7.2.1: la cimentación transfiere cargas al subsuelo; la capacidad admisible debe constar en el informe geotécnico y puede expresarse en base neta o incorporando el esfuerzo geoestático removido.
- El módulo no estima `qadm`, asentamientos ni parámetros de suelo: esos datos siguen siendo entradas declaradas del proyecto.

## Regla de procedencia

Las fichas pueden citar el número de una norma consultada por Axel para trazabilidad, pero el repositorio solo conserva su criterio técnico original, las ecuaciones autorizadas para el software y los casos numéricos revisados. El material protegido permanece fuera del repositorio y no se procesa automáticamente.

## Quinta ficha: AXC-FTG-005 — acero mínimo de referencia

La aplicación compara el acero inferior declarado por metro en cada dirección con el mínimo ilustrado en el ejemplo de zapatas de la *Guía práctica para el diseño de estructuras de hormigón armado de conformidad con NEC 2015*, sección 1.10.5. La guía muestra el valor `Amin = 0.0018 × b × h`; el motor lo aplica con una franja de un metro y expresa ambos resultados en cm²/m.

La salida se denomina deliberadamente **referencia de guía**. No constituye una verificación NEC completa: no dimensiona el acero requerido por flexión, no verifica resistencia, cuantía máxima, separación normativa, longitud de desarrollo ni anclaje. Cada una de esas comprobaciones requiere su propia ficha, fuente exacta, límites de aplicación y casos independientes.

La segunda parte de esta ficha reproduce la expresión de acero requerido mostrada en el mismo ejemplo para una sección rectangular. Las entradas obligatorias son el momento último de cada franja, el ancho de esa franja, la profundidad efectiva, `f′c` y `fy`; el factor de reducción usado es el que presenta la guía en ese desarrollo. El motor normaliza el resultado a cm²/m, comprueba si la raíz tiene solución real y marca una sección insuficiente cuando no la tiene. No adopta automáticamente un nuevo espesor ni cambia barras.

La comparación integrada exige, por cada dirección, el mayor valor entre el mínimo y el requerido de referencia, y lo confronta con el acero obtenido de la distribución geométrica real de diámetro y separación máxima declarados. Es una síntesis de resultados existentes; no habilita una aprobación normativa ni reemplaza las revisiones pendientes de corte, resistencia y desarrollo.

## Sexta ficha: AXC-FTG-006 — resistencia a cortante unidireccional de referencia

La guía práctica NEC 2015, sección 1.10.1, presenta una comprobación por tensión de cortante en una sección a profundidad efectiva de la cara de columna. El motor aplica esa expresión únicamente a la demanda uniforme ya calculada por AndeLogic, con hormigón de peso normal, y compara cada dirección contra la resistencia de referencia reducida que muestra el ejemplo. Las entradas visibles son `f′c`, `d`, ancho de la sección y demanda última.

Este resultado no cubre presión trapezoidal, excentricidad, carga sísmica, armadura de cortante, otras condiciones de material ni todos los requisitos de la NEC. Está disponible en la interfaz como referencia de guía, acompañado de sus límites; no habilita un resultado normativo.

## Séptima ficha: AXC-FTG-007 — resistencia a punzonamiento de referencia

La guía práctica NEC 2015, secciones 1.10.2 a 1.10.4, presenta alternativas de resistencia para el perímetro crítico de una columna interior. El módulo inicial solo acepta una columna rectangular centrada, una presión última uniforme y hormigón de peso normal. Forma el perímetro a una mitad de la profundidad efectiva desde las caras de la columna y toma el menor resultado de las alternativas que la guía muestra para ese caso.

Se bloquean expresamente la excentricidad, los momentos transmitidos, columnas de borde o esquina, hormigón liviano, presión no uniforme y cualquier interpretación fuera de ese ejemplo. El resultado será una referencia de guía hasta completar contrastes y la matriz NEC.

## Octava ficha: AXC-FTG-008 — longitud de desarrollo a tracción de referencia

La guía práctica NEC 2015, sección 1.10.6, presenta una expresión de desarrollo a tracción y ejemplifica barras sin recubrimiento especial, hormigón de peso normal y coeficientes de modificación unitarios. El módulo inicial aplicará solamente ese caso y comparará la longitud requerida con el largo disponible declarado por el usuario para cada dirección.

El largo disponible no se infiere automáticamente de la zapata: debe especificarse desde la cara o sección que el detalle técnico determine hasta el extremo efectivo de la barra. Quedan fuera del módulo inicial barras con recubrimiento especial, hormigón liviano, ganchos, patillas, empalmes, barras superiores y cualquier condición de detalle no declarada.

## Novena ficha: AXC-CORNER-DER-001 — contacto completo biaxial

La ficha completa se conserva en `22-corner-biaxial-footing-scope.md`. Para una base rectangular rígida sometida a carga axial desplazada en X y Y, la presión se representa mediante un plano que satisface fuerza vertical y los dos momentos. Las cuatro esquinas se calculan con `q = q̄[1 + sx·6ex/L + sy·6ey/B]`.

La condición autorizada para contacto completo es `6|ex|/L + 6|ey|/B ≤ 1`. No se permite sustituirla por dos comprobaciones independientes de `L/6` y `B/6`. El caso `AXC-CORNER-001`, su espejo y el bloqueo por interacción mayor que uno están automatizados. El contacto parcial, el análisis de placa y el punzonamiento de esquina permanecen fuera de alcance.

## Décima ficha: AXC-MAT-DER-001 — losa rígida multicolumna

La ficha completa está en `23-mat-foundation-scope.md`. Para una losa rectangular rígida, cada columna aporta carga y dos momentos respecto del centroide. El plano `q(x,y)=P/A+My(x−L/2)/Iy+Mx(y−B/2)/Ix` recupera exactamente la fuerza vertical y ambos momentos, siempre que las cuatro esquinas permanezcan comprimidas.

Cuando el usuario declara un módulo de balasto compatible, la pantalla preliminar calcula `s=q/k` en las cuatro esquinas y compara límites externos opcionales. FHWA NHI-06-089, sección 8.6, advierte que `k` depende del suelo y también de la cimentación; por eso no se deriva ni se presenta como propiedad universal. El caso `AXC-MAT-001`, la simetría multicolumna, la geometría inválida y la pérdida de contacto están automatizados. Flexión, cortante, punzonamiento y armado de placa permanecen `not-evaluated`.
