import { describe, expect, it } from 'vitest'
import { createNewProject } from '../projects'
import { calculatePreliminaryContact } from './preliminary-contact'

describe('calculatePreliminaryContact', () => {
  it('calcula presión promedio en kPa con carga en kN y área en m²', () => {
    const inputs = createNewProject().inputSnapshot
    inputs.axialLoadKn = 300
    inputs.allowableBearingKpa = 180

    const result = calculatePreliminaryContact(inputs)

    expect(result.grossAreaM2).toBe(2.25)
    expect(result.minimumRequiredAreaM2).toBeCloseTo(1.666666, 5)
    expect(result.equivalentSquareSideM).toBeCloseTo(1.290994, 5)
    expect(result.contactPressureKpa).toBeCloseTo(133.333333, 5)
    expect(result.utilization).toBeCloseTo(0.7407407, 5)
    expect(result.status).toBe('pass')
  })

  it('indica cuando la presión promedio supera la capacidad ingresada', () => {
    const inputs = createNewProject().inputSnapshot
    inputs.axialLoadKn = 450
    inputs.allowableBearingKpa = 180

    const result = calculatePreliminaryContact(inputs)

    expect(result.contactPressureKpa).toBe(200)
    expect(result.capacityMarginKpa).toBe(-20)
    expect(result.status).toBe('fail')
  })

  it('no calcula con datos físicos inválidos', () => {
    expect(() => calculatePreliminaryContact(createNewProject().inputSnapshot)).toThrow(RangeError)
  })
})
