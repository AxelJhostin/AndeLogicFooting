export type BearingCapacityBasis = 'gross' | 'net'

export type ServiceContactInputs = {
  appliedServiceLoadKn: number
  footingWidthM: number
  footingLengthM: number
  footingThicknessM: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  allowableBearingKpa: number
  bearingCapacityBasis: BearingCapacityBasis
  removedOverburdenKpa: number
}

export type ServiceContactResult = {
  grossAreaM2: number
  footingSelfWeightKn: number
  soilCoverWeightKn: number
  totalServiceLoadKn: number
  grossContactPressureKpa: number
  netContactPressureKpa: number
  pressureForComparisonKpa: number
  allowableBearingKpa: number
  bearingCapacityBasis: BearingCapacityBasis
  capacityMarginKpa: number
  utilization: number
  minimumRequiredAreaM2: number | null
  equivalentSquareSideM: number | null
  status: 'pass' | 'fail'
}

const positive = (value: number) => Number.isFinite(value) && value > 0
const nonNegative = (value: number) => Number.isFinite(value) && value >= 0

/**
 * Presión de contacto de servicio para una zapata rectangular con carga centrada.
 * Compara bases homogéneas: presión bruta con qadm bruta o presión neta con qadm neta.
 * No evalúa asentamientos, excentricidad, estabilidad ni resistencia del hormigón.
 */
export function calculateServiceContact(inputs: ServiceContactInputs): ServiceContactResult {
  const {
    appliedServiceLoadKn,
    footingWidthM,
    footingLengthM,
    footingThicknessM,
    concreteUnitWeightKnM3,
    soilCoverDepthM,
    soilUnitWeightKnM3,
    allowableBearingKpa,
    bearingCapacityBasis,
    removedOverburdenKpa,
  } = inputs

  if (
    !positive(appliedServiceLoadKn) ||
    !positive(footingWidthM) ||
    !positive(footingLengthM) ||
    !positive(footingThicknessM) ||
    !positive(concreteUnitWeightKnM3) ||
    !nonNegative(soilCoverDepthM) ||
    !nonNegative(soilUnitWeightKnM3) ||
    !positive(allowableBearingKpa) ||
    !nonNegative(removedOverburdenKpa) ||
    (bearingCapacityBasis !== 'gross' && bearingCapacityBasis !== 'net')
  ) {
    throw new RangeError('Las entradas de contacto de servicio no son físicamente válidas.')
  }

  if (soilCoverDepthM > 0 && soilUnitWeightKnM3 === 0) {
    throw new RangeError('El relleno requiere un peso unitario de suelo mayor que cero.')
  }

  const grossAreaM2 = footingWidthM * footingLengthM
  const footingSelfWeightKn = grossAreaM2 * footingThicknessM * concreteUnitWeightKnM3
  const soilCoverWeightKn = grossAreaM2 * soilCoverDepthM * soilUnitWeightKnM3
  const totalServiceLoadKn = appliedServiceLoadKn + footingSelfWeightKn + soilCoverWeightKn
  const grossContactPressureKpa = totalServiceLoadKn / grossAreaM2
  const netContactPressureKpa = grossContactPressureKpa - removedOverburdenKpa
  const pressureForComparisonKpa =
    bearingCapacityBasis === 'gross' ? grossContactPressureKpa : netContactPressureKpa
  const capacityMarginKpa = allowableBearingKpa - pressureForComparisonKpa
  const utilization = pressureForComparisonKpa / allowableBearingKpa
  const distributedLoadPressureKpa =
    footingThicknessM * concreteUnitWeightKnM3 + soilCoverDepthM * soilUnitWeightKnM3
  const capacityAvailableForAppliedLoadKpa =
    bearingCapacityBasis === 'gross'
      ? allowableBearingKpa - distributedLoadPressureKpa
      : allowableBearingKpa + removedOverburdenKpa - distributedLoadPressureKpa
  const minimumRequiredAreaM2 =
    capacityAvailableForAppliedLoadKpa > 0
      ? appliedServiceLoadKn / capacityAvailableForAppliedLoadKpa
      : null

  return {
    grossAreaM2,
    footingSelfWeightKn,
    soilCoverWeightKn,
    totalServiceLoadKn,
    grossContactPressureKpa,
    netContactPressureKpa,
    pressureForComparisonKpa,
    allowableBearingKpa,
    bearingCapacityBasis,
    capacityMarginKpa,
    utilization,
    minimumRequiredAreaM2,
    equivalentSquareSideM: minimumRequiredAreaM2 === null ? null : Math.sqrt(minimumRequiredAreaM2),
    status: pressureForComparisonKpa <= allowableBearingKpa ? 'pass' : 'fail',
  }
}
