import type { ProjectDocument } from '../domain/projects'
import { analyzeStrapFooting, type StrapFootingAnalysisOutcome } from '../domain/strap-footing/strap-footing-analysis'

/** Frontera de aplicación exclusiva para las dos bases enlazadas por viga centradora. */
export function analyzeStrapFootingCase(project: ProjectDocument): StrapFootingAnalysisOutcome {
  return analyzeStrapFooting(project.strapInputSnapshot)
}

export type { StrapFootingAnalysis, StrapFootingAnalysisOutcome, StrapPadAnalysis } from '../domain/strap-footing/strap-footing-analysis'
