import type { FootingType, ProjectDocument } from '../../domain/projects'
import { analyzeFootingCase } from '../../application/footing-analysis'
import { analyzeStripFootingCase } from '../../application/strip-footing-analysis'
import { analyzeCombinedFootingCase } from '../../application/combined-footing-analysis'
import { analyzeStrapFootingCase } from '../../application/strap-footing-analysis'
import { analyzeTrapezoidalFootingCase } from '../../application/trapezoidal-footing-analysis'
import { analyzeEdgeFootingCase } from '../../application/edge-footing-analysis'
import { analyzeCornerFootingCase } from '../../application/corner-footing-analysis'
import { analyzeMatFootingCase } from '../../application/mat-footing-analysis'
import { buildFootingCalculationReport } from '../../reports/footing-calculation-report'
import { buildStripFootingCalculationReport } from '../../reports/strip-footing-calculation-report'
import { buildCombinedFootingCalculationReport } from '../../reports/combined-footing-calculation-report'
import { buildStrapFootingCalculationReport } from '../../reports/strap-footing-calculation-report'
import { buildTrapezoidalFootingCalculationReport } from '../../reports/trapezoidal-footing-calculation-report'
import { buildEdgeFootingCalculationReport } from '../../reports/edge-footing-calculation-report'
import { buildCornerFootingCalculationReport } from '../../reports/corner-footing-calculation-report'
import { buildMatFootingCalculationReport } from '../../reports/mat-footing-calculation-report'

export const WORKBOOK_SHEETS = ['Resumen', 'Entradas', 'Cálculo completo', 'Comprobaciones', 'Trazabilidad', 'Control'] as const
export const INPUT_FIRST_ROW = 6
export const CALCULATION_FIRST_ROW = 6

export type WorkbookScalar = number | string | boolean

export type WorkbookInputRow = {
  id: string
  label: string
  originalValue: WorkbookScalar
  unit: string
  editable: boolean
}

export type WorkbookCalculationRow = {
  id: string
  section: string
  label: string
  expression: string
  formula: string
  originalValue: WorkbookScalar
  unit: string
  note: string
}

export type WorkbookCheckRow = {
  id: string
  label: string
  formula: string
  originalValue: string
  detail: string
}

export type WorkbookTraceabilityRow = {
  module: string
  basis: string
  source: string
  version: string
  reference: string
  applicability: string
  url: string
}

export type ExerciseWorkbookModel = {
  project: Pick<ProjectDocument, 'projectId' | 'name' | 'createdAt' | 'updatedAt' | 'productVersion' | 'engineVersion' | 'schemaVersion'>
  footingType: FootingType
  footingTypeLabel: string
  generatedAt: string
  profile: { id: string; label: string; releaseStatus: string; releaseBlocker: string }
  sheets: typeof WORKBOOK_SHEETS
  inputRows: WorkbookInputRow[]
  calculationRows: WorkbookCalculationRow[]
  checkRows: WorkbookCheckRow[]
  traceabilityRows: WorkbookTraceabilityRow[]
  limitations: string[]
}

type ReportLike = {
  profile: {
    id: string
    label: string
    releaseStatus: string
    releaseBlocker: string
    sources: Array<{ id: string; label: string; version: string; url: string }>
    traceability: Array<{
      appliesTo: FootingType[]
      module: string
      basis: string
      sourceId?: string
      reference: string
      applicability: string
    }>
  }
  inputs: Array<{ id: string; label: string; value: number | string; unit: string }>
  limitations: string[]
}

type Template = {
  id: string
  section: string
  label: string
  expression: string
  formula: string
  path: string
  unit: string
  note?: string
}

const TYPE_LABELS: Record<FootingType, string> = {
  isolated: 'Zapata aislada rectangular centrada',
  strip: 'Zapata corrida bajo muro centrado',
  combined: 'Zapata combinada rectangular',
  strap: 'Zapata medianera con viga centradora',
  trapezoidal: 'Zapata combinada trapezoidal',
  edge: 'Zapata aislada excéntrica de borde',
  corner: 'Zapata de esquina con excentricidad biaxial',
  mat: 'Losa de cimentación rectangular',
}

const FALLBACK_LABELS: Record<string, string> = {
  removedOverburdenKpa: 'Esfuerzo geoestático removido',
  concreteUnitWeightKnM3: 'Peso unitario del hormigón',
  soilCoverDepthM: 'Altura de relleno sobre la cimentación',
  soilUnitWeightKnM3: 'Peso unitario del relleno',
  concreteCoverM: 'Recubrimiento del acero',
  developmentAvailableLengthWidthM: 'Desarrollo disponible en dirección B',
  developmentAvailableLengthLengthM: 'Desarrollo disponible en dirección L',
  punchingCriticalSectionOffsetM: 'Separación declarada de la sección crítica de punzonamiento',
  barsParallelToWidthMaxSpacingM: 'Separación máxima de barras paralelas a B',
  barsParallelToLengthMaxSpacingM: 'Separación máxima de barras paralelas a L',
  id: 'Identificador',
  label: 'Etiqueta',
  serviceLoadKn: 'Carga de servicio',
  factoredLoadKn: 'Carga última declarada',
  widthM: 'Ancho de columna',
  lengthM: 'Longitud de columna',
  centerXM: 'Coordenada X del centro',
  centerYM: 'Coordenada Y del centro',
}

const i = (id: string) => `{{i:${id}}}`
const c = (id: string) => `{{c:${id}}}`
const tpl = (id: string, section: string, label: string, expression: string, formula: string, path: string, unit: string, note = ''): Template => ({ id, section, label, expression, formula, path, unit, note })

