export type StandardProfileId = 'NEC-PENDING' | 'ACI-318-25-PENDING'

export type StandardProfile = {
  id: StandardProfileId
  label: string
  releaseStatus: 'blocked'
  sources: string[]
  releaseBlocker: string
}

export const standardProfiles: Record<StandardProfileId, StandardProfile> = {
  'NEC-PENDING': {
    id: 'NEC-PENDING',
    label: 'Ecuador - NEC 2014 (pendiente de perfil complementario)',
    releaseStatus: 'blocked',
    sources: ['NEC-SE-GC 2014', 'NEC-SE-HM 2014'],
    releaseBlocker:
      'La NEC 2014 remite a referencias complementarias para el modelo completo de zapatas. Falta congelar la edición autorizada, mapear cláusulas y validar casos de referencia.',
  },
  'ACI-318-25-PENDING': {
    id: 'ACI-318-25-PENDING',
    label: 'ACI CODE-318-25 SI (pendiente de licencia y validación)',
    releaseStatus: 'blocked',
    sources: ['ACI CODE-318-25'],
    releaseBlocker:
      'Falta acceso autorizado, mapeo de cláusulas y casos de validación independientes para ACI CODE-318-25.',
  },
}

export const getStandardProfile = (id: StandardProfileId) => standardProfiles[id]
