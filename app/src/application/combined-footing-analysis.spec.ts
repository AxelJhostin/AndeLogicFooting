import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { analyzeCombinedFootingCase } from './combined-footing-analysis'

describe('analyzeCombinedFootingCase', () => {
  it('analiza exclusivamente el snapshot combinado del proyecto', () => {
    const project = createNewProject()
    project.footingType = 'combined'
    project.inputSnapshot.axialLoadKn = 0
    const outcome = analyzeCombinedFootingCase(project)
    expect(outcome.status).toBe('calculated')
  })
})
