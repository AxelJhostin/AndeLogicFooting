import type { CornerFootingInputs, ProjectDocument } from '../domain/projects'
import { getStandardProfile } from '../standards/profiles'
import type { FootingCalculationReport } from './footing-calculation-report'

export type CornerReportInput = { id: keyof CornerFootingInputs; label: string; value: number | string; unit: string }
export type CornerFootingCalculationReport = {
  generatedAt: string
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt'>
  product: Pick<ProjectDocument, 'productVersion' | 'engineVersion' | 'schemaVersion'>
  profile: FootingCalculationReport['profile']
  inputs: CornerReportInput[]
  limitations: string[]
}

const definitions: Array<{ id: keyof CornerFootingInputs; label: string; unit: string }> = [
  { id: 'serviceAxialLoadKn', label: 'Carga axial de servicio', unit: 'kN' }, { id: 'factoredAxialLoadKn', label: 'Carga axial última declarada', unit: 'kN' },
  { id: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa' }, { id: 'bearingCapacityBasis', label: 'Base de capacidad declarada', unit: '' },
  { id: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa' }, { id: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³' },
  { id: 'soilCoverDepthM', label: 'Altura de relleno', unit: 'm' }, { id: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³' },
  { id: 'footingWidthM', label: 'Ancho B', unit: 'm' }, { id: 'footingLengthM', label: 'Longitud L', unit: 'm' }, { id: 'footingThicknessM', label: 'Espesor h', unit: 'm' },
  { id: 'columnWidthM', label: 'Ancho de columna cB', unit: 'm' }, { id: 'columnLengthM', label: 'Longitud de columna cL', unit: 'm' }, { id: 'cornerPosition', label: 'Esquina', unit: '' },
  { id: 'concreteCoverM', label: 'Recubrimiento', unit: 'm' }, { id: 'barDiameterM', label: 'Diámetro de barra', unit: 'm' },
  { id: 'concreteStrengthMpa', label: 'Resistencia f′c', unit: 'MPa' }, { id: 'steelYieldStrengthMpa', label: 'Fluencia fy', unit: 'MPa' },
  { id: 'longitudinalBarSpacingM', label: 'Separación en X', unit: 'm' }, { id: 'transverseBarSpacingM', label: 'Separación en Y', unit: 'm' },
  { id: 'longitudinalDevelopmentAvailableM', label: 'Desarrollo disponible en X', unit: 'm' }, { id: 'transverseDevelopmentAvailableM', label: 'Desarrollo disponible en Y', unit: 'm' },
]

export function buildCornerFootingCalculationReport(project: ProjectDocument, generatedAt = new Date().toISOString()): CornerFootingCalculationReport {
  const profile = getStandardProfile(project.standardProfile)
  return {
    generatedAt,
    project: { projectId: project.projectId, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt },
    product: { productVersion: project.productVersion, engineVersion: project.engineVersion, schemaVersion: project.schemaVersion },
    profile: { id: profile.id, label: profile.label, shortLabel: profile.shortLabel, releaseStatus: profile.releaseStatus, sources: profile.sources, traceability: profile.traceability, releaseBlocker: profile.releaseBlocker },
    inputs: definitions.map(({ id, label, unit }) => {
      const raw = project.cornerInputSnapshot[id]
      const value = id === 'bearingCapacityBasis'
        ? raw === 'gross' ? 'Bruta' : 'Neta'
        : id === 'cornerPosition'
          ? ({ 'bottom-left': 'Inferior izquierda', 'bottom-right': 'Inferior derecha', 'top-left': 'Superior izquierda', 'top-right': 'Superior derecha' } as const)[raw as CornerFootingInputs['cornerPosition']]
          : raw
      return { id, label, unit, value }
    }),
    limitations: [
      'Dos caras adyacentes de la columna coinciden con los bordes de la base rectangular.',
      'Las cuatro esquinas deben permanecer comprimidas y la interacción biaxial del núcleo debe ser menor o igual que uno.',
      'No incluye momentos adicionales, fuerzas horizontales, torsión, contacto parcial ni interacción suelo-estructura.',
      'Punzonamiento de esquina no evaluado: el perímetro queda truncado en dos direcciones.',
      'Las demandas direccionales integran franjas completas y no sustituyen un análisis de placa cuando sea exigible.',
      'Capacidad admisible y asentamientos proceden del estudio geotécnico aplicable.',
      'Las resistencias de cortante, acero y desarrollo son referencias públicas con contraste independiente pendiente.',
      ...project.warnings,
    ],
  }
}
