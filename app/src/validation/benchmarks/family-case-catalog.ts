import { analyzeCombinedFootingCase } from '../../application/combined-footing-analysis'
import { analyzeCornerFootingCase } from '../../application/corner-footing-analysis'
import { analyzeEdgeFootingCase } from '../../application/edge-footing-analysis'
import { analyzeFootingCase } from '../../application/footing-analysis'
import { analyzeMatFootingCase } from '../../application/mat-footing-analysis'
import { analyzeStrapFootingCase } from '../../application/strap-footing-analysis'
import { analyzeStripFootingCase } from '../../application/strip-footing-analysis'
import { analyzeTrapezoidalFootingCase } from '../../application/trapezoidal-footing-analysis'
import {
  applyFootingExample,
  defaultExampleForFootingType,
  type FootingExample,
} from '../../domain/examples/footing-examples'
import { createNewProject, type FootingType } from '../../domain/projects'

export type FamilyBenchmarkMetric = {
  metricId: string
  label: string
  engineValue: number
  unit: string
  absoluteTolerance: number
  relativeTolerance: number
}

export type FamilyBenchmarkCase = {
  caseId: string
  footingType: FootingType
  label: string
  exampleId: string
  standardProfile: 'NEC-2015-GUIDE-TRACEABLE'
  assumptionsId: string
  scopeReference: string
  inputs: FootingExample['inputs']
  metrics: FamilyBenchmarkMetric[]
}

type CalculationOutcome<T> = { status: 'calculated'; analysis: T } | { status: 'invalid-input' }

function requireCalculated<T>(caseId: string, outcome: CalculationOutcome<T>): T {
  if (outcome.status !== 'calculated') throw new Error(`El caso ${caseId} dejó de ser calculable.`)
  return outcome.analysis
}

const metric = (
  metricId: string,
  label: string,
  engineValue: number,
  unit: string,
  absoluteTolerance: number,
): FamilyBenchmarkMetric => ({ metricId, label, engineValue, unit, absoluteTolerance, relativeTolerance: 0.005 })

const examples = {
  isolated: defaultExampleForFootingType('isolated'),
  strip: defaultExampleForFootingType('strip'),
  combined: defaultExampleForFootingType('combined'),
  strap: defaultExampleForFootingType('strap'),
  trapezoidal: defaultExampleForFootingType('trapezoidal'),
  edge: defaultExampleForFootingType('edge'),
  corner: defaultExampleForFootingType('corner'),
  mat: defaultExampleForFootingType('mat'),
}

const projects = Object.fromEntries(Object.entries(examples).map(([footingType, example]) => [
  footingType,
  applyFootingExample(createNewProject(), example),
])) as Record<FootingType, ReturnType<typeof createNewProject>>

const isolated = requireCalculated('AXC-BMK-ISO-001', analyzeFootingCase(projects.isolated))
const strip = requireCalculated('AXC-BMK-STRIP-001', analyzeStripFootingCase(projects.strip))
const combined = requireCalculated('AXC-BMK-COMBINED-001', analyzeCombinedFootingCase(projects.combined))
const strap = requireCalculated('AXC-BMK-STRAP-001', analyzeStrapFootingCase(projects.strap))
const trapezoidal = requireCalculated('AXC-BMK-TRAPEZOIDAL-001', analyzeTrapezoidalFootingCase(projects.trapezoidal))
const edge = requireCalculated('AXC-BMK-EDGE-001', analyzeEdgeFootingCase(projects.edge))
const corner = requireCalculated('AXC-BMK-CORNER-001', analyzeCornerFootingCase(projects.corner))
const mat = requireCalculated('AXC-BMK-MAT-001', analyzeMatFootingCase(projects.mat))

