# Alcance y normativa

## Alcance de la primera versión

La primera versión pública resolverá únicamente:

- Zapata aislada **rectangular** de hormigón armado.
- Columna rectangular o cuadrada, centrada en la zapata.
- Carga axial centrada y compresión dominante.
- Capacidad portante admisible ingresada por el usuario desde un estudio geotécnico.
- Verificación de presión de contacto uniforme.
- Diseño por cortante unidireccional, punzonamiento y flexión.
- Propuesta de acero inferior y memoria de cálculo exportable o imprimible.
- Biblioteca local de proyectos y archivo portable versionado para exportar e importar el caso en otro equipo.
- Unidades SI, con conversiones explícitas y sin conversiones implícitas ocultas.

## Fuera de alcance en la primera versión

- Cargas excéntricas, momentos, volcamiento o presión no uniforme.
- Zapatas combinadas, corridas, con vigas de amarre o losas de cimentación.
- Asentamientos, consolidación, licuación, nivel freático, suelos estratificados o capacidad portante calculada por la aplicación.
- Interacción suelo-estructura, análisis sísmico, diseño de pedestales, anclajes o conexión acero-columna.
- Generación de planos constructivos o detalle final de obra.

Una entrada fuera de alcance debe bloquear el cálculo o emitir una advertencia inequívoca; nunca debe forzar una simplificación silenciosa.

## Base técnica inicial

La primera versión tendrá un único perfil ecuatoriano: **NEC-SE-GC 2014 + NEC-SE-HM 2014**, complementado únicamente con fuentes públicas que puedan identificarse, fecharse y contrastarse. No se presentará como compatible con otras normas ni dependerá de una edición de ACI para funcionar.

## Gestión de fuentes

- La NEC se consultará exclusivamente desde los portales oficiales del Estado ecuatoriano.
- Las publicaciones técnicas públicas de profesionales pueden servir como apoyo o contraste, nunca como sustituto silencioso de la NEC. Se guarda URL, autor, fecha, hipótesis y resultado contrastado.
- Un cambio de norma crea una nueva versión de perfil; no altera silenciosamente proyectos o reportes anteriores.
- Un proyecto guardado conserva el perfil, edición y versión de motor usados. Al abrirlo, la aplicación identifica esas versiones y no recalcula ni migra criterios normativos de manera silenciosa.

## Fuentes de referencia inicial

- [Norma Ecuatoriana de la Construcción — MIT](https://www.mit.gob.ec/norma-ecuatoriana-de-la-construccion/)
Estas fuentes orientan la planificación; el desarrollo de ecuaciones comienza solo tras registrar las referencias exactas que corresponden a cada verificación.
