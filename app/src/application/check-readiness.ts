import type { ProjectDocument } from '../domain/projects'
import { validateFootingInputs, type ValidationIssue } from '../domain/validation/footing-input'
import { getStandardProfile } from '../standards/profiles'

export type CalculationReadiness =
  | { status: 'invalid-input'; issues: ValidationIssue[] }
  | { status: 'pending-review'; reason: string }

export function checkCalculationReadiness(project: ProjectDocument): CalculationReadiness {
  const issues = validateFootingInputs(project.inputSnapshot)
  if (issues.length > 0) return { status: 'invalid-input', issues }

  const profile = getStandardProfile(project.standardProfile)

  return {
    status: 'pending-review',
    reason: `${profile.label}: ${profile.releaseBlocker}`,
  }
}
