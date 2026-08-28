import { describe, expect, it } from 'vitest'
import { calculateServiceContact, type ServiceContactInputs } from './service-contact'

const baseInputs: ServiceContactInputs = {
  appliedServiceLoadKn: 300,
  footingWidthM: 1.5,
  footingLengthM: 1.5,
  footingThicknessM: 0.45,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  allowableBearingKpa: 180,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
}

describe('calculateServiceContact', () => {
  it('incluye el peso propio de la zapata en la presión bruta de servicio', () => {
    const result = calculateServiceContact(baseInputs)

    expect(result.grossAreaM2).toBe(2.25)
    expect(result.footingSelfWeightKn).toBeCloseTo(24.3, 8)
    expect(result.soilCoverWeightKn).toBe(0)
    expect(result.totalServiceLoadKn).toBeCloseTo(324.3, 8)
    expect(result.grossContactPressureKpa).toBeCloseTo(144.133333, 6)
    expect(result.pressureForComparisonKpa).toBeCloseTo(144.133333, 6)
    expect(result.status).toBe('pass')
  })

  it('calcula presión neta al descontar el esfuerzo removido cuando el informe declara capacidad neta', () => {
    const result = calculateServiceContact({
      ...baseInputs,
      bearingCapacityBasis: 'net',
      allowableBearingKpa: 120,
      removedOverburdenKpa: 30,
    })

    expect(result.grossContactPressureKpa).toBeCloseTo(144.133333, 6)
    expect(result.netContactPressureKpa).toBeCloseTo(114.133333, 6)
    expect(result.pressureForComparisonKpa).toBeCloseTo(114.133333, 6)
    expect(result.status).toBe('pass')
  })

  it('incorpora el peso de relleno cuando se declara profundidad y peso unitario', () => {
    const result = calculateServiceContact({
      ...baseInputs,
      soilCoverDepthM: 0.6,
      soilUnitWeightKnM3: 18,
    })

    expect(result.soilCoverWeightKn).toBeCloseTo(24.3, 8)
    expect(result.grossContactPressureKpa).toBeCloseTo(154.933333, 6)
  })

  it('informa cuando no existe área finita que satisfaga la capacidad por la carga distribuida declarada', () => {
    const result = calculateServiceContact({
      ...baseInputs,
      allowableBearingKpa: 8,
    })

    expect(result.minimumRequiredAreaM2).toBeNull()
    expect(result.status).toBe('fail')
  })

  it('rechaza datos físicos inválidos y capacidad neta sin esfuerzo removido', () => {
    expect(() => calculateServiceContact({ ...baseInputs, concreteUnitWeightKnM3: 0 })).toThrow(RangeError)
    expect(() => calculateServiceContact({ ...baseInputs, bearingCapacityBasis: 'net', removedOverburdenKpa: -1 })).toThrow(RangeError)
  })
})
