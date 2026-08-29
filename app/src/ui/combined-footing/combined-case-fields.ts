import type { CombinedFootingInputs } from '../../domain/projects'

export type CombinedCaseField = Exclude<keyof CombinedFootingInputs, 'bearingCapacityBasis'>

export const combinedCaseFieldDefinitions: Array<{ key: CombinedCaseField; label: string; unit: string; help: string }> = [
  { key: 'serviceColumn1LoadKn', label: 'Servicio · columna 1', unit: 'kN', help: 'Carga vertical de servicio declarada en la columna izquierda.' },
  { key: 'serviceColumn2LoadKn', label: 'Servicio · columna 2', unit: 'kN', help: 'Carga vertical de servicio declarada en la columna derecha.' },
  { key: 'factoredColumn1LoadKn', label: 'Última · columna 1', unit: 'kN', help: 'Carga última declarada; la aplicación no forma combinaciones.' },
  { key: 'factoredColumn2LoadKn', label: 'Última · columna 2', unit: 'kN', help: 'Carga última declarada; la aplicación no forma combinaciones.' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible', unit: 'kPa', help: 'Valor procedente del informe geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa', help: 'Solo para comparación en base neta.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Usado en el contacto de servicio.' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre zapata', unit: 'm', help: 'Altura uniforme posterior a la construcción.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Puede ser cero cuando no existe relleno.' },
  { key: 'footingWidthM', label: 'Ancho B', unit: 'm', help: 'Dimensión transversal constante.' },
  { key: 'footingLengthM', label: 'Longitud L', unit: 'm', help: 'Dimensión longitudinal total.' },
  { key: 'footingThicknessM', label: 'Espesor h', unit: 'm', help: 'Espesor constante del modelo.' },
  { key: 'column1WidthM', label: 'Columna 1 · ancho transversal', unit: 'm', help: 'Dimensión paralela a B.' },
  { key: 'column1LengthM', label: 'Columna 1 · longitud', unit: 'm', help: 'Dimensión paralela a L.' },
  { key: 'column1CenterFromLeftM', label: 'Columna 1 · posición x₁', unit: 'm', help: 'Centro medido desde el extremo izquierdo.' },
  { key: 'column2WidthM', label: 'Columna 2 · ancho transversal', unit: 'm', help: 'Dimensión paralela a B.' },
  { key: 'column2LengthM', label: 'Columna 2 · longitud', unit: 'm', help: 'Dimensión paralela a L.' },
  { key: 'column2CenterFromLeftM', label: 'Columna 2 · posición x₂', unit: 'm', help: 'Centro medido desde el extremo izquierdo.' },
  { key: 'concreteCoverM', label: 'Recubrimiento', unit: 'm', help: 'Hasta la cara de la barra inferior.' },
  { key: 'barDiameterM', label: 'Diámetro de barra', unit: 'mm', help: 'Diámetro común usado en esta revisión preliminar.' },
  { key: 'concreteStrengthMpa', label: 'Resistencia f′c', unit: 'MPa', help: 'Hormigón de peso normal.' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia fy', unit: 'MPa', help: 'Resistencia declarada del acero.' },
  { key: 'longitudinalBottomBarSpacingM', label: 'Acero longitudinal inferior', unit: 'm', help: 'Separación máxima declarada.' },
  { key: 'longitudinalTopBarSpacingM', label: 'Acero longitudinal superior', unit: 'm', help: 'Separación en la zona de momento negativo.' },
  { key: 'transverseBarSpacingM', label: 'Acero transversal inferior', unit: 'm', help: 'Separación máxima declarada.' },
  { key: 'longitudinalDevelopmentAvailableM', label: 'Desarrollo longitudinal disponible', unit: 'm', help: 'Longitud efectiva declarada desde la sección crítica.' },
  { key: 'transverseDevelopmentAvailableM', label: 'Desarrollo transversal disponible', unit: 'm', help: 'Longitud efectiva declarada desde la sección crítica.' },
]

export const combinedCaseFieldGroups: Array<{ id: string; label: string; description: string; keys: CombinedCaseField[] }> = [
  { id: 'project', label: 'Proyecto y alcance', description: 'Dos columnas interiores y contacto completo.', keys: [] },
  { id: 'loads', label: 'Cargas por columna', description: 'Servicio y última se declaran por separado.', keys: ['serviceColumn1LoadKn', 'serviceColumn2LoadKn', 'factoredColumn1LoadKn', 'factoredColumn2LoadKn'] },
  { id: 'soil', label: 'Suelo y contacto', description: 'Capacidad externa, base y pesos de servicio.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'geometry', label: 'Geometría de zapata', description: 'Planta rectangular y espesor constante.', keys: ['footingWidthM', 'footingLengthM', 'footingThicknessM'] },
  { id: 'columns', label: 'Columnas y posiciones', description: 'Dimensiones y centros longitudinales.', keys: ['column1WidthM', 'column1LengthM', 'column1CenterFromLeftM', 'column2WidthM', 'column2LengthM', 'column2CenterFromLeftM'] },
  { id: 'materials', label: 'Materiales', description: 'Profundidad efectiva y resistencias declaradas.', keys: ['concreteCoverM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa'] },
  { id: 'reinforcement', label: 'Armado y desarrollo', description: 'Distribución preliminar en las zonas principales.', keys: ['longitudinalBottomBarSpacingM', 'longitudinalTopBarSpacingM', 'transverseBarSpacingM', 'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM'] },
]

export type CombinedInputText = Record<CombinedCaseField, string>

export function combinedInputTextFrom(inputs: CombinedFootingInputs): CombinedInputText {
  return Object.fromEntries(combinedCaseFieldDefinitions.map(({ key }) => [key, key === 'barDiameterM' ? String(inputs[key] * 1000) : String(inputs[key])])) as CombinedInputText
}
