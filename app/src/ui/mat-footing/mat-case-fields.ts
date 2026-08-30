import type { MatFootingInputs } from '../../domain/projects'

export type MatCaseField = Exclude<keyof MatFootingInputs, 'bearingCapacityBasis' | 'settlementPressureBasis' | 'columns'>
export const matCaseFieldDefinitions: Array<{ key: MatCaseField; label: string; unit: string; help: string }> = [
  { key: 'allowableBearingKpa', label: 'Capacidad admisible', unit: 'kPa', help: 'Dato externo del estudio geotécnico.' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido', unit: 'kPa', help: 'Solo se resta cuando la base seleccionada es neta.' },
  { key: 'subgradeModulusKnM3', label: 'Módulo de balasto k', unit: 'kN/m³', help: 'Valor calibrado para suelo, tamaño, forma, profundidad y rigidez.' },
  { key: 'allowableTotalSettlementMm', label: 'Límite de asentamiento total', unit: 'mm', help: 'Cero significa que el límite no fue suministrado.' },
  { key: 'allowableDifferentialSettlementMm', label: 'Límite de asentamiento diferencial', unit: 'mm', help: 'Cero significa que el límite no fue suministrado.' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³', help: 'Se incluye como carga centrada en servicio.' },
  { key: 'soilCoverDepthM', label: 'Relleno uniforme', unit: 'm', help: 'Altura de suelo sobre la losa.' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³', help: 'Puede ser cero cuando no existe relleno.' },
  { key: 'footingWidthM', label: 'Ancho B · eje Y', unit: 'm', help: 'Dimensión total de la losa en Y.' },
  { key: 'footingLengthM', label: 'Longitud L · eje X', unit: 'm', help: 'Dimensión total de la losa en X.' },
  { key: 'footingThicknessM', label: 'Espesor uniforme h', unit: 'm', help: 'Usado en peso propio; no dimensiona la placa.' },
]

export const matCaseFieldGroups: Array<{ id: string; label: string; description: string; keys: MatCaseField[] }> = [
  { id: 'project', label: 'Proyecto y alcance', description: 'Evaluación rígida–Winkler preliminar y límites explícitos.', keys: [] },
  { id: 'soil', label: 'Suelo, capacidad y asentamiento', description: 'Parámetros externos y bases de comparación declaradas.', keys: ['allowableBearingKpa', 'removedOverburdenKpa', 'subgradeModulusKnM3', 'allowableTotalSettlementMm', 'allowableDifferentialSettlementMm'] },
  { id: 'geometry', label: 'Geometría y pesos', description: 'Losa rectangular de espesor constante y cargas uniformes centradas.', keys: ['footingWidthM', 'footingLengthM', 'footingThicknessM', 'concreteUnitWeightKnM3', 'soilCoverDepthM', 'soilUnitWeightKnM3'] },
  { id: 'columns', label: 'Columnas y cargas', description: 'Entre 2 y 24 columnas rectangulares, contenidas y sin superposición.', keys: [] },
]

export type MatInputText = Record<MatCaseField, string>
export const matInputTextFrom = (inputs: MatFootingInputs): MatInputText => Object.fromEntries(
  matCaseFieldDefinitions.map(({ key }) => [key, String(inputs[key])]),
) as MatInputText
