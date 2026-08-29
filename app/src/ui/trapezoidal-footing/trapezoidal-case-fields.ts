import type { TrapezoidalFootingInputs } from '../../domain/projects'

export type TrapezoidalCaseField = Exclude<keyof TrapezoidalFootingInputs, 'bearingCapacityBasis'>
export const trapezoidalCaseFieldDefinitions: Array<{ key: TrapezoidalCaseField; label: string; unit: string; help: string }> = [
  { key: 'serviceColumn1LoadKn', label: 'Servicio · columna 1', unit: 'kN', help: 'Carga vertical declarada en la columna izquierda.' },
  { key: 'serviceColumn2LoadKn', label: 'Servicio · columna 2', unit: 'kN', help: 'Carga vertical declarada en la columna derecha.' },
  { key: 'factoredColumn1LoadKn', label: 'Última · columna 1', unit: 'kN', help: 'La aplicación no forma combinaciones.' },
  { key: 'factoredColumn2LoadKn', label: 'Última · columna 2', unit: 'kN', help: 'La aplicación no forma combinaciones.' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible', unit: 'kPa', help: 'Valor procedente del estudio geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa', help: 'Solo para comparación en base neta.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Usado en contacto de servicio.' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre zapata', unit: 'm', help: 'Altura uniforme declarada.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Puede ser cero si no existe relleno.' },
  { key: 'leftFootingWidthM', label: 'Ancho izquierdo B₁', unit: 'm', help: 'Ancho transversal en x=0.' },
  { key: 'rightFootingWidthM', label: 'Ancho derecho B₂', unit: 'm', help: 'Ancho transversal en x=L; debe diferir de B₁.' },
  { key: 'footingLengthM', label: 'Longitud L', unit: 'm', help: 'Distancia entre los dos extremos paralelos.' },
  { key: 'footingThicknessM', label: 'Espesor h', unit: 'm', help: 'Espesor constante.' },
  { key: 'column1WidthM', label: 'Columna 1 · ancho', unit: 'm', help: 'Dimensión transversal.' },
  { key: 'column1LengthM', label: 'Columna 1 · longitud', unit: 'm', help: 'Dimensión longitudinal.' },
  { key: 'column1CenterFromLeftM', label: 'Columna 1 · posición x₁', unit: 'm', help: 'Centro desde el extremo izquierdo.' },
  { key: 'column2WidthM', label: 'Columna 2 · ancho', unit: 'm', help: 'Dimensión transversal.' },
  { key: 'column2LengthM', label: 'Columna 2 · longitud', unit: 'm', help: 'Dimensión longitudinal.' },
  { key: 'column2CenterFromLeftM', label: 'Columna 2 · posición x₂', unit: 'm', help: 'Centro desde el extremo izquierdo.' },
  { key: 'concreteCoverM', label: 'Recubrimiento', unit: 'm', help: 'Hasta la cara de la barra inferior.' },
  { key: 'barDiameterM', label: 'Diámetro de barra', unit: 'mm', help: 'Diámetro común de esta revisión.' },
  { key: 'concreteStrengthMpa', label: 'Resistencia f′c', unit: 'MPa', help: 'Hormigón de peso normal.' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia fy', unit: 'MPa', help: 'Resistencia declarada del acero.' },
  { key: 'longitudinalBottomBarSpacingM', label: 'Acero longitudinal inferior', unit: 'm', help: 'Separación máxima declarada.' },
  { key: 'longitudinalTopBarSpacingM', label: 'Acero longitudinal superior', unit: 'm', help: 'Separación en zona de momento negativo.' },
  { key: 'transverseBarSpacingM', label: 'Acero transversal inferior', unit: 'm', help: 'Separación máxima declarada.' },
  { key: 'longitudinalDevelopmentAvailableM', label: 'Desarrollo longitudinal disponible', unit: 'm', help: 'Longitud efectiva declarada.' },
  { key: 'transverseDevelopmentAvailableM', label: 'Desarrollo transversal disponible', unit: 'm', help: 'Longitud efectiva declarada.' },
]

export const trapezoidalCaseFieldGroups: Array<{ id: string; label: string; description: string; keys: TrapezoidalCaseField[] }> = [
  { id: 'project', label: 'Proyecto y alcance', description: 'Dos columnas interiores y trapecio simétrico respecto del eje.', keys: [] },
  { id: 'loads', label: 'Cargas por columna', description: 'Servicio y última se declaran por separado.', keys: ['serviceColumn1LoadKn', 'serviceColumn2LoadKn', 'factoredColumn1LoadKn', 'factoredColumn2LoadKn'] },
  { id: 'soil', label: 'Suelo y contacto', description: 'Capacidad externa, base y pesos de servicio.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'geometry', label: 'Geometría trapezoidal', description: 'Dos anchos extremos, longitud y espesor.', keys: ['leftFootingWidthM', 'rightFootingWidthM', 'footingLengthM', 'footingThicknessM'] },
  { id: 'columns', label: 'Columnas y posiciones', description: 'Dimensiones y centros longitudinales.', keys: ['column1WidthM', 'column1LengthM', 'column1CenterFromLeftM', 'column2WidthM', 'column2LengthM', 'column2CenterFromLeftM'] },
  { id: 'materials', label: 'Materiales', description: 'Profundidad efectiva y resistencias.', keys: ['concreteCoverM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa'] },
  { id: 'reinforcement', label: 'Armado y desarrollo', description: 'Distribución preliminar en zonas principales.', keys: ['longitudinalBottomBarSpacingM', 'longitudinalTopBarSpacingM', 'transverseBarSpacingM', 'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM'] },
]

export type TrapezoidalInputText = Record<TrapezoidalCaseField, string>
export function trapezoidalInputTextFrom(inputs: TrapezoidalFootingInputs): TrapezoidalInputText {
  return Object.fromEntries(trapezoidalCaseFieldDefinitions.map(({ key }) => [key, key === 'barDiameterM' ? String(inputs[key]*1000) : String(inputs[key])])) as TrapezoidalInputText
}
