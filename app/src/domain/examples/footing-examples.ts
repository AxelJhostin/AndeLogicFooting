import {
  DEFAULT_COMBINED_FOOTING_INPUTS,
  DEFAULT_CORNER_FOOTING_INPUTS,
  DEFAULT_EDGE_FOOTING_INPUTS,
  DEFAULT_MAT_FOOTING_INPUTS,
  DEFAULT_STRAP_FOOTING_INPUTS,
  DEFAULT_STRIP_FOOTING_INPUTS,
  DEFAULT_TRAPEZOIDAL_FOOTING_INPUTS,
  type CombinedFootingInputs,
  type CornerFootingInputs,
  type EdgeFootingInputs,
  type FootingInputs,
  type FootingType,
  type MatFootingInputs,
  type ProjectDocument,
  type StrapFootingInputs,
  type StripFootingInputs,
  type TrapezoidalFootingInputs,
} from '../projects'

export type FootingExampleCategory = 'reference' | 'variation' | 'boundary'
export type FootingExampleExpectation = 'calculated' | 'attention' | 'blocked'

type FootingExampleBase<TType extends FootingType, TInputs> = {
  id: string
  footingType: TType
  category: FootingExampleCategory
  expectation: FootingExampleExpectation
  label: string
  projectName: string
  description: string
  expectedObservation: string
  inputs: TInputs
}

export type IsolatedFootingExample = FootingExampleBase<'isolated', FootingInputs>
export type StripFootingExample = FootingExampleBase<'strip', StripFootingInputs>
export type CombinedFootingExample = FootingExampleBase<'combined', CombinedFootingInputs>
export type StrapFootingExample = FootingExampleBase<'strap', StrapFootingInputs>
export type TrapezoidalFootingExample = FootingExampleBase<'trapezoidal', TrapezoidalFootingInputs>
export type EdgeFootingExample = FootingExampleBase<'edge', EdgeFootingInputs>
export type CornerFootingExample = FootingExampleBase<'corner', CornerFootingInputs>
export type MatFootingExample = FootingExampleBase<'mat', MatFootingInputs>

export type FootingExample =
  | IsolatedFootingExample
  | StripFootingExample
  | CombinedFootingExample
  | StrapFootingExample
  | TrapezoidalFootingExample
  | EdgeFootingExample
  | CornerFootingExample
  | MatFootingExample

export const FOOTING_TYPES: readonly FootingType[] = [
  'isolated',
  'strip',
  'combined',
  'strap',
  'trapezoidal',
  'edge',
  'corner',
  'mat',
]

const isolatedReference: FootingInputs = {
  axialLoadKn: 450,
  factoredAxialLoadKn: 900,
  allowableBearingKpa: 180,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  columnWidthM: 0.4,
  columnLengthM: 0.6,
  footingWidthM: 2,
  footingLengthM: 3,
  footingThicknessM: 0.5,
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  developmentAvailableLengthWidthM: 1.3,
  developmentAvailableLengthLengthM: 1.3,
  punchingCriticalSectionOffsetM: 0.21,
  barsParallelToWidthMaxSpacingM: 0.15,
  barsParallelToLengthMaxSpacingM: 0.15,
}

