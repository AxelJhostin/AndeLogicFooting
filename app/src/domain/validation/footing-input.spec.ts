import { describe, expect, it } from 'vitest'
import { createNewProject } from '../projects'
import { validateFootingInputs, validateGuideRequiredReinforcementInputs, validateOneWayShearInputs, validatePunchingShearInputs } from './footing-input'

describe('validateFootingInputs', () => {
  it('acepta entradas geométricas y geotécnicas positivas dentro del alcance preliminar', () => {
    const inputs = createNewProject().inputSnapshot
    inputs.axialLoadKn = 450
    inputs.allowableBearingKpa = 180

    expect(validateFootingInputs(inputs)).toEqual([])
  })

  it('rechaza valores requeridos iguales a cero', () => {
    const issues = validateFootingInputs(createNewProject().inputSnapshot)

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'axialLoadKn', code: 'MISSING_POSITIVE_VALUE' }),
      expect.objectContaining({ field: 'allowableBearingKpa', code: 'MISSING_POSITIVE_VALUE' }),
    ]))
  })

  it('rechaza una zapata no mayor que la columna', () => {
    const inputs = createNewProject().inputSnapshot
    inputs.axialLoadKn = 450
    inputs.allowableBearingKpa = 180
    inputs.footingWidthM = inputs.columnWidthM

    expect(validateFootingInputs(inputs)).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'footingWidthM', code: 'FOOTING_NOT_LARGER_THAN_COLUMN' }),
    ]))
  })

  it('requiere carga última y una profundidad efectiva física para cortante', () => {
    const inputs = createNewProject().inputSnapshot
    inputs.axialLoadKn = 450
    inputs.allowableBearingKpa = 180
    inputs.concreteCoverM = inputs.footingThicknessM

    expect(validateOneWayShearInputs(inputs)).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'factoredAxialLoadKn', code: 'FACTORED_LOAD_REQUIRED' }),
      expect.objectContaining({ field: 'concreteCoverM', code: 'INVALID_EFFECTIVE_DEPTH' }),
    ]))
  })

  it('requiere un perímetro crítico interior para punzonamiento', () => {
    const inputs = createNewProject().inputSnapshot
    inputs.axialLoadKn = 450
    inputs.allowableBearingKpa = 180
    inputs.factoredAxialLoadKn = 650

    expect(validatePunchingShearInputs(inputs)).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'punchingCriticalSectionOffsetM', code: 'PUNCHING_OFFSET_REQUIRED' }),
    ]))
  })

  it('requiere resistencias de materiales y profundidad efectiva para el acero requerido de guía', () => {
    const inputs = createNewProject().inputSnapshot
    inputs.axialLoadKn = 450
    inputs.allowableBearingKpa = 180
    inputs.factoredAxialLoadKn = 650

    expect(validateGuideRequiredReinforcementInputs(inputs)).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'concreteStrengthMpa', code: 'MATERIAL_STRENGTH_REQUIRED' }),
      expect.objectContaining({ field: 'steelYieldStrengthMpa', code: 'MATERIAL_STRENGTH_REQUIRED' }),
    ]))
  })
})
