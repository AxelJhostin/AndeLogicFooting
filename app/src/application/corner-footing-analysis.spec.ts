import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { analyzeCornerFootingCase } from './corner-footing-analysis'

describe('analyzeCornerFootingCase', () => {
  it('analiza únicamente el snapshot de zapata de esquina', () => {
    const project = createNewProject()
    project.footingType = 'corner'
    project.inputSnapshot.axialLoadKn = 0
    expect(analyzeCornerFootingCase(project).status).toBe('calculated')
  })
})
