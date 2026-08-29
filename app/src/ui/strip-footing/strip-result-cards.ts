import type { StripFootingAnalysis } from '../../application/strip-footing-analysis'
import type { ResultCard } from '../results/result-cards'

const state = (value: boolean | undefined): ResultCard['state'] => value === undefined ? 'pending' : value ? 'reference' : 'attention'

export function buildStripResultCards(analysis: StripFootingAnalysis | null): ResultCard[] {
  return [
    { id: 'strip-contact', title: 'Contacto de servicio', state: state(analysis ? analysis.contact.status === 'pass' : undefined), value: analysis ? `${(analysis.contact.utilization * 100).toFixed(1)}%` : '—', detail: analysis ? `${analysis.contact.pressureForComparisonKpa.toFixed(1)} kPa` : 'Requiere análisis', destination: 'section' },
    { id: 'strip-shear', title: 'Cortante transversal', state: state(analysis ? analysis.shearReference.status === 'meets-guide-reference' : undefined), value: analysis ? `${(analysis.shearReference.utilization * 100).toFixed(1)}%` : '—', detail: analysis ? `Vᵤ ${analysis.structural.oneWayShearDemandKnPerM.toFixed(1)} kN/m` : 'Requiere análisis', destination: 'section' },
    { id: 'strip-flexure', title: 'Flexión transversal', state: analysis ? 'calculated' : 'pending', value: analysis ? `${analysis.structural.flexureDemandKnMPerM.toFixed(1)} kN·m/m` : '—', detail: 'Demanda en cara de muro', destination: 'section' },
    { id: 'strip-steel-t', title: 'Acero transversal', state: state(analysis ? analysis.reinforcement.transverseStatus === 'meets-guide-reference' : undefined), value: analysis ? `${(analysis.reinforcement.transverseProvidedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m` : '—', detail: 'Colocado vs. referencia gobernante', destination: 'plan' },
    { id: 'strip-steel-l', title: 'Acero longitudinal', state: state(analysis ? analysis.reinforcement.longitudinalStatus === 'meets-guide-reference' : undefined), value: analysis ? `${(analysis.reinforcement.longitudinalProvidedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m` : '—', detail: 'Distribución vs. mínimo de guía', destination: 'plan' },
    { id: 'strip-development', title: 'Desarrollo transversal', state: state(analysis ? analysis.development.widthDirection.status === 'meets-guide-reference' : undefined), value: analysis ? `${analysis.development.requiredDevelopmentLengthM.toFixed(2)} m` : '—', detail: 'Longitud requerida de referencia', destination: 'calculation' },
  ]
}
