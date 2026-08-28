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

## Revisión del enfoque gráfico

Las primeras iteraciones no resolvieron la jerarquía de información: mostraban controles, tarjetas, resultados y dibujos al mismo nivel. El resultado se percibe como una página de administración, no como una herramienta de ingeniería. El fondo claro por sí solo tampoco soluciona este problema; el texto verde sobre blanco reduce contraste y no tiene una función técnica clara.

Las referencias aportadas por Axel establecen la dirección correcta: la visualización debe ser una **lámina técnica generada desde el modelo**, con cotas, secciones, líneas críticas, armado y llamadas de resultado. No debe ser una ilustración decorativa ni un conjunto de gráficos abstractos.

### Lámina técnica requerida

La vista principal de resultados debe componerse como un plano de cálculo, con fondo blanco, trazos oscuros y un código visual consistente:

1. **Planta general:** zapata, columna/dado centrado, ejes, cotas B/L y líneas de corte A–A y B–B.
2. **Detalle de punzonamiento:** columna, perímetro crítico, área interior/exterior rayada y llamadas a `b₀`, demanda y utilización.
3. **Secciones A–A y B–B:** columna, zapata, espesor `h`, recubrimiento, peralte efectivo `d`, barras inferiores y corte a `d` desde la cara.
4. **Armado:** planta de barras en ambas direcciones y sección transversal con diámetro, cantidad y separación real, únicamente después de calcularlo.
5. **Isométrica opcional:** solo para orientación; no sustituye planta ni secciones y no ocupa el área principal.

### Código gráfico

- Negro/azul gris: geometría y cotas.
- Azul: cargas, ejes y acciones.
- Magenta o violeta: perímetros y secciones críticas.
- Verde oscuro: barras calculadas; nunca texto pequeño verde sobre blanco.
- Ámbar/rojo: advertencias y fallas, acompañadas de texto y símbolo.

El plano debe poder imprimirse en blanco y negro sin perder significado: tipos de línea, tramas y etiquetas acompañan al color.

### Flujo antes de implementar

1. Definir la lámina y cada dato que puede aparecer en ella.
2. Validar con ejemplos qué módulos activan cada elemento gráfico.
3. Diseñar un único espacio de edición sencillo, separado de la lámina.
4. Construir vistas SVG desde componentes independientes y datos del motor, con pruebas de geometría.

Mientras no se complete esta definición, se evita seguir retocando CSS o agregando tarjetas. La interfaz actual es una transición funcional, no la dirección visual definitiva.

## Corrección de arquitectura de información

La prueba de la primera reorganización confirmó que no basta con mover los controles a una columna. Los problemas observados son:

- El panel “Estado real de los módulos” aparece antes de que el usuario haya comenzado el caso; interrumpe la tarea y comunica el estado interno del producto en vez del estado del proyecto.
- Todos los campos abiertos convierten el panel lateral en un formulario interminable y hacen que el lienzo técnico pierda protagonismo.
- Los botones actuales representan funciones internas del motor, no pasos comprensibles para la persona que diseña. Al mostrarlos todos, parecen un tablero de administración.
- La combinación de controles, resultados, biblioteca, validación y teoría en la misma vista obliga a recorrer información que no corresponde a la acción actual.

### Flujo que reemplaza la organización actual

La aplicación se organizará como una secuencia de trabajo, no como un catálogo de módulos:

1. **Definir el caso**
   - Datos básicos del proyecto y del alcance.
   - Cargas y suelo.
   - Geometría.
   - Materiales y armado preliminar.
   - Cada bloque se abre uno a la vez; el usuario ve progreso y puede volver a editar.
2. **Analizar**
   - Un único botón principal: `Analizar zapata`.
   - El orquestador ejecuta las revisiones disponibles y presenta claramente las que estén bloqueadas por una entrada faltante.
   - Las acciones técnicas individuales pasan a “Recalcular detalle” dentro de la vista correspondiente, no permanecen como doce botones visibles.
3. **Revisar resultados**
   - Resumen de controles por estado y lámina técnica asociada.
   - Elegir suelo, cortante, punzonamiento, flexión o armado abre el detalle de esa revisión en vez de apilar tarjetas.
4. **Documentar**
   - Guardar, descargar, abrir e imprimir se agrupan en un menú de proyecto, no dentro del flujo de cálculo.

### Ubicación de elementos que hoy están mal situados

- **Estado de módulos:** se mueve a “Acerca de la metodología” o a una pequeña etiqueta de perfil dentro de Teoría. No se muestra como panel principal de trabajo.
- **Biblioteca local:** se contrae a un selector de proyecto o menú lateral, visible solo al abrir/guardar.
- **Campos:** se transforman en acordeones o pasos, con un resumen compacto de los valores completados cuando el bloque se cierra.
- **Botones de cálculo:** desaparece la cuadrícula de botones. El resultado de cada etapa se recalcula desde `Analizar zapata` y, si hace falta, se permite recalcular el detalle desde su propia vista.
- **Teoría y trazabilidad:** quedan fuera del lienzo de trabajo; son pestañas de consulta, no contenido permanente.

### Decisión de implementación

No se seguirá ajustando la cuadrícula actual. El siguiente cambio de código debe construir un flujo por estados (`Definir`, `Analizar`, `Resultados`, `Documentar`) y reutilizar los componentes del motor dentro de esa estructura. Solo después se vuelve a conectar la lámina técnica como resultado de una revisión.

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

## Implementación de interfaz — 2026-08-28

La interfaz activa implementa el shell técnico descrito en este documento sin alterar el motor ni los contratos de dominio. El flujo está separado en `Definir caso`, `Sección`, `Planta`, `Resultados`, `Cálculo completo` y `Teoría`; las acciones de archivo quedan en el menú de proyecto y el estado de validación se muestra como una etiqueta breve de perfil.

La lámina se divide en componentes SVG independientes para planta, secciones A–A/B–B, punzonamiento y armado preliminar. Todos consumen entradas o resultados existentes: no vuelven a calcular criterios dentro de los componentes. Las referencias de resistencia y armado siguen rotuladas como referencias de guía en validación, nunca como cumplimiento o aprobación normativa.

La interfaz anterior quedó archivada en `app/src/legacy/` y excluida de la compilación. La producción utiliza exclusivamente el shell nuevo y sus componentes técnicos; el archivo legado se conserva solo como referencia recuperable durante la transición.
