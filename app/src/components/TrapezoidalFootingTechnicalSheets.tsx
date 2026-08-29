import type { TrapezoidalFootingAnalysis } from '../application/trapezoidal-footing-analysis'
import type { TrapezoidalFootingInputs } from '../domain/projects'

type Props = { inputs: TrapezoidalFootingInputs; analysis: TrapezoidalFootingAnalysis | null }
const n = (value:number,decimals=2)=>value.toFixed(decimals)
const sx=(x:number,length:number)=>90+580*x/length

export function TrapezoidalFootingPlanSheet({ inputs, analysis }: Props) {
  const maxWidth=Math.max(inputs.leftFootingWidthM,inputs.rightFootingWidthM)
  const leftH=220*inputs.leftFootingWidthM/maxWidth
  const rightH=220*inputs.rightFootingWidthM/maxWidth
  const cy=190
  const x1=sx(inputs.column1CenterFromLeftM,inputs.footingLengthM)
  const x2=sx(inputs.column2CenterFromLeftM,inputs.footingLengthM)
  const c1L=Math.max(28,580*inputs.column1LengthM/inputs.footingLengthM)
  const c2L=Math.max(28,580*inputs.column2LengthM/inputs.footingLengthM)
  const c1W=Math.max(28,220*inputs.column1WidthM/maxWidth)
  const c2W=Math.max(28,220*inputs.column2WidthM/maxWidth)
  return <figure className="engineering-sheet trapezoidal-sheet"><figcaption><span>PLANTA GENERAL</span><strong>Zapata combinada trapezoidal</strong><small>Dos columnas interiores sobre el eje longitudinal; el ancho cambia linealmente.</small></figcaption><svg viewBox="0 0 760 420" role="img" aria-label="Planta de zapata combinada trapezoidal"><polygon points={`90,${cy-leftH/2} 670,${cy-rightH/2} 670,${cy+rightH/2} 90,${cy+leftH/2}`} className="footing-line"/><line x1="65" y1={cy} x2="695" y2={cy} className="axis-line"/><rect x={x1-c1L/2} y={cy-c1W/2} width={c1L} height={c1W} className="column-line"/><rect x={x2-c2L/2} y={cy-c2W/2} width={c2L} height={c2W} className="column-line"/><text x={x1} y={cy+4} textAnchor="middle" className="column-label">C1</text><text x={x2} y={cy+4} textAnchor="middle" className="column-label">C2</text>{analysis&&<><rect x={x1-Math.max(c1L+18,580*analysis.punching[0].criticalLengthM/inputs.footingLengthM)/2} y={cy-Math.max(c1W+18,220*analysis.punching[0].criticalWidthM/maxWidth)/2} width={Math.max(c1L+18,580*analysis.punching[0].criticalLengthM/inputs.footingLengthM)} height={Math.max(c1W+18,220*analysis.punching[0].criticalWidthM/maxWidth)} className="critical-perimeter"/><rect x={x2-Math.max(c2L+18,580*analysis.punching[1].criticalLengthM/inputs.footingLengthM)/2} y={cy-Math.max(c2W+18,220*analysis.punching[1].criticalWidthM/maxWidth)/2} width={Math.max(c2L+18,580*analysis.punching[1].criticalLengthM/inputs.footingLengthM)} height={Math.max(c2W+18,220*analysis.punching[1].criticalWidthM/maxWidth)} className="critical-perimeter"/><line x1={sx(analysis.geometry.centroidFromLeftM,inputs.footingLengthM)} y1="48" x2={sx(analysis.geometry.centroidFromLeftM,inputs.footingLengthM)} y2="335" className="critical-line"/><text x={sx(analysis.geometry.centroidFromLeftM,inputs.footingLengthM)+6} y="56" className="callout-title">x̄ = {n(analysis.geometry.centroidFromLeftM)} m</text></>}<line x1="90" y1="360" x2="670" y2="360" className="dimension"/><text x="380" y="380" textAnchor="middle" className="dimension-label">L = {n(inputs.footingLengthM)} m</text><line x1="62" y1={cy-leftH/2} x2="62" y2={cy+leftH/2} className="dimension"/><text x="47" y={cy} transform={`rotate(-90 47 ${cy})`} textAnchor="middle" className="dimension-label">B₁ = {n(inputs.leftFootingWidthM)} m</text><line x1="698" y1={cy-rightH/2} x2="698" y2={cy+rightH/2} className="dimension"/><text x="715" y={cy} transform={`rotate(-90 715 ${cy})`} textAnchor="middle" className="dimension-label">B₂ = {n(inputs.rightFootingWidthM)} m</text>{analysis&&<text x="380" y="410" textAnchor="middle" className="sheet-notes">A = {n(analysis.geometry.areaM2)} m² · qᵤ: {n(analysis.structural.factoredPressureLeftKpa,1)} → {n(analysis.structural.factoredPressureRightKpa,1)} kPa</text>}</svg></figure>
}