export const FOOTING_EXAMPLES: readonly FootingExample[] = [
  {
    id: 'isolated-reference-rectangular',
    footingType: 'isolated',
    category: 'reference',
    expectation: 'calculated',
    label: 'Rectangular · caso de referencia',
    projectName: 'Aislada rectangular · referencia',
    description: 'Columna centrada sobre una base 2.00 × 3.00 m con presión uniforme.',
    expectedObservation: 'Cadena completa calculada y contacto dentro de la capacidad declarada.',
    inputs: isolatedReference,
  },
  {
    id: 'isolated-square-net-capacity',
    footingType: 'isolated',
    category: 'variation',
    expectation: 'calculated',
    label: 'Cuadrada · capacidad neta y relleno',
    projectName: 'Aislada cuadrada · base neta',
    description: 'Base cuadrada con relleno declarado y comparación contra capacidad admisible neta.',
    expectedObservation: 'Diferencia visible entre presión bruta y neta, manteniendo contacto admisible.',
    inputs: {
      ...isolatedReference,
      axialLoadKn: 320,
      factoredAxialLoadKn: 480,
      allowableBearingKpa: 150,
      bearingCapacityBasis: 'net',
      removedOverburdenKpa: 15,
      soilCoverDepthM: 0.5,
      soilUnitWeightKnM3: 18,
      columnWidthM: 0.35,
      columnLengthM: 0.35,
      footingWidthM: 2,
      footingLengthM: 2,
      footingThicknessM: 0.45,
      developmentAvailableLengthWidthM: 0.8,
      developmentAvailableLengthLengthM: 0.8,
      punchingCriticalSectionOffsetM: 0.18,
    },
  },
  {
    id: 'isolated-bearing-attention',
    footingType: 'isolated',
    category: 'boundary',
    expectation: 'attention',
    label: 'Alerta · capacidad de suelo superada',
    projectName: 'Aislada · alerta de contacto',
    description: 'Conserva la geometría de referencia y reduce la capacidad admisible declarada.',
    expectedObservation: 'El cálculo termina, pero contacto de servicio queda marcado para ajuste.',
    inputs: { ...isolatedReference, allowableBearingKpa: 80 },
  },
  {
    id: 'strip-reference-wall',
    footingType: 'strip',
    category: 'reference',
    expectation: 'calculated',
    label: 'Muro centrado · caso base',
    projectName: 'Corrida · muro centrado',
    description: 'Franja de 1.00 m bajo un muro de 0.20 m y carga lineal centrada.',
    expectedObservation: 'Contacto, voladizo transversal, cortante, flexión y armado disponibles.',
    inputs: { ...DEFAULT_STRIP_FOOTING_INPUTS, developmentAvailableLengthM: 0.8 },
  },
  {
    id: 'strip-net-capacity-with-fill',
    footingType: 'strip',
    category: 'variation',
    expectation: 'calculated',
    label: 'Ancha · capacidad neta y relleno',
    projectName: 'Corrida · base neta con relleno',
    description: 'Aumenta el ancho e incorpora relleno para comparar presiones bruta y neta.',
    expectedObservation: 'Contacto admisible con una proyección transversal y demanda distintas al caso base.',
    inputs: {
      ...DEFAULT_STRIP_FOOTING_INPUTS,
      serviceLineLoadKnM: 150,
      factoredLineLoadKnM: 225,
      allowableBearingKpa: 150,
      bearingCapacityBasis: 'net',
      removedOverburdenKpa: 15,
      soilCoverDepthM: 0.5,
      soilUnitWeightKnM3: 18,
      footingWidthM: 1.5,
      footingThicknessM: 0.4,
      developmentAvailableLengthM: 0.7,
    },
  },
  {
    id: 'strip-bearing-attention',
    footingType: 'strip',
    category: 'boundary',
    expectation: 'attention',
    label: 'Alerta · capacidad de suelo superada',
    projectName: 'Corrida · alerta de contacto',
    description: 'Mantiene la carga y geometría base con una capacidad admisible menor.',
    expectedObservation: 'El cálculo termina y el contacto queda marcado como requiere ajuste.',
    inputs: { ...DEFAULT_STRIP_FOOTING_INPUTS, allowableBearingKpa: 140, developmentAvailableLengthM: 0.8 },
  },
  {
    id: 'combined-reference-unbalanced',
    footingType: 'combined',
    category: 'reference',
    expectation: 'calculated',
    label: 'Dos columnas · cargas distintas',
    projectName: 'Combinada rectangular · cargas distintas',
    description: 'Caso base con dos columnas interiores y una distribución lineal de presión.',
    expectedObservation: 'Presiones extremas distintas y equilibrio longitudinal completo.',
    inputs: { ...DEFAULT_COMBINED_FOOTING_INPUTS },
  },
  {
    id: 'combined-balanced-manual',
    footingType: 'combined',
    category: 'variation',
    expectation: 'calculated',
    label: 'Simétrica · presión uniforme',
    projectName: 'Combinada rectangular · simétrica',
    description: 'Dos cargas iguales ubicadas simétricamente sobre una base 2.00 × 6.00 m.',
    expectedObservation: 'Presión uniforme y reproducción del caso manual AXC-COMB-001.',
    inputs: {
      ...DEFAULT_COMBINED_FOOTING_INPUTS,
      serviceColumn1LoadKn: 600,
      serviceColumn2LoadKn: 600,
      factoredColumn1LoadKn: 900,
      factoredColumn2LoadKn: 900,
      allowableBearingKpa: 180,
      footingWidthM: 2,
      footingLengthM: 6,
      footingThicknessM: 0.5,
      column1WidthM: 0.4,
      column1LengthM: 0.4,
      column1CenterFromLeftM: 1,
      column2WidthM: 0.4,
      column2LengthM: 0.4,
      column2CenterFromLeftM: 5,
      longitudinalDevelopmentAvailableM: 0.8,
      transverseDevelopmentAvailableM: 0.8,
    },
  },
  {
    id: 'combined-contact-loss',
    footingType: 'combined',
    category: 'boundary',
    expectation: 'blocked',
    label: 'Bloqueo · pérdida de contacto',
    projectName: 'Combinada rectangular · fuera del núcleo',
    description: 'Carga muy desbalanceada para llevar la resultante fuera del contacto completo.',
    expectedObservation: 'El análisis se bloquea y explica que el contacto parcial está fuera de alcance.',
    inputs: {
      ...DEFAULT_COMBINED_FOOTING_INPUTS,
      serviceColumn1LoadKn: 100,
      serviceColumn2LoadKn: 1000,
      factoredColumn1LoadKn: 100,
      factoredColumn2LoadKn: 1500,
      footingWidthM: 2,
      footingLengthM: 6,
      footingThicknessM: 0.5,
      column1WidthM: 0.4,
      column1LengthM: 0.4,
      column1CenterFromLeftM: 0.5,
      column2WidthM: 0.4,
      column2LengthM: 0.4,
      column2CenterFromLeftM: 5.5,
    },
  },
  {
    id: 'strap-reference-transfer',
    footingType: 'strap',
    category: 'reference',
    expectation: 'calculated',
    label: 'Medianera · transferencia base',
    projectName: 'Medianera · equilibrio de referencia',
    description: 'Dos bases separadas y una viga centradora con excentricidad de 0.30 m.',
    expectedObservation: 'Reproduce reacciones y transferencia del caso manual AXC-STRAP-001.',
    inputs: { ...DEFAULT_STRAP_FOOTING_INPUTS },
  },
  {
    id: 'strap-longer-spacing',
    footingType: 'strap',
    category: 'variation',
    expectation: 'calculated',
    label: 'Mayor separación · menor transferencia',
    projectName: 'Medianera · separación ampliada',
    description: 'Separa más las bases y modifica cargas y geometría para comparar la viga centradora.',
    expectedObservation: 'Reacciones positivas con una transferencia distinta al caso base.',
    inputs: {
      ...DEFAULT_STRAP_FOOTING_INPUTS,
      serviceExteriorLoadKn: 500,
      serviceInteriorLoadKn: 850,
      factoredExteriorLoadKn: 750,
      factoredInteriorLoadKn: 1275,
      exteriorFootingWidthM: 2.2,
      exteriorFootingLengthM: 1.8,
      footingCenterSpacingM: 5.5,
      exteriorColumnCenterFromOuterEdgeM: 0.45,
    },
  },
  {
    id: 'strap-interior-reaction-loss',
    footingType: 'strap',
    category: 'boundary',
    expectation: 'blocked',
    label: 'Bloqueo · reacción interior negativa',
    projectName: 'Medianera · pérdida de reacción interior',
    description: 'Una carga exterior extrema hace desaparecer la compresión en la base interior.',
    expectedObservation: 'El análisis se bloquea porque ambas reacciones deben permanecer positivas.',
    inputs: {
      ...DEFAULT_STRAP_FOOTING_INPUTS,
      factoredExteriorLoadKn: 5000,
      factoredInteriorLoadKn: 100,
    },
  },
  {
    id: 'trapezoidal-reference-centroid',
    footingType: 'trapezoidal',
    category: 'reference',
    expectation: 'calculated',
    label: 'Trapecio · resultante en centroide',
    projectName: 'Trapezoidal · referencia uniforme',
    description: 'El centroide del trapecio coincide con la resultante de las dos columnas.',
    expectedObservation: 'Presión uniforme y reproducción del caso manual AXC-TRAP-001.',
    inputs: { ...DEFAULT_TRAPEZOIDAL_FOOTING_INPUTS },
  },
  {
    id: 'trapezoidal-linear-pressure',
    footingType: 'trapezoidal',
    category: 'variation',
    expectation: 'calculated',
    label: 'Carga gobernante · presión lineal',
    projectName: 'Trapezoidal · presión lineal',
    description: 'Aumenta la carga de la segunda columna sin cambiar el trapecio.',
    expectedObservation: 'La presión crece hacia el extremo derecho y el equilibrio se conserva.',
    inputs: {
      ...DEFAULT_TRAPEZOIDAL_FOOTING_INPUTS,
      serviceColumn2LoadKn: 800,
      factoredColumn2LoadKn: 1200,
    },
  },
  {
    id: 'trapezoidal-contact-loss',
    footingType: 'trapezoidal',
    category: 'boundary',
    expectation: 'blocked',
    label: 'Bloqueo · presión extrema negativa',
    projectName: 'Trapezoidal · pérdida de contacto',
    description: 'Desbalancea las cargas hasta producir pérdida de contacto completo.',
    expectedObservation: 'El análisis se bloquea sin recortar silenciosamente el área activa.',
    inputs: {
      ...DEFAULT_TRAPEZOIDAL_FOOTING_INPUTS,
      serviceColumn1LoadKn: 50,
      serviceColumn2LoadKn: 1500,
      factoredColumn1LoadKn: 50,
      factoredColumn2LoadKn: 2200,
      column1CenterFromLeftM: 0.5,
      column2CenterFromLeftM: 5.5,
    },
  },
  {
    id: 'edge-reference-left',
    footingType: 'edge',
    category: 'reference',
    expectation: 'calculated',
    label: 'Borde izquierdo · referencia',
    projectName: 'Excéntrica · borde izquierdo',
    description: 'Columna alineada al lindero izquierdo con contacto completo.',
    expectedObservation: 'Presión máxima junto al lindero y reproducción de AXC-ECC-001.',
    inputs: { ...DEFAULT_EDGE_FOOTING_INPUTS },
  },
  {
    id: 'edge-mirrored-right',
    footingType: 'edge',
    category: 'variation',
    expectation: 'calculated',
    label: 'Borde derecho · caso espejo',
    projectName: 'Excéntrica · borde derecho',
    description: 'Refleja la misma geometría hacia el lindero derecho.',
    expectedObservation: 'Las magnitudes se conservan y las presiones extremas se intercambian.',
    inputs: { ...DEFAULT_EDGE_FOOTING_INPUTS, edgeSide: 'right' },
  },
  {
    id: 'edge-outside-middle-third',
    footingType: 'edge',
    category: 'boundary',
    expectation: 'blocked',
    label: 'Bloqueo · fuera del tercio central',
    projectName: 'Excéntrica · fuera del tercio central',
    description: 'Alarga la base sin mover la columna y lleva la resultante fuera del núcleo permitido.',
    expectedObservation: 'El análisis se bloquea porque requeriría modelar contacto parcial.',
    inputs: { ...DEFAULT_EDGE_FOOTING_INPUTS, footingLengthM: 1.2 },
  },
  {
    id: 'corner-reference-bottom-left',
    footingType: 'corner',
    category: 'reference',
    expectation: 'calculated',
    label: 'Esquina inferior izquierda · referencia',
    projectName: 'Esquina biaxial · referencia',
    description: 'Columna alineada con los bordes inferior e izquierdo y contacto completo en las cuatro esquinas.',
    expectedObservation: 'Reproduce AXC-CORNER-001, la interacción biaxial y el cierre de los dos momentos.',
    inputs: { ...DEFAULT_CORNER_FOOTING_INPUTS },
  },
  {
    id: 'corner-mirrored-top-right',
    footingType: 'corner',
    category: 'variation',
    expectation: 'calculated',
    label: 'Esquina superior derecha · espejo',
    projectName: 'Esquina biaxial · caso espejo',
    description: 'Refleja la geometría de referencia hacia los bordes superior y derecho.',
    expectedObservation: 'Conserva magnitudes y utilización, intercambiando las cuatro presiones de esquina.',
    inputs: { ...DEFAULT_CORNER_FOOTING_INPUTS, cornerPosition: 'top-right' },
  },
  {
    id: 'corner-biaxial-contact-loss',
    footingType: 'corner',
    category: 'boundary',
    expectation: 'blocked',
    label: 'Bloqueo · fuera del núcleo biaxial',
    projectName: 'Esquina biaxial · pérdida de contacto',
    description: 'Amplía la base manteniendo la columna en esquina hasta que la interacción biaxial supera la unidad.',
    expectedObservation: 'El motor bloquea el caso aunque cada excentricidad aislada permanezca dentro de su sexto.',
    inputs: { ...DEFAULT_CORNER_FOOTING_INPUTS, footingWidthM: 0.6, footingLengthM: 0.6 },
  },
  {
    id: 'mat-rigid-winkler-reference',
    footingType: 'mat',
    category: 'reference',
    expectation: 'calculated',
    label: 'Cuatro columnas · referencia rígida–Winkler',
    projectName: 'Losa de cimentación · referencia',
    description: 'Losa rectangular con cuatro columnas, plano biaxial de contacto y módulo de balasto declarado.',
    expectedObservation: 'Reproduce AXC-MAT-001, cierra fuerza y momentos y muestra asentamientos preliminares en las cuatro esquinas.',
    inputs: { ...DEFAULT_MAT_FOOTING_INPUTS, columns: DEFAULT_MAT_FOOTING_INPUTS.columns.map((column) => ({ ...column })) },
  },
  {
    id: 'mat-symmetric-six-columns',
    footingType: 'mat',
    category: 'variation',
    expectation: 'calculated',
    label: 'Seis columnas · distribución simétrica',
    projectName: 'Losa de cimentación · seis columnas',
    description: 'Malla simétrica de seis columnas con cargas iguales y resultante coincidente con el centroide de la losa.',
    expectedObservation: 'Las cuatro presiones y asentamientos coinciden; las excentricidades globales son nulas.',
    inputs: {
      ...DEFAULT_MAT_FOOTING_INPUTS,
      columns: [2, 4, 6].flatMap((x, xIndex) => [1.5, 4.5].map((y, yIndex) => ({
        id: `C${xIndex * 2 + yIndex + 1}`, label: `Columna ${xIndex * 2 + yIndex + 1}`,
        serviceLoadKn: 500, factoredLoadKn: 750, widthM: 0.5, lengthM: 0.5, centerXM: x, centerYM: y,
      }))),
    },
  },
  {
    id: 'mat-biaxial-contact-loss',
    footingType: 'mat',
    category: 'boundary',
    expectation: 'blocked',
    label: 'Bloqueo · carga extrema en una esquina',
    projectName: 'Losa de cimentación · pérdida de contacto',
    description: 'Concentra casi toda la carga en una columna para llevar la resultante fuera del núcleo central biaxial.',
    expectedObservation: 'El motor detiene el análisis porque la hipótesis de contacto completo deja de ser válida.',
    inputs: {
      ...DEFAULT_MAT_FOOTING_INPUTS,
      columns: DEFAULT_MAT_FOOTING_INPUTS.columns.map((column, index) => ({
        ...column, serviceLoadKn: index === 0 ? 10000 : 10, factoredLoadKn: index === 0 ? 15000 : 15,
      })),
    },
  },
]

