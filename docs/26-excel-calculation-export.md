# Exportación Excel de la memoria de cálculo

## Propósito

AndeLogic conserva dos descargas distintas y complementarias:

- el archivo `*.andelogic-zapatas-project.json` es el documento portable que puede volver a abrirse en la aplicación;
- el archivo `*.andelogic-zapatas-calculo.xlsx` es una memoria de auditoría editable del ejercicio activo.

El libro Excel no sustituye el documento de proyecto ni cambia el estado técnico del motor. Sirve para revisar la cadena calculada, variar entradas de forma local y detectar diferencias respecto del cálculo original exportado.

## Contrato del libro

Todo libro generado contiene estas hojas, en este orden:

1. **Resumen**: identifica proyecto, tipología, perfil, versiones, fecha, estado del archivo y advertencias de alcance.
2. **Entradas**: conserva el valor original exportado y una columna editable. Las fórmulas del libro solo leen la columna editable.
3. **Cálculo completo**: presenta pasos ordenados, expresión simbólica, fórmula Excel visible, resultado recalculado, valor original del motor, diferencia, consistencia y copia de la fórmula exportada.
4. **Comprobaciones**: resume equilibrio, contacto, utilización y resultados no evaluados o de referencia según la familia.
5. **Trazabilidad**: registra módulo, base, fuente, edición, referencia, aplicabilidad y URL pública.
6. **Control**: explica el código de colores y cuenta entradas modificadas, cálculos por revisar y diferencias numéricas.

Para los modelos multicolumna se añade en **Entradas** una tabla de columnas con cargas, dimensiones y coordenadas.

## Reglas de edición y control

- Las entradas editables se distinguen en azul y conservan unidades SI.
- Las celdas derivadas contienen fórmulas de Excel; no macros, vínculos externos ni código VBA.
- El libro solicita recálculo automático completo al abrirse.
- Cada fórmula conserva una copia textual original para comparación. La columna de consistencia avisa cuando el resultado deja de coincidir con el valor original; un cambio de fórmula que conserve exactamente el mismo resultado requiere comparar manualmente la fórmula viva con esa copia.
- Cada resultado conserva el valor calculado por AndeLogic al exportar y muestra la diferencia frente al recálculo del libro.
- Una modificación no altera el proyecto guardado ni constituye un nuevo resultado validado por AndeLogic. Para adoptar el cambio debe repetirse en la aplicación y volver a analizarse.
- Los módulos fuera de alcance permanecen identificados como `NO EVALUADO`; no se rellenan con fórmulas aproximadas.

## Arquitectura

- `app/src/exports/exercise-workbook/`: contrato tipado, modelos por familia y generador OOXML independiente de React.
- `FootingApp.tsx`: inicia la descarga del libro del tipo activo sin sustituir la exportación JSON.
- El generador usa exclusivamente snapshots SI, orquestadores existentes, informes y trazabilidad del perfil.
- La infraestructura XLSX compartida no conoce ecuaciones de cimentaciones; las fórmulas permanecen en catálogos por familia.

## Criterios de aceptación

1. Las ocho familias generan un libro válido desde su caso de referencia.
2. Una familia bloqueada no produce una memoria engañosa: devuelve el mismo motivo de invalidez que su orquestador.
3. Todas las celdas de resultado auditables son fórmulas y conservan un valor original del motor.
4. Las fórmulas solo dependen de entradas editables o de pasos anteriores del mismo libro.
5. El archivo no contiene macros ni conexiones externas.
6. El nombre es estable, seguro para el sistema de archivos y conserva la extensión `.xlsx`.
7. Las pruebas verifican estructura OOXML, hojas, recálculo automático, cobertura de familias y ausencia de referencias rotas en los catálogos.

## Límite técnico

Excel y la aplicación pueden usar motores numéricos diferentes para operaciones avanzadas. La columna **Valor original AndeLogic** y las comprobaciones de diferencia existen precisamente para hacer visible cualquier divergencia. El archivo JSON y un nuevo análisis en la aplicación siguen siendo la fuente de verdad del proyecto.
