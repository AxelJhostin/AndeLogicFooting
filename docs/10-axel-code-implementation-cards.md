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
| AXC-FTG-005 | Refuerzo y desarrollo | Por redactar | No implementado |

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
