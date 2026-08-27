# AndeLogic Footing — Aplicación

Prototipo React + TypeScript + Vite para la primera herramienta independiente de AndeLogic Engineering.

## Estado actual

La aplicación permite crear proyectos, guardarlos localmente con IndexedDB, reabrirlos después de recargar y exportarlos/importarlos como JSON versionado. Incluye una evaluación experimental de presión media de contacto `P / A` frente a la capacidad admisible ingresada.

No contiene diseño ni verificaciones normativas: no incluye peso propio, combinaciones de carga, excentricidad, asentamientos, cortante, punzonamiento, flexión ni armado.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Vite mostrará una URL local, normalmente `http://localhost:5173`.

## Verificar antes de cambiar código

```bash
npm run build
```

## Estructura

```text
src/
├── domain/projects.ts                    # Documento portable y validación de esquema
├── persistence/browser-project-repository.ts # IndexedDB mediante Dexie
└── App.tsx                               # Interfaz del prototipo
```

La siguiente fase es implementar el motor NEC como código puro y pruebas de referencia, únicamente después de cerrar la trazabilidad normativa en `../docs`.
