import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { analyzeStrapFootingCase } from './strap-footing-analysis'

describe('analyzeStrapFootingCase', () => {
  it('analiza exclusivamente el snapshot de zapata medianera', () => {
    const project = createNewProject()
    project.footingType = 'strap'
    project.inputSnapshot.axialLoadKn = 0
    expect(analyzeStrapFootingCase(project).status).toBe('calculated')
  })
})
