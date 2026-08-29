import { describe, expect, it } from 'vitest'
import { createNewProject, DEFAULT_FOOTING_THICKNESS_M, isProjectDocument, normalizeProjectDocument, PROJECT_SCHEMA_VERSION, type FootingInputs, type ProjectDocument } from './projects'

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
    delete legacyInputs.concreteStrengthMpa
    delete legacyInputs.steelYieldStrengthMpa
    delete legacyInputs.developmentAvailableLengthWidthM
    delete legacyInputs.developmentAvailableLengthLengthM

    const normalized = normalizeProjectDocument({
      ...currentProject,
      inputSnapshot: legacyInputs as FootingInputs,
    })

    expect(normalized.inputSnapshot.factoredAxialLoadKn).toBe(0)
    expect(normalized.inputSnapshot.concreteCoverM).toBe(0.075)
    expect(normalized.inputSnapshot.barDiameterM).toBe(0.016)
    expect(normalized.inputSnapshot.punchingCriticalSectionOffsetM).toBe(0)
    expect(normalized.inputSnapshot.concreteStrengthMpa).toBe(0)
    expect(normalized.inputSnapshot.steelYieldStrengthMpa).toBe(0)
    expect(normalized.inputSnapshot.developmentAvailableLengthWidthM).toBe(0)
    expect(normalized.inputSnapshot.developmentAvailableLengthLengthM).toBe(0)
  })

  it('migra el identificador NEC previo al perfil público actual', () => {
    const project = createNewProject()
    const legacyProject = { ...project, standardProfile: 'NEC-PENDING' } as unknown as ProjectDocument

    expect(normalizeProjectDocument(legacyProject).standardProfile).toBe('NEC-2015-GUIDE-TRACEABLE')
  })

  it('añade el tipo y snapshot de zapata corrida a proyectos anteriores', () => {
    const project = createNewProject()
    const legacyProject = { ...project } as Partial<ProjectDocument>
    delete legacyProject.footingType
    delete legacyProject.stripInputSnapshot

    const normalized = normalizeProjectDocument(legacyProject as ProjectDocument)
    expect(normalized.footingType).toBe('isolated')
    expect(normalized.stripInputSnapshot.serviceLineLoadKnM).toBeGreaterThan(0)
    expect(normalized.inputSnapshot).toEqual(project.inputSnapshot)
  })

  it('migra archivos anteriores al snapshot independiente de zapata combinada', () => {
    const project = createNewProject()
    const legacyProject = { ...project, schemaVersion: 1 } as Partial<ProjectDocument>
    delete legacyProject.combinedInputSnapshot

    expect(isProjectDocument(legacyProject)).toBe(true)
    const normalized = normalizeProjectDocument(legacyProject as ProjectDocument)
    expect(normalized.schemaVersion).toBe(PROJECT_SCHEMA_VERSION)
    expect(normalized.combinedInputSnapshot.serviceColumn1LoadKn).toBeGreaterThan(0)
    expect(normalized.combinedInputSnapshot.column2CenterFromLeftM).toBeGreaterThan(normalized.combinedInputSnapshot.column1CenterFromLeftM)
  })

  it('migra el esquema 2 al snapshot de zapata medianera sin alterar los existentes', () => {
    const project = createNewProject()
    const legacyProject = { ...project, schemaVersion: 2 } as Partial<ProjectDocument>
    delete legacyProject.strapInputSnapshot

    expect(isProjectDocument(legacyProject)).toBe(true)
    const normalized = normalizeProjectDocument(legacyProject as ProjectDocument)
    expect(normalized.schemaVersion).toBe(PROJECT_SCHEMA_VERSION)
    expect(normalized.strapInputSnapshot.footingCenterSpacingM).toBeGreaterThan(0)
    expect(normalized.combinedInputSnapshot).toEqual(project.combinedInputSnapshot)
  })

  it('migra el esquema 3 al snapshot de zapata trapezoidal', () => {
    const project = createNewProject()
    const legacyProject = { ...project, schemaVersion: 3 } as Partial<ProjectDocument>
    delete legacyProject.trapezoidalInputSnapshot

    expect(isProjectDocument(legacyProject)).toBe(true)
    const normalized = normalizeProjectDocument(legacyProject as ProjectDocument)
    expect(normalized.schemaVersion).toBe(PROJECT_SCHEMA_VERSION)
    expect(normalized.trapezoidalInputSnapshot.rightFootingWidthM).toBeGreaterThan(normalized.trapezoidalInputSnapshot.leftFootingWidthM)
    expect(normalized.strapInputSnapshot).toEqual(project.strapInputSnapshot)
  })

  it('migra el esquema 4 al snapshot de zapata excéntrica de borde', () => {
    const project = createNewProject()
    const legacyProject = { ...project, schemaVersion: 4 } as Partial<ProjectDocument>
    delete legacyProject.edgeInputSnapshot

    expect(isProjectDocument(legacyProject)).toBe(true)
    const normalized = normalizeProjectDocument(legacyProject as ProjectDocument)
    expect(normalized.schemaVersion).toBe(PROJECT_SCHEMA_VERSION)
    expect(normalized.edgeInputSnapshot.edgeSide).toBe('left')
    expect(normalized.edgeInputSnapshot.columnLengthM).toBeLessThan(normalized.edgeInputSnapshot.footingLengthM)
    expect(normalized.trapezoidalInputSnapshot).toEqual(project.trapezoidalInputSnapshot)
  })
})
