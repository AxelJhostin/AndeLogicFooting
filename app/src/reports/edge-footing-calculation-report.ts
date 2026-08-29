import type { EdgeFootingInputs, ProjectDocument } from '../domain/projects'
import { getStandardProfile } from '../standards/profiles'
import type { FootingCalculationReport } from './footing-calculation-report'

export type EdgeReportInput = { id: keyof EdgeFootingInputs; label: string; value: number | string; unit: string }
export type EdgeFootingCalculationReport = {
  generatedAt: string
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt'>
  product: Pick<ProjectDocument, 'productVersion' | 'engineVersion' | 'schemaVersion'>
  profile: FootingCalculationReport['profile']
  inputs: EdgeReportInput[]
  limitations: string[]
}

const definitions: Array<{ id: keyof EdgeFootingInputs; label: string; unit: string }> = [
  { id: 'serviceAxialLoadKn', label: 'Carga axial de servicio', unit: 'kN' },
  { id: 'factoredAxialLoadKn', label: 'Carga axial última declarada', unit: 'kN' },
  { id: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa' },
  { id: 'bearingCapacityBasis', label: 'Base de capacidad declarada', unit: '' },
  { id: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa' },
  { id: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³' },
  { id: 'soilCoverDepthM', label: 'Altura de relleno', unit: 'm' },
  { id: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³' },
  { id: 'footingWidthM', label: 'Ancho transversal B', unit: 'm' },
  { id: 'footingLengthM', label: 'Longitud excéntrica L', unit: 'm' },
  { id: 'footingThicknessM', label: 'Espesor h', unit: 'm' },
  { id: 'columnWidthM', label: 'Ancho transversal de columna', unit: 'm' },
  { id: 'columnLengthM', label: 'Longitud de columna', unit: 'm' },
  { id: 'edgeSide', label: 'Borde exterior', unit: '' },
  { id: 'concreteCoverM', label: 'Recubrimiento', unit: 'm' },
  { id: 'barDiameterM', label: 'Diámetro de barra', unit: 'm' },
  { id: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa' },
  { id: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa' },
  { id: 'longitudinalBarSpacingM', label: 'Separación longitudinal', unit: 'm' },
  { id: 'transverseBarSpacingM', label: 'Separación transversal', unit: 'm' },
  { id: 'longitudinalDevelopmentAvailableM', label: 'Desarrollo longitudinal disponible', unit: 'm' },
  { id: 'transverseDevelopmentAvailableM', label: 'Desarrollo transversal disponible', unit: 'm' },
]

export function buildEdgeFootingCalculationReport(project: ProjectDocument, generatedAt = new Date().toISOString()): EdgeFootingCalculationReport {
  const profile = getStandardProfile(project.standardProfile)
  return {
    generatedAt,
    project: { projectId: project.projectId, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt },
    product: { productVersion: project.productVersion, engineVersion: project.engineVersion, schemaVersion: project.schemaVersion },
    profile: { id: profile.id, label: profile.label, shortLabel: profile.shortLabel, releaseStatus: profile.releaseStatus, sources: profile.sources, traceability: profile.traceability, releaseBlocker: profile.releaseBlocker },
    inputs: definitions.map(({ id, label, unit }) => ({ id, label, unit, value: project.edgeInputSnapshot[id] })),
    limitations: [
      'Columna centrada transversalmente, con una cara alineada al borde izquierdo o derecho.',
      'La resultante debe permanecer dentro del tercio central y la base debe conservar contacto completo.',
      'No incluye momento transferido adicional, fuerza horizontal, excentricidad biaxial ni contacto parcial.',
      'Punzonamiento de borde no evaluado: requiere un perímetro y una referencia específicos.',
      'Los asentamientos y la capacidad admisible proceden del estudio geotécnico aplicable.',
      'Las resistencias de cortante, acero y desarrollo son referencias públicas con contraste independiente pendiente.',
      ...project.warnings,
    ],
  }
}
