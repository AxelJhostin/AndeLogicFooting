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

## Contratos de datos

- Todas las entradas se guardan con unidad y valor base SI.
- Los resultados incluyen estado (`pass`, `fail`, `warning` o `blocked`), valor, unidad, referencia y mensaje accionable.
- El perfil normativo es un dato obligatorio de la entrada y del informe.
- Los redondeos se aplican solo al presentar resultados; el motor conserva precisión interna.
- Las fórmulas y parámetros reciben una versión de motor.

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
