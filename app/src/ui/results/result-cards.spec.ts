import { describe, expect, it } from 'vitest'
import { buildResultCards } from './result-cards'

describe('buildResultCards', () => {
  it('mantiene resultados pendientes sin inventar valores', () => {
    const cards = buildResultCards(null)
    expect(cards).toHaveLength(9)
    expect(cards.every((card) => card.state === 'pending' && card.value === '—')).toBe(true)
  })
})
