# Dirección de rediseño de interfaz

## Decisión

AndeLogic Zapatas debe dejar la apariencia actual de panel oscuro tipo prototipo. La siguiente iteración será una **reestructuración completa de diseño y navegación**, no un conjunto de retoques sobre la pantalla existente. Se reemplazará el flujo visual actual por una interfaz clara, sobria y técnica, pensada primero para ingenieros y, al mismo tiempo, explicable para estudiantes.

La experiencia principal no será una página larga de formularios y tarjetas. Será un **espacio de trabajo de cálculo**: al modificar un dato válido, la representación y el resumen se actualizan de inmediato; las comprobaciones que no estén listas se identificarán como pendientes, nunca se simularán como aprobadas.

La reestructuración conserva el motor de cálculo, las pruebas, el almacenamiento local, los límites de alcance y la trazabilidad. Solo después de aprobar la nueva estructura se conectarán nuevamente los componentes visuales al motor; no se trasladará la acumulación actual de paneles, botones y estilos al nuevo diseño.

## Aprendizajes de las referencias

- [StruCalc](https://strucalc.com/es/calculadora-postes-zapatas/) destaca una vista de diseño orientada a editar datos con rapidez, resultados actualizados y documentación revisable. Su alcance es mucho mayor que el de AndeLogic y no debe copiarse ni prometerse.
- [CalcForge Pad Footing](https://calcforge.com/1/2/free-pad-footing-foundation-design) usa una estructura útil: vista de sección, planta, resumen, cálculo completo y teoría. También presenta utilización por revisión y validación cerca del dato que la necesita.
- Las capturas aportadas confirman que un lienzo claro mejora la lectura de cotas, líneas de corte, suelo, acero y estados de resultado.

## Arquitectura de pantalla propuesta

### 1. Barra superior mínima

- Marca AndeLogic Engineering / producto Zapatas.
- Nombre del proyecto, estado de guardado local y acciones de archivo.
- Perfil técnico y su estado real: por ejemplo, “Referencia de guía · en validación”, sin usar una etiqueta genérica de prototipo como elemento dominante.

### 2. Área de trabajo en dos paneles

En escritorio, el espacio se divide aproximadamente en 36% para controles y 64% para la visualización.

- **Panel izquierdo fijo:** grupos plegables: Proyecto, Cargas, Suelo, Geometría, Materiales y Armado. Cada campo lleva unidad integrada, ayuda contextual y validación debajo del campo. Un botón “Cargar ejemplo” queda visible al inicio.
- **Panel derecho principal:** pestañas: `Sección`, `Planta`, `Resultados`, `Cálculo` y `Teoría`.
- **Panel inferior de estado:** tarjetas pequeñas para contacto, cortante B, cortante L, punzonamiento, flexión B, flexión L, acero B y acero L. Cada tarjeta muestra estado, utilización y el valor gobernante. Al seleccionarla, resalta en el dibujo la zona relacionada.

En móvil, los controles se muestran primero como acordeones y las pestañas de visualización pasan a una fila desplazable. No se conserva un panel lateral estrecho que vuelva ilegibles los campos.

## Representación que debe reaccionar en tiempo real

La geometría se actualiza al cambiar dimensiones válidas, incluso antes de presionar “Analizar”. Los resultados técnicos solo aparecen al ejecutar una revisión válida y se distinguen visualmente de la geometría preliminar.

### Vista de sección

- Nivel de terreno, columna, zapata, espesor, recubrimiento y barras inferiores.
- Flecha de carga axial declarada.
- Presión de contacto bajo la base cuando exista resultado de servicio.
- Líneas de sección crítica y rótulos de profundidad efectiva cuando exista cortante.

### Vista de planta

- Rectángulo de zapata, columna centrada y cotas B/L.
- Malla de refuerzo cuando exista distribución.
- Perímetro crítico de punzonamiento y secciones de cortante cuando los módulos respectivos estén calculados.
- Al seleccionar una tarjeta de resultado, se ilumina solo su línea, perímetro o franja; no se colorea todo el dibujo sin significado.

### Resumen de resultados

- Utilización en porcentaje y estado: dentro de referencia, requiere ajuste, pendiente o fuera de alcance.
- Una conclusión legible: qué gobierna, qué se calcula con los datos actuales y qué falta revisar.
- La conclusión siempre menciona “referencia de guía” cuando corresponda. No se presentará como aprobación NEC mientras la matriz de evidencia siga pendiente.

### Cálculo completo

Esta pestaña muestra una memoria de lectura, no una pared de fórmulas:

1. datos usados y procedencia declarada;
2. hipótesis aplicadas;
3. resultado intermedio y unidad;
4. procedimiento o ecuación autorizada por el proyecto;
5. referencia y límites del módulo.

## Página independiente de teoría

Crear una ruta pública separada, por ejemplo `/teoria-zapatas`, enlazada desde la aplicación y la web de AndeLogic. No debe mezclarse con el área de cálculo.

Contenido inicial:

1. Qué es una zapata aislada y cuándo el caso queda fuera del alcance.
2. Ruta de carga: columna → zapata → suelo.
3. Presión de contacto: diferencia entre valores brutos y netos, y procedencia geotécnica de la capacidad admisible.
4. Cortante unidireccional, punzonamiento y flexión: ubicación visual de cada revisión.
5. Refuerzo inferior y desarrollo: qué datos debe declarar el usuario.
6. Cómo interpreta AndeLogic cada estado y qué no calcula aún.
7. Fuentes y trazabilidad del perfil técnico.

Las fórmulas propias aprobadas para el motor pueden mostrarse acompañadas de variables, unidades, supuestos y versión. No se copiarán ecuaciones, tablas ni figuras de normas protegidas; las referencias normativas seguirán la trazabilidad existente.

## Lenguaje visual

- Fondo blanco o gris muy claro; texto carbón/azul grisáceo para lectura prolongada.
- Azul técnico como color de interacción, verde discreto para “dentro de referencia”, ámbar/rojo para advertencia. El color nunca será la única señal: cada estado tendrá texto e icono.
- Dibujos en negro/gris técnico sobre fondo claro, con azul para acciones, verde para acero y color de estado reservado para comprobaciones.
- Tipografía de interfaz sobria, jerarquía fuerte y tablas de resultados compactas. No usar estética de landing, gradientes decorativos ni tarjetas excesivas.

## Reglas de interacción

- Entradas numéricas con unidad unida al campo, validación inmediata y sin forzar un `0` visible mientras el usuario edita.
- Cambiar un dato invalida de forma visible los resultados afectados: “Necesita recalcular”, no resultados antiguos aparentando vigencia.
- Un solo botón principal: `Analizar caso`. Las acciones avanzadas quedan en pestañas o secciones secundarias.
- El ejemplo carga un caso didáctico identificable, no un proyecto real ni un diseño aprobado.
- Guardar, exportar e imprimir siguen disponibles, pero no compiten visualmente con el análisis.

## Límites de esta fase

El rediseño no cambia ecuaciones, fuentes, alcance ni el estado de validación. Primero se define una maqueta navegable con datos de ejemplo; después se conecta al motor existente y se prueba que cada visual represente exactamente sus resultados.

La interfaz actual se mantiene solamente como referencia funcional durante la transición. La nueva interfaz se construirá como un shell y componentes de visualización nuevos; cuando alcance paridad funcional, se retiran los estilos y pantallas antiguas de forma controlada.

## Secuencia para retomar

1. Aprobar una maqueta clara del área de trabajo y sus pestañas.
2. Rediseñar el sistema de estilos y el shell de aplicación.
3. Construir la vista de sección reactiva y la vista de planta reactiva.
4. Conectar las tarjetas de estado a cada elemento gráfico.
5. Construir `Cálculo completo` desde el contrato de informe existente.
6. Crear la ruta de teoría con contenido propio, fuentes y límites.
7. Probar escritorio, tablet y móvil con usuarios del perfil objetivo.
