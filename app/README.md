# Aplicación AndeLogic Zapatas

Frontend React + TypeScript + Vite y motores puros para ocho modelos de cimentación superficial. La aplicación funciona localmente, guarda proyectos en IndexedDB y permite importar o exportar documentos JSON versionados.

## Desarrollo

```bash
npm install
npm run dev
```

## Verificación

```bash
npm run lint
npm test
npm run build
```

## Organización

```text
src/
├── domain/
│   ├── examples/              # 24 casos rápidos tipados y probados
│   ├── footing/               # Zapata aislada centrada
│   ├── strip-footing/         # Zapata corrida
│   ├── combined-footing/      # Combinada rectangular
│   ├── strap-footing/         # Medianera con viga centradora
│   ├── trapezoidal-footing/   # Combinada trapezoidal
│   ├── edge-footing/          # Aislada excéntrica de borde
│   ├── corner-footing/        # Esquina biaxial
│   └── mat-footing/           # Losa rígida multicolumna y pantalla Winkler
├── application/               # Orquestador independiente por modelo
├── standards/                 # Perfil técnico y fuentes
├── reports/                   # Memorias serializables
├── persistence/               # IndexedDB, importación y migraciones
├── ui/                        # Formularios y presentación de resultados
└── components/                # Láminas SVG
```

La biblioteca de ejemplos vive fuera de React. Cada caso tiene un identificador estable, una observación esperada y una prueba que confirma si debe calcular, advertir o bloquear. Cargarlo reemplaza solo el snapshot del modelo activo y nunca ejecuta ni guarda el proyecto automáticamente.

Consulta la [documentación principal](../README.md) y el [catálogo de ejemplos](../docs/21-quick-example-library.md).
