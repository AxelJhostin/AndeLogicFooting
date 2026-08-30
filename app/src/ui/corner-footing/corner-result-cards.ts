import type { CornerFootingAnalysis } from '../../application/corner-footing-analysis'
import type { ResultCard } from '../results/result-cards'

const reference = (value: boolean | undefined): ResultCard['state'] => value === undefined ? 'pending' : value ? 'reference' : 'attention'
export function buildCornerResultCards(analysis: CornerFootingAnalysis | null): ResultCard[] {
  return [
    { id: 'corner-contact', title: 'Contacto y capacidad', state: reference(analysis ? analysis.contact.status === 'pass' : undefined), value: analysis ? `${(analysis.contact.utilization * 100).toFixed(1)}%` : '—', detail: analysis ? `qmáx ${analysis.contact.maximumPressureForComparisonKpa.toFixed(1)} kPa` : 'Requiere análisis', destination: 'plan' },
    { id: 'corner-kern', title: 'Núcleo biaxial', state: reference(analysis ? analysis.contact.gross.kernMargin >= 0 : undefined), value: analysis ? `${analysis.contact.gross.kernInteraction.toFixed(3)} / 1.000` : '—', detail: 'Suma simultánea de ambas excentricidades', destination: 'plan' },
    { id: 'corner-equilibrium', title: 'Equilibrio en dos ejes', state: analysis ? 'calculated' : 'pending', value: analysis ? `${Math.max(Math.abs(analysis.equilibrium.momentXResidualKnM), Math.abs(analysis.equilibrium.momentYResidualKnM)).toExponential(1)}` : '—', detail: 'Máximo residual de momento', destination: 'section' },
    { id: 'corner-shear-x', title: 'Cortante en X', state: reference(analysis ? analysis.shearReference.x.status === 'meets-guide-reference' : undefined), value: analysis ? `${(analysis.shearReference.x.utilization * 100).toFixed(1)}%` : '—', detail: analysis ? `${analysis.directions.x.governingShearDemandKn.toFixed(1)} kN` : 'Requiere análisis', destination: 'section' },
    { id: 'corner-shear-y', title: 'Cortante en Y', state: reference(analysis ? analysis.shearReference.y.status === 'meets-guide-reference' : undefined), value: analysis ? `${(analysis.shearReference.y.utilization * 100).toFixed(1)}%` : '—', detail: analysis ? `${analysis.directions.y.governingShearDemandKn.toFixed(1)} kN` : 'Requiere análisis', destination: 'section' },
    { id: 'corner-punching', title: 'Punzonamiento de esquina', state: 'out-of-scope', value: 'No evaluado', detail: 'Perímetro truncado en dos direcciones', destination: 'plan' },
    { id: 'corner-steel-x', title: 'Acero en X', state: reference(analysis ? analysis.reinforcement.x.status === 'meets-guide-reference' : undefined), value: analysis ? `${(analysis.reinforcement.x.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m` : '—', detail: 'Barras paralelas a L', destination: 'plan' },
    { id: 'corner-steel-y', title: 'Acero en Y', state: reference(analysis ? analysis.reinforcement.y.status === 'meets-guide-reference' : undefined), value: analysis ? `${(analysis.reinforcement.y.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m` : '—', detail: 'Barras paralelas a B', destination: 'plan' },
    { id: 'corner-development', title: 'Desarrollo', state: reference(analysis ? analysis.development.x.status === 'meets-guide-reference' && analysis.development.y.status === 'meets-guide-reference' : undefined), value: analysis ? `${analysis.development.requiredDevelopmentLengthM.toFixed(2)} m` : '—', detail: 'Longitud requerida de referencia', destination: 'calculation' },
  ]
}
