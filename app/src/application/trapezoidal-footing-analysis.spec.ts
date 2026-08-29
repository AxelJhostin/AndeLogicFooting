import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { analyzeTrapezoidalFootingCase } from './trapezoidal-footing-analysis'

describe('analyzeTrapezoidalFootingCase', () => {
  it('analiza únicamente el snapshot trapezoidal', () => {
    const project = createNewProject()
    project.footingType = 'trapezoidal'
    project.inputSnapshot.axialLoadKn = 0
    expect(analyzeTrapezoidalFootingCase(project).status).toBe('calculated')
  })
})
