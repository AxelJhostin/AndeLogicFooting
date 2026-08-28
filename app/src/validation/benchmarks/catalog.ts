export type ModuleValidationState = 'internal-testing' | 'pending-review' | 'approved'

export type ModuleValidationRecord = {
  id: string
  label: string
  state: ModuleValidationState
  completedExternalBenchmarks: number
  requiredExternalBenchmarks: number
  note: string
}

export const moduleValidationCatalog: ModuleValidationRecord[] = [
  {
    id: 'preliminary-contact',
    label: 'Contacto de servicio',
    state: 'internal-testing',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Incluye peso propio, relleno y comparación bruta/neta declarada; falta cerrar el banco externo.',
  },
  {
    id: 'one-way-shear',
    label: 'Cortante unidireccional',
    state: 'internal-testing',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Demanda por equilibrio implementada en ambos ejes; resistencia y contraste normativo pendientes.',
  },
  {
    id: 'punching-shear',
    label: 'Punzonamiento',
    state: 'internal-testing',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Demanda por equilibrio y perímetro declarado implementados; resistencia y contraste normativo pendientes.',
  },
  {
    id: 'flexure-reinforcement',
    label: 'Flexión y refuerzo',
    state: 'internal-testing',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Demanda de flexión implementada en ambos ejes; acero y resistencia normativa pendientes.',
  },
]
