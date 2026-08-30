import type { MatFootingInputs, ProjectDocument } from '../domain/projects'
import { getStandardProfile } from '../standards/profiles'
import type { FootingCalculationReport } from './footing-calculation-report'

export type MatReportInput = { id: keyof MatFootingInputs; label: string; value: number | string; unit: string }
export type MatFootingCalculationReport = {
  generatedAt: string
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt'>
  product: Pick<ProjectDocument, 'productVersion' | 'engineVersion' | 'schemaVersion'>
  profile: FootingCalculationReport['profile']
  inputs: MatReportInput[]
  limitations: string[]
}

export function buildMatFootingCalculationReport(project: ProjectDocument, generatedAt = new Date().toISOString()): MatFootingCalculationReport {
  const profile = getStandardProfile(project.standardProfile)
  const inputs = project.matInputSnapshot
  return {
    generatedAt,
    project: { projectId: project.projectId, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt },
    product: { productVersion: project.productVersion, engineVersion: project.engineVersion, schemaVersion: project.schemaVersion },
    profile: { id: profile.id, label: profile.label, shortLabel: profile.shortLabel, releaseStatus: profile.releaseStatus, sources: profile.sources, traceability: profile.traceability, releaseBlocker: profile.releaseBlocker },
    inputs: [
      { id: 'footingWidthM', label: 'Ancho B', value: inputs.footingWidthM, unit: 'm' },
      { id: 'footingLengthM', label: 'Longitud L', value: inputs.footingLengthM, unit: 'm' },
      { id: 'footingThicknessM', label: 'Espesor h', value: inputs.footingThicknessM, unit: 'm' },
      { id: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', value: inputs.concreteUnitWeightKnM3, unit: 'kN/m³' },
      { id: 'soilCoverDepthM', label: 'Relleno uniforme', value: inputs.soilCoverDepthM, unit: 'm' },
      { id: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', value: inputs.soilUnitWeightKnM3, unit: 'kN/m³' },
      { id: 'allowableBearingKpa', label: 'Capacidad admisible', value: inputs.allowableBearingKpa, unit: 'kPa' },
      { id: 'bearingCapacityBasis', label: 'Base de capacidad', value: inputs.bearingCapacityBasis === 'gross' ? 'Bruta' : 'Neta', unit: '' },
      { id: 'removedOverburdenKpa', label: 'Esfuerzo removido', value: inputs.removedOverburdenKpa, unit: 'kPa' },
      { id: 'settlementPressureBasis', label: 'Base para asentamiento', value: inputs.settlementPressureBasis === 'gross' ? 'Bruta' : 'Neta', unit: '' },
      { id: 'subgradeModulusKnM3', label: 'Módulo de balasto k', value: inputs.subgradeModulusKnM3, unit: 'kN/m³' },
      { id: 'allowableTotalSettlementMm', label: 'Límite total', value: inputs.allowableTotalSettlementMm || 'No suministrado', unit: inputs.allowableTotalSettlementMm ? 'mm' : '' },
      { id: 'allowableDifferentialSettlementMm', label: 'Límite diferencial', value: inputs.allowableDifferentialSettlementMm || 'No suministrado', unit: inputs.allowableDifferentialSettlementMm ? 'mm' : '' },
      { id: 'columns', label: 'Número de columnas', value: inputs.columns.length, unit: '' },
    ],
    limitations: [
      'Modelo rectangular rígido con cargas axiales verticales y contacto completo.',
      'El módulo de balasto, la capacidad admisible y los límites de asentamiento son datos externos del proyecto.',
      'La estimación s=q/k no representa consolidación, estratigrafía ni flexión de la losa.',
      'Las proyecciones X/Y son auditorías de equilibrio y no diseñan franjas estructurales.',
      'Flexión, cortante, punzonamiento y armado de placa permanecen explícitamente no evaluados.',
      'No incluye muros, momentos de columnas, cargas horizontales, contacto parcial, losas sobre pilotes ni elementos finitos.',
      ...project.warnings,
    ],
  }
}
