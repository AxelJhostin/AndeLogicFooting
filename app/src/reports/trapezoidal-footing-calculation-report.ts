import type { ProjectDocument, TrapezoidalFootingInputs } from '../domain/projects'
import { getStandardProfile } from '../standards/profiles'
import type { FootingCalculationReport } from './footing-calculation-report'

export type TrapezoidalReportInput = { id: keyof TrapezoidalFootingInputs; label: string; value: number | string; unit: string }
export type TrapezoidalFootingCalculationReport = {
  generatedAt: string
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt'>
  product: Pick<ProjectDocument, 'productVersion' | 'engineVersion' | 'schemaVersion'>
  profile: FootingCalculationReport['profile']
  inputs: TrapezoidalReportInput[]
  limitations: string[]
}

const definitions: Array<{ id: keyof TrapezoidalFootingInputs; label: string; unit: string }> = [
  { id: 'serviceColumn1LoadKn', label: 'Carga de servicio columna 1', unit: 'kN' },
  { id: 'serviceColumn2LoadKn', label: 'Carga de servicio columna 2', unit: 'kN' },
  { id: 'factoredColumn1LoadKn', label: 'Carga última columna 1', unit: 'kN' },
  { id: 'factoredColumn2LoadKn', label: 'Carga última columna 2', unit: 'kN' },
  { id: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa' },
  { id: 'bearingCapacityBasis', label: 'Base de capacidad declarada', unit: '' },
  { id: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa' },
  { id: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³' },
  { id: 'soilCoverDepthM', label: 'Altura de relleno', unit: 'm' },
  { id: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³' },
  { id: 'leftFootingWidthM', label: 'Ancho extremo izquierdo B₁', unit: 'm' },
  { id: 'rightFootingWidthM', label: 'Ancho extremo derecho B₂', unit: 'm' },
  { id: 'footingLengthM', label: 'Longitud L', unit: 'm' },
  { id: 'footingThicknessM', label: 'Espesor h', unit: 'm' },
  { id: 'column1WidthM', label: 'Columna 1 · ancho transversal', unit: 'm' },
  { id: 'column1LengthM', label: 'Columna 1 · longitud', unit: 'm' },
  { id: 'column1CenterFromLeftM', label: 'Centro columna 1 desde extremo izquierdo', unit: 'm' },
  { id: 'column2WidthM', label: 'Columna 2 · ancho transversal', unit: 'm' },
  { id: 'column2LengthM', label: 'Columna 2 · longitud', unit: 'm' },
  { id: 'column2CenterFromLeftM', label: 'Centro columna 2 desde extremo izquierdo', unit: 'm' },
  { id: 'concreteCoverM', label: 'Recubrimiento', unit: 'm' },
  { id: 'barDiameterM', label: 'Diámetro de barra', unit: 'm' },
  { id: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa' },
  { id: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa' },
  { id: 'longitudinalBottomBarSpacingM', label: 'Separación longitudinal inferior', unit: 'm' },
  { id: 'longitudinalTopBarSpacingM', label: 'Separación longitudinal superior', unit: 'm' },
  { id: 'transverseBarSpacingM', label: 'Separación transversal', unit: 'm' },
  { id: 'longitudinalDevelopmentAvailableM', label: 'Desarrollo longitudinal disponible', unit: 'm' },
  { id: 'transverseDevelopmentAvailableM', label: 'Desarrollo transversal disponible', unit: 'm' },
]

export function buildTrapezoidalFootingCalculationReport(project: ProjectDocument, generatedAt = new Date().toISOString()): TrapezoidalFootingCalculationReport {
  const profile = getStandardProfile(project.standardProfile)
  return {
    generatedAt,
    project: { projectId: project.projectId, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt },
    product: { productVersion: project.productVersion, engineVersion: project.engineVersion, schemaVersion: project.schemaVersion },
    profile: { id: profile.id, label: profile.label, shortLabel: profile.shortLabel, releaseStatus: profile.releaseStatus, sources: profile.sources, traceability: profile.traceability, releaseBlocker: profile.releaseBlocker },
    inputs: definitions.map(({ id, label, unit }) => ({ id, label, unit, value: project.trapezoidalInputSnapshot[id] })),
    limitations: [
      'Planta trapezoidal simétrica respecto del eje longitudinal, espesor constante y dos columnas interiores alineadas.',
      'La presión varía linealmente en la dirección longitudinal y debe conservar contacto completo.',
      'No incluye momentos de columna, acciones horizontales, columnas de borde, contacto parcial ni espesor variable.',
      'Los asentamientos y la capacidad admisible proceden del estudio geotécnico aplicable.',
      'Las resistencias, el acero y el desarrollo son referencias públicas con contraste independiente pendiente.',
      ...project.warnings,
    ],
  }
}
