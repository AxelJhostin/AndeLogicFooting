import type { ProjectDocument, StrapFootingInputs } from '../domain/projects'
import { getStandardProfile } from '../standards/profiles'
import type { FootingCalculationReport } from './footing-calculation-report'

export type StrapReportInput = { id: keyof StrapFootingInputs; label: string; value: number | string; unit: string }
export type StrapFootingCalculationReport = {
  generatedAt: string
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt'>
  product: Pick<ProjectDocument, 'productVersion' | 'engineVersion' | 'schemaVersion'>
  profile: FootingCalculationReport['profile']
  inputs: StrapReportInput[]
  limitations: string[]
}

const definitions: Array<{ id: keyof StrapFootingInputs; label: string; unit: string }> = [
  { id: 'serviceExteriorLoadKn', label: 'Carga de servicio · columna medianera', unit: 'kN' },
  { id: 'serviceInteriorLoadKn', label: 'Carga de servicio · columna interior', unit: 'kN' },
  { id: 'factoredExteriorLoadKn', label: 'Carga última · columna medianera', unit: 'kN' },
  { id: 'factoredInteriorLoadKn', label: 'Carga última · columna interior', unit: 'kN' },
  { id: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa' },
  { id: 'bearingCapacityBasis', label: 'Base de capacidad declarada', unit: '' },
  { id: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa' },
  { id: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³' },
  { id: 'soilCoverDepthM', label: 'Altura de relleno', unit: 'm' },
  { id: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³' },
  { id: 'exteriorFootingWidthM', label: 'Base medianera · ancho', unit: 'm' },
  { id: 'exteriorFootingLengthM', label: 'Base medianera · longitud', unit: 'm' },
  { id: 'exteriorFootingThicknessM', label: 'Base medianera · espesor', unit: 'm' },
  { id: 'interiorFootingWidthM', label: 'Base interior · ancho', unit: 'm' },
  { id: 'interiorFootingLengthM', label: 'Base interior · longitud', unit: 'm' },
  { id: 'interiorFootingThicknessM', label: 'Base interior · espesor', unit: 'm' },
  { id: 'footingCenterSpacingM', label: 'Separación entre centros', unit: 'm' },
  { id: 'exteriorColumnWidthM', label: 'Columna medianera · ancho', unit: 'm' },
  { id: 'exteriorColumnLengthM', label: 'Columna medianera · longitud', unit: 'm' },
  { id: 'exteriorColumnCenterFromOuterEdgeM', label: 'Centro exterior desde medianera', unit: 'm' },
  { id: 'interiorColumnWidthM', label: 'Columna interior · ancho', unit: 'm' },
  { id: 'interiorColumnLengthM', label: 'Columna interior · longitud', unit: 'm' },
  { id: 'strapBeamWidthM', label: 'Viga centradora · ancho', unit: 'm' },
  { id: 'strapBeamDepthM', label: 'Viga centradora · peralte', unit: 'm' },
  { id: 'concreteCoverM', label: 'Recubrimiento', unit: 'm' },
  { id: 'barDiameterM', label: 'Diámetro de barra', unit: 'm' },
  { id: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa' },
  { id: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa' },
  { id: 'padLongitudinalBarSpacingM', label: 'Separación longitudinal en bases', unit: 'm' },
  { id: 'padTransverseBarSpacingM', label: 'Separación transversal en bases', unit: 'm' },
  { id: 'beamLongitudinalBarCount', label: 'Barras longitudinales en viga', unit: 'u' },
  { id: 'padDevelopmentAvailableM', label: 'Desarrollo disponible en bases', unit: 'm' },
  { id: 'beamDevelopmentAvailableM', label: 'Anclaje disponible de la viga', unit: 'm' },
]

export function buildStrapFootingCalculationReport(project: ProjectDocument, generatedAt = new Date().toISOString()): StrapFootingCalculationReport {
  const profile = getStandardProfile(project.standardProfile)
  return {
    generatedAt,
    project: { projectId: project.projectId, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt },
    product: { productVersion: project.productVersion, engineVersion: project.engineVersion, schemaVersion: project.schemaVersion },
    profile: {
      id: profile.id, label: profile.label, shortLabel: profile.shortLabel, releaseStatus: profile.releaseStatus,
      sources: profile.sources, traceability: profile.traceability, releaseBlocker: profile.releaseBlocker,
    },
    inputs: definitions.map(({ id, label, unit }) => ({ id, label, unit, value: project.strapInputSnapshot[id] })),
    limitations: [
      'Dos bases rectangulares separadas y una viga centradora rígida sin contacto con el suelo.',
      'Solo cargas verticales y excentricidad longitudinal de la columna medianera; no se forman combinaciones de carga.',
      'Se exige presión uniforme y reacción positiva bajo cada base; levantamiento y contacto parcial quedan fuera de alcance.',
      'El punzonamiento donde la viga cruza la región crítica se declara no evaluado y requiere revisión especializada.',
      'Los asentamientos y la capacidad admisible proceden del estudio geotécnico aplicable.',
      'Las resistencias, el acero y el desarrollo son referencias públicas con contraste independiente pendiente.',
      ...project.warnings,
    ],
  }
}