export function TrapezoidalFootingLongitudinalSheet({ inputs, analysis }: Props) {
  const x1=sx(inputs.column1CenterFromLeftM,inputs.footingLengthM)
  const x2=sx(inputs.column2CenterFromLeftM,inputs.footingLengthM)
  const c1=Math.max(34,580*inputs.column1LengthM/inputs.footingLengthM)
  const c2=Math.max(34,580*inputs.column2LengthM/inputs.footingLengthM)
  const maxMoment=analysis?Math.max(...analysis.longitudinal.diagram.map((point)=>Math.abs(point.momentKnM)),1):1
  const momentPath=analysis?analysis.longitudinal.diagram.map((point,index)=>`${index?'L':'M'}${sx(point.xM,inputs.footingLengthM)},${354-point.momentKnM/maxMoment*35}`).join(' '):''
  const qLeft=analysis?.structural.factoredPressureLeftKpa??0
  const qRight=analysis?.structural.factoredPressureRightKpa??0
  const qMax=Math.max(qLeft,qRight,1)
  const yLeft=300-qLeft/qMax*43
  const yRight=300-qRight/qMax*43
  return <figure className="engineering-sheet trapezoidal-sheet"><figcaption><span>SECCIÓN LONGITUDINAL A–A</span><strong>Presión lineal y reacción cuadrática</strong><small>El ancho variable transforma w(x)=q(x)B(x) en una carga distribuida cuadrática.</small></figcaption><svg viewBox="0 0 760 440" role="img" aria-label="Sección longitudinal de zapata trapezoidal"><defs><marker id="trapArrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill="#1b6799"/></marker></defs><line x1="55" y1="160" x2="705" y2="160" className="ground-line"/><rect x="90" y="176" width="580" height="66" className="footing-line"/><rect x={x1-c1/2} y="68" width={c1} height="108" className="column-line"/><rect x={x2-c2/2} y="68" width={c2} height="108" className="column-line"/><line x1={x1} y1="28" x2={x1} y2="58" className="load-line" markerEnd="url(#trapArrow)"/><line x1={x2} y1="28" x2={x2} y2="58" className="load-line" markerEnd="url(#trapArrow)"/><text x={x1+9} y="42" className="load-label">P₁</text><text x={x2+9} y="42" className="load-label">P₂</text>{analysis&&<><path d={`M90 300 L90 ${yLeft} L670 ${yRight} L670 300 Z`} className="pressure-fill"/><line x1="90" y1={yLeft} x2="670" y2={yRight} className="pressure-line"/><text x="96" y="320" className="sheet-notes">qᵤ,1 = {n(qLeft,1)} kPa</text><text x="548" y="320" className="sheet-notes">qᵤ,2 = {n(qRight,1)} kPa</text><line x1="90" y1="354" x2="670" y2="354" className="axis-line"/><path d={momentPath} className="moment-line"/><text x="96" y="342" className="sheet-notes">M⁺ = {n(analysis.longitudinal.maximumPositiveMomentKnM,1)} kN·m</text><text x="480" y="342" className="sheet-notes">M⁻ = {n(analysis.longitudinal.minimumNegativeMomentKnM,1)} kN·m</text></>}<line x1="90" y1="410" x2="670" y2="410" className="dimension"/><text x="380" y="430" textAnchor="middle" className="dimension-label">L = {n(inputs.footingLengthM)} m</text></svg></figure>
}

export function TrapezoidalReinforcementSummary({ inputs, analysis }: Props) {
  if(!analysis)return <section className="sheet-empty">Analiza el caso para revisar el armado trapezoidal.</section>
  const row=(label:string,spacing:number,result:TrapezoidalFootingAnalysis['reinforcement']['longitudinalBottom'])=><div><dt>{label}</dt><dd>Ø{n(inputs.barDiameterM*1000,0)} @ {n(spacing)} m · {n(result.providedAreaPerMeterMm2/100)} cm²/m</dd></div>
  return <section className="strip-rebar-summary"><header><span>ARMADO PRELIMINAR</span><h3>Zonas longitudinales y transversales</h3></header><dl>{row('Longitudinal inferior · M⁺',inputs.longitudinalBottomBarSpacingM,analysis.reinforcement.longitudinalBottom)}{row('Longitudinal superior · M⁻',inputs.longitudinalTopBarSpacingM,analysis.reinforcement.longitudinalTop)}{row('Transversal inferior',inputs.transverseBarSpacingM,analysis.reinforcement.transverse)}<div><dt>Cortante longitudinal gobernante</dt><dd>x={n(analysis.longitudinal.governingShearSection.xM)} m · η {n(analysis.longitudinal.governingShearSection.reference.utilization*100,1)}%</dd></div><div><dt>Punzonamiento gobernante</dt><dd>{n(Math.max(...analysis.punching.map((item)=>item.utilization))*100,1)}%</dd></div><div><dt>Desarrollo requerido</dt><dd>{n(analysis.development.requiredDevelopmentLengthM)} m</dd></div></dl><p>El detalle debe adaptar las longitudes de barra a los bordes inclinados; no constituye plano constructivo.</p></section>
}
