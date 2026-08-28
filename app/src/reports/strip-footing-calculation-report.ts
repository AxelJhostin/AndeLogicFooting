import type { ProjectDocument, StripFootingInputs } from '../domain/projects'
import { getStandardProfile } from '../standards/profiles'
import type { FootingCalculationReport } from './footing-calculation-report'

export type StripReportInput = {
  id: keyof StripFootingInputs
  label: string
  value: number | string
  unit: string
}

export type StripFootingCalculationReport = {
  generatedAt: string
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt'>
  product: Pick<ProjectDocument, 'productVersion' | 'engineVersion' | 'schemaVersion'>
  profile: FootingCalculationReport['profile']
  inputs: StripReportInput[]
  limitations: string[]
}

const definitions: Array<{ id: keyof StripFootingInputs; label: string; unit: string }> = [
  { id: 'serviceLineLoadKnM', label: 'Carga lineal de servicio', unit: 'kN/m' },
  { id: 'factoredLineLoadKnM', label: 'Carga lineal última declarada', unit: 'kN/m' },
  { id: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa' },
  { id: 'bearingCapacityBasis', label: 'Base de capacidad declarada', unit: '' },
  { id: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa' },
  { id: 'wallThicknessM', label: 'Espesor del muro', unit: 'm' },
  { id: 'footingWidthM', label: 'Ancho de zapata corrida', unit: 'm' },
  { id: 'footingThicknessM', label: 'Espesor de zapata', unit: 'm' },
  { id: 'concreteCoverM', label: 'Recubrimiento inferior', unit: 'm' },
  { id: 'barDiameterM', label: 'Diámetro de barra', unit: 'm' },
  { id: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa' },
  { id: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa' },
  { id: 'transverseBarSpacingM', label: 'Separación transversal', unit: 'm' },
  { id: 'longitudinalBarSpacingM', label: 'Separación longitudinal', unit: 'm' },
  { id: 'developmentAvailableLengthM', label: 'Desarrollo disponible', unit: 'm' },
]

export function buildStripFootingCalculationReport(project: ProjectDocument, generatedAt: string = new Date().toISOString()): StripFootingCalculationReport {
  const profile = getStandardProfile(project.standardProfile)
  return {
    generatedAt,
    project: { projectId: project.projectId, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt },
    product: { productVersion: project.productVersion, engineVersion: project.engineVersion, schemaVersion: project.schemaVersion },
    profile: {
      id: profile.id,
      label: profile.label,
      shortLabel: profile.shortLabel,
      releaseStatus: profile.releaseStatus,
      sources: profile.sources,
      traceability: profile.traceability,
      releaseBlocker: profile.releaseBlocker,
    },
    inputs: definitions.map(({ id, label, unit }) => ({ id, label, unit, value: project.stripInputSnapshot[id] })),
    limitations: [
      'Modelo por franja longitudinal de 1.00 m bajo muro y carga lineal centrados.',
      'La reacción del suelo se considera uniforme; no incluye excentricidad, momento ni levantamiento.',
      'Punzonamiento no aplica al modelo continuo bajo muro; no se evalúan extremos, esquinas ni discontinuidades.',
      'La capacidad admisible y los asentamientos dependen del estudio geotécnico aplicable.',
      'Las resistencias y el armado son referencias de guía con contraste independiente pendiente.',
      ...project.warnings,
    ],
  }
}
