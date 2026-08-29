# Inventario de tipologías de cimentación superficial

## Propósito

No existe una lista universal cerrada: las tipologías pueden clasificarse por geometría, posición, sistema resistente y condiciones del suelo. Para AndeLogic se adopta una lista práctica de familias principales de cimentación superficial para edificios, evitando presentar cada variante geométrica como un producto distinto.

## Familias principales ya implementadas

1. **Zapata aislada rectangular centrada**: una columna, carga axial y presión uniforme.
2. **Zapata corrida centrada**: muro y carga lineal, resuelta por franja de un metro.
3. **Zapata combinada rectangular**: dos columnas interiores, presión longitudinal lineal y contacto completo.
4. **Zapata medianera con viga centradora**: dos bases separadas y viga rígida sin apoyo en el suelo.

Cada familia tiene motor, entradas, validación, informe, memoria y componentes visuales independientes. Compartir módulos de resistencia no mezcla sus ecuaciones de demanda.

## Familias principales pendientes, en orden recomendado

1. **Zapata combinada trapezoidal**: siguiente prioridad. Permite ajustar el centroide geométrico cuando las cargas o el lindero hacen inconveniente una planta rectangular.
2. **Zapata aislada excéntrica de borde, sin viga centradora**: excentricidad uniaxial, presión trapezoidal con contacto completo y límites del núcleo central.
3. **Zapata de esquina o excéntrica biaxial**: presión variable en dos ejes, posibles casos de borde y geometría de contacto más exigente.
4. **Losa de cimentación**: módulo mayor, con múltiples columnas, rigidez de placa, distribución de presiones, punzonamiento y asentamientos diferenciales/interacción suelo-estructura.

## Extensiones, no familias separadas al inicio

- Zapata aislada escalonada o inclinada: variantes de espesor y detalle.
- Zapata circular o poligonal: variantes geométricas de una base aislada.
- Zapata combinada en T o para muro-columna: extensiones de la familia combinada.
- Vigas de cimentación entre varias bases: sistema de enlace que requiere definir cuándo reciben reacción del suelo.

## Sistemas que deben permanecer en otro producto

- Encepados y grupos de pilotes son cimentaciones profundas, no un tipo adicional de zapata superficial.
- Muros de contención, cimentaciones de maquinaria y cimentaciones dinámicas necesitan acciones y verificaciones propias.

## Próximo modelo

La siguiente implementación recomendada es la **zapata combinada trapezoidal**, manteniendo el principio actual: primero alcance y caso manual, luego pruebas del motor, y finalmente interfaz y memoria completa.
