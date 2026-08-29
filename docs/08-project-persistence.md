# Persistencia y archivos de proyecto

## Decisión de producto

La primera versión guarda proyectos localmente en el navegador y permite exportarlos e importarlos como archivos JSON versionados. No requiere registro, conexión, servidor ni una cuenta de AndeLogic.

La base local mejora la experiencia diaria; la exportación es el medio para respaldar, compartir o mover un proyecto a otra computadora. El usuario debe conservar sus exportaciones: borrar datos del navegador puede eliminar la biblioteca local.

## Estructura conceptual

```text
ProjectDocument
├── schemaVersion
├── projectId, name, createdAt, updatedAt
├── productVersion, engineVersion
├── standardProfile { id, edition, profileVersion }
├── inputSnapshot       # valores canónicos SI + unidades de presentación
├── explicitDecisions   # opciones seleccionadas por el usuario
├── resultSnapshot?     # histórico, identificado como tal
└── warnings
```

El archivo no incluirá datos de otros usuarios, secretos, credenciales ni tablas o texto normativo protegido.

## Comportamiento de abrir e importar

1. Se valida el JSON y `schemaVersion` antes de escribir en la biblioteca local.
2. Si la versión es compatible, se carga el documento y se muestra el perfil y versiones usados.
3. Si requiere migración, se explica y se ejecuta una migración probada sobre una copia del documento.
4. Si el perfil normativo o motor no es compatible, se conserva como histórico o se bloquea; jamás se reemplaza por el perfil actual en silencio.
5. Un nuevo cálculo se ejecuta explícitamente y deja visible la versión con la que se produjo.

## Implementación prevista

- `ProjectRepository`: contrato para listar, guardar, abrir, duplicar, eliminar e importar/exportar.
- `BrowserProjectRepository`: implementación con Dexie e IndexedDB.
- `projectMigrations`: funciones puras entre versiones del esquema.
- `projectFile`: serialización, validación y descarga/carga del JSON.
- Pruebas de documento y migración independientes de la UI; pruebas del repositorio con una base temporal.

Una futura versión de escritorio con Tauri puede usar SQLite mediante otro adaptador. Los documentos portables y el contrato del repositorio se mantienen, por lo que los proyectos siguen moviéndose entre web y escritorio.

## Relación con los ejemplos rápidos

Elegir un ejemplo en el selector no modifica el proyecto. Al pulsar **Cargar**, se reemplaza únicamente el snapshot de la tipología activa, se actualiza el nombre didáctico y se invalidan resultados previos. Los otros snapshots se conservan. El caso no entra en IndexedDB ni sobrescribe un archivo hasta que el usuario ejecuta de forma explícita **Guardar** o **Descargar archivo**.
