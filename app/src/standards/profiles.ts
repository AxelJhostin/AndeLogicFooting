export type StandardProfileId = 'NEC-PUBLIC-2014-PENDING' | 'ARCHIVED-UNSUPPORTED'

export type StandardProfile = {
  id: StandardProfileId
  label: string
  releaseStatus: 'pending-review'
  sources: string[]
  releaseBlocker: string
}

export const standardProfiles: Record<StandardProfileId, StandardProfile> = {
  'NEC-PUBLIC-2014-PENDING': {
    id: 'NEC-PUBLIC-2014-PENDING',
    label: 'Ecuador · NEC 2014 y fuentes públicas (en validación)',
    releaseStatus: 'pending-review',
    sources: ['NEC-SE-GC 2014', 'NEC-SE-HM 2014'],
    releaseBlocker:
      'Falta completar el mapa de fuentes públicas NEC, registrar parámetros y contrastar casos de referencia antes de habilitar verificaciones de resistencia.',
  },
  'ARCHIVED-UNSUPPORTED': {
    id: 'ARCHIVED-UNSUPPORTED',
    label: 'Proyecto histórico sin perfil compatible',
    releaseStatus: 'pending-review',
    sources: [],
    releaseBlocker:
      'Este proyecto conserva una identificación normativa anterior y no se recalculará hasta migrarlo explícitamente a un perfil compatible.',
  },
}

export const getStandardProfile = (id: StandardProfileId) => standardProfiles[id]
