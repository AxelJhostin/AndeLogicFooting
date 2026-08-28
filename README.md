# AndeLogic Zapatas — Producto 01

Producto de **AndeLogic Engineering** para revisar zapatas aisladas rectangulares de forma trazable. El nombre anterior `andelogic-footing` se conserva únicamente como identificador local de almacenamiento para no perder proyectos creados durante el prototipo.

Herramienta especializada para el diseño y la verificación de **zapatas aisladas rectangulares de hormigón armado**. Es el primer producto oficial nuevo de AndeLogic Engineering; no reutiliza ni reemplaza PreDim NEC.

## Estado

**Fase de definición y validación.** Ya existe un prototipo de interfaz para probar la biblioteca local, los archivos portables, el contacto de servicio centrado y la demanda de cortante unidireccional en ambos ejes. El contacto permite comparar en base bruta o neta. El módulo de cortante muestra presión última, profundidad efectiva, áreas tributarias y acciones, pero todavía no calcula resistencia ni cumplimiento normativo. Punzonamiento, flexión y refuerzo siguen pendientes.

## Probar el prototipo

Requiere Node.js 20 o superior. En una terminal:

```bash
cd /Users/hernandezaxel/Documents/ChatGPT/AndeLogicFooting/app
npm run dev
```

Abre la dirección que muestre la terminal, normalmente [http://localhost:5173](http://localhost:5173). Para comprobar la persistencia:

1. Escribe un nombre y algunos valores de prueba.
2. Pulsa **Guardar en este equipo**.
3. Recarga la página y abre el proyecto desde la biblioteca local.
4. Pulsa **Descargar archivo**, luego **Abrir archivo** para importarlo como copia en el mismo navegador u otro equipo.
5. Define si la capacidad del informe geotécnico es **bruta** o **neta**, ingresa el esfuerzo removido si aplica y pulsa **Calcular contacto de servicio**. El resultado separa peso propio, relleno, presión bruta y presión neta.
6. Ingresa la carga axial última, recubrimiento y diámetro considerado; pulsa **Calcular demanda de cortante** para revisar ambos ejes y las secciones discontinuas de la planta.
6. Pulsa **Imprimir informe** si quieres entregar el caso y sus supuestos a un revisor.

El contacto y la demanda de cortante suponen columna centrada y presión uniforme. No evalúan asentamientos, excentricidad, volcamiento ni deslizamiento. La demanda de cortante no incluye aún resistencia del hormigón; tampoco están implementados punzonamiento, flexión ni armado. El prototipo no produce todavía un diseño completo de cimentación.

## Documentación

- [Brief de producto](docs/01-product-brief.md)
- [Alcance y normativa](docs/02-scope-and-norms.md)
- [Arquitectura técnica](docs/03-technical-architecture.md)
- [Validación y aceptación](docs/04-validation-and-acceptance.md)
- [Roadmap](docs/05-roadmap.md)
- [Trazabilidad normativa](docs/06-normative-traceability.md)
- [Registro de casos de validación](docs/07-validation-case-register.md)
- [Persistencia y archivos de proyecto](docs/08-project-persistence.md)
- [Protocolo de contraste externo](docs/09-external-benchmark-protocol.md)
- [Fichas de implementación de Axel Code](docs/10-axel-code-implementation-cards.md)
- [Guía de contribución para IA y colaboradores](AGENTS.md)

## Principio rector

```text
Entradas declaradas → motor normativo determinista → verificaciones → resultados trazables → informe revisable
                                      ↑
                         IA opcional para explicar, nunca para decidir
```

La herramienta no inventará ecuaciones, no cambiará datos silenciosamente y no sustituirá el estudio geotécnico, el análisis global ni el criterio del profesional responsable.

## Propiedad de los datos

El producto será **local-first**: el usuario podrá guardar varios proyectos en su propio equipo y exportarlos para respaldo, envío o apertura en otra computadora. La primera versión no requerirá cuenta, servidor ni sincronización en la nube. El archivo exportado será el mecanismo de respaldo portable; una base de datos local no sustituye una copia que el usuario decida conservar.
