import type { ProjectDocument } from '../domain/projects'
import { analyzeStripFooting, type StripFootingAnalysisOutcome } from '../domain/strip-footing/strip-footing-analysis'

/** Frontera de aplicación para el caso de zapata corrida guardado en el proyecto. */
export function analyzeStripFootingCase(project: ProjectDocument): StripFootingAnalysisOutcome {
  return analyzeStripFooting(project.stripInputSnapshot)
}

export type { StripFootingAnalysis, StripFootingAnalysisOutcome } from '../domain/strip-footing/strip-footing-analysis'
