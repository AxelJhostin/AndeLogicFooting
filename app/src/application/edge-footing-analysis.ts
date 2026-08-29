import type { ProjectDocument } from '../domain/projects'
import { analyzeEdgeFooting, type EdgeFootingAnalysisOutcome } from '../domain/edge-footing/edge-footing-analysis'

/** Frontera de aplicación exclusiva para la zapata aislada excéntrica de borde. */
export function analyzeEdgeFootingCase(project: ProjectDocument): EdgeFootingAnalysisOutcome {
  return analyzeEdgeFooting(project.edgeInputSnapshot)
}

export type { EdgeFootingAnalysis, EdgeFootingAnalysisOutcome } from '../domain/edge-footing/edge-footing-analysis'
