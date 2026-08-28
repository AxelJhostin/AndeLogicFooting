export const centeredFootingReferenceCase = {
  id: 'NEC-FTG-REF-001',
  title: 'Zapata aislada rectangular centrada - cadena interna de referencia',
  profile: 'NEC-PUBLIC-2014-PENDING',
  source: 'Guía práctica NEC 2015, secciones 1.10.1 a 1.10.6; valores de demanda propios con presión uniforme.',
  assumptions: [
    'Columna interior centrada.',
    'Presión última uniforme.',
    'Hormigón de peso normal.',
    'Barra sin recubrimiento especial y coeficientes unitarios para desarrollo.',
  ],
  inputs: {
    appliedServiceLoadKn: 450,
    factoredAxialLoadKn: 900,
    footingWidthM: 2,
    footingLengthM: 3,
    footingThicknessM: 0.5,
    concreteUnitWeightKnM3: 24,
    soilCoverDepthM: 0,
    soilUnitWeightKnM3: 0,
    allowableBearingKpa: 180,
    removedOverburdenKpa: 0,
    concreteStrengthMpa: 23.54,
    steelYieldStrengthMpa: 412.08,
    columnWidthM: 0.4,
    columnLengthM: 0.6,
    concreteCoverM: 0.075,
    barDiameterM: 0.016,
    barsParallelToWidthMaxSpacingM: 0.15,
    barsParallelToLengthMaxSpacingM: 0.15,
    developmentAvailableLengthWidthM: 1.3,
    developmentAvailableLengthLengthM: 1.3,
  },
  expected: {
    serviceContactPressureKpa: 87,
    oneWayWidthDemandKn: 172.35,
    oneWayLengthDemandKn: 234.9,
    punchingDemandKn: 775.36665,
    flexureWidthMomentKnM: 144,
    flexureLengthMomentKnM: 216,
  },
} as const

export const serviceContactFailureCase = {
  id: 'NEC-FTG-REF-002',
  title: 'Contacto de servicio por encima de capacidad declarada',
  inputs: {
    appliedServiceLoadKn: 900,
    footingWidthM: 2,
    footingLengthM: 2,
    footingThicknessM: 0.5,
    concreteUnitWeightKnM3: 24,
    soilCoverDepthM: 0,
    soilUnitWeightKnM3: 0,
    allowableBearingKpa: 100,
    removedOverburdenKpa: 0,
  },
} as const

export const reinforcementFailureCase = {
  id: 'NEC-FTG-REF-003',
  title: 'Refuerzo declarado insuficiente frente a referencia de guía',
  inputs: {
    ...centeredFootingReferenceCase.inputs,
    barsParallelToWidthMaxSpacingM: 0.3,
    barsParallelToLengthMaxSpacingM: 0.3,
  },
} as const
