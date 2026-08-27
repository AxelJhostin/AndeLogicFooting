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
    id: 'skyciv-verification-aci14',
    label: 'SkyCiv Foundation — Verification #1',
    sourceKind: 'software',
    evidenceUrl:
      'https://skyciv.com/docs/skyciv-foundation/isolated-footings/verification-2/aci-318-verification-1/',
    confirmedProfiles: ['ACI-318-14'],
    status: 'historical-fixture',
    limitation: 'Sirve para probar el proceso de contraste; no valida ACI 318-25 ni NEC 2014.',
  },
  {
    id: 'skyciv-free-foundation',
    label: 'SkyCiv — Free Concrete Footing Calculator',
    sourceKind: 'software',
    evidenceUrl: 'https://skyciv.com/es/concrete-footing-calculator/',
    confirmedProfiles: ['ACI-318-19'],
    status: 'candidate',
    limitation: 'La edición seleccionada, las entradas y el reporte deben capturarse en cada ejecución.',
  },
  {
    id: 'asdip-free-footing',
    label: 'ASDIP — Free Concrete Footing Calculator',
    sourceKind: 'software',
    evidenceUrl: 'https://www.asdipsoft.com/free-footing-calculator/',
    confirmedProfiles: [],
    status: 'candidate',
    limitation: 'La página dice “latest ACI 318”; no se admite hasta confirmar la edición exacta en la ejecución.',
  },
  {
    id: 'tekla-tedds-foundation',
    label: 'Tekla Tedds — Foundation analysis and design',
    sourceKind: 'software',
    evidenceUrl: 'https://support.tekla.com/video/foundation_analysis_design_aci318',
    confirmedProfiles: ['ACI-318-19(2022)'],
    status: 'candidate',
    limitation: 'Solo se usa con versión exacta y después de revisar los boletines de corrección aplicables.',
  },
]
