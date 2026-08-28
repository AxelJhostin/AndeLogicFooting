import type { FootingInputs } from '../../domain/projects'

export type CaseField = Exclude<keyof FootingInputs, 'bearingCapacityBasis'>
export type CaseFieldDefinition = { key: CaseField; label: string; unit: string; help: string }
export type CaseFieldGroup = { id: string; label: string; description: string; keys: CaseField[] }

export const caseFieldDefinitions: CaseFieldDefinition[] = [
  { key: 'axialLoadKn', label: 'Carga de servicio centrada', unit: 'kN', help: 'Proviene del análisis estructural.' },
  { key: 'factoredAxialLoadKn', label: 'Carga axial última declarada', unit: 'kN', help: 'Combinación última declarada.' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa', help: 'Dato del informe geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido en desplante', unit: 'kPa', help: 'Solo para base neta.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Propiedad declarada del material.' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre zapata', unit: 'm', help: 'Altura de relleno posterior a la obra.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Dato geotécnico declarado.' },
  { key: 'columnWidthM', label: 'Ancho de columna', unit: 'm', help: 'Dimensión B de columna centrada.' },
  { key: 'columnLengthM', label: 'Largo de columna', unit: 'm', help: 'Dimensión L de columna centrada.' },
  { key: 'footingWidthM', label: 'Ancho de zapata B', unit: 'm', help: 'Dimensión preliminar de planta.' },
  { key: 'footingLengthM', label: 'Largo de zapata L', unit: 'm', help: 'Dimensión preliminar de planta.' },
  { key: 'footingThicknessM', label: 'Espesor h', unit: 'm', help: 'Espesor preliminar de zapata.' },
  { key: 'concreteCoverM', label: 'Recubrimiento inferior', unit: 'm', help: 'Desde la cara al acero.' },
  { key: 'barDiameterM', label: 'Diámetro de barra', unit: 'mm', help: 'Barra inferior considerada.' },
  { key: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa', help: 'Propiedad especificada.' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa', help: 'Propiedad especificada.' },
  { key: 'barsParallelToWidthMaxSpacingM', label: 'Separación máxima · barras B', unit: 'm', help: 'Valor objetivo preliminar.' },
  { key: 'barsParallelToLengthMaxSpacingM', label: 'Separación máxima · barras L', unit: 'm', help: 'Valor objetivo preliminar.' },
  { key: 'developmentAvailableLengthWidthM', label: 'Largo disponible · B', unit: 'm', help: 'Largo declarado en el detalle.' },
  { key: 'developmentAvailableLengthLengthM', label: 'Largo disponible · L', unit: 'm', help: 'Largo declarado en el detalle.' },
  { key: 'punchingCriticalSectionOffsetM', label: 'Distancia de perímetro declarada', unit: 'm', help: 'Hipótesis de demanda.' },
]

export const caseFieldGroups: CaseFieldGroup[] = [
  { id: 'project', label: 'Proyecto', description: 'Identificación y alcance del caso.', keys: [] },
  { id: 'loads', label: 'Cargas', description: 'Acciones declaradas por el análisis estructural.', keys: ['axialLoadKn', 'factoredAxialLoadKn'] },
  { id: 'soil', label: 'Suelo y contacto', description: 'Datos del informe geotécnico y pesos declarados.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'geometry', label: 'Geometría', description: 'Columna centrada y dimensiones preliminares.', keys: ['columnWidthM', 'columnLengthM', 'footingWidthM', 'footingLengthM', 'footingThicknessM', 'punchingCriticalSectionOffsetM'] },
  { id: 'materials', label: 'Materiales', description: 'Hormigón y acero declarados.', keys: ['concreteCoverM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa'] },
  { id: 'reinforcement', label: 'Armado y desarrollo', description: 'Distribución preliminar y largos disponibles.', keys: ['barsParallelToWidthMaxSpacingM', 'barsParallelToLengthMaxSpacingM', 'developmentAvailableLengthWidthM', 'developmentAvailableLengthLengthM'] },
]

export function inputTextFrom(inputs: FootingInputs): Record<CaseField, string> {
  return Object.fromEntries(caseFieldDefinitions.map(({ key }) => [key, String(key === 'barDiameterM' ? inputs[key] * 1000 : inputs[key])])) as Record<CaseField, string>
}
