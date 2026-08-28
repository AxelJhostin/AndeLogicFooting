import type { FootingAnalysis } from '../../application/footing-analysis'
import type { WorkspaceView } from '../navigation'

export type ResultCardState = 'pending' | 'reference' | 'attention'
export type ResultCard = { id: string; title: string; state: ResultCardState; value: string; detail: string; destination: WorkspaceView }

const state = (value: boolean | undefined): ResultCardState => value === undefined ? 'pending' : value ? 'reference' : 'attention'

export function resultCardLabel(value: ResultCardState): string {
  return value === 'pending' ? 'Pendiente' : value === 'reference' ? 'Dentro de referencia' : 'Requiere ajuste'
}

/** Convierte resultados ya calculados en información de presentación; no calcula resistencias ni demandas. */
export function buildResultCards(analysis: FootingAnalysis | null): ResultCard[] {
  const contact = analysis?.contact
  const oneWay = analysis?.oneWay
  const oneWayGuide = analysis?.oneWayGuide
  const punching = analysis?.punchingGuide
  const flexure = analysis?.flexure
  const steel = analysis?.reinforcement
  const development = analysis?.development

  return [
    { id: 'contact', title: 'Contacto de servicio', state: state(contact ? contact.status === 'pass' : undefined), value: contact ? `${(contact.utilization * 100).toFixed(1)}%` : '—', detail: contact ? `${contact.pressureForComparisonKpa.toFixed(1)} kPa` : 'Requiere análisis', destination: 'plan' },
    { id: 'shear-b', title: 'Cortante B', state: state(oneWayGuide ? oneWayGuide.widthDirection.status === 'meets-guide-reference' : undefined), value: oneWayGuide ? `${(oneWayGuide.widthDirection.utilization * 100).toFixed(1)}%` : '—', detail: oneWay ? `Vᵤ ${oneWay.widthDirection.shearDemandKn.toFixed(1)} kN` : 'Requiere análisis', destination: 'section' },
    { id: 'shear-l', title: 'Cortante L', state: state(oneWayGuide ? oneWayGuide.lengthDirection.status === 'meets-guide-reference' : undefined), value: oneWayGuide ? `${(oneWayGuide.lengthDirection.utilization * 100).toFixed(1)}%` : '—', detail: oneWay ? `Vᵤ ${oneWay.lengthDirection.shearDemandKn.toFixed(1)} kN` : 'Requiere análisis', destination: 'section' },
    { id: 'punching', title: 'Punzonamiento', state: state(punching ? punching.status === 'meets-guide-reference' : undefined), value: punching ? `${(punching.utilization * 100).toFixed(1)}%` : '—', detail: punching ? `b₀ ${punching.criticalPerimeterM.toFixed(2)} m` : 'Requiere análisis', destination: 'plan' },
    { id: 'flexure-b', title: 'Flexión B', state: state(flexure ? true : undefined), value: flexure ? `${flexure.widthDirection.momentDemandKnM.toFixed(1)} kN·m` : '—', detail: 'Demanda en cara de columna', destination: 'section' },
    { id: 'flexure-l', title: 'Flexión L', state: state(flexure ? true : undefined), value: flexure ? `${flexure.lengthDirection.momentDemandKnM.toFixed(1)} kN·m` : '—', detail: 'Demanda en cara de columna', destination: 'section' },
    { id: 'steel-b', title: 'Acero B', state: state(steel ? steel.widthDirection.status === 'meets-guide-reference' : undefined), value: steel ? `${(steel.widthDirection.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m` : '—', detail: 'Colocado vs. referencia', destination: 'plan' },
    { id: 'steel-l', title: 'Acero L', state: state(steel ? steel.lengthDirection.status === 'meets-guide-reference' : undefined), value: steel ? `${(steel.lengthDirection.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m` : '—', detail: 'Colocado vs. referencia', destination: 'plan' },
    { id: 'development', title: 'Desarrollo', state: state(development ? development.widthDirection.status === 'meets-guide-reference' && development.lengthDirection.status === 'meets-guide-reference' : undefined), value: development ? `${development.requiredDevelopmentLengthM.toFixed(2)} m` : '—', detail: 'Longitud de referencia', destination: 'calculation' },
  ]
}
