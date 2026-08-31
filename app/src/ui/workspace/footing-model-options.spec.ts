import { describe, expect, it } from 'vitest'
import { FOOTING_MODEL_BY_TYPE, FOOTING_MODEL_OPTIONS } from './footing-model-options'

describe('selector de modelos de cimentación', () => {
  it('ofrece las ocho familias congeladas una sola vez y en el orden de producto', () => {
    expect(FOOTING_MODEL_OPTIONS.map(({ value }) => value)).toEqual([
      'isolated',
      'strip',
      'combined',
      'strap',
      'trapezoidal',
      'edge',
      'corner',
      'mat',
    ])
    expect(new Set(FOOTING_MODEL_OPTIONS.map(({ value }) => value)).size).toBe(8)
  })

  it('mantiene etiqueta, descripción y acción explícitas para cada familia', () => {
    for (const option of FOOTING_MODEL_OPTIONS) {
      expect(FOOTING_MODEL_BY_TYPE[option.value]).toBe(option)
      expect(option.label.length).toBeGreaterThan(10)
      expect(option.description.length).toBeGreaterThan(20)
      expect(option.analyzeLabel).toMatch(/^Analizar /)
    }
  })
})