export const familyBenchmarkCases: readonly FamilyBenchmarkCase[] = [
  {
    caseId: 'AXC-BMK-ISO-001', footingType: 'isolated', label: 'Aislada centrada · referencia',
    exampleId: examples.isolated.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-ISO-ASSUMPTIONS-001',
    scopeReference: 'docs/02-scope-and-norms.md y docs/10-axel-code-implementation-cards.md', inputs: structuredClone(examples.isolated.inputs),
    metrics: [
      metric('contact.gross-pressure', 'Presión bruta de servicio', isolated.contact.grossContactPressureKpa, 'kPa', 0.1),
      metric('one-way.governing-demand', 'Cortante unidireccional gobernante', isolated.oneWay.governingShearDemandKn, 'kN', 0.1),
      metric('flexure.governing-demand', 'Momento flector gobernante', isolated.flexure.governingMomentDemandKnM, 'kN·m', 0.1),
    ],
  },
  {
    caseId: 'AXC-BMK-STRIP-001', footingType: 'strip', label: 'Corrida centrada · referencia',
    exampleId: examples.strip.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-STRIP-ASSUMPTIONS-001',
    scopeReference: 'docs/15-strip-footing-scope.md', inputs: structuredClone(examples.strip.inputs),
    metrics: [
      metric('contact.gross-pressure', 'Presión bruta de servicio', strip.contact.grossContactPressureKpa, 'kPa', 0.1),
      metric('one-way.demand', 'Cortante unidireccional por metro', strip.structural.oneWayShearDemandKnPerM, 'kN/m', 0.1),
      metric('flexure.demand', 'Momento transversal por metro', strip.structural.flexureDemandKnMPerM, 'kN·m/m', 0.1),
    ],
  },
  {
    caseId: 'AXC-BMK-COMBINED-001', footingType: 'combined', label: 'Combinada rectangular · referencia',
    exampleId: examples.combined.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-COMBINED-ASSUMPTIONS-001',
    scopeReference: 'docs/16-combined-footing-scope.md', inputs: structuredClone(examples.combined.inputs),
    metrics: [
      metric('contact.gross-left', 'Presión bruta de servicio izquierda', combined.contact.grossPressureLeftKpa, 'kPa', 0.1),
      metric('contact.gross-right', 'Presión bruta de servicio derecha', combined.contact.grossPressureRightKpa, 'kPa', 0.1),
      metric('longitudinal.governing-moment', 'Momento longitudinal absoluto gobernante', combined.longitudinal.governingAbsoluteMomentKnM, 'kN·m', 0.1),
    ],
  },
  {
    caseId: 'AXC-BMK-STRAP-001', footingType: 'strap', label: 'Medianera con viga centradora · referencia',
    exampleId: examples.strap.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-STRAP-ASSUMPTIONS-001',
    scopeReference: 'docs/17-strap-footing-scope.md', inputs: structuredClone(examples.strap.inputs),
    metrics: [
      metric('equilibrium.strap-shear', 'Cortante transferido por la viga', strap.service.strapShearKn, 'kN', 0.1),
      metric('contact.exterior-gross-pressure', 'Presión bruta base exterior', strap.service.exteriorGrossPressureKpa, 'kPa', 0.1),
      metric('contact.interior-gross-pressure', 'Presión bruta base interior', strap.service.interiorGrossPressureKpa, 'kPa', 0.1),
    ],
  },
  {
    caseId: 'AXC-BMK-TRAPEZOIDAL-001', footingType: 'trapezoidal', label: 'Combinada trapezoidal · referencia',
    exampleId: examples.trapezoidal.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-TRAPEZOIDAL-ASSUMPTIONS-001',
    scopeReference: 'docs/19-trapezoidal-footing-scope.md', inputs: structuredClone(examples.trapezoidal.inputs),
    metrics: [
      metric('geometry.centroid-from-left', 'Centroide geométrico desde la izquierda', trapezoidal.geometry.centroidFromLeftM, 'm', 0.001),
      metric('contact.gross-left', 'Presión bruta de servicio izquierda', trapezoidal.contact.grossPressureLeftKpa, 'kPa', 0.1),
      metric('contact.gross-right', 'Presión bruta de servicio derecha', trapezoidal.contact.grossPressureRightKpa, 'kPa', 0.1),
    ],
  },
  {
    caseId: 'AXC-BMK-EDGE-001', footingType: 'edge', label: 'Excéntrica de borde · referencia',
    exampleId: examples.edge.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-EDGE-ASSUMPTIONS-001',
    scopeReference: 'docs/20-edge-eccentric-footing-scope.md', inputs: structuredClone(examples.edge.inputs),
    metrics: [
      metric('contact.gross-left', 'Presión bruta de servicio izquierda', edge.contact.grossPressureLeftKpa, 'kPa', 0.1),
      metric('contact.gross-right', 'Presión bruta de servicio derecha', edge.contact.grossPressureRightKpa, 'kPa', 0.1),
      metric('longitudinal.governing-flexure', 'Momento longitudinal gobernante', edge.longitudinal.governingFlexureDemandKnM, 'kN·m', 0.1),
    ],
  },
  {
    caseId: 'AXC-BMK-CORNER-001', footingType: 'corner', label: 'Esquina biaxial · referencia',
    exampleId: examples.corner.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-CORNER-ASSUMPTIONS-001',
    scopeReference: 'docs/22-corner-biaxial-footing-scope.md', inputs: structuredClone(examples.corner.inputs),
    metrics: [
      metric('contact.gross-average', 'Presión bruta promedio', corner.contact.gross.averagePressureKpa, 'kPa', 0.1),
      metric('contact.gross-minimum', 'Presión bruta mínima', corner.contact.gross.minimumPressureKpa, 'kPa', 0.1),
      metric('contact.gross-maximum', 'Presión bruta máxima', corner.contact.gross.maximumPressureKpa, 'kPa', 0.1),
    ],
  },
  {
    caseId: 'AXC-BMK-MAT-001', footingType: 'mat', label: 'Losa multicolumna · referencia',
    exampleId: examples.mat.id, standardProfile: 'NEC-2015-GUIDE-TRACEABLE', assumptionsId: 'AXC-MAT-ASSUMPTIONS-001',
    scopeReference: 'docs/23-mat-foundation-scope.md', inputs: structuredClone(examples.mat.inputs),
    metrics: [
      metric('contact.gross-average', 'Presión bruta promedio', mat.contact.gross.averagePressureKpa, 'kPa', 0.1),
      metric('contact.gross-minimum', 'Presión bruta mínima', mat.contact.gross.minimumPressureKpa, 'kPa', 0.1),
      metric('contact.gross-maximum', 'Presión bruta máxima', mat.contact.gross.maximumPressureKpa, 'kPa', 0.1),
    ],
  },
]
