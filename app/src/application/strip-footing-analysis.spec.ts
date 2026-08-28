import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { analyzeStripFootingCase } from './strip-footing-analysis'

describe('analyzeStripFootingCase', () => {
  it('orquesta el snapshot específico de zapata corrida', () => {
    const project = createNewProject()
    project.footingType = 'strip'
    const outcome = analyzeStripFootingCase(project)
    expect(outcome.status).toBe('calculated')
  })
})
