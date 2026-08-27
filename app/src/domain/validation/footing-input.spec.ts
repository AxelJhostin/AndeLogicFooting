import { describe, expect, it } from 'vitest'
import { createNewProject } from '../projects'
import { validateFootingInputs } from './footing-input'

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
})
