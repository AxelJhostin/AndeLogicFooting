import type { ProjectDocument } from '../domain/projects'
import { analyzeTrapezoidalFooting, type TrapezoidalFootingAnalysisOutcome } from '../domain/trapezoidal-footing/trapezoidal-footing-analysis'

/** Frontera de aplicación exclusiva para la combinada de ancho variable. */
export function analyzeTrapezoidalFootingCase(project: ProjectDocument): TrapezoidalFootingAnalysisOutcome {
  return analyzeTrapezoidalFooting(project.trapezoidalInputSnapshot)
}

export type { TrapezoidalFootingAnalysis, TrapezoidalFootingAnalysisOutcome } from '../domain/trapezoidal-footing/trapezoidal-footing-analysis'
