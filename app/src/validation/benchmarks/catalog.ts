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
    label: 'Contacto preliminar P/A',
    state: 'internal-testing',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Implementado como evaluación física experimental; falta cerrar el banco externo.',
  },
  {
    id: 'one-way-shear',
    label: 'Cortante unidireccional',
    state: 'pending-review',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Pendiente de tu revisión de fuente, cláusula, casos y comparadores compatibles.',
  },
  {
    id: 'punching-shear',
    label: 'Punzonamiento',
    state: 'pending-review',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Pendiente de tu revisión de fuente, cláusula, casos y comparadores compatibles.',
  },
  {
    id: 'flexure-reinforcement',
    label: 'Flexión y refuerzo',
    state: 'pending-review',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Pendiente de tu revisión de fuente, cláusula, casos y comparadores compatibles.',
  },
]
