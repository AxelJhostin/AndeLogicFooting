import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { checkCalculationReadiness } from './check-readiness'

describe('checkCalculationReadiness', () => {
  it('bloquea el motor hasta liberar el perfil normativo', () => {
    const project = createNewProject()
    project.inputSnapshot.axialLoadKn = 450
    project.inputSnapshot.allowableBearingKpa = 180

    expect(checkCalculationReadiness(project)).toMatchObject({ status: 'blocked' })
  })

  it('informa las entradas inválidas antes del bloqueo normativo', () => {
    expect(checkCalculationReadiness(createNewProject())).toMatchObject({
      status: 'invalid-input',
    })
  })
})
