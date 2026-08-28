import type { StripFootingInputs } from '../../domain/projects'

export type StripCaseField = Exclude<keyof StripFootingInputs, 'bearingCapacityBasis'>
export type StripCaseFieldDefinition = { key: StripCaseField; label: string; unit: string; help: string }
export type StripCaseFieldGroup = { id: string; label: string; description: string; keys: StripCaseField[] }

export const stripCaseFieldDefinitions: StripCaseFieldDefinition[] = [
  { key: 'serviceLineLoadKnM', label: 'Carga lineal de servicio', unit: 'kN/m', help: 'Carga vertical centrada transmitida por el muro.' },
  { key: 'factoredLineLoadKnM', label: 'Carga lineal última declarada', unit: 'kN/m', help: 'Combinación última por metro declarada.' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa', help: 'Dato del informe geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido en desplante', unit: 'kPa', help: 'Se resta solo cuando la base declarada es neta.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Peso declarado para la franja de zapata.' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre zapata', unit: 'm', help: 'Altura uniforme sobre la franja.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Dato geotécnico declarado.' },
  { key: 'wallThicknessM', label: 'Espesor del muro', unit: 'm', help: 'Muro continuo centrado sobre la zapata.' },
  { key: 'footingWidthM', label: 'Ancho de zapata B', unit: 'm', help: 'Ancho transversal total.' },
  { key: 'footingThicknessM', label: 'Espesor h', unit: 'm', help: 'Espesor uniforme preliminar.' },
  { key: 'concreteCoverM', label: 'Recubrimiento inferior', unit: 'm', help: 'Desde la cara inferior al acero.' },
  { key: 'barDiameterM', label: 'Diámetro de barra', unit: 'mm', help: 'Barra inferior considerada.' },
  { key: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa', help: 'Propiedad especificada.' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa', help: 'Propiedad especificada.' },
  { key: 'transverseBarSpacingM', label: 'Separación · acero transversal', unit: 'm', help: 'Armadura principal perpendicular al muro.' },
  { key: 'longitudinalBarSpacingM', label: 'Separación · acero longitudinal', unit: 'm', help: 'Armadura de distribución paralela al muro.' },
  { key: 'developmentAvailableLengthM', label: 'Desarrollo disponible', unit: 'm', help: 'Longitud declarada desde la cara del muro.' },
]

export const stripCaseFieldGroups: StripCaseFieldGroup[] = [
  { id: 'project', label: 'Proyecto y modelo', description: 'Franja de referencia y límites del caso.', keys: [] },
  { id: 'loads', label: 'Cargas lineales', description: 'Acciones por metro transmitidas por el muro.', keys: ['serviceLineLoadKnM', 'factoredLineLoadKnM'] },
  { id: 'soil', label: 'Suelo y contacto', description: 'Capacidad y pesos declarados.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'geometry', label: 'Geometría transversal', description: 'Muro centrado y sección de la zapata.', keys: ['wallThicknessM', 'footingWidthM', 'footingThicknessM'] },
  { id: 'materials', label: 'Materiales', description: 'Propiedades y profundidad efectiva.', keys: ['concreteCoverM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa'] },
  { id: 'reinforcement', label: 'Armado y desarrollo', description: 'Distribución preliminar por metro.', keys: ['transverseBarSpacingM', 'longitudinalBarSpacingM', 'developmentAvailableLengthM'] },
]

export function stripInputTextFrom(inputs: StripFootingInputs): Record<StripCaseField, string> {
  return Object.fromEntries(stripCaseFieldDefinitions.map(({ key }) => [key, String(key === 'barDiameterM' ? inputs[key] * 1000 : inputs[key])])) as Record<StripCaseField, string>
}
