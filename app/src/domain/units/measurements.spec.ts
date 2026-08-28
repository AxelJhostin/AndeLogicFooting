import { describe, expect, it } from 'vitest'
import { kilonewtonsToNewtons, kilopascalsToPascals, metersToMillimeters } from './measurements'

describe('conversiones explícitas SI', () => {
  it('convierte fuerzas, presiones y longitudes sin alterar su magnitud física', () => {
    expect(kilonewtonsToNewtons(900)).toBe(900_000)
    expect(kilopascalsToPascals(150)).toBe(150_000)
    expect(metersToMillimeters(0.417)).toBeCloseTo(417)
  })
})
