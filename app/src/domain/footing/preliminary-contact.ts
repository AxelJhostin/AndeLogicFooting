import type { FootingInputs } from '../projects'

export type PreliminaryContactResult = {
  grossAreaM2: number
  minimumRequiredAreaM2: number
  equivalentSquareSideM: number
  contactPressureKpa: number
  allowableBearingKpa: number
  capacityMarginKpa: number
  utilization: number
  status: 'pass' | 'fail'
}

/**
 * Evaluación física preliminar de presión promedio: q = P / A.
 * No aplica combinaciones de carga, peso propio, excentricidad, asentamientos
 * ni verificaciones de hormigón. No es una verificación normativa NEC.
 */
export function calculatePreliminaryContact(inputs: FootingInputs): PreliminaryContactResult {
  const { axialLoadKn, allowableBearingKpa, footingWidthM, footingLengthM } = inputs
  const values = [axialLoadKn, allowableBearingKpa, footingWidthM, footingLengthM]

  if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new RangeError('La carga, la capacidad admisible y las dimensiones de zapata deben ser mayores que cero.')
  }

  const grossAreaM2 = footingWidthM * footingLengthM
  const minimumRequiredAreaM2 = axialLoadKn / allowableBearingKpa
  const equivalentSquareSideM = Math.sqrt(minimumRequiredAreaM2)
  const contactPressureKpa = axialLoadKn / grossAreaM2
  const capacityMarginKpa = allowableBearingKpa - contactPressureKpa
  const utilization = contactPressureKpa / allowableBearingKpa

  return {
    grossAreaM2,
    minimumRequiredAreaM2,
    equivalentSquareSideM,
    contactPressureKpa,
    allowableBearingKpa,
    capacityMarginKpa,
    utilization,
    status: contactPressureKpa <= allowableBearingKpa ? 'pass' : 'fail',
  }
}
