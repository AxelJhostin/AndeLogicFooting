import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { analyzeMatFootingCase } from './mat-footing-analysis'

describe('analyzeMatFootingCase', () => {
  it('analiza únicamente el snapshot de losa de cimentación', () => {
    const project = createNewProject()
    project.footingType = 'mat'
    project.inputSnapshot.axialLoadKn = 0
    expect(analyzeMatFootingCase(project).status).toBe('calculated')
  })
})
