import type { ProjectDocument } from '../domain/projects'
import { analyzeMatFooting, type MatFootingAnalysisOutcome } from '../domain/mat-footing/mat-footing-analysis'

/** Frontera de aplicación exclusiva para la losa de cimentación rectangular. */
export function analyzeMatFootingCase(project: ProjectDocument): MatFootingAnalysisOutcome {
  return analyzeMatFooting(project.matInputSnapshot)
}

export type { MatFootingAnalysis, MatFootingAnalysisOutcome } from '../domain/mat-footing/mat-footing-analysis'
