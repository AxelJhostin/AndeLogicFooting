import { describe, expect, it } from 'vitest'
import type { FootingType } from '../../domain/projects'
import { FOOTING_THEORY_PAGES } from './theory-content'

const expectedTypes: FootingType[] = ['isolated', 'strip', 'combined', 'strap', 'trapezoidal', 'edge', 'corner', 'mat']

describe('guías teóricas por modelo', () => {
  it('cubre exactamente las ocho familias del producto', () => {
    expect(Object.keys(FOOTING_THEORY_PAGES)).toEqual(expectedTypes)
  })

  it('mantiene profundidad mínima, secuencia, errores y glosario en cada guía', () => {
    for (const footingType of expectedTypes) {
      const page = FOOTING_THEORY_PAGES[footingType]
      expect(page.introduction.length, footingType).toBeGreaterThan(180)
      expect(page.loadPath.length, footingType).toBeGreaterThanOrEqual(4)
      expect(page.scopeFacts, footingType).toHaveLength(3)
      expect(page.sections.length, footingType).toBeGreaterThanOrEqual(6)
      expect(page.workflow.length, footingType).toBeGreaterThanOrEqual(6)
      expect(page.commonMistakes.length, footingType).toBeGreaterThanOrEqual(5)
      expect(page.glossary.length, footingType).toBeGreaterThanOrEqual(5)
      expect(page.sections.some(({ formulas }) => Boolean(formulas?.length)), footingType).toBe(true)
    }
  })
})
