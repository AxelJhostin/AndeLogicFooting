import { describe, expect, it } from 'vitest'
import { createNewProject, DEFAULT_FOOTING_THICKNESS_M, normalizeProjectDocument, type FootingInputs } from './projects'

describe('normalizeProjectDocument', () => {
  it('asigna un espesor seguro a proyectos creados antes de la vista de elevación', () => {
    const currentProject = createNewProject()
    const legacyInputs: Partial<FootingInputs> = { ...currentProject.inputSnapshot }
    delete legacyInputs.footingThicknessM
    const legacyProject = {
      ...currentProject,
      inputSnapshot: legacyInputs as FootingInputs,
    }

    expect(normalizeProjectDocument(legacyProject).inputSnapshot.footingThicknessM).toBe(DEFAULT_FOOTING_THICKNESS_M)
  })
})
