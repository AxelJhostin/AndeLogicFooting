# Zapata corrida bajo muro centrado

## Decisión de alcance

El segundo tipo de cimentación de AndeLogic es una **zapata corrida de ancho constante bajo un muro continuo**, evaluada mediante una franja longitudinal de `1.00 m`.

El caso incluido requiere:

- muro centrado sobre el ancho de la zapata;
- carga vertical lineal centrada, de servicio y última, declarada en `kN/m`;
- reacción uniforme del suelo;
- sección y materiales constantes;
- hormigón de peso normal para las referencias de resistencia disponibles.

No se aproxima silenciosamente un muro excéntrico, una viga de cimentación ni una fila de columnas como zapata corrida.

## Cadena de cálculo implementada

| Módulo | Base registrada | Expresión del motor | Estado técnico |
| --- | --- | --- | --- |
| Contacto de servicio | Equilibrio de una franja de `1.00 m` | `q = Ptotal / B` | Cálculo determinista; capacidad admisible externa. |
| Presión última | Equilibrio de una franja de `1.00 m` | `qu = Pu / B` | Cálculo determinista con carga última declarada. |
| Voladizo transversal | Geometría de muro centrado | `a = (B - tv) / 2` | Cálculo determinista. |
| Cortante transversal | Demanda por equilibrio; resistencia de Guía práctica NEC 2015, sección 1.10.1 | `Vu = qu × max(a-d,0) × 1 m` | Referencia de guía adaptada a franja; contraste independiente pendiente. |
| Flexión transversal | Equilibrio de voladizo con carga uniforme | `Mu = qu × 1 m × a² / 2` | Demanda calculada, no estado de aprobación. |
| Acero transversal | Guía práctica NEC 2015, sección 1.10.5 | Requerido por flexión comparado con mínimo y colocado | Referencia adaptada a franja; detallado integral pendiente. |
| Acero longitudinal | Mínimo de guía de la sección 1.10.5 | Mínimo comparado con acero colocado | Distribución preliminar, sin análisis longitudinal de extremos. |
| Desarrollo | Ejemplo de Guía práctica NEC 2015, sección 1.10.6 | Longitud requerida comparada con longitud declarada | Factores unitarios y hormigón normal; referencia en validación. |

Las ecuaciones de resistencia existentes no se modificaron. El nuevo orquestador reutiliza los módulos puros de referencia para una sección de un metro y conserva sus estados `guide-reference-only`.

## Revisiones no aplicables o excluidas

- Punzonamiento de columna: no aplica al modelo continuo bajo muro.
- Extremos, esquinas, encuentros, aberturas y cambios de sección.
- Excentricidad, momento lineal, distribución triangular/trapezoidal y levantamiento.
- Comportamiento longitudinal de una zapata bajo columnas discretas.
- Vigas de cimentación, contratrabes y conexión muro-zapata.
- Capacidad portante calculada internamente y asentamientos.
- Plano constructivo definitivo, empalmes y detalles de obra.

## Arquitectura

- `domain/strip-footing/`: validación, demandas, composición de referencias y resultados puros.
- `application/strip-footing-analysis.ts`: frontera única para analizar el snapshot de zapata corrida.
- `reports/strip-footing-calculation-report.ts`: contrato de memoria, entradas y límites.
- `ui/strip-footing/`: campos, tarjetas, memoria y componentes del flujo específico.
- `components/StripFootingTechnicalSheets.tsx`: sección, planta y armado, alimentados exclusivamente por entradas y resultados.

El documento de proyecto conserva snapshots independientes para zapata aislada y corrida. `footingType` selecciona cuál está activo; abrir proyectos anteriores añade el snapshot nuevo mediante una migración sin alterar sus entradas aisladas.

## Criterio de liberación futuro

Antes de presentar las referencias adaptadas como verificación normativa debe existir al menos un caso manual independiente de zapata corrida y un segundo contraste numérico compatible con el mismo perfil, hipótesis, unidades y secciones de fuente. Hasta entonces la interfaz distingue `Calculado`, `Dentro de referencia` y `Requiere ajuste`.
