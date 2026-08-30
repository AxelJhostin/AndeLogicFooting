import { FOOTING_TYPES } from '../domain/examples/footing-examples'
import type { FootingType } from '../domain/projects'

export type ValidationGateId = 'scope' | 'internalEngine' | 'traceability' | 'externalBenchmarks' | 'professionalReview'
export type ValidationGateStatus = 'passed' | 'pending' | 'blocked'

export type ValidationGateResult = {
  status: ValidationGateStatus
  note: string
}

export type FamilyValidationRecord = {
  footingType: FootingType
  label: string
  internalCaseIds: string[]
  completedExternalBenchmarks: number
  requiredExternalBenchmarks: number
  gates: Record<ValidationGateId, ValidationGateResult>
}

export type ValidationReleaseAssessment = {
  status: 'approved' | 'pending-review' | 'blocked'
  familyCount: number
  passedGateCount: number
  totalGateCount: number
  reasons: string[]
}

const passed = (note: string): ValidationGateResult => ({ status: 'passed', note })
const pending = (note: string): ValidationGateResult => ({ status: 'pending', note })

const gatesFor = (scopeDocument: string, internalNote: string): FamilyValidationRecord['gates'] => ({
  scope: passed(`Alcance y exclusiones cerrados en ${scopeDocument}.`),
  internalEngine: passed(internalNote),
  traceability: passed('Fuentes públicas, referencias y aplicabilidad registradas; el perfil permanece en revisión.'),
  externalBenchmarks: pending('Falta completar el contraste externo compatible exigido por el protocolo.'),
  professionalReview: pending('La revisión profesional se realizará sobre una versión y matriz de evidencia congeladas.'),
})

export const familyValidationCatalog: FamilyValidationRecord[] = [
  {
    footingType: 'isolated', label: 'Zapata aislada centrada', internalCaseIds: ['NEC-FTG-001', 'NEC-FTG-013'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/02 y docs/10', 'Cadena interna, fallas, unidades y referencias estructurales automatizadas.'),
  },
  {
    footingType: 'strip', label: 'Zapata corrida', internalCaseIds: ['NEC-FTG-014'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/15', 'Contacto y demandas por franja, bloqueos y ejemplos automatizados.'),
  },
  {
    footingType: 'combined', label: 'Zapata combinada rectangular', internalCaseIds: ['NEC-FTG-015', 'NEC-FTG-016', 'NEC-FTG-017', 'NEC-FTG-018'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/16', 'Caso manual, equilibrio, contacto parcial bloqueado y geometría automatizados.'),
  },
  {
    footingType: 'strap', label: 'Zapata medianera', internalCaseIds: ['NEC-FTG-019', 'NEC-FTG-020', 'NEC-FTG-021', 'NEC-FTG-022'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/17', 'Transferencia, conservación de fuerza, reacciones y geometría automatizadas.'),
  },
  {
    footingType: 'trapezoidal', label: 'Zapata trapezoidal', internalCaseIds: ['NEC-FTG-023', 'NEC-FTG-024', 'NEC-FTG-025', 'NEC-FTG-026'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/19', 'Geometría variable, equilibrio integral, contacto y perímetros automatizados.'),
  },
  {
    footingType: 'edge', label: 'Zapata excéntrica de borde', internalCaseIds: ['NEC-FTG-027', 'NEC-FTG-028', 'NEC-FTG-029', 'NEC-FTG-030'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/20', 'Caso manual, simetría, tercio central y punzonamiento no evaluado automatizados.'),
  },
  {
    footingType: 'corner', label: 'Zapata de esquina biaxial', internalCaseIds: ['NEC-FTG-031', 'NEC-FTG-032', 'NEC-FTG-033', 'NEC-FTG-034'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/22', 'Caso manual, simetría, núcleo biaxial y punzonamiento no evaluado automatizados.'),
  },
  {
    footingType: 'mat', label: 'Losa de cimentación', internalCaseIds: ['NEC-FTG-035', 'NEC-FTG-036', 'NEC-FTG-037', 'NEC-FTG-038'],
    completedExternalBenchmarks: 0, requiredExternalBenchmarks: 3,
    gates: gatesFor('docs/23', 'Caso manual, equilibrio multicolumna, Winkler y límites geométricos automatizados.'),
  },
]

export function assessValidationRelease(records: FamilyValidationRecord[]): ValidationReleaseAssessment {
  const reasons: string[] = []
  const knownTypes = new Set<FootingType>(FOOTING_TYPES)
  const counts = new Map<FootingType, number>()
  for (const record of records) counts.set(record.footingType, (counts.get(record.footingType) ?? 0) + 1)

  const missing = FOOTING_TYPES.filter((footingType) => !counts.has(footingType))
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1).map(([footingType]) => footingType)
  const unexpected = records.filter(({ footingType }) => !knownTypes.has(footingType)).map(({ footingType }) => footingType)
  if (missing.length) reasons.push(`Faltan familias en el catálogo: ${missing.join(', ')}.`)
  if (duplicates.length) reasons.push(`Hay familias duplicadas en el catálogo: ${duplicates.join(', ')}.`)
  if (unexpected.length) reasons.push(`Hay familias no soportadas en el catálogo: ${unexpected.join(', ')}.`)

  const invalidEvidence = records.filter((record) => (
    record.requiredExternalBenchmarks < 3
    || record.completedExternalBenchmarks < 0
    || record.completedExternalBenchmarks > record.requiredExternalBenchmarks
    || (record.gates.externalBenchmarks.status === 'passed'
      && record.completedExternalBenchmarks < record.requiredExternalBenchmarks)
  ))
  if (invalidEvidence.length) {
    reasons.push(...invalidEvidence.map((record) => (
      `${record.label}: estado inconsistente de evidencias externas `
      + `(${record.completedExternalBenchmarks}/${record.requiredExternalBenchmarks}).`
    )))
  }

  const gateResults = records.flatMap((record) => Object.entries(record.gates).map(([gateId, result]) => ({ record, gateId, result })))
  const blocked = gateResults.filter(({ result }) => result.status === 'blocked')
  const pendingResults = gateResults.filter(({ result }) => result.status === 'pending')
  if (blocked.length) reasons.push(...blocked.map(({ record, gateId, result }) => `${record.label} · ${gateId}: ${result.note}`))
  if (pendingResults.length) reasons.push(...pendingResults.map(({ record, gateId, result }) => `${record.label} · ${gateId}: ${result.note}`))

  const structuralProblem = missing.length > 0
    || duplicates.length > 0
    || unexpected.length > 0
    || invalidEvidence.length > 0
    || blocked.length > 0
  return {
    status: structuralProblem ? 'blocked' : pendingResults.length ? 'pending-review' : 'approved',
    familyCount: new Set(records.map(({ footingType }) => footingType)).size,
    passedGateCount: gateResults.filter(({ result }) => result.status === 'passed').length,
    totalGateCount: gateResults.length,
    reasons,
  }
}
