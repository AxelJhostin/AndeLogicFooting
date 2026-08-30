import type { CornerFootingInputs } from '../../domain/projects'

export type CornerCaseField = Exclude<keyof CornerFootingInputs, 'bearingCapacityBasis' | 'cornerPosition'>
export const cornerCaseFieldDefinitions: Array<{ key: CornerCaseField; label: string; unit: string; help: string }> = [
  { key: 'serviceAxialLoadKn', label: 'Carga axial de servicio', unit: 'kN', help: 'Carga vertical declarada de la columna.' },
  { key: 'factoredAxialLoadKn', label: 'Carga axial última', unit: 'kN', help: 'Combinación última declarada; la aplicación no la genera.' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible', unit: 'kPa', help: 'Valor procedente del estudio geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa', help: 'Solo se resta cuando la capacidad declarada es neta.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Usado en el contacto de servicio.' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre zapata', unit: 'm', help: 'Altura uniforme declarada.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Puede ser cero cuando no existe relleno.' },
  { key: 'footingWidthM', label: 'Ancho B · eje Y', unit: 'm', help: 'Dimensión total entre borde inferior y superior.' },
  { key: 'footingLengthM', label: 'Longitud L · eje X', unit: 'm', help: 'Dimensión total entre borde izquierdo y derecho.' },
  { key: 'footingThicknessM', label: 'Espesor h', unit: 'm', help: 'Espesor constante de la base.' },
  { key: 'columnWidthM', label: 'Columna · ancho cB', unit: 'm', help: 'Dimensión de columna en Y.' },
  { key: 'columnLengthM', label: 'Columna · longitud cL', unit: 'm', help: 'Dimensión de columna en X.' },
  { key: 'concreteCoverM', label: 'Recubrimiento', unit: 'm', help: 'Hasta la cara de la barra inferior.' },
  { key: 'barDiameterM', label: 'Diámetro de barra', unit: 'mm', help: 'Diámetro común para esta revisión.' },
  { key: 'concreteStrengthMpa', label: 'Resistencia f′c', unit: 'MPa', help: 'Hormigón de peso normal.' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia fy', unit: 'MPa', help: 'Resistencia declarada del acero.' },
  { key: 'longitudinalBarSpacingM', label: 'Acero en X', unit: 'm', help: 'Separación de barras paralelas a L.' },
  { key: 'transverseBarSpacingM', label: 'Acero en Y', unit: 'm', help: 'Separación de barras paralelas a B.' },
  { key: 'longitudinalDevelopmentAvailableM', label: 'Desarrollo disponible en X', unit: 'm', help: 'Longitud efectiva declarada.' },
  { key: 'transverseDevelopmentAvailableM', label: 'Desarrollo disponible en Y', unit: 'm', help: 'Longitud efectiva declarada.' },
]

export const cornerCaseFieldGroups: Array<{ id: string; label: string; description: string; keys: CornerCaseField[] }> = [
  { id: 'project', label: 'Proyecto y alcance', description: 'Columna alineada con dos linderos y contacto completo.', keys: [] },
  { id: 'loads', label: 'Cargas', description: 'Servicio y última se declaran por separado.', keys: ['serviceAxialLoadKn', 'factoredAxialLoadKn'] },
  { id: 'soil', label: 'Suelo y contacto', description: 'Capacidad externa, base de comparación y pesos de servicio.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'geometry', label: 'Geometría y esquina', description: 'Base rectangular y dos caras de columna junto a bordes adyacentes.', keys: ['footingWidthM', 'footingLengthM', 'footingThicknessM', 'columnWidthM', 'columnLengthM'] },
  { id: 'materials', label: 'Materiales', description: 'Profundidad efectiva y resistencias declaradas.', keys: ['concreteCoverM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa'] },
  { id: 'reinforcement', label: 'Armado y desarrollo', description: 'Distribución preliminar en X y Y.', keys: ['longitudinalBarSpacingM', 'transverseBarSpacingM', 'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM'] },
]

export type CornerInputText = Record<CornerCaseField, string>
export function cornerInputTextFrom(inputs: CornerFootingInputs): CornerInputText {
  return Object.fromEntries(cornerCaseFieldDefinitions.map(({ key }) => [key, key === 'barDiameterM' ? String(inputs[key] * 1000) : String(inputs[key])])) as CornerInputText
}