function isolatedTemplates(): Template[] {
  return [
    tpl('area', 'Geometría', 'Área de contacto', 'A = B × L', `=${i('footingWidthM')}*${i('footingLengthM')}`, 'contact.grossAreaM2', 'm²'),
    tpl('effective_depth', 'Geometría', 'Profundidad efectiva', 'd = h − c − dᵦ/2', `=${i('footingThicknessM')}-${i('concreteCoverM')}-${i('barDiameterM')}/2`, 'oneWay.effectiveDepthM', 'm'),
    tpl('self_weight', 'Servicio', 'Peso propio', 'Wz = A × h × γc', `=${c('area')}*${i('footingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'contact.footingSelfWeightKn', 'kN'),
    tpl('soil_weight', 'Servicio', 'Peso de relleno', 'Wr = A × hr × γr', `=${c('area')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}`, 'contact.soilCoverWeightKn', 'kN'),
    tpl('service_total', 'Servicio', 'Carga total de servicio', 'P = Pserv + Wz + Wr', `=${i('axialLoadKn')}+${c('self_weight')}+${c('soil_weight')}`, 'contact.totalServiceLoadKn', 'kN'),
    tpl('gross_pressure', 'Servicio', 'Presión bruta', 'qg = P/A', `=${c('service_total')}/${c('area')}`, 'contact.grossContactPressureKpa', 'kPa'),
    tpl('net_pressure', 'Servicio', 'Presión neta', 'qn = qg − qrem', `=${c('gross_pressure')}-${i('removedOverburdenKpa')}`, 'contact.netContactPressureKpa', 'kPa'),
    tpl('comparison_pressure', 'Servicio', 'Presión comparada', 'qcmp = qg o qn', `=IF(${i('bearingCapacityBasis')}="gross",${c('gross_pressure')},${c('net_pressure')})`, 'contact.pressureForComparisonKpa', 'kPa'),
    tpl('utilization', 'Servicio', 'Utilización de capacidad', 'η = qcmp/qadm', `=${c('comparison_pressure')}/${i('allowableBearingKpa')}`, 'contact.utilization', ''),
    tpl('factored_pressure', 'Estructural', 'Presión última uniforme', 'qᵤ = Pᵤ/A', `=${i('factoredAxialLoadKn')}/${c('area')}`, 'oneWay.factoredContactPressureKpa', 'kPa'),
    tpl('projection_b', 'Cortante', 'Voladizo en B', 'aB = (B−cB)/2', `=(${i('footingWidthM')}-${i('columnWidthM')})/2`, 'oneWay.widthDirection.cantileverProjectionM', 'm'),
    tpl('projection_l', 'Cortante', 'Voladizo en L', 'aL = (L−cL)/2', `=(${i('footingLengthM')}-${i('columnLengthM')})/2`, 'oneWay.lengthDirection.cantileverProjectionM', 'm'),
    tpl('shear_b', 'Cortante', 'Demanda en dirección B', 'Vᵤ = qᵤ × L × máx(aB−d,0)', `=${c('factored_pressure')}*${i('footingLengthM')}*MAX(${c('projection_b')}-${c('effective_depth')},0)`, 'oneWay.widthDirection.shearDemandKn', 'kN'),
    tpl('shear_l', 'Cortante', 'Demanda en dirección L', 'Vᵤ = qᵤ × B × máx(aL−d,0)', `=${c('factored_pressure')}*${i('footingWidthM')}*MAX(${c('projection_l')}-${c('effective_depth')},0)`, 'oneWay.lengthDirection.shearDemandKn', 'kN'),
    tpl('moment_b', 'Flexión', 'Momento en dirección B', 'Mᵤ = qᵤ × L × aB²/2', `=${c('factored_pressure')}*${i('footingLengthM')}*${c('projection_b')}^2/2`, 'flexure.widthDirection.momentDemandKnM', 'kN·m'),
    tpl('moment_l', 'Flexión', 'Momento en dirección L', 'Mᵤ = qᵤ × B × aL²/2', `=${c('factored_pressure')}*${i('footingWidthM')}*${c('projection_l')}^2/2`, 'flexure.lengthDirection.momentDemandKnM', 'kN·m'),
    tpl('bar_area', 'Armado', 'Área de una barra', 'Aᵦ = πdᵦ²/4', `=PI()*(${i('barDiameterM')}*1000)^2/4`, 'minimumReinforcement.barAreaMm2', 'mm²'),
    tpl('minimum_steel', 'Armado', 'Acero mínimo por metro', 'Aₛ,min = 0.0018×1000×h(mm)', `=0.0018*1000*(${i('footingThicknessM')}*1000)`, 'minimumReinforcement.minimumAreaPerMeterMm2', 'mm²/m', 'Referencia de guía en validación.'),
    tpl('development', 'Desarrollo', 'Longitud requerida', 'lᵈ = fy/(1.4√f′c) × dᵦ', `=${i('steelYieldStrengthMpa')}/(1.4*SQRT(${i('concreteStrengthMpa')}))*${i('barDiameterM')}`, 'development.requiredDevelopmentLengthM', 'm', 'Referencia de guía en validación.'),
  ]
}

function stripTemplates(): Template[] {
  return [
    tpl('area', 'Geometría', 'Área de contacto por metro', 'A = B × 1 m', `=${i('footingWidthM')}*1`, 'contact.contactAreaM2PerM', 'm²/m'),
    tpl('projection', 'Geometría', 'Voladizo por lado', 'a = (B−tv)/2', `=(${i('footingWidthM')}-${i('wallThicknessM')})/2`, 'structural.cantileverProjectionM', 'm'),
    tpl('effective_depth', 'Geometría', 'Profundidad efectiva', 'd = h−c−dᵦ/2', `=${i('footingThicknessM')}-${i('concreteCoverM')}-${i('barDiameterM')}/2`, 'structural.effectiveDepthM', 'm'),
    tpl('self_weight', 'Servicio', 'Peso propio por metro', 'Wz = B×h×γc', `=${i('footingWidthM')}*${i('footingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'contact.footingSelfWeightKnM', 'kN/m'),
    tpl('soil_weight', 'Servicio', 'Peso de relleno por metro', 'Wr = B×hr×γr', `=${i('footingWidthM')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}`, 'contact.soilCoverWeightKnM', 'kN/m'),
    tpl('service_total', 'Servicio', 'Carga lineal total', 'P = Pserv+Wz+Wr', `=${i('serviceLineLoadKnM')}+${c('self_weight')}+${c('soil_weight')}`, 'contact.totalServiceLineLoadKnM', 'kN/m'),
    tpl('gross_pressure', 'Servicio', 'Presión bruta', 'qg = P/B', `=${c('service_total')}/${i('footingWidthM')}`, 'contact.grossContactPressureKpa', 'kPa'),
    tpl('net_pressure', 'Servicio', 'Presión neta', 'qn = qg−qrem', `=${c('gross_pressure')}-${i('removedOverburdenKpa')}`, 'contact.netContactPressureKpa', 'kPa'),
    tpl('comparison_pressure', 'Servicio', 'Presión comparada', 'qcmp = qg o qn', `=IF(${i('bearingCapacityBasis')}="gross",${c('gross_pressure')},${c('net_pressure')})`, 'contact.pressureForComparisonKpa', 'kPa'),
    tpl('utilization', 'Servicio', 'Utilización', 'η = qcmp/qadm', `=${c('comparison_pressure')}/${i('allowableBearingKpa')}`, 'contact.utilization', ''),
    tpl('factored_pressure', 'Estructural', 'Presión última', 'qᵤ = Pᵤ/B', `=${i('factoredLineLoadKnM')}/${i('footingWidthM')}`, 'structural.factoredContactPressureKpa', 'kPa'),
    tpl('loaded_length', 'Cortante', 'Longitud cargada exterior', 'x = máx(a−d,0)', `=MAX(${c('projection')}-${c('effective_depth')},0)`, 'structural.loadedLengthBeyondCriticalSectionM', 'm'),
    tpl('shear', 'Cortante', 'Demanda por metro', 'Vᵤ = qᵤ×x×1 m', `=${c('factored_pressure')}*${c('loaded_length')}*1`, 'structural.oneWayShearDemandKnPerM', 'kN/m'),
    tpl('moment', 'Flexión', 'Momento transversal', 'Mᵤ = qᵤ×a²/2', `=${c('factored_pressure')}*${c('projection')}^2/2`, 'structural.flexureDemandKnMPerM', 'kN·m/m'),
    tpl('bar_area', 'Armado', 'Área de barra', 'Aᵦ = πdᵦ²/4', `=PI()*(${i('barDiameterM')}*1000)^2/4`, 'reinforcement.barAreaMm2', 'mm²'),
    tpl('minimum_steel', 'Armado', 'Acero mínimo por metro', 'Aₛ,min = 0.0018×1000×h(mm)', `=0.0018*1000*(${i('footingThicknessM')}*1000)`, 'minimumReinforcement.minimumAreaPerMeterMm2', 'mm²/m', 'Referencia de guía en validación.'),
    tpl('development', 'Desarrollo', 'Longitud requerida', 'lᵈ = fy/(1.4√f′c)×dᵦ', `=${i('steelYieldStrengthMpa')}/(1.4*SQRT(${i('concreteStrengthMpa')}))*${i('barDiameterM')}`, 'development.requiredDevelopmentLengthM', 'm', 'Referencia de guía en validación.'),
  ]
}

function combinedTemplates(): Template[] {
  return [
    tpl('area', 'Geometría', 'Área', 'A = B×L', `=${i('footingWidthM')}*${i('footingLengthM')}`, 'contact.areaM2', 'm²'),
    tpl('self_weight', 'Servicio', 'Peso propio', 'Wz = A×h×γc', `=${c('area')}*${i('footingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'contact.footingSelfWeightKn', 'kN'),
    tpl('soil_weight', 'Servicio', 'Peso de relleno', 'Wr = A×hr×γr', `=${c('area')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}`, 'contact.soilCoverWeightKn', 'kN'),
    tpl('service_total', 'Servicio', 'Carga total', 'P = P1+P2+Wz+Wr', `=${i('serviceColumn1LoadKn')}+${i('serviceColumn2LoadKn')}+${c('self_weight')}+${c('soil_weight')}`, 'contact.gross.totalLoadKn', 'kN'),
    tpl('service_moment', 'Servicio', 'Momento respecto del centroide', 'M = P1(x1−L/2)+P2(x2−L/2)', `=${i('serviceColumn1LoadKn')}*(${i('column1CenterFromLeftM')}-${i('footingLengthM')}/2)+${i('serviceColumn2LoadKn')}*(${i('column2CenterFromLeftM')}-${i('footingLengthM')}/2)`, 'contact.gross.momentAboutCentroidKnM', 'kN·m'),
    tpl('service_eccentricity', 'Servicio', 'Excentricidad', 'e = M/P', `=${c('service_moment')}/${c('service_total')}`, 'contact.gross.eccentricityM', 'm'),
    tpl('service_average', 'Servicio', 'Presión promedio', 'q̄ = P/A', `=${c('service_total')}/${c('area')}`, 'contact.gross.averagePressureKpa', 'kPa'),
    tpl('service_left', 'Servicio', 'Presión izquierda bruta', 'qizq = q̄(1−6e/L)', `=${c('service_average')}*(1-6*${c('service_eccentricity')}/${i('footingLengthM')})`, 'contact.grossPressureLeftKpa', 'kPa'),
    tpl('service_right', 'Servicio', 'Presión derecha bruta', 'qder = q̄(1+6e/L)', `=${c('service_average')}*(1+6*${c('service_eccentricity')}/${i('footingLengthM')})`, 'contact.grossPressureRightKpa', 'kPa'),
    tpl('comparison_max', 'Servicio', 'Presión máxima comparada', 'máx(qg o qn)', `=MAX(IF(${i('bearingCapacityBasis')}="gross",${c('service_left')},${c('service_left')}-${i('removedOverburdenKpa')}),IF(${i('bearingCapacityBasis')}="gross",${c('service_right')},${c('service_right')}-${i('removedOverburdenKpa')}))`, 'contact.maximumPressureForComparisonKpa', 'kPa'),
    tpl('utilization', 'Servicio', 'Utilización', 'η = qmáx/qadm', `=${c('comparison_max')}/${i('allowableBearingKpa')}`, 'contact.utilization', ''),
    tpl('effective_depth', 'Estructural', 'Profundidad efectiva', 'd = h−c−dᵦ/2', `=${i('footingThicknessM')}-${i('concreteCoverM')}-${i('barDiameterM')}/2`, 'structural.effectiveDepthM', 'm'),
    tpl('factored_total', 'Estructural', 'Carga última total', 'Pᵤ = Pᵤ1+Pᵤ2', `=${i('factoredColumn1LoadKn')}+${i('factoredColumn2LoadKn')}`, 'structural.factored.totalLoadKn', 'kN'),
    tpl('factored_moment', 'Estructural', 'Momento último', 'Mᵤ = ΣPᵤi(xi−L/2)', `=${i('factoredColumn1LoadKn')}*(${i('column1CenterFromLeftM')}-${i('footingLengthM')}/2)+${i('factoredColumn2LoadKn')}*(${i('column2CenterFromLeftM')}-${i('footingLengthM')}/2)`, 'structural.factored.momentAboutCentroidKnM', 'kN·m'),
    tpl('factored_eccentricity', 'Estructural', 'Excentricidad última', 'eᵤ = Mᵤ/Pᵤ', `=${c('factored_moment')}/${c('factored_total')}`, 'structural.factored.eccentricityM', 'm'),
    tpl('factored_average', 'Estructural', 'Presión última promedio', 'q̄ᵤ = Pᵤ/A', `=${c('factored_total')}/${c('area')}`, 'structural.factored.averagePressureKpa', 'kPa'),
    tpl('factored_left', 'Estructural', 'Presión última izquierda', 'qᵤ,izq = q̄ᵤ(1−6eᵤ/L)', `=${c('factored_average')}*(1-6*${c('factored_eccentricity')}/${i('footingLengthM')})`, 'structural.factoredPressureLeftKpa', 'kPa'),
    tpl('factored_right', 'Estructural', 'Presión última derecha', 'qᵤ,der = q̄ᵤ(1+6eᵤ/L)', `=${c('factored_average')}*(1+6*${c('factored_eccentricity')}/${i('footingLengthM')})`, 'structural.factoredPressureRightKpa', 'kPa'),
    tpl('development', 'Desarrollo', 'Longitud requerida', 'lᵈ = fy/(1.4√f′c)×dᵦ', `=${i('steelYieldStrengthMpa')}/(1.4*SQRT(${i('concreteStrengthMpa')}))*${i('barDiameterM')}`, 'development.requiredDevelopmentLengthM', 'm', 'Referencia de guía en validación.'),
  ]
}

function strapTemplates(): Template[] {
  return [
    tpl('area_ext', 'Geometría', 'Área base medianera', 'Aₑ = Bₑ×Lₑ', `=${i('exteriorFootingWidthM')}*${i('exteriorFootingLengthM')}`, 'geometry.exteriorAreaM2', 'm²'),
    tpl('area_int', 'Geometría', 'Área base interior', 'Aᵢ = Bᵢ×Lᵢ', `=${i('interiorFootingWidthM')}*${i('interiorFootingLengthM')}`, 'geometry.interiorAreaM2', 'm²'),
    tpl('eccentricity', 'Geometría', 'Excentricidad medianera', 'e = Lₑ/2−xₑ', `=${i('exteriorFootingLengthM')}/2-${i('exteriorColumnCenterFromOuterEdgeM')}`, 'geometry.exteriorEccentricityM', 'm'),
    tpl('clear_beam', 'Geometría', 'Tramo libre de viga', 'Lv = S−Lₑ/2−Lᵢ/2', `=${i('footingCenterSpacingM')}-${i('exteriorFootingLengthM')}/2-${i('interiorFootingLengthM')}/2`, 'geometry.clearStrapLengthM', 'm'),
    tpl('service_moment', 'Servicio', 'Momento excéntrico', 'Ms = Ps,e×e', `=${i('serviceExteriorLoadKn')}*${c('eccentricity')}`, 'service.eccentricMomentKnM', 'kN·m'),
    tpl('service_shear', 'Servicio', 'Transferencia de la viga', 'Vs = Ms/S', `=${c('service_moment')}/${i('footingCenterSpacingM')}`, 'service.strapShearKn', 'kN'),
    tpl('service_reaction_ext', 'Servicio', 'Reacción estructural exterior', 'Rs,e = Ps,e+Vs', `=${i('serviceExteriorLoadKn')}+${c('service_shear')}`, 'service.exteriorStructuralReactionKn', 'kN'),
    tpl('service_reaction_int', 'Servicio', 'Reacción estructural interior', 'Rs,i = Ps,i−Vs', `=${i('serviceInteriorLoadKn')}-${c('service_shear')}`, 'service.interiorStructuralReactionKn', 'kN'),
    tpl('weight_ext', 'Servicio', 'Peso propio exterior', 'Wₑ = Aₑhₑγc', `=${c('area_ext')}*${i('exteriorFootingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'service.exteriorPadSelfWeightKn', 'kN'),
    tpl('weight_int', 'Servicio', 'Peso propio interior', 'Wᵢ = Aᵢhᵢγc', `=${c('area_int')}*${i('interiorFootingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'service.interiorPadSelfWeightKn', 'kN'),
    tpl('weight_beam', 'Servicio', 'Peso del tramo libre', 'Wv = Lv×bv×hv×γc', `=${c('clear_beam')}*${i('strapBeamWidthM')}*${i('strapBeamDepthM')}*${i('concreteUnitWeightKnM3')}`, 'service.clearStrapSelfWeightKn', 'kN'),
    tpl('gross_pressure_ext', 'Servicio', 'Presión bruta exterior', 'qg,e = Rg,e/Aₑ', `=(${c('service_reaction_ext')}+${c('weight_ext')}+${c('area_ext')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}+${c('weight_beam')}/2)/${c('area_ext')}`, 'service.exteriorGrossPressureKpa', 'kPa'),
    tpl('gross_pressure_int', 'Servicio', 'Presión bruta interior', 'qg,i = Rg,i/Aᵢ', `=(${c('service_reaction_int')}+${c('weight_int')}+${c('area_int')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}+${c('weight_beam')}/2)/${c('area_int')}`, 'service.interiorGrossPressureKpa', 'kPa'),
    tpl('comparison_max', 'Servicio', 'Presión gobernante comparada', 'máx(qe,qi)', `=MAX(IF(${i('bearingCapacityBasis')}="gross",${c('gross_pressure_ext')},${c('gross_pressure_ext')}-${i('removedOverburdenKpa')}),IF(${i('bearingCapacityBasis')}="gross",${c('gross_pressure_int')},${c('gross_pressure_int')}-${i('removedOverburdenKpa')}))`, 'service.governingPressureKpa', 'kPa'),
    tpl('utilization', 'Servicio', 'Utilización', 'η = qgob/qadm', `=${c('comparison_max')}/${i('allowableBearingKpa')}`, 'service.utilization', ''),
    tpl('factored_moment', 'Estructural', 'Momento último', 'Mᵤ = Pᵤ,e×e', `=${i('factoredExteriorLoadKn')}*${c('eccentricity')}`, 'factored.eccentricMomentKnM', 'kN·m'),
    tpl('factored_shear', 'Estructural', 'Transferencia última', 'Vᵤ = Mᵤ/S', `=${c('factored_moment')}/${i('footingCenterSpacingM')}`, 'factored.strapShearKn', 'kN'),
    tpl('factored_reaction_ext', 'Estructural', 'Reacción última exterior', 'Rᵤ,e = Pᵤ,e+Vᵤ', `=${i('factoredExteriorLoadKn')}+${c('factored_shear')}`, 'factored.exteriorReactionKn', 'kN'),
    tpl('factored_reaction_int', 'Estructural', 'Reacción última interior', 'Rᵤ,i = Pᵤ,i−Vᵤ', `=${i('factoredInteriorLoadKn')}-${c('factored_shear')}`, 'factored.interiorReactionKn', 'kN'),
    tpl('factored_pressure_ext', 'Estructural', 'Presión última exterior', 'qᵤ,e = Rᵤ,e/Aₑ', `=${c('factored_reaction_ext')}/${c('area_ext')}`, 'factored.exteriorPressureKpa', 'kPa'),
    tpl('factored_pressure_int', 'Estructural', 'Presión última interior', 'qᵤ,i = Rᵤ,i/Aᵢ', `=${c('factored_reaction_int')}/${c('area_int')}`, 'factored.interiorPressureKpa', 'kPa'),
    tpl('development', 'Desarrollo', 'Longitud requerida', 'lᵈ = fy/(1.4√f′c)×dᵦ', `=${i('steelYieldStrengthMpa')}/(1.4*SQRT(${i('concreteStrengthMpa')}))*${i('barDiameterM')}`, 'development.requiredDevelopmentLengthM', 'm', 'Referencia de guía en validación.'),
  ]
}

function trapezoidalTemplates(): Template[] {
  return [
    tpl('width_slope', 'Geometría', 'Pendiente del ancho', 'kB = (B2−B1)/L', `=(${i('rightFootingWidthM')}-${i('leftFootingWidthM')})/${i('footingLengthM')}`, 'geometry.widthSlope', ''),
    tpl('area', 'Geometría', 'Área', 'A = L(B1+B2)/2', `=${i('footingLengthM')}*(${i('leftFootingWidthM')}+${i('rightFootingWidthM')})/2`, 'geometry.areaM2', 'm²'),
    tpl('first_moment', 'Geometría', 'Primer momento de área', 'Q = B1L²/2+kBL³/3', `=${i('leftFootingWidthM')}*${i('footingLengthM')}^2/2+${c('width_slope')}*${i('footingLengthM')}^3/3`, 'geometry.firstAreaMomentM3', 'm³'),
    tpl('second_moment', 'Geometría', 'Segundo momento de área', 'J = B1L³/3+kBL⁴/4', `=${i('leftFootingWidthM')}*${i('footingLengthM')}^3/3+${c('width_slope')}*${i('footingLengthM')}^4/4`, 'geometry.secondAreaMomentM4', 'm⁴'),
    tpl('centroid', 'Geometría', 'Centroide desde la izquierda', 'x̄ = Q/A', `=${c('first_moment')}/${c('area')}`, 'geometry.centroidFromLeftM', 'm'),
    tpl('self_weight', 'Servicio', 'Peso propio', 'Wz = A×h×γc', `=${c('area')}*${i('footingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'contact.footingSelfWeightKn', 'kN'),
    tpl('soil_weight', 'Servicio', 'Peso de relleno', 'Wr = A×hr×γr', `=${c('area')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}`, 'contact.soilCoverWeightKn', 'kN'),
    tpl('service_total', 'Servicio', 'Carga total', 'P = P1+P2+Wz+Wr', `=${i('serviceColumn1LoadKn')}+${i('serviceColumn2LoadKn')}+${c('self_weight')}+${c('soil_weight')}`, 'contact.gross.totalLoadKn', 'kN'),
    tpl('service_moment_left', 'Servicio', 'Momento desde el extremo izquierdo', 'M0 = P1x1+P2x2+(Wz+Wr)x̄', `=${i('serviceColumn1LoadKn')}*${i('column1CenterFromLeftM')}+${i('serviceColumn2LoadKn')}*${i('column2CenterFromLeftM')}+(${c('self_weight')}+${c('soil_weight')})*${c('centroid')}`, 'contact.gross.momentFromLeftKnM', 'kN·m'),
    tpl('pressure_intercept', 'Servicio', 'Intercepto de presión', 'a = (PJ−M0Q)/(AJ−Q²)', `=(${c('service_total')}*${c('second_moment')}-${c('service_moment_left')}*${c('first_moment')})/(${c('area')}*${c('second_moment')}-${c('first_moment')}^2)`, 'contact.gross.pressureInterceptKpa', 'kPa'),
    tpl('pressure_slope', 'Servicio', 'Pendiente de presión', 'b = (M0A−PQ)/(AJ−Q²)', `=(${c('service_moment_left')}*${c('area')}-${c('service_total')}*${c('first_moment')})/(${c('area')}*${c('second_moment')}-${c('first_moment')}^2)`, 'contact.gross.pressureSlopeKpaM', 'kPa/m'),
    tpl('service_left', 'Servicio', 'Presión izquierda bruta', 'q(0) = a', `=${c('pressure_intercept')}`, 'contact.grossPressureLeftKpa', 'kPa'),
    tpl('service_right', 'Servicio', 'Presión derecha bruta', 'q(L) = a+bL', `=${c('pressure_intercept')}+${c('pressure_slope')}*${i('footingLengthM')}`, 'contact.grossPressureRightKpa', 'kPa'),
    tpl('comparison_max', 'Servicio', 'Presión máxima comparada', 'máx(qg o qn)', `=MAX(IF(${i('bearingCapacityBasis')}="gross",${c('service_left')},${c('service_left')}-${i('removedOverburdenKpa')}),IF(${i('bearingCapacityBasis')}="gross",${c('service_right')},${c('service_right')}-${i('removedOverburdenKpa')}))`, 'contact.maximumPressureForComparisonKpa', 'kPa'),
    tpl('utilization', 'Servicio', 'Utilización', 'η = qmáx/qadm', `=${c('comparison_max')}/${i('allowableBearingKpa')}`, 'contact.utilization', ''),
    tpl('effective_depth', 'Estructural', 'Profundidad efectiva', 'd = h−c−dᵦ/2', `=${i('footingThicknessM')}-${i('concreteCoverM')}-${i('barDiameterM')}/2`, 'structural.effectiveDepthM', 'm'),
    tpl('development', 'Desarrollo', 'Longitud requerida', 'lᵈ = fy/(1.4√f′c)×dᵦ', `=${i('steelYieldStrengthMpa')}/(1.4*SQRT(${i('concreteStrengthMpa')}))*${i('barDiameterM')}`, 'development.requiredDevelopmentLengthM', 'm', 'Referencia de guía en validación.'),
  ]
}

function edgeTemplates(): Template[] {
  return [
    tpl('area', 'Geometría', 'Área', 'A = B×L', `=${i('footingWidthM')}*${i('footingLengthM')}`, 'geometry.areaM2', 'm²'),
    tpl('centroid', 'Geometría', 'Centroide longitudinal', 'xc = L/2', `=${i('footingLengthM')}/2`, 'geometry.centroidFromLeftM', 'm'),
    tpl('column_center', 'Geometría', 'Centro de columna', 'xp según borde declarado', `=IF(${i('edgeSide')}="left",${i('columnLengthM')}/2,${i('footingLengthM')}-${i('columnLengthM')}/2)`, 'geometry.columnCenterFromLeftM', 'm'),
    tpl('self_weight', 'Servicio', 'Peso propio', 'Wz = A×h×γc', `=${c('area')}*${i('footingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'contact.footingSelfWeightKn', 'kN'),
    tpl('soil_weight', 'Servicio', 'Peso de relleno', 'Wr = A×hr×γr', `=${c('area')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}`, 'contact.soilCoverWeightKn', 'kN'),
    tpl('service_total', 'Servicio', 'Carga total', 'P = Pserv+Wz+Wr', `=${i('serviceAxialLoadKn')}+${c('self_weight')}+${c('soil_weight')}`, 'contact.gross.totalLoadKn', 'kN'),
    tpl('service_moment', 'Servicio', 'Momento respecto del centroide', 'M = Pserv(xp−xc)', `=${i('serviceAxialLoadKn')}*(${c('column_center')}-${c('centroid')})`, 'contact.gross.momentAboutCentroidKnM', 'kN·m'),
    tpl('service_eccentricity', 'Servicio', 'Excentricidad', 'e = M/P', `=${c('service_moment')}/${c('service_total')}`, 'contact.gross.eccentricityM', 'm'),
    tpl('service_average', 'Servicio', 'Presión promedio', 'q̄ = P/A', `=${c('service_total')}/${c('area')}`, 'contact.gross.averagePressureKpa', 'kPa'),
    tpl('service_left', 'Servicio', 'Presión izquierda bruta', 'qizq = q̄(1−6e/L)', `=${c('service_average')}*(1-6*${c('service_eccentricity')}/${i('footingLengthM')})`, 'contact.grossPressureLeftKpa', 'kPa'),
    tpl('service_right', 'Servicio', 'Presión derecha bruta', 'qder = q̄(1+6e/L)', `=${c('service_average')}*(1+6*${c('service_eccentricity')}/${i('footingLengthM')})`, 'contact.grossPressureRightKpa', 'kPa'),
    tpl('comparison_max', 'Servicio', 'Presión máxima comparada', 'máx(qg o qn)', `=MAX(IF(${i('bearingCapacityBasis')}="gross",${c('service_left')},${c('service_left')}-${i('removedOverburdenKpa')}),IF(${i('bearingCapacityBasis')}="gross",${c('service_right')},${c('service_right')}-${i('removedOverburdenKpa')}))`, 'contact.maximumPressureForComparisonKpa', 'kPa'),
    tpl('utilization', 'Servicio', 'Utilización', 'η = qmáx/qadm', `=${c('comparison_max')}/${i('allowableBearingKpa')}`, 'contact.utilization', ''),
    tpl('factored_total', 'Estructural', 'Carga última', 'Pᵤ = carga última declarada', `=${i('factoredAxialLoadKn')}`, 'structural.factored.totalLoadKn', 'kN'),
    tpl('factored_moment', 'Estructural', 'Momento último', 'Mᵤ = Pᵤ(xp−xc)', `=${c('factored_total')}*(${c('column_center')}-${c('centroid')})`, 'structural.factored.momentAboutCentroidKnM', 'kN·m'),
    tpl('factored_eccentricity', 'Estructural', 'Excentricidad última', 'eᵤ = Mᵤ/Pᵤ', `=${c('factored_moment')}/${c('factored_total')}`, 'structural.factored.eccentricityM', 'm'),
    tpl('kern_margin', 'Estructural', 'Margen del tercio central', 'm = L/6−|eᵤ|', `=${i('footingLengthM')}/6-ABS(${c('factored_eccentricity')})`, 'structural.factored.middleThirdMarginM', 'm'),
    tpl('effective_depth', 'Estructural', 'Profundidad efectiva', 'd = h−c−dᵦ/2', `=${i('footingThicknessM')}-${i('concreteCoverM')}-${i('barDiameterM')}/2`, 'structural.effectiveDepthM', 'm'),
    tpl('development', 'Desarrollo', 'Longitud requerida', 'lᵈ = fy/(1.4√f′c)×dᵦ', `=${i('steelYieldStrengthMpa')}/(1.4*SQRT(${i('concreteStrengthMpa')}))*${i('barDiameterM')}`, 'development.requiredDevelopmentLengthM', 'm', 'Referencia de guía en validación.'),
  ]
}

function biaxialTemplates(kind: 'corner' | 'mat', columnCount = 0): Template[] {
  const isCorner = kind === 'corner'
  const serviceLoad = isCorner ? i('serviceAxialLoadKn') : Array.from({ length: columnCount }, (_, index) => i(`columns.${index}.serviceLoadKn`)).join('+')
  const factoredLoad = isCorner ? i('factoredAxialLoadKn') : Array.from({ length: columnCount }, (_, index) => i(`columns.${index}.factoredLoadKn`)).join('+')
  const xp = isCorner
    ? `IF(OR(${i('cornerPosition')}="bottom-left",${i('cornerPosition')}="top-left"),${i('columnLengthM')}/2,${i('footingLengthM')}-${i('columnLengthM')}/2)`
    : ''
  const yp = isCorner
    ? `IF(OR(${i('cornerPosition')}="bottom-left",${i('cornerPosition')}="bottom-right"),${i('columnWidthM')}/2,${i('footingWidthM')}-${i('columnWidthM')}/2)`
    : ''
  const serviceMomentY = isCorner
    ? `${i('serviceAxialLoadKn')}*(${c('column_x')}-${c('centroid_x')})`
    : Array.from({ length: columnCount }, (_, index) => `${i(`columns.${index}.serviceLoadKn`)}*(${i(`columns.${index}.centerXM`)}-${c('centroid_x')})`).join('+')
  const serviceMomentX = isCorner
    ? `${i('serviceAxialLoadKn')}*(${c('column_y')}-${c('centroid_y')})`
    : Array.from({ length: columnCount }, (_, index) => `${i(`columns.${index}.serviceLoadKn`)}*(${i(`columns.${index}.centerYM`)}-${c('centroid_y')})`).join('+')
  const factoredMomentY = isCorner
    ? `${i('factoredAxialLoadKn')}*(${c('column_x')}-${c('centroid_x')})`
    : Array.from({ length: columnCount }, (_, index) => `${i(`columns.${index}.factoredLoadKn`)}*(${i(`columns.${index}.centerXM`)}-${c('centroid_x')})`).join('+')
  const factoredMomentX = isCorner
    ? `${i('factoredAxialLoadKn')}*(${c('column_y')}-${c('centroid_y')})`
    : Array.from({ length: columnCount }, (_, index) => `${i(`columns.${index}.factoredLoadKn`)}*(${i(`columns.${index}.centerYM`)}-${c('centroid_y')})`).join('+')
  const rows: Template[] = [
    tpl('area', 'Geometría', 'Área', 'A = B×L', `=${i('footingWidthM')}*${i('footingLengthM')}`, isCorner ? 'geometry.areaM2' : 'geometry.areaM2', 'm²'),
    tpl('centroid_x', 'Geometría', 'Centroide X', 'xc = L/2', `=${i('footingLengthM')}/2`, 'geometry.centroidXM', 'm'),
    tpl('centroid_y', 'Geometría', 'Centroide Y', 'yc = B/2', `=${i('footingWidthM')}/2`, 'geometry.centroidYM', 'm'),
  ]
  if (isCorner) {
    rows.push(
      tpl('column_x', 'Geometría', 'Centro de columna X', 'xp según esquina', `=${xp}`, 'geometry.columnCenterXM', 'm'),
      tpl('column_y', 'Geometría', 'Centro de columna Y', 'yp según esquina', `=${yp}`, 'geometry.columnCenterYM', 'm'),
    )
  }
  rows.push(
    tpl('self_weight', 'Servicio', 'Peso propio', 'Wz = A×h×γc', `=${c('area')}*${i('footingThicknessM')}*${i('concreteUnitWeightKnM3')}`, 'contact.footingSelfWeightKn', 'kN'),
    tpl('soil_weight', 'Servicio', 'Peso de relleno', 'Wr = A×hr×γr', `=${c('area')}*${i('soilCoverDepthM')}*${i('soilUnitWeightKnM3')}`, 'contact.soilCoverWeightKn', 'kN'),
    tpl('service_column_total', 'Servicio', 'Carga de columnas', 'ΣPs', `=${serviceLoad}`, isCorner ? '$input.serviceAxialLoadKn' : 'loads.serviceColumnTotalKn', 'kN'),
    tpl('service_total', 'Servicio', 'Carga total', 'P = ΣPs+Wz+Wr', `=${c('service_column_total')}+${c('self_weight')}+${c('soil_weight')}`, 'contact.gross.totalLoadKn', 'kN'),
    tpl('service_my', 'Servicio', 'Momento respecto de Y', 'My = ΣPs(xi−xc)', `=${serviceMomentY}`, 'contact.gross.momentYKnM', 'kN·m'),
    tpl('service_mx', 'Servicio', 'Momento respecto de X', 'Mx = ΣPs(yi−yc)', `=${serviceMomentX}`, 'contact.gross.momentXKnM', 'kN·m'),
    tpl('service_ex', 'Servicio', 'Excentricidad X', 'ex = My/P', `=${c('service_my')}/${c('service_total')}`, 'contact.gross.eccentricityXM', 'm'),
    tpl('service_ey', 'Servicio', 'Excentricidad Y', 'ey = Mx/P', `=${c('service_mx')}/${c('service_total')}`, 'contact.gross.eccentricityYM', 'm'),
    tpl('service_kern', 'Servicio', 'Interacción del núcleo', 'κ = 6|ex|/L+6|ey|/B', `=6*ABS(${c('service_ex')})/${i('footingLengthM')}+6*ABS(${c('service_ey')})/${i('footingWidthM')}`, 'contact.gross.kernInteraction', ''),
    tpl('service_average', 'Servicio', 'Presión promedio', 'q̄ = P/A', `=${c('service_total')}/${c('area')}`, 'contact.gross.averagePressureKpa', 'kPa'),
    tpl('service_bl', 'Servicio', 'Presión inferior izquierda', 'qBL = q̄(1−6ex/L−6ey/B)', `=${c('service_average')}*(1-6*${c('service_ex')}/${i('footingLengthM')}-6*${c('service_ey')}/${i('footingWidthM')})`, 'contact.gross.cornerPressuresKpa.bottomLeft', 'kPa'),
    tpl('service_br', 'Servicio', 'Presión inferior derecha', 'qBR = q̄(1+6ex/L−6ey/B)', `=${c('service_average')}*(1+6*${c('service_ex')}/${i('footingLengthM')}-6*${c('service_ey')}/${i('footingWidthM')})`, 'contact.gross.cornerPressuresKpa.bottomRight', 'kPa'),
    tpl('service_tl', 'Servicio', 'Presión superior izquierda', 'qTL = q̄(1−6ex/L+6ey/B)', `=${c('service_average')}*(1-6*${c('service_ex')}/${i('footingLengthM')}+6*${c('service_ey')}/${i('footingWidthM')})`, 'contact.gross.cornerPressuresKpa.topLeft', 'kPa'),
    tpl('service_tr', 'Servicio', 'Presión superior derecha', 'qTR = q̄(1+6ex/L+6ey/B)', `=${c('service_average')}*(1+6*${c('service_ex')}/${i('footingLengthM')}+6*${c('service_ey')}/${i('footingWidthM')})`, 'contact.gross.cornerPressuresKpa.topRight', 'kPa'),
    tpl('comparison_max', 'Servicio', 'Presión máxima comparada', 'máx de cuatro esquinas, bruta o neta', `=MAX(IF(${i('bearingCapacityBasis')}="gross",${c('service_bl')},${c('service_bl')}-${i('removedOverburdenKpa')}),IF(${i('bearingCapacityBasis')}="gross",${c('service_br')},${c('service_br')}-${i('removedOverburdenKpa')}),IF(${i('bearingCapacityBasis')}="gross",${c('service_tl')},${c('service_tl')}-${i('removedOverburdenKpa')}),IF(${i('bearingCapacityBasis')}="gross",${c('service_tr')},${c('service_tr')}-${i('removedOverburdenKpa')}))`, 'contact.maximumPressureForComparisonKpa', 'kPa'),
    tpl('utilization', 'Servicio', 'Utilización', 'η = qmáx/qadm', `=${c('comparison_max')}/${i('allowableBearingKpa')}`, 'contact.utilization', ''),
    tpl('factored_total', 'Estructural', 'Carga última total', 'Pᵤ = ΣPᵤi', `=${factoredLoad}`, 'structural.factored.totalLoadKn', 'kN'),
    tpl('factored_my', 'Estructural', 'Momento último respecto de Y', 'Mᵤy = ΣPᵤi(xi−xc)', `=${factoredMomentY}`, 'structural.factored.momentYKnM', 'kN·m'),
    tpl('factored_mx', 'Estructural', 'Momento último respecto de X', 'Mᵤx = ΣPᵤi(yi−yc)', `=${factoredMomentX}`, 'structural.factored.momentXKnM', 'kN·m'),
    tpl('factored_ex', 'Estructural', 'Excentricidad última X', 'eᵤx = Mᵤy/Pᵤ', `=${c('factored_my')}/${c('factored_total')}`, 'structural.factored.eccentricityXM', 'm'),
    tpl('factored_ey', 'Estructural', 'Excentricidad última Y', 'eᵤy = Mᵤx/Pᵤ', `=${c('factored_mx')}/${c('factored_total')}`, 'structural.factored.eccentricityYM', 'm'),
    tpl('factored_kern', 'Estructural', 'Interacción última del núcleo', 'κᵤ = 6|eᵤx|/L+6|eᵤy|/B', `=6*ABS(${c('factored_ex')})/${i('footingLengthM')}+6*ABS(${c('factored_ey')})/${i('footingWidthM')}`, 'structural.factored.kernInteraction', ''),
  )
  if (isCorner) {
    rows.push(
      tpl('effective_depth', 'Estructural', 'Profundidad efectiva', 'd = h−c−dᵦ/2', `=${i('footingThicknessM')}-${i('concreteCoverM')}-${i('barDiameterM')}/2`, 'structural.effectiveDepthM', 'm'),
      tpl('development', 'Desarrollo', 'Longitud requerida', 'lᵈ = fy/(1.4√f′c)×dᵦ', `=${i('steelYieldStrengthMpa')}/(1.4*SQRT(${i('concreteStrengthMpa')}))*${i('barDiameterM')}`, 'development.requiredDevelopmentLengthM', 'm', 'Referencia de guía en validación.'),
    )
  }
  return rows
}

function templatesFor(footingType: FootingType, columnCount: number): Template[] {
  switch (footingType) {
    case 'isolated': return isolatedTemplates()
    case 'strip': return stripTemplates()
    case 'combined': return combinedTemplates()
    case 'strap': return strapTemplates()
    case 'trapezoidal': return trapezoidalTemplates()
    case 'edge': return edgeTemplates()
    case 'corner': return biaxialTemplates('corner')
    case 'mat': return biaxialTemplates('mat', columnCount)
  }
}

function activeInputs(project: ProjectDocument): Record<string, unknown> {
  switch (project.footingType) {
    case 'isolated': return project.inputSnapshot
    case 'strip': return project.stripInputSnapshot
    case 'combined': return project.combinedInputSnapshot
    case 'strap': return project.strapInputSnapshot
    case 'trapezoidal': return project.trapezoidalInputSnapshot
    case 'edge': return project.edgeInputSnapshot
    case 'corner': return project.cornerInputSnapshot
    case 'mat': return project.matInputSnapshot
  }
}

function activeReport(project: ProjectDocument, generatedAt: string): ReportLike {
  switch (project.footingType) {
    case 'isolated': return buildFootingCalculationReport(project, generatedAt) as unknown as ReportLike
    case 'strip': return buildStripFootingCalculationReport(project, generatedAt) as unknown as ReportLike
    case 'combined': return buildCombinedFootingCalculationReport(project, generatedAt) as unknown as ReportLike
    case 'strap': return buildStrapFootingCalculationReport(project, generatedAt) as unknown as ReportLike
    case 'trapezoidal': return buildTrapezoidalFootingCalculationReport(project, generatedAt) as unknown as ReportLike
    case 'edge': return buildEdgeFootingCalculationReport(project, generatedAt) as unknown as ReportLike
    case 'corner': return buildCornerFootingCalculationReport(project, generatedAt) as unknown as ReportLike
    case 'mat': return buildMatFootingCalculationReport(project, generatedAt) as unknown as ReportLike
  }
}

function activeAnalysis(project: ProjectDocument): Record<string, unknown> {
  const outcome = (() => {
    switch (project.footingType) {
      case 'isolated': return analyzeFootingCase(project)
      case 'strip': return analyzeStripFootingCase(project)
      case 'combined': return analyzeCombinedFootingCase(project)
      case 'strap': return analyzeStrapFootingCase(project)
      case 'trapezoidal': return analyzeTrapezoidalFootingCase(project)
      case 'edge': return analyzeEdgeFootingCase(project)
      case 'corner': return analyzeCornerFootingCase(project)
      case 'mat': return analyzeMatFootingCase(project)
    }
  })()
  if (outcome.status === 'invalid-input') {
    throw new Error(`No se puede exportar el cálculo: ${outcome.issues.map((issue) => issue.message).join(' ')}`)
  }
  return outcome.analysis as unknown as Record<string, unknown>
}

function inferUnit(id: string): string {
  if (/Kpa$/.test(id)) return 'kPa'
  if (/Mpa$/.test(id)) return 'MPa'
  if (/KnM3$/.test(id)) return 'kN/m³'
  if (/KnM$/.test(id)) return 'kN/m'
  if (/LoadKn$|AxialLoadKn$/.test(id)) return 'kN'
  if (/Mm$/.test(id)) return 'mm'
  if (/M$/.test(id)) return 'm'
  return ''
}

function humanize(id: string): string {
  return id.replaceAll('.', ' · ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase())
}

function inputRowsOf(inputs: Record<string, unknown>, report: ReportLike): WorkbookInputRow[] {
  const reportMetadata = new Map(report.inputs.map((row) => [String(row.id), row]))
  const rows: WorkbookInputRow[] = []
  for (const [id, value] of Object.entries(inputs)) {
    if (id === 'columns' && Array.isArray(value)) {
      value.forEach((column, index) => {
        for (const [columnKey, columnValue] of Object.entries(column as Record<string, WorkbookScalar>)) {
          const fullId = `columns.${index}.${columnKey}`
          rows.push({
            id: fullId,
            label: `Columna ${index + 1} · ${FALLBACK_LABELS[columnKey] ?? humanize(columnKey)}`,
            originalValue: columnValue,
            unit: inferUnit(columnKey),
            editable: columnKey !== 'id' && columnKey !== 'label',
          })
        }
      })
      continue
    }
    if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'boolean') continue
    const metadata = reportMetadata.get(id)
    rows.push({
      id,
      label: metadata?.label ?? FALLBACK_LABELS[id] ?? humanize(id),
      originalValue: value,
      unit: metadata?.unit ?? inferUnit(id),
      editable: true,
    })
  }
  return rows
}

function valueAt(source: Record<string, unknown>, path: string): WorkbookScalar {
  let current: unknown = source
  for (const segment of path.split('.')) {
    if (current === null || typeof current !== 'object' || !(segment in current)) {
      throw new Error(`El resultado original no contiene la ruta requerida: ${path}.`)
    }
    current = (current as Record<string, unknown>)[segment]
  }
  if (typeof current !== 'number' && typeof current !== 'string' && typeof current !== 'boolean') {
    throw new Error(`El resultado original de ${path} no es una celda escalar exportable.`)
  }
  return current
}

function resolveFormula(template: string, inputRows: WorkbookInputRow[], templates: Template[]): string {
  const inputIndex = new Map(inputRows.map((row, index) => [row.id, INPUT_FIRST_ROW + index]))
  const calculationIndex = new Map(templates.map((row, index) => [row.id, CALCULATION_FIRST_ROW + index]))
  return template
    .replace(/\{\{i:([^}]+)}}/g, (_match, id: string) => {
      const row = inputIndex.get(id)
      if (!row) throw new Error(`La fórmula referencia una entrada inexistente: ${id}.`)
      return `'Entradas'!$D$${row}`
    })
    .replace(/\{\{c:([^}]+)}}/g, (_match, id: string) => {
      const row = calculationIndex.get(id)
      if (!row) throw new Error(`La fórmula referencia un paso inexistente: ${id}.`)
      return `'Cálculo completo'!$F$${row}`
    })
}

function checkRowsOf(calculations: WorkbookCalculationRow[]): WorkbookCheckRow[] {
  const rowById = new Map(calculations.map((row, index) => [row.id, CALCULATION_FIRST_ROW + index]))
  const ref = (id: string) => {
    const row = rowById.get(id)
    if (!row) throw new Error(`No se encuentra el paso ${id} para construir las comprobaciones.`)
    return `'Cálculo completo'!$F$${row}`
  }
  const checks: WorkbookCheckRow[] = []
  if (rowById.has('utilization')) {
    checks.push({ id: 'bearing', label: 'Capacidad admisible declarada', formula: `=IF(${ref('utilization')}<=1,"DENTRO DE CAPACIDAD","REQUIERE AJUSTE")`, originalValue: Number(calculations.find((row) => row.id === 'utilization')?.originalValue) <= 1 ? 'DENTRO DE CAPACIDAD' : 'REQUIERE AJUSTE', detail: 'Compara la presión gobernante con la capacidad externa declarada.' })
  }
  if (rowById.has('service_left') && rowById.has('service_right')) {
    checks.push({ id: 'service_contact', label: 'Contacto completo de servicio', formula: `=IF(MIN(${ref('service_left')},${ref('service_right')})>=0,"CONTACTO COMPLETO","FUERA DE ALCANCE")`, originalValue: 'CONTACTO COMPLETO', detail: 'No se permite presión negativa ni contacto parcial.' })
  }
  if (rowById.has('service_kern')) {
    checks.push({ id: 'service_kern', label: 'Núcleo biaxial de servicio', formula: `=IF(${ref('service_kern')}<=1,"CONTACTO COMPLETO","FUERA DE ALCANCE")`, originalValue: 'CONTACTO COMPLETO', detail: 'Exige 6|ex|/L + 6|ey|/B ≤ 1.' })
  }
  if (rowById.has('factored_kern')) {
    checks.push({ id: 'factored_kern', label: 'Núcleo biaxial último', formula: `=IF(${ref('factored_kern')}<=1,"CONTACTO COMPLETO","FUERA DE ALCANCE")`, originalValue: 'CONTACTO COMPLETO', detail: 'La combinación última declarada también debe conservar compresión completa.' })
  }
  if (rowById.has('kern_margin')) {
    checks.push({ id: 'middle_third', label: 'Tercio central último', formula: `=IF(${ref('kern_margin')}>=0,"DENTRO DEL TERCIO CENTRAL","FUERA DE ALCANCE")`, originalValue: 'DENTRO DEL TERCIO CENTRAL', detail: 'El contacto parcial no está implementado.' })
  }
  if (rowById.has('factored_reaction_int')) {
    checks.push({ id: 'positive_reactions', label: 'Reacciones últimas positivas', formula: `=IF(MIN(${ref('factored_reaction_ext')},${ref('factored_reaction_int')})>0,"REACCIONES POSITIVAS","FUERA DE ALCANCE")`, originalValue: 'REACCIONES POSITIVAS', detail: 'Ambas bases deben conservar reacción positiva.' })
  }
  checks.push({ id: 'scope', label: 'Estado normativo', formula: '="REFERENCIA EN VALIDACIÓN"', originalValue: 'REFERENCIA EN VALIDACIÓN', detail: 'El libro no convierte referencias de guía en aprobación normativa.' })
  return checks
}

export function buildWorkbookModel(project: ProjectDocument, generatedAt = new Date().toISOString()): ExerciseWorkbookModel {
  const report = activeReport(project, generatedAt)
  const analysis = activeAnalysis(project)
  const inputs = activeInputs(project)
  const inputRows = inputRowsOf(inputs, report)
  const columnCount = project.footingType === 'mat' ? project.matInputSnapshot.columns.length : 0
  const templates = templatesFor(project.footingType, columnCount)
  const calculationRows = templates.map((template) => ({
    id: template.id,
    section: template.section,
    label: template.label,
    expression: template.expression,
    formula: resolveFormula(template.formula, inputRows, templates),
    originalValue: template.path.startsWith('$input.')
      ? valueAt(inputs, template.path.slice('$input.'.length))
      : valueAt(analysis, template.path),
    unit: template.unit,
    note: template.note ?? '',
  }))
  const traceabilityRows = report.profile.traceability
    .filter((item) => item.appliesTo.includes(project.footingType))
    .map((item) => {
      const source = item.sourceId ? report.profile.sources.find((candidate) => candidate.id === item.sourceId) : undefined
      return {
        module: item.module,
        basis: item.basis,
        source: source?.label ?? 'Derivación y alcance documentados por AndeLogic',
        version: source?.version ?? project.engineVersion,
        reference: item.reference,
        applicability: item.applicability,
        url: source?.url ?? '',
      }
    })

  return {
    project: {
      projectId: project.projectId,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      productVersion: project.productVersion,
      engineVersion: project.engineVersion,
      schemaVersion: project.schemaVersion,
    },
    footingType: project.footingType,
    footingTypeLabel: TYPE_LABELS[project.footingType],
    generatedAt,
    profile: {
      id: report.profile.id,
      label: report.profile.label,
      releaseStatus: report.profile.releaseStatus,
      releaseBlocker: report.profile.releaseBlocker,
    },
    sheets: WORKBOOK_SHEETS,
    inputRows,
    calculationRows,
    checkRows: checkRowsOf(calculationRows),
    traceabilityRows,
    limitations: report.limitations,
  }
}
