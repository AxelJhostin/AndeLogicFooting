import type { StrapFootingInputs } from '../../domain/projects'

export type StrapCaseField = Exclude<keyof StrapFootingInputs, 'bearingCapacityBasis'>
type Definition = { key: StrapCaseField; label: string; unit: string; help: string }

export const strapCaseFieldDefinitions: Definition[] = [
  { key: 'serviceExteriorLoadKn', label: 'Servicio · medianera', unit: 'kN', help: 'Carga vertical de la columna junto al lindero.' },
  { key: 'serviceInteriorLoadKn', label: 'Servicio · interior', unit: 'kN', help: 'Carga vertical de la columna que estabiliza el sistema.' },
  { key: 'factoredExteriorLoadKn', label: 'Última · medianera', unit: 'kN', help: 'Carga última declarada; no se forman combinaciones.' },
  { key: 'factoredInteriorLoadKn', label: 'Última · interior', unit: 'kN', help: 'Carga última declarada; no se forman combinaciones.' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible', unit: 'kPa', help: 'Dato del estudio geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa', help: 'Solo se descuenta al comparar en base neta.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Incluye las dos bases y el tramo libre de viga.' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre las bases', unit: 'm', help: 'Altura uniforme declarada.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Puede ser cero si no hay relleno.' },
  { key: 'exteriorFootingWidthM', label: 'Base medianera · ancho Bₑ', unit: 'm', help: 'Dimensión transversal.' },
  { key: 'exteriorFootingLengthM', label: 'Base medianera · longitud Lₑ', unit: 'm', help: 'Dimensión desde el lindero hacia el interior.' },
  { key: 'exteriorFootingThicknessM', label: 'Base medianera · espesor hₑ', unit: 'm', help: 'Espesor constante de esta base.' },
  { key: 'interiorFootingWidthM', label: 'Base interior · ancho Bᵢ', unit: 'm', help: 'Dimensión transversal.' },
  { key: 'interiorFootingLengthM', label: 'Base interior · longitud Lᵢ', unit: 'm', help: 'Dimensión longitudinal.' },
  { key: 'interiorFootingThicknessM', label: 'Base interior · espesor hᵢ', unit: 'm', help: 'Espesor constante de esta base.' },
  { key: 'footingCenterSpacingM', label: 'Separación entre centros S', unit: 'm', help: 'Distancia entre los centros geométricos de ambas bases.' },
  { key: 'exteriorColumnWidthM', label: 'Columna medianera · ancho', unit: 'm', help: 'Dimensión transversal.' },
  { key: 'exteriorColumnLengthM', label: 'Columna medianera · longitud', unit: 'm', help: 'Dimensión longitudinal.' },
  { key: 'exteriorColumnCenterFromOuterEdgeM', label: 'Centro desde lindero xₑ', unit: 'm', help: 'Posición del centro de columna medida desde el borde exterior.' },
  { key: 'interiorColumnWidthM', label: 'Columna interior · ancho', unit: 'm', help: 'Columna centrada sobre la segunda base.' },
  { key: 'interiorColumnLengthM', label: 'Columna interior · longitud', unit: 'm', help: 'Columna centrada sobre la segunda base.' },
  { key: 'strapBeamWidthM', label: 'Viga · ancho bᵥ', unit: 'm', help: 'Ancho de la viga centradora.' },
  { key: 'strapBeamDepthM', label: 'Viga · peralte hᵥ', unit: 'm', help: 'Peralte total; el tramo libre no apoya en el suelo.' },
  { key: 'concreteCoverM', label: 'Recubrimiento', unit: 'm', help: 'Recubrimiento común usado en esta revisión.' },
  { key: 'barDiameterM', label: 'Diámetro de barra', unit: 'mm', help: 'Diámetro común de la referencia preliminar.' },
  { key: 'concreteStrengthMpa', label: 'Resistencia f′c', unit: 'MPa', help: 'Hormigón de peso normal.' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia fy', unit: 'MPa', help: 'Resistencia declarada del acero.' },
  { key: 'padLongitudinalBarSpacingM', label: 'Bases · acero longitudinal', unit: 'm', help: 'Separación máxima declarada.' },
  { key: 'padTransverseBarSpacingM', label: 'Bases · acero transversal', unit: 'm', help: 'Separación máxima declarada.' },
  { key: 'beamLongitudinalBarCount', label: 'Viga · barras longitudinales', unit: 'u', help: 'Cantidad total de barras longitudinales declaradas.' },
  { key: 'padDevelopmentAvailableM', label: 'Desarrollo disponible en bases', unit: 'm', help: 'Longitud efectiva declarada para las mallas.' },
  { key: 'beamDevelopmentAvailableM', label: 'Anclaje disponible de viga', unit: 'm', help: 'Longitud declarada dentro de los apoyos.' },
]

export const strapCaseFieldGroups: Array<{ id: string; label: string; description: string; keys: StrapCaseField[] }> = [
  { id: 'project', label: 'Proyecto y alcance', description: 'Dos bases separadas y una viga sin apoyo en el suelo.', keys: [] },
  { id: 'loads', label: 'Cargas por columna', description: 'Servicio y última se declaran por separado.', keys: ['serviceExteriorLoadKn', 'serviceInteriorLoadKn', 'factoredExteriorLoadKn', 'factoredInteriorLoadKn'] },
  { id: 'soil', label: 'Suelo y contacto', description: 'Capacidad externa, base y pesos de servicio.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'pads', label: 'Geometría de las bases', description: 'Dimensiones independientes y separación entre centros.', keys: ['exteriorFootingWidthM', 'exteriorFootingLengthM', 'exteriorFootingThicknessM', 'interiorFootingWidthM', 'interiorFootingLengthM', 'interiorFootingThicknessM', 'footingCenterSpacingM'] },
  { id: 'columns', label: 'Columnas y excentricidad', description: 'La exterior queda junto al lindero; la interior se centra.', keys: ['exteriorColumnWidthM', 'exteriorColumnLengthM', 'exteriorColumnCenterFromOuterEdgeM', 'interiorColumnWidthM', 'interiorColumnLengthM'] },
  { id: 'beam', label: 'Viga centradora', description: 'Sección rígida entre ambas zapatas.', keys: ['strapBeamWidthM', 'strapBeamDepthM'] },
  { id: 'materials', label: 'Materiales', description: 'Profundidades efectivas y resistencias declaradas.', keys: ['concreteCoverM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa'] },
  { id: 'reinforcement', label: 'Armado y desarrollo', description: 'Mallas de las bases y acero longitudinal de la viga.', keys: ['padLongitudinalBarSpacingM', 'padTransverseBarSpacingM', 'beamLongitudinalBarCount', 'padDevelopmentAvailableM', 'beamDevelopmentAvailableM'] },
]

export type StrapInputText = Record<StrapCaseField, string>
export function strapInputTextFrom(inputs: StrapFootingInputs): StrapInputText {
  return Object.fromEntries(strapCaseFieldDefinitions.map(({ key }) => [key, key === 'barDiameterM' ? String(inputs[key] * 1000) : String(inputs[key])])) as StrapInputText
}
