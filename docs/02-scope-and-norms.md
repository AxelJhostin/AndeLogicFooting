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

## Perfiles normativos

La aplicación tendrá una arquitectura de perfiles normativos independientes desde el primer día.

| Perfil | Base | Estado de lanzamiento |
| --- | --- | --- |
| Ecuador | NEC-SE-GC 2014 + NEC-SE-HM 2014, más las referencias complementarias cuya edición se congele y justifique | Perfil predeterminado solo cuando la matriz complete el criterio de zapatas sin asumir equivalencias. |
| Internacional | ACI CODE-318-25, unidades SI | Perfil separado, solo se publica cuando el mapa de cláusulas, parámetros y casos de validación esté completo. |

No se mostrará un interruptor “NEC / ACI” si ambas rutas no han sido implementadas y verificadas de forma independiente. NEC-SE-HM 2014 remite a ACI 318 para varias disposiciones y para cimentaciones sísmicas; esa remisión no autoriza a asumir que ACI 318-25 sea equivalente al perfil NEC. Cada perfil guarda sus fuentes, ediciones, parámetros, cláusulas aplicadas y pruebas.

## Gestión de fuentes

- La NEC se consultará exclusivamente desde los portales oficiales del Estado ecuatoriano.
- ACI CODE-318-25 es una publicación con licencia; no se copiarán tablas ni texto protegido al repositorio. Las referencias internas requerirán acceso autorizado al documento y una tabla de trazabilidad de cláusulas.
- Un cambio de norma crea una nueva versión de perfil; no altera silenciosamente proyectos o reportes anteriores.
- Un proyecto guardado conserva el perfil, edición y versión de motor usados. Al abrirlo, la aplicación identifica esas versiones y no recalcula ni migra criterios normativos de manera silenciosa.

## Fuentes de referencia inicial

- [Norma Ecuatoriana de la Construcción — MIT](https://www.mit.gob.ec/norma-ecuatoriana-de-la-construccion/)
- [ACI CODE-318-25 — American Concrete Institute](https://www.concrete.org/store/productdetail.aspx?itemid=31825)

Estas fuentes orientan la planificación; el desarrollo de ecuaciones comienza solo tras registrar las referencias exactas que corresponden a cada verificación.
