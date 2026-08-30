import type { ProjectDocument } from '../domain/projects'
import { analyzeCornerFooting, type CornerFootingAnalysisOutcome } from '../domain/corner-footing/corner-footing-analysis'

/** Frontera de aplicación exclusiva para la zapata de esquina con excentricidad biaxial. */
export function analyzeCornerFootingCase(project: ProjectDocument): CornerFootingAnalysisOutcome {
  return analyzeCornerFooting(project.cornerInputSnapshot)
}

export type { CornerFootingAnalysis, CornerFootingAnalysisOutcome } from '../domain/corner-footing/corner-footing-analysis'
