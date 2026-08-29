import type { StrapFootingAnalysis } from '../application/strap-footing-analysis'
import type { StrapFootingInputs } from '../domain/projects'

type Props = { inputs: StrapFootingInputs; analysis: StrapFootingAnalysis | null }
const n = (value: number, decimals = 2) => value.toFixed(decimals)

const geometry = (inputs: StrapFootingInputs) => {
  const totalLengthM = inputs.footingCenterSpacingM + inputs.exteriorFootingLengthM / 2 + inputs.interiorFootingLengthM / 2
  const scale = 600 / totalLengthM
  const exteriorLeft = 80
  const exteriorLength = inputs.exteriorFootingLengthM * scale
  const interiorCenter = exteriorLeft + (inputs.exteriorFootingLengthM / 2 + inputs.footingCenterSpacingM) * scale
  const interiorLength = inputs.interiorFootingLengthM * scale
  const interiorLeft = interiorCenter - interiorLength / 2
  const exteriorColumnX = exteriorLeft + inputs.exteriorColumnCenterFromOuterEdgeM * scale
  return { scale, exteriorLeft, exteriorLength, interiorLeft, interiorLength, interiorCenter, exteriorColumnX }
}

export function StrapFootingPlanSheet({ inputs, analysis }: Props) {
  const g = geometry(inputs)
  const maxWidthM = Math.max(inputs.exteriorFootingWidthM, inputs.interiorFootingWidthM)
  const widthScale = 210 / maxWidthM
  const exteriorWidth = inputs.exteriorFootingWidthM * widthScale
  const interiorWidth = inputs.interiorFootingWidthM * widthScale
  const beamWidth = Math.max(16, inputs.strapBeamWidthM * widthScale)
  const exteriorColumnL = Math.max(24, inputs.exteriorColumnLengthM * g.scale)
  const exteriorColumnW = Math.max(24, inputs.exteriorColumnWidthM * widthScale)
  const interiorColumnL = Math.max(24, inputs.interiorColumnLengthM * g.scale)
  const interiorColumnW = Math.max(24, inputs.interiorColumnWidthM * widthScale)
  const cy = 190
  return <figure className="engineering-sheet strap-sheet"><figcaption><span>PLANTA GENERAL</span><strong>Zapata medianera con viga centradora</strong><small>La línea izquierda representa el lindero; el tramo de viga entre bases no recibe reacción del suelo.</small></figcaption><svg viewBox="0 0 780 420" role="img" aria-label="Planta de dos zapatas enlazadas por una viga centradora"><line x1="80" y1="42" x2="80" y2="338" className="critical-line"/><text x="68" y="55" textAnchor="end" className="callout-title">LINDERO</text><rect x={g.exteriorLeft} y={cy-exteriorWidth/2} width={g.exteriorLength} height={exteriorWidth} className="footing-line"/><rect x={g.interiorLeft} y={cy-interiorWidth/2} width={g.interiorLength} height={interiorWidth} className="footing-line"/><rect x={g.exteriorLeft+g.exteriorLength} y={cy-beamWidth/2} width={g.interiorLeft-(g.exteriorLeft+g.exteriorLength)} height={beamWidth} className="footing-fill"/><rect x={g.exteriorColumnX-exteriorColumnL/2} y={cy-exteriorColumnW/2} width={exteriorColumnL} height={exteriorColumnW} className="column-line"/><rect x={g.interiorCenter-interiorColumnL/2} y={cy-interiorColumnW/2} width={interiorColumnL} height={interiorColumnW} className="column-line"/><text x={g.exteriorColumnX} y={cy+4} textAnchor="middle" className="column-label">Cₑ</text><text x={g.interiorCenter} y={cy+4} textAnchor="middle" className="column-label">Cᵢ</text><line x1={g.exteriorColumnX} y1="58" x2={g.exteriorColumnX} y2="342" className="axis-line"/><line x1={g.interiorCenter} y1="58" x2={g.interiorCenter} y2="342" className="axis-line"/><text x={(g.exteriorLeft+g.exteriorLength+g.interiorLeft)/2} y={cy-beamWidth/2-12} textAnchor="middle" className="sheet-notes">VIGA CENTRADORA · SIN APOYO EN SUELO</text><line x1={g.exteriorColumnX} y1="366" x2={g.interiorCenter} y2="366" className="dimension"/><text x={(g.exteriorColumnX+g.interiorCenter)/2} y="386" textAnchor="middle" className="dimension-label">S = {n(inputs.footingCenterSpacingM)} m</text>{analysis && <><text x={g.exteriorLeft+g.exteriorLength/2} y="28" textAnchor="middle" className="callout-title">qᵤ,e = {n(analysis.factored.exteriorPressureKpa,1)} kPa</text><text x={g.interiorCenter} y="28" textAnchor="middle" className="callout-title">qᵤ,i = {n(analysis.factored.interiorPressureKpa,1)} kPa</text><text x={(g.exteriorColumnX+g.interiorCenter)/2} y="410" textAnchor="middle" className="dimension-label">e = {n(analysis.geometry.exteriorEccentricityM)} m · Mᵤ = {n(analysis.beam.momentDemandKnM,1)} kN·m</text></>}</svg></figure>
}

