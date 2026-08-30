# Inventario de tipologías de cimentación superficial

## Propósito

No existe una lista universal cerrada: las tipologías pueden clasificarse por geometría, posición, sistema resistente y condiciones del suelo. Para AndeLogic se adopta una lista práctica de familias principales de cimentación superficial para edificios, evitando presentar cada variante geométrica como un producto distinto.

## Familias principales ya implementadas

1. **Zapata aislada rectangular centrada**: una columna, carga axial y presión uniforme.
2. **Zapata corrida centrada**: muro y carga lineal, resuelta por franja de un metro.
3. **Zapata combinada rectangular**: dos columnas interiores, presión longitudinal lineal y contacto completo.
4. **Zapata medianera con viga centradora**: dos bases separadas y viga rígida sin apoyo en el suelo.
5. **Zapata combinada trapezoidal**: dos columnas interiores, ancho variable y presión longitudinal lineal.
6. **Zapata aislada excéntrica de borde, sin viga centradora**: una columna alineada al lindero, presión longitudinal lineal y contacto completo dentro del tercio central.
7. **Zapata de esquina o excéntrica biaxial**: una columna alineada con dos bordes adyacentes, plano de presión, interacción del núcleo central y contacto completo en las cuatro esquinas.
8. **Losa de cimentación rectangular**: 2 a 24 columnas axiales, plano global de contacto completo y evaluación rígida–Winkler preliminar con parámetros externos.

Cada familia tiene motor, entradas, validación, informe, memoria y componentes visuales independientes. Compartir módulos de resistencia no mezcla sus ecuaciones de demanda.

Cada familia dispone además de tres ejemplos rápidos probados: referencia, variación y borde. El catálogo completo y su contrato de mantenimiento están en `21-quick-example-library.md`.

## Familias principales pendientes

No queda pendiente otra familia principal de cimentación superficial dentro del inventario inicial. Las siguientes etapas son extensiones del alcance y profundización de los modelos activos.

## Extensiones, no familias separadas al inicio

- Zapata aislada escalonada o inclinada: variantes de espesor y detalle.
- Zapata circular o poligonal: variantes geométricas de una base aislada.
- Zapata combinada en T o para muro-columna: extensiones de la familia combinada.
- Vigas de cimentación entre varias bases: sistema de enlace que requiere definir cuándo reciben reacción del suelo.

## Sistemas que deben permanecer en otro producto

- Encepados y grupos de pilotes son cimentaciones profundas, no un tipo adicional de zapata superficial.
- Muros de contención, cimentaciones de maquinaria y cimentaciones dinámicas necesitan acciones y verificaciones propias.

## Próxima ampliación recomendada

Profundizar la losa de cimentación con un modelo validado de rigidez de placa–suelo, punzonamiento por columna y diseño de armado. Esa ampliación no debe reutilizar las proyecciones globales como franjas estructurales: requiere fuentes específicas, casos manuales y contraste independiente antes de programar resistencias.
