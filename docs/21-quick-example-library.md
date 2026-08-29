# Biblioteca de ejemplos rápidos

## Propósito

La biblioteca permite probar todos los modelos activos sin llenar formularios repetidamente. No es una fuente normativa ni un banco de diseños aprobados: sus datos sirven para explorar la interfaz, reproducir regresiones internas y comprobar que las restricciones de alcance sean visibles.

Cada tipología ofrece exactamente tres clases de caso:

- **Referencia:** reproduce el caso base o manual documentado del modelo.
- **Variación:** cambia carga, geometría, orientación o base de capacidad sin salir del alcance.
- **Borde:** provoca una alerta calculada o un bloqueo intencional y explicado.

## Inventario

| Tipo | ID estable | Caso | Resultado esperado |
| --- | --- | --- | --- |
| Aislada centrada | `isolated-reference-rectangular` | Rectangular 2.00 × 3.00 m | Calcula la cadena completa y mantiene contacto admisible. |
| Aislada centrada | `isolated-square-net-capacity` | Cuadrada, relleno y capacidad neta | Calcula y muestra presión bruta frente a neta. |
| Aislada centrada | `isolated-bearing-attention` | Capacidad declarada reducida | Calcula y marca contacto para ajuste. |
| Corrida | `strip-reference-wall` | Muro centrado por franja de 1.00 m | Calcula contacto y revisiones transversales. |
| Corrida | `strip-net-capacity-with-fill` | Mayor ancho, relleno y capacidad neta | Calcula una variación de contacto y voladizo. |
| Corrida | `strip-bearing-attention` | Capacidad declarada reducida | Calcula y marca contacto para ajuste. |
| Combinada rectangular | `combined-reference-unbalanced` | Dos cargas diferentes | Calcula presión lineal y equilibrio. |
| Combinada rectangular | `combined-balanced-manual` | Dos cargas simétricas | Reproduce `AXC-COMB-001` con presión uniforme. |
| Combinada rectangular | `combined-contact-loss` | Resultante fuera del núcleo | Bloquea el contacto parcial. |
| Medianera | `strap-reference-transfer` | Transferencia base | Reproduce `AXC-STRAP-001`. |
| Medianera | `strap-longer-spacing` | Mayor separación de bases | Calcula reacciones positivas y otra transferencia. |
| Medianera | `strap-interior-reaction-loss` | Carga exterior extrema | Bloquea una reacción interior no positiva. |
| Trapezoidal | `trapezoidal-reference-centroid` | Resultante en el centroide | Reproduce `AXC-TRAP-001` con presión uniforme. |
| Trapezoidal | `trapezoidal-linear-pressure` | Segunda columna gobernante | Calcula presión creciente hacia la derecha. |
| Trapezoidal | `trapezoidal-contact-loss` | Desbalance extremo | Bloquea una presión extrema negativa. |
| Excéntrica de borde | `edge-reference-left` | Lindero izquierdo | Reproduce `AXC-ECC-001`. |
| Excéntrica de borde | `edge-mirrored-right` | Lindero derecho | Conserva magnitudes e intercambia extremos. |
| Excéntrica de borde | `edge-outside-middle-third` | Resultante fuera del tercio central | Bloquea el contacto parcial. |

## Comportamiento en la interfaz

1. Al cambiar de tipología se selecciona su caso de referencia.
2. Elegir otro caso solo cambia la selección; no modifica todavía el proyecto.
3. **Cargar** reemplaza únicamente el snapshot de entradas de la tipología activa.
4. Los snapshots de los otros cinco modelos permanecen intactos.
5. Se borran los resultados anteriores y se vuelve a la definición del caso.
6. **Analizar** ejecuta el orquestador normal; no existe una ruta de cálculo especial para ejemplos.
7. El proyecto no se guarda en IndexedDB hasta que el usuario elige **Guardar**.

## Contrato de mantenimiento

Todo ejemplo nuevo o modificado debe:

- tener un ID único y estable;
- declarar tipología, categoría y resultado esperado;
- conservar todas sus entradas en unidades canónicas SI;
- explicar qué debe observar la persona;
- pasar por el mismo motor que un proyecto manual;
- incluir una prueba automática del estado anunciado;
- evitar valores ocultos, generación aleatoria y cambios a otros snapshots;
- mantener visible que se trata de datos didácticos, no de una aprobación normativa.

El catálogo está en `app/src/domain/examples/footing-examples.ts` y sus garantías de estructura y comportamiento en `app/src/domain/examples/footing-examples.spec.ts`.

## Relación con la validación técnica

Los ejemplos rápidos no reemplazan los casos normativos del registro `07-validation-case-register.md` ni los contrastes externos de `09-external-benchmark-protocol.md`. Algunos reutilizan casos manuales ya documentados; otros son pruebas de experiencia y límites. Elevar el estado normativo de un módulo sigue requiriendo fuente, edición, hipótesis, tolerancia y evidencia independiente.
