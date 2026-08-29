import type { ProjectDocument } from '../domain/projects'
import { analyzeCombinedFooting, type CombinedFootingAnalysisOutcome } from '../domain/combined-footing/combined-footing-analysis'

/** Frontera de aplicación exclusiva para el snapshot de zapata combinada. */
export function analyzeCombinedFootingCase(project: ProjectDocument): CombinedFootingAnalysisOutcome {
  return analyzeCombinedFooting(project.combinedInputSnapshot)
}

export type { CombinedFootingAnalysis, CombinedFootingAnalysisOutcome } from '../domain/combined-footing/combined-footing-analysis'
