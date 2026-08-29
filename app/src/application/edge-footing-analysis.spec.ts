import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { analyzeEdgeFootingCase } from './edge-footing-analysis'

describe('analyzeEdgeFootingCase', () => {
  it('analiza únicamente el snapshot de zapata excéntrica', () => {
    const project = createNewProject()
    project.footingType = 'edge'
    project.inputSnapshot.axialLoadKn = 0
    expect(analyzeEdgeFootingCase(project).status).toBe('calculated')
  })
})
