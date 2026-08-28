import type { FootingInputs, ProjectDocument } from '../domain/projects'
import { getStandardProfile } from '../standards/profiles'

export type ReportInput = {
  id: keyof FootingInputs
  label: string
  value: number | string
  unit: string
}

export type FootingCalculationReport = {
  generatedAt: string
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt'>
  product: Pick<ProjectDocument, 'productVersion' | 'engineVersion' | 'schemaVersion'>
  profile: {
    id: string
    label: string
    releaseStatus: string
    sources: string[]
    releaseBlocker: string
  }
  inputs: ReportInput[]
  limitations: string[]
}

const inputDefinitions: Array<{ id: keyof FootingInputs; label: string; unit: string }> = [
  { id: 'axialLoadKn', label: 'Carga de servicio centrada', unit: 'kN' },
  { id: 'factoredAxialLoadKn', label: 'Carga axial última declarada', unit: 'kN' },
  { id: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa' },
  { id: 'bearingCapacityBasis', label: 'Base de capacidad declarada', unit: '' },
  { id: 'footingWidthM', label: 'Ancho de zapata', unit: 'm' },
  { id: 'footingLengthM', label: 'Largo de zapata', unit: 'm' },
  { id: 'footingThicknessM', label: 'Espesor de zapata', unit: 'm' },
  { id: 'columnWidthM', label: 'Ancho de columna', unit: 'm' },
  { id: 'columnLengthM', label: 'Largo de columna', unit: 'm' },
  { id: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa' },
  { id: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa' },
  { id: 'barDiameterM', label: 'Diámetro de barra', unit: 'm' },
]

/** Modelo de memoria serializable. El renderizado HTML/PDF se conecta posteriormente a este contrato. */
export function buildFootingCalculationReport(
  project: ProjectDocument,
  generatedAt: string = new Date().toISOString(),
): FootingCalculationReport {
  const profile = getStandardProfile(project.standardProfile)

  return {
    generatedAt,
    project: {
      projectId: project.projectId,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    },
    product: {
      productVersion: project.productVersion,
      engineVersion: project.engineVersion,
      schemaVersion: project.schemaVersion,
    },
    profile: {
      id: profile.id,
      label: profile.label,
      releaseStatus: profile.releaseStatus,
      sources: profile.sources,
      releaseBlocker: profile.releaseBlocker,
    },
    inputs: inputDefinitions.map(({ id, label, unit }) => ({ id, label, value: project.inputSnapshot[id], unit })),
    limitations: [
      'Los resultados de referencia permanecen en validación y no son una liberación normativa NEC.',
      'La capacidad admisible y los asentamientos dependen del estudio geotécnico aplicable.',
      'El alcance excluye excentricidad, presión no uniforme, zapatas combinadas, corridas y losas.',
      ...project.warnings,
    ],
  }
}
