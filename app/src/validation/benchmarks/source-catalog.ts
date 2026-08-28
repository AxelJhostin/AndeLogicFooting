import type { BenchmarkSourceKind } from './types'

export type ExternalBenchmarkSource = {
  id: string
  label: string
  sourceKind: BenchmarkSourceKind
  evidenceUrl: string
  confirmedProfiles: string[]
  status: 'candidate' | 'historical-fixture'
  limitation: string
}

export const externalBenchmarkSources: ExternalBenchmarkSource[] = [
  {
    id: 'nec-official-portal',
    label: 'NEC — Portal oficial del Ministerio',
    sourceKind: 'public-reference',
    evidenceUrl: 'https://www.mit.gob.ec/norma-ecuatoriana-de-la-construccion/',
    confirmedProfiles: ['NEC-2014'],
    status: 'candidate',
    limitation: 'La sección exacta, hipótesis y parámetro aplicable deben registrarse por cada módulo.',
  },
]
