# AndeLogic Zapatas

Aplicación local-first de **AndeLogic Engineering** para estudiar y documentar cimentaciones superficiales de hormigón armado mediante cálculos deterministas, memoria de punta a punta y límites técnicos visibles.

## Estado actual

La aplicación dispone de ocho modelos independientes:

1. zapata aislada rectangular centrada;
2. zapata corrida bajo muro centrado, por franja de `1.00 m`;
3. zapata combinada rectangular para dos columnas interiores;
4. zapata medianera con viga centradora;
5. zapata combinada trapezoidal;
6. zapata aislada excéntrica de borde sin viga centradora;
7. zapata de esquina con excentricidad biaxial y contacto completo;
8. losa de cimentación rectangular multicolumna con contacto biaxial y evaluación rígida–Winkler preliminar.

Cada modelo tiene sus propias entradas, validación, motor, resultados, memoria y representación técnica. Las demandas se obtienen por equilibrio; las resistencias disponibles se identifican como **referencias de guía en validación**, no como aprobación normativa integral.

El catálogo queda cerrado en estas ocho familias. La etapa vigente no incorpora nuevas tipologías: endurece motores, trazabilidad, contrastes externos y revisión antes de cualquier liberación técnica.

El proyecto también incluye:

- biblioteca local de proyectos con IndexedDB;
- importación y exportación de archivos JSON versionados;
- memoria de cálculo con datos, hipótesis, fórmulas, sustituciones y resultados;
- láminas técnicas de sección, planta y armado preliminar;
- catálogo de **24 ejemplos rápidos**, tres por tipología: referencia, variación y alerta o bloqueo esperado;
- pruebas automáticas del motor, migraciones, informes y ejemplos.

## Ejecutar la aplicación

Requiere Node.js 20 o superior.

```bash
cd /Users/hernandezaxel/Documents/ChatGPT/AndeLogicFooting/app
npm install
npm run dev
```

La terminal mostrará la dirección local, normalmente [http://localhost:5173](http://localhost:5173).

## Comprobaciones de calidad

```bash
cd /Users/hernandezaxel/Documents/ChatGPT/AndeLogicFooting/app
npm run lint
npm test
npm run build
```

## Ejemplos rápidos

En la franja superior:

1. elige una tipología;
2. selecciona un caso en **Prueba rápida**;
3. revisa el resultado esperado que aparece bajo el selector;
4. pulsa **Cargar** y luego **Analizar**.

Los ejemplos reemplazan únicamente las entradas del tipo activo, invalidan resultados anteriores y no se guardan automáticamente. Incluyen casos que deben calcular, casos que deben mostrar una alerta y casos que deben bloquearse para demostrar los límites del modelo. Son datos didácticos y de regresión, no proyectos reales ni diseños aprobados.

El inventario completo está en [Biblioteca de ejemplos rápidos](docs/21-quick-example-library.md).

## Arquitectura resumida

```text
app/src/
├── domain/          # Modelos, validaciones, cálculos puros y catálogo de ejemplos
├── application/     # Orquestadores por tipología
├── standards/       # Perfil técnico y trazabilidad
├── validation/      # Benchmarks, invariantes y puerta de liberación
├── reports/         # Contratos de memoria
├── persistence/     # Biblioteca local y documento portable
├── ui/              # Formularios, resultados y memorias
└── components/      # Láminas técnicas
```

La interfaz no contiene fórmulas. Cargar un ejemplo tampoco ejecuta cálculos ni cambia criterios: solo aplica un snapshot SI explícito; el botón **Analizar** utiliza el mismo orquestador probado que cualquier proyecto manual.

## Documentación

- [Brief de producto](docs/01-product-brief.md)
- [Alcance y normativa](docs/02-scope-and-norms.md)
- [Arquitectura técnica](docs/03-technical-architecture.md)
- [Validación y aceptación](docs/04-validation-and-acceptance.md)
- [Roadmap](docs/05-roadmap.md)
- [Trazabilidad normativa](docs/06-normative-traceability.md)
- [Registro de casos de validación](docs/07-validation-case-register.md)
- [Persistencia y archivos](docs/08-project-persistence.md)
- [Protocolo de contraste externo](docs/09-external-benchmark-protocol.md)
- [Fichas de Axel Code](docs/10-axel-code-implementation-cards.md)
- [Manifiesto local NEC](docs/11-local-nec-reference-manifest.md)
- [Mapa técnico NEC](docs/12-nec-footing-technical-map.md)
- [Dirección de interfaz](docs/13-ui-redesign-direction.md)
- [Comparación con manual externo](docs/14-manual-tecnico-comparison.md)
- [Alcance de zapata corrida](docs/15-strip-footing-scope.md)
- [Alcance de zapata combinada](docs/16-combined-footing-scope.md)
- [Alcance de zapata medianera](docs/17-strap-footing-scope.md)
- [Inventario de tipologías](docs/18-footing-types-roadmap.md)
- [Alcance de zapata trapezoidal](docs/19-trapezoidal-footing-scope.md)
- [Alcance de zapata excéntrica de borde](docs/20-edge-eccentric-footing-scope.md)
- [Biblioteca de ejemplos rápidos](docs/21-quick-example-library.md)
- [Alcance de zapata de esquina biaxial](docs/22-corner-biaxial-footing-scope.md)
- [Alcance de losa de cimentación](docs/23-mat-foundation-scope.md)
- [Plan de endurecimiento y liberación](docs/24-validation-hardening-plan.md)
- [Paquete de casos para contraste externo](docs/25-external-benchmark-case-pack.md)
- [Libro operativo de contraste externo](outputs/01a04a13-8bed-7161-8f79-2eef8fed266d/AndeLogic-Paquete-Contraste-Externo.xlsx)
- [Guía para IA y colaboradores](AGENTS.md)

## Límites y responsabilidad

La aplicación no calcula la capacidad portante ni un asentamiento geotécnico estratificado: la capacidad admisible, el módulo de balasto y los límites aplicables deben provenir del estudio geotécnico. Para la losa solo ofrece la pantalla preliminar `s=q/k` bajo hipótesis rígida. Tampoco sustituye el análisis estructural de placa, el detallado constructivo ni la revisión de un profesional competente.

```text
Entradas declaradas → motor determinista → verificaciones → resultados trazables → memoria revisable
```

AndeLogic no cambia datos, normas o hipótesis de manera silenciosa. Un caso fuera del alcance se bloquea o se marca expresamente como no evaluado.
