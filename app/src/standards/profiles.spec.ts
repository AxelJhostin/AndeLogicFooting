import { describe, expect, it } from 'vitest'
import { getStandardProfile } from './profiles'

describe('standard profiles', () => {
  it('mantiene NEC 2014 y ACI 318-25 como rutas independientes', () => {
    const nec = getStandardProfile('NEC-PENDING')
    const aci = getStandardProfile('ACI-318-25-PENDING')

    expect(nec.sources).toContain('NEC-SE-HM 2014')
    expect(aci.sources).toContain('ACI CODE-318-25')
    expect(nec.releaseBlocker).not.toEqual(aci.releaseBlocker)
  })
})