export function examplesForFootingType(footingType: FootingType): FootingExample[] {
  return FOOTING_EXAMPLES.filter((example) => example.footingType === footingType)
}

export function defaultExampleForFootingType(footingType: FootingType): FootingExample {
  const example = FOOTING_EXAMPLES.find((candidate) => candidate.footingType === footingType && candidate.category === 'reference')
  if (!example) throw new Error(`No existe un ejemplo de referencia para ${footingType}.`)
  return example
}

export function applyFootingExample(project: ProjectDocument, example: FootingExample): ProjectDocument {
  const shared = { ...project, footingType: example.footingType, name: example.projectName }
  switch (example.footingType) {
    case 'isolated': return { ...shared, inputSnapshot: { ...example.inputs } }
    case 'strip': return { ...shared, stripInputSnapshot: { ...example.inputs } }
    case 'combined': return { ...shared, combinedInputSnapshot: { ...example.inputs } }
    case 'strap': return { ...shared, strapInputSnapshot: { ...example.inputs } }
    case 'trapezoidal': return { ...shared, trapezoidalInputSnapshot: { ...example.inputs } }
    case 'edge': return { ...shared, edgeInputSnapshot: { ...example.inputs } }
    case 'corner': return { ...shared, cornerInputSnapshot: { ...example.inputs } }
    case 'mat': return { ...shared, matInputSnapshot: { ...example.inputs, columns: example.inputs.columns.map((column) => ({ ...column })) } }
  }
}
