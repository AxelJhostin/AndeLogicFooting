import { describe, expect, it } from 'vitest'
import { createNewProject, DEFAULT_FOOTING_THICKNESS_M, normalizeProjectDocument, type FootingInputs, type ProjectDocument } from './projects'

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

  it('completa las entradas estructurales en archivos creados por versiones anteriores', () => {
    const currentProject = createNewProject()
    const legacyInputs: Partial<FootingInputs> = { ...currentProject.inputSnapshot }
    delete legacyInputs.factoredAxialLoadKn
    delete legacyInputs.concreteCoverM
    delete legacyInputs.barDiameterM
    delete legacyInputs.punchingCriticalSectionOffsetM

    const normalized = normalizeProjectDocument({
      ...currentProject,
      inputSnapshot: legacyInputs as FootingInputs,
    })

    expect(normalized.inputSnapshot.factoredAxialLoadKn).toBe(0)
    expect(normalized.inputSnapshot.concreteCoverM).toBe(0.075)
    expect(normalized.inputSnapshot.barDiameterM).toBe(0.016)
    expect(normalized.inputSnapshot.punchingCriticalSectionOffsetM).toBe(0)
  })

  it('migra el identificador NEC previo al perfil público actual', () => {
    const project = createNewProject()
    const legacyProject = { ...project, standardProfile: 'NEC-PENDING' } as unknown as ProjectDocument

    expect(normalizeProjectDocument(legacyProject).standardProfile).toBe('NEC-PUBLIC-2014-PENDING')
  })
})
