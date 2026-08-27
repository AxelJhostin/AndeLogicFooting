export type ModuleValidationState = 'internal-testing' | 'not-implemented' | 'approved'

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
    state: 'not-implemented',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Bloqueado hasta completar fuente, cláusula, casos y comparadores compatibles.',
  },
  {
    id: 'punching-shear',
    label: 'Punzonamiento',
    state: 'not-implemented',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Bloqueado hasta completar fuente, cláusula, casos y comparadores compatibles.',
  },
  {
    id: 'flexure-reinforcement',
    label: 'Flexión y refuerzo',
    state: 'not-implemented',
    completedExternalBenchmarks: 0,
    requiredExternalBenchmarks: 3,
    note: 'Bloqueado hasta completar fuente, cláusula, casos y comparadores compatibles.',
  },
]