export function StrapFootingLongitudinalSheet({ inputs, analysis }: Props) {
  const g = geometry(inputs)
  const extBottom = 238
  const intBottom = 238
  const extH = Math.max(42, inputs.exteriorFootingThicknessM * 100)
  const intH = Math.max(42, inputs.interiorFootingThicknessM * 100)
  const beamH = Math.max(44, inputs.strapBeamDepthM * 100)
  return <figure className="engineering-sheet strap-sheet"><figcaption><span>SECCIÓN LONGITUDINAL A–A</span><strong>Transferencia del momento excéntrico</strong><small>Las reacciones del suelo actúan únicamente bajo las dos bases.</small></figcaption><svg viewBox="0 0 780 440" role="img" aria-label="Sección longitudinal de una zapata medianera con viga centradora"><defs><marker id="strapArrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill="#1b6799"/></marker></defs><line x1="46" y1="150" x2="734" y2="150" className="ground-line"/><line x1="80" y1="38" x2="80" y2="330" className="critical-line"/><text x="69" y="50" textAnchor="end" className="callout-title">LINDERO</text><rect x={g.exteriorLeft} y={extBottom-extH} width={g.exteriorLength} height={extH} className="footing-line"/><rect x={g.interiorLeft} y={intBottom-intH} width={g.interiorLength} height={intH} className="footing-line"/><rect x={g.exteriorLeft+g.exteriorLength} y={extBottom-beamH} width={g.interiorLeft-(g.exteriorLeft+g.exteriorLength)} height={beamH} className="footing-fill"/><rect x={g.exteriorColumnX-18} y="70" width="36" height={extBottom-extH-70} className="column-line"/><rect x={g.interiorCenter-20} y="70" width="40" height={intBottom-intH-70} className="column-line"/><line x1={g.exteriorColumnX} y1="24" x2={g.exteriorColumnX} y2="58" className="load-line" markerEnd="url(#strapArrow)"/><line x1={g.interiorCenter} y1="24" x2={g.interiorCenter} y2="58" className="load-line" markerEnd="url(#strapArrow)"/><text x={g.exteriorColumnX+10} y="38" className="load-label">Pₑ</text><text x={g.interiorCenter+10} y="38" className="load-label">Pᵢ</text><path d={`M${g.exteriorLeft} 300H${g.exteriorLeft+g.exteriorLength}V270H${g.exteriorLeft}Z`} className="pressure-fill"/><path d={`M${g.interiorLeft} 300H${g.interiorLeft+g.interiorLength}V270H${g.interiorLeft}Z`} className="pressure-fill"/><line x1={g.exteriorLeft} y1="270" x2={g.exteriorLeft+g.exteriorLength} y2="270" className="pressure-line"/><line x1={g.interiorLeft} y1="270" x2={g.interiorLeft+g.interiorLength} y2="270" className="pressure-line"/><text x={g.exteriorLeft+g.exteriorLength/2} y="320" textAnchor="middle" className="sheet-notes">Rₑ ↑</text><text x={g.interiorCenter} y="320" textAnchor="middle" className="sheet-notes">Rᵢ ↑</text><line x1={g.exteriorLeft+g.exteriorLength} y1="300" x2={g.interiorLeft} y2="300" className="critical-line"/><text x={(g.exteriorLeft+g.exteriorLength+g.interiorLeft)/2} y="292" textAnchor="middle" className="callout-title">SIN REACCIÓN DEL SUELO</text>{analysis && <><text x="94" y="357" className="sheet-notes">Mᵤ = Pᵤ,e × e = {n(analysis.factored.eccentricMomentKnM,1)} kN·m</text><text x="94" y="378" className="sheet-notes">Vᵥ = Mᵤ / S = {n(analysis.factored.strapShearKn,1)} kN</text><text x="94" y="399" className="sheet-notes">Rᵤ,e / Rᵤ,i = {n(analysis.factored.exteriorReactionKn,1)} / {n(analysis.factored.interiorReactionKn,1)} kN</text></>}</svg></figure>
}

export function StrapReinforcementSummary({ inputs, analysis }: Props) {
  if (!analysis) return <section className="sheet-empty">Analiza el caso para revisar el armado del sistema medianero.</section>
  const padRow = (label: string, pad: StrapFootingAnalysis['pads']['exterior']) => <><div><dt>{label} · longitudinal</dt><dd>Ø{n(inputs.barDiameterM*1000,0)} @ {n(inputs.padLongitudinalBarSpacingM)} m · {n(pad.longitudinal.reinforcement.providedAreaPerMeterMm2/100)} cm²/m</dd></div><div><dt>{label} · transversal</dt><dd>Ø{n(inputs.barDiameterM*1000,0)} @ {n(inputs.padTransverseBarSpacingM)} m · {n(pad.transverse.reinforcement.providedAreaPerMeterMm2/100)} cm²/m</dd></div></>
  return <section className="strip-rebar-summary"><header><span>ARMADO PRELIMINAR</span><h3>Dos bases y viga centradora</h3></header><dl>{padRow('Base medianera', analysis.pads.exterior)}{padRow('Base interior', analysis.pads.interior)}<div><dt>Viga · acero longitudinal</dt><dd>{inputs.beamLongitudinalBarCount} Ø{n(inputs.barDiameterM*1000,0)} · colocado {n(analysis.beam.providedLongitudinalAreaMm2/100)} cm²</dd></div><div><dt>Viga · acero requerido</dt><dd>{analysis.beam.requiredLongitudinalAreaMm2 === null ? 'Sección insuficiente' : `${n(analysis.beam.requiredLongitudinalAreaMm2/100)} cm²`}</dd></div><div><dt>Punzonamiento en encuentros</dt><dd>Fuera de alcance · revisión especializada</dd></div></dl><p>La aplicación no define estribos, nudos ni plano constructivo definitivo.</p></section>
}
