# AndeLogic Footing — Producto 01

> Nombre interno provisional: `andelogic-footing`. El nombre comercial se decidirá después de validar identidad, dominio y arquitectura de productos.

Herramienta especializada para el diseño y la verificación de **zapatas aisladas rectangulares de hormigón armado**. Es el primer producto oficial nuevo de AndeLogic Engineering; no reutiliza ni reemplaza PreDim NEC.

## Estado

**Fase de definición y validación.** Ya existe un prototipo de interfaz para probar la biblioteca local, los archivos portables y la presión media de contacto experimental. El motor normativo de diseño todavía no está implementado; ningún resultado podrá considerarse profesional hasta completar los casos de validación y la revisión técnica definidos en este repositorio.

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
5. Pulsa **Calcular contacto preliminar** para evaluar `P / A`, el área mínima orientativa y el lado cuadrado equivalente frente a la capacidad admisible que ingresaste.
6. Pulsa **Imprimir informe** si quieres entregar el caso y sus supuestos a un revisor.

La presión media es un resultado experimental con carga centrada y presión uniforme. No incorpora peso propio, combinaciones de carga, excentricidad, asentamientos, cortantes, punzonamiento, flexión ni armado; no produce un diseño de cimentación.

## Documentación

- [Brief de producto](docs/01-product-brief.md)
- [Alcance y normativa](docs/02-scope-and-norms.md)
- [Arquitectura técnica](docs/03-technical-architecture.md)
- [Validación y aceptación](docs/04-validation-and-acceptance.md)
- [Roadmap](docs/05-roadmap.md)
- [Trazabilidad normativa](docs/06-normative-traceability.md)
- [Registro de casos de validación](docs/07-validation-case-register.md)
- [Persistencia y archivos de proyecto](docs/08-project-persistence.md)
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
