import type { EdgeFootingInputs } from '../../domain/projects'

export type EdgeCaseField = Exclude<keyof EdgeFootingInputs, 'bearingCapacityBasis' | 'edgeSide'>
export const edgeCaseFieldDefinitions: Array<{ key: EdgeCaseField; label: string; unit: string; help: string }> = [
  { key: 'serviceAxialLoadKn', label: 'Carga axial de servicio', unit: 'kN', help: 'Carga vertical declarada de la columna.' },
  { key: 'factoredAxialLoadKn', label: 'Carga axial última', unit: 'kN', help: 'Combinación última declarada; la aplicación no forma combinaciones.' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible', unit: 'kPa', help: 'Valor procedente del estudio geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa', help: 'Solo para comparación en base neta.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Usado en contacto de servicio.' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre zapata', unit: 'm', help: 'Altura uniforme declarada.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Puede ser cero si no existe relleno.' },
  { key: 'footingWidthM', label: 'Ancho transversal B', unit: 'm', help: 'Dimensión paralela al lindero.' },
  { key: 'footingLengthM', label: 'Longitud excéntrica L', unit: 'm', help: 'Dimensión perpendicular al lindero.' },
  { key: 'footingThicknessM', label: 'Espesor h', unit: 'm', help: 'Espesor constante de la base.' },
  { key: 'columnWidthM', label: 'Columna · ancho transversal', unit: 'm', help: 'Dimensión paralela al lindero.' },
  { key: 'columnLengthM', label: 'Columna · longitud', unit: 'm', help: 'Una cara coincide con el borde seleccionado.' },
  { key: 'concreteCoverM', label: 'Recubrimiento', unit: 'm', help: 'Hasta la cara de la barra inferior.' },
  { key: 'barDiameterM', label: 'Diámetro de barra', unit: 'mm', help: 'Diámetro común de esta revisión.' },
  { key: 'concreteStrengthMpa', label: 'Resistencia f′c', unit: 'MPa', help: 'Hormigón de peso normal.' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia fy', unit: 'MPa', help: 'Resistencia declarada del acero.' },
  { key: 'longitudinalBarSpacingM', label: 'Acero longitudinal', unit: 'm', help: 'Separación máxima en la dirección excéntrica.' },
  { key: 'transverseBarSpacingM', label: 'Acero transversal', unit: 'm', help: 'Separación máxima paralela al lindero.' },
  { key: 'longitudinalDevelopmentAvailableM', label: 'Desarrollo longitudinal disponible', unit: 'm', help: 'Longitud efectiva declarada.' },
  { key: 'transverseDevelopmentAvailableM', label: 'Desarrollo transversal disponible', unit: 'm', help: 'Longitud efectiva declarada.' },
]

export const edgeCaseFieldGroups: Array<{ id: string; label: string; description: string; keys: EdgeCaseField[] }> = [
  { id: 'project', label: 'Proyecto y alcance', description: 'Una columna alineada al lindero y excentricidad en un eje.', keys: [] },
  { id: 'loads', label: 'Cargas', description: 'Servicio y última se declaran por separado.', keys: ['serviceAxialLoadKn', 'factoredAxialLoadKn'] },
  { id: 'soil', label: 'Suelo y contacto', description: 'Capacidad externa, base y pesos de servicio.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'geometry', label: 'Geometría y borde', description: 'Base rectangular y columna con una cara al lindero.', keys: ['footingWidthM', 'footingLengthM', 'footingThicknessM', 'columnWidthM', 'columnLengthM'] },
  { id: 'materials', label: 'Materiales', description: 'Profundidad efectiva y resistencias.', keys: ['concreteCoverM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa'] },
  { id: 'reinforcement', label: 'Armado y desarrollo', description: 'Distribución preliminar en las dos direcciones.', keys: ['longitudinalBarSpacingM', 'transverseBarSpacingM', 'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM'] },
]

export type EdgeInputText = Record<EdgeCaseField, string>
export function edgeInputTextFrom(inputs: EdgeFootingInputs): EdgeInputText {
  return Object.fromEntries(edgeCaseFieldDefinitions.map(({ key }) => [key, key === 'barDiameterM' ? String(inputs[key] * 1000) : String(inputs[key])])) as EdgeInputText
}
