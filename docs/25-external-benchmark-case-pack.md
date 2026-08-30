# Paquete de casos para contraste externo

## Propósito

Este paquete convierte el protocolo de `09-external-benchmark-protocol.md` en un formato operativo para las ocho familias congeladas. No contiene resultados atribuidos a terceros: prepara entradas, resultados internos, tolerancias y espacios de evidencia para que cada observación externa pueda reconstruirse y auditarse.

## Caso principal por familia

Cada familia utiliza su ejemplo rápido de categoría `reference` como caso canónico. El catálogo en código conserva el ID del ejemplo, el perfil `NEC-2015-GUIDE-TRACEABLE`, una firma de hipótesis estable, el snapshot completo de entradas y tres métricas finitas producidas por el orquestador normal de la aplicación.

Las métricas priorizan equilibrio, contacto y demandas reproducibles. Un resultado marcado como `not-evaluated` no se transforma en una cifra para llenar el paquete. En particular, la placa, el punzonamiento y el armado de la losa permanecen fuera del benchmark estructural actual.

## Evidencia mínima

Por cada métrica se reservan tres observaciones independientes:

1. una referencia pública o desarrollo independiente reproducible;
2. un primer programa externo identificado por producto y versión;
3. un segundo programa externo independiente, también identificado por producto y versión.

Cada observación registra clase, fuente, versión, perfil, firma de hipótesis, valor, unidad, URL o archivo de evidencia, fecha y responsable. Una celda vacía conserva el estado `PENDIENTE`; nunca equivale a cero.

## Tolerancias

La tolerancia absoluta se declara por métrica antes de observar resultados externos. La tolerancia relativa inicial es `0.5 %`. Una observación compatible cumple al menos una de las dos. La tolerancia no se amplía después del contraste para esconder una discrepancia.

## Archivos operativos

- `app/src/validation/benchmarks/family-case-catalog.ts`: fuente tipada de casos y métricas internas.
- `app/src/validation/benchmarks/family-case-catalog.spec.ts`: cobertura, unicidad, finitud y consistencia del catálogo.
- `outputs/01a04a13-8bed-7161-8f79-2eef8fed266d/AndeLogic-Paquete-Contraste-Externo.xlsx`: interfaz editable para transcribir y revisar evidencia.

## Criterio de avance

El libro preparado no aumenta por sí mismo el contador de evidencias de `release-gate.ts`. Solo una observación completa, compatible y conservada en el repositorio podrá incorporarse después al catálogo de fuentes y a las comparaciones automatizadas.
