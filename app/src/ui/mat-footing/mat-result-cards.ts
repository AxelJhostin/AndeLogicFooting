import type { MatFootingAnalysis } from '../../application/mat-footing-analysis'
import type { ResultCard } from '../results/result-cards'

const state = (value: boolean | undefined): ResultCard['state'] => value === undefined ? 'pending' : value ? 'reference' : 'attention'
export function buildMatResultCards(analysis: MatFootingAnalysis | null): ResultCard[] {
  const settlement = analysis?.settlement
  return [
    { id: 'mat-contact', title: 'Contacto y capacidad', state: state(analysis ? analysis.contact.status === 'pass' : undefined), value: analysis ? `${(analysis.contact.utilization * 100).toFixed(1)}%` : '—', detail: analysis ? `qmáx ${analysis.contact.maximumPressureForComparisonKpa.toFixed(1)} kPa` : 'Requiere análisis', destination: 'plan' },
    { id: 'mat-kern', title: 'Núcleo biaxial', state: state(analysis ? analysis.contact.gross.kernMargin >= 0 : undefined), value: analysis ? `${analysis.contact.gross.kernInteraction.toFixed(3)} / 1.000` : '—', detail: 'Contacto completo en cuatro esquinas', destination: 'plan' },
    { id: 'mat-settlement-total', title: 'Asentamiento total', state: settlement?.status === 'calculated' ? settlement.totalStatus === 'not-provided' ? 'calculated' : state(settlement.totalStatus === 'pass') : settlement ? 'out-of-scope' : 'pending', value: settlement?.status === 'calculated' ? `${settlement.maximumSettlementMm.toFixed(2)} mm` : settlement ? 'No evaluado' : '—', detail: settlement?.status === 'calculated' ? 'Pantalla rígida–Winkler' : 'Requiere k declarado', destination: 'calculation' },
    { id: 'mat-settlement-differential', title: 'Asentamiento diferencial', state: settlement?.status === 'calculated' ? settlement.differentialStatus === 'not-provided' ? 'calculated' : state(settlement.differentialStatus === 'pass') : settlement ? 'out-of-scope' : 'pending', value: settlement?.status === 'calculated' ? `${settlement.differentialSettlementMm.toFixed(2)} mm` : settlement ? 'No evaluado' : '—', detail: 'Diferencia entre esquinas extremas', destination: 'calculation' },
    { id: 'mat-equilibrium', title: 'Equilibrio global', state: analysis ? 'calculated' : 'pending', value: analysis ? Math.max(Math.abs(analysis.equilibrium.verticalResidualKn), Math.abs(analysis.equilibrium.momentXResidualKnM), Math.abs(analysis.equilibrium.momentYResidualKnM)).toExponential(1) : '—', detail: 'Máximo residual de fuerza o momento', destination: 'section' },
    { id: 'mat-plate', title: 'Flexión y cortante de placa', state: 'out-of-scope', value: 'No evaluado', detail: 'Requiere rigidez de placa y suelo', destination: 'section' },
    { id: 'mat-punching', title: 'Punzonamiento por columna', state: 'out-of-scope', value: 'No evaluado', detail: 'No se reutiliza una regla incompleta', destination: 'calculation' },
    { id: 'mat-reinforcement', title: 'Armado de la losa', state: 'out-of-scope', value: 'No evaluado', detail: 'Depende del análisis estructural de placa', destination: 'calculation' },
  ]
}
