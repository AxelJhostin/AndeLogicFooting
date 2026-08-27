# Validación y criterios de aceptación

## Principio

La interfaz nunca valida una fórmula. El motor se valida contra casos documentados antes de conectarse a la UI.

## Banco de casos requerido

Cada perfil normativo necesita como mínimo:

1. Caso de referencia manual desarrollado paso a paso.
2. Caso contrastado con bibliografía o ejemplo normativo autorizado.
3. Caso de borde para cada restricción de dominio.
4. Caso que debe fallar: presión superior a la admisible, punzonamiento insuficiente y refuerzo insuficiente.
5. Caso de unidades equivalentes que produzca el mismo resultado interno.

Cada fixture debe conservar: fuente, edición, cláusulas aplicadas, entradas, resultados esperados, tolerancia numérica y fecha de revisión.

## Persistencia y archivos de proyecto

Antes de publicar se prueban, como mínimo:

1. Guardar y reabrir un proyecto conserva exactamente las entradas canónicas, unidades, perfil y versiones.
2. Exportar e importar el mismo archivo en una biblioteca vacía reproduce el mismo documento y las mismas advertencias.
3. Un archivo corrupto, de esquema desconocido o con datos fuera de alcance se rechaza sin modificar proyectos existentes.
4. Cada migración de esquema tiene un fixture de entrada y salida revisable.
5. Abrir un proyecto de otra versión muestra con claridad su versión histórica; no aplica una norma ni recalcula resultados de forma silenciosa.

Estos casos se ejecutan sin IndexedDB real para probar el documento y las migraciones, y con una base temporal para comprobar el adaptador local.

## Revisión técnica

Antes de llamar al producto “profesional”:

- Un ingeniero estructural o geotécnico externo revisa al menos el procedimiento y los casos principales.
- Se documentan discrepancias, decisiones y límites aceptados.
- Se confirma que el informe geotécnico sigue siendo una entrada del usuario, no una salida estimada por la aplicación.

## Definición de terminado del Producto 01

- El alcance y las exclusiones están visibles antes de calcular.
- Los dos perfiles publicados tienen fuentes, versión y matriz de pruebas completas.
- Todas las verificaciones muestran resultado, ecuación o procedimiento, entradas y referencia aplicable.
- Los casos de regresión pasan automáticamente.
- La aplicación bloquea datos inválidos y casos fuera de alcance.
- El informe identifica producto, versión del motor, perfil normativo, entradas, resultados y advertencias.
- El proyecto puede guardarse localmente, exportarse e importarse sin perder trazabilidad de versiones.
- No existen errores críticos de interfaz en escritorio o móvil.
- Existe guía de uso, limitaciones y canal para reportar errores.

Si un criterio falla, el producto sigue en desarrollo; no se compensa con un mensaje comercial ambiguo.
