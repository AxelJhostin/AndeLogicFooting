# Arquitectura técnica

## Decisión

La primera implementación será una aplicación web local-first construida con:

- **React + TypeScript** para la interfaz tipada y modular.
- **Vite** para desarrollo rápido y compilación a activos estáticos optimizados.
- **Vitest** para pruebas del motor de cálculo desde la primera ecuación.
- **Dexie sobre IndexedDB** para una biblioteca local de proyectos, sin depender de un servidor.
- Validación de entradas con esquemas tipados y conversión de unidades explícita.
- HTML y CSS de impresión para una memoria de cálculo revisable; un PDF nativo no es requisito inicial.

No habrá cuentas, nube ni IA en la primera versión. Sí habrá almacenamiento local opcional en el navegador: el usuario podrá crear, nombrar, duplicar, eliminar, abrir y exportar sus propios proyectos. La aplicación seguirá funcionando sin conexión y no enviará los datos del proyecto a AndeLogic.

Vite produce activos estáticos optimizados y Vitest se integra con ese ecosistema de desarrollo. Dexie es una capa tipada para IndexedDB que permite persistencia local sin backend. Tauri acepta cualquier frontend web, por lo que el producto podrá empaquetarse para escritorio posteriormente sin sustituir la interfaz. [Vite](https://vite.dev/guide/), [Vitest](https://vitest.dev/guide/), [Dexie](https://dexie.org/), [Tauri](https://v2.tauri.app/)

## Por qué no escritorio desde el día uno

Una aplicación de escritorio no vuelve más confiable un cálculo. La confianza viene de un motor determinista, fuentes rastreables, pruebas y una interfaz que expone límites. Empezar como web local-first permite validar el producto y publicar actualizaciones más rápido; Tauri será una capa de distribución futura cuando se justifique el trabajo offline, el manejo de archivos o la integración con el sistema.

## Separación obligatoria

```text
src/
├── domain/
│   ├── footing/          # Tipos, cálculos puros y resultados
│   ├── strip-footing/    # Motor independiente por metro lineal bajo muro
│   ├── combined-footing/ # Motor para dos columnas y presión longitudinal lineal
│   ├── strap-footing/    # Dos bases y viga centradora sin apoyo en el suelo
│   ├── trapezoidal-footing/ # Dos columnas y ancho longitudinal variable
│   ├── edge-footing/     # Una columna al borde y excentricidad uniaxial
│   ├── examples/         # Catálogo tipado de pruebas rápidas por tipología
│   ├── units/            # Conversión y presentación de unidades
│   └── validation/       # Reglas de dominio y errores accionables
├── standards/
│   ├── nec/              # Perfil NEC con versión y cláusulas trazables
├── application/          # Orquesta entrada → perfil → cálculo → informe
├── persistence/          # Documento portable, migraciones y adaptador IndexedDB
├── reports/              # Modelo de memoria, no componentes de UI
├── ui/                   # Formularios, resultados y navegación React
└── test-fixtures/        # Casos conocidos y entradas de regresión
```

La UI no contiene fórmulas. El motor no importa React, el navegador ni librerías de presentación. Un mismo caso de cálculo debe dar el mismo resultado en pruebas, interfaz e informe.

La biblioteca rápida tampoco vive en React. `domain/examples/footing-examples.ts` conserva entradas SI completas, identidad, categoría y observación esperada. Se carga como un recurso independiente para que el catálogo pueda crecer sin aumentar el paquete inicial. `applyFootingExample` reemplaza únicamente el snapshot activo; después, el botón general de análisis usa el orquestador normal. Esta separación evita rutas especiales, datos aleatorios y resultados precalculados dentro de la interfaz.

La interfaz llama a un único orquestador de caso en `application/footing-analysis.ts`. Este adapta las entradas del documento a los módulos puros y devuelve un resultado consolidado tipado; los componentes visuales solo representan ese resultado. Así, añadir una revisión exige extender el orquestador y su prueba, no duplicar cálculos en cada vista.

La zapata corrida dispone de una frontera paralela en `application/strip-footing-analysis.ts`. No añade condicionales geométricos al motor de zapata aislada: cada tipología conserva entradas, validación, resultados, informe y componentes propios, mientras el documento de proyecto y el shell seleccionan el flujo activo.

La zapata combinada repite este patrón en `domain/combined-footing/` y `application/combined-footing-analysis.ts`. Su snapshot, análisis e informe son independientes. El shell solo selecciona el flujo activo; las ecuaciones de presión lineal, viga longitudinal y demandas no viven en React ni modifican los motores aislado y corrido.

La zapata medianera sigue la misma frontera en `domain/strap-footing/` y `application/strap-footing-analysis.ts`. El equilibrio de las dos reacciones, las demandas de cada base y la viga centradora viven en el dominio. El punzonamiento atravesado por la viga se conserva como resultado explícito `not-evaluated`, sin reutilizar el caso de columna interior ni ocultarlo en la interfaz.

La zapata trapezoidal mantiene otro motor independiente. Sus propiedades geométricas, el sistema de equilibrio para `q(x)=a+bx` y la integración de `w(x)=q(x)B(x)` permanecen fuera de React. Los componentes reciben resultados ya calculados y no aproximan el ancho local.

La zapata excéntrica de borde se aísla en `domain/edge-footing/`. El motor obtiene la excentricidad de la cara de columna alineada al lindero, exige la resultante dentro del tercio central e integra la presión lineal para las demandas. El punzonamiento truncado se devuelve como `not-evaluated`; no hereda la comprobación de columna interior.

Para la memoria de revisión, `MinimumReinforcementResult` expone además `barAreaMm2`: es un resultado geométrico ya obtenido por el módulo de dominio. La interfaz lo muestra como sustitución trazable y no vuelve a calcularlo; esta ampliación no modifica fórmulas ni criterios del motor.

El contrato `reports/footing-calculation-report.ts` ya produce una memoria serializable de identidad, versiones, perfil, entradas y límites. La etapa visual solo deberá renderizar este contrato, sin volver a decidir criterios técnicos.

## Trazabilidad de fuentes públicas

El perfil activo es `NEC-2015-GUIDE-TRACEABLE` ("Ecuador · NEC 2015 — guía práctica trazable"). Guarda las fuentes públicas con URL, versión y alcance, y asocia cada módulo a su base técnica:

- Contacto y flexión: equilibrio y geometría con carga centrada y presión uniforme.
- Cortante unidireccional: Guía práctica NEC 2015, sección 1.10.1.
- Punzonamiento: Guía práctica NEC 2015, secciones 1.10.2 a 1.10.4.
- Acero mínimo y requerido: Guía práctica NEC 2015, sección 1.10.5.
- Longitud de desarrollo: Guía práctica NEC 2015, sección 1.10.6.

La memoria muestra además la condición de aplicabilidad de cada módulo y enlaza las fuentes públicas. Este perfil no combina factores de reglamentos distintos, ni declara cumplimiento NEC: para hacerlo se requerirá contrastar casos independientes y revisión profesional. Los proyectos con los identificadores históricos `NEC-PENDING` y `NEC-PUBLIC-2014-PENDING` migran explícitamente a este perfil al abrirse.

## Contratos de datos

- Todas las entradas se guardan con unidad y valor base SI.
- Los resultados incluyen estado (`pass`, `fail`, `warning` o `blocked`), valor, unidad, referencia y mensaje accionable.
- El perfil normativo es un dato obligatorio de la entrada y del informe.
- Los redondeos se aplican solo al presentar resultados; el motor conserva precisión interna.
- Las fórmulas y parámetros reciben una versión de motor.

El esquema de proyecto `5` incorpora `edgeInputSnapshot`. La normalización acepta archivos de esquemas anteriores, agrega los snapshots faltantes y conserva sus entradas existentes sin convertir silenciosamente una tipología en otra.

## Persistencia local y portabilidad

La persistencia se diseña como una frontera intercambiable, no como parte de la UI ni del motor:

```text
ProjectDocument (schema versionado)
       ├── BrowserProjectRepository → Dexie / IndexedDB
       ├── exportProject()          → JSON portable
       └── importProject()          → validación + migración explícita
```

- `ProjectDocument` contiene identificador, nombre, fechas, perfil normativo, versiones de perfil y motor, entradas canónicas SI, decisiones explícitas y metadatos de advertencias.
- Los resultados se pueden guardar como instantánea para auditoría, pero al abrirse se identifican como históricos y se recalculan de manera visible solo con el mismo perfil/versiones compatibles.
- El primer formato será JSON legible y versionado, con nombre `andelogic-zapatas-project.json`; no se define todavía una extensión propietaria.
- La importación valida el esquema, el origen y las unidades; archivos corruptos, futuros o fuera de alcance se bloquean con un mensaje claro.
- Las migraciones son funciones puras, probadas y explícitas. Nunca alteran silenciosamente el perfil normativo, las entradas técnicas ni los resultados históricos.
- Exportar es responsabilidad del usuario y funciona como respaldo para otra computadora; IndexedDB puede borrarse si el navegador limpia sus datos.

Cuando sea útil distribuir una aplicación de escritorio, Tauri podrá incorporar un adaptador SQLite local. El `ProjectDocument`, las migraciones y el motor se conservarán: cambiará solo el repositorio de almacenamiento.

## Calidad y seguridad de software

- TypeScript estricto y reglas de lint.
- Pruebas unitarias por verificación y casos límite.
- Pruebas de regresión por perfil normativo.
- Validación de rangos antes de calcular.
- Sin valores por defecto que aparenten provenir de un estudio geotécnico.
- Sin telemetría ni transferencia de datos en la primera versión.
