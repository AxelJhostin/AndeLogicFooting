import type { ProjectDocument } from '../domain/projects'
import { validateFootingInputs, type ValidationIssue } from '../domain/validation/footing-input'

export type CalculationReadiness =
  | { status: 'invalid-input'; issues: ValidationIssue[] }
  | { status: 'blocked'; reason: string }

export function checkCalculationReadiness(project: ProjectDocument): CalculationReadiness {
  const issues = validateFootingInputs(project.inputSnapshot)
  if (issues.length > 0) return { status: 'invalid-input', issues }

  return {
    status: 'blocked',
    reason: `El perfil ${project.standardProfile} aún no está liberado: faltan trazabilidad de cláusulas y casos de validación antes de ejecutar cálculos.`,
  }
}
