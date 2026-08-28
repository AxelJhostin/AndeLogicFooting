import type { FootingInputs } from '../domain/projects'
import type { ServiceContactResult } from '../domain/footing/service-contact'
import type { OneWayShearDemandResult } from '../domain/footing/one-way-shear-demand'
import type { GuidePunchingShearResult } from '../domain/footing/punching-shear-guide-check'
import type { ReinforcementLayoutResult } from '../domain/footing/reinforcement-layout'
import type { GuideReinforcementComparisonResult } from '../domain/footing/reinforcement-comparison'

type SheetProps = {
  inputs: FootingInputs
  contact: ServiceContactResult | null
  oneWay: OneWayShearDemandResult | null
  punching: GuidePunchingShearResult | null
  reinforcement: ReinforcementLayoutResult | null
  reinforcementCheck: GuideReinforcementComparisonResult | null
}

const valid = (...values: number[]) => values.every((value) => Number.isFinite(value) && value > 0)
const positions = (count: number, start: number, span: number): number[] => {
  const visible = Math.max(2, Math.min(count, 15))
  return Array.from({ length: visible }, (_, index) => start + span * index / (visible - 1))
}
const statusText = (status: 'meets-guide-reference' | 'below-guide-reference' | undefined) => status === 'meets-guide-reference' ? 'Dentro de referencia' : status === 'below-guide-reference' ? 'Requiere ajuste' : 'Pendiente'

function SheetFrame({ title, detail, children }: { title: string; detail: string; children: React.ReactNode }) {
  return <figure className="engineering-sheet"><figcaption><span>Lámina técnica</span><strong>{title}</strong><small>{detail}</small></figcaption>{children}</figure>
}

export function FootingPlanSheet({ inputs, oneWay, punching, reinforcement }: Pick<SheetProps, 'inputs' | 'oneWay' | 'punching' | 'reinforcement'>) {
  const { footingWidthM: B, footingLengthM: L, columnWidthM: cB, columnLengthM: cL } = inputs
  if (!valid(B, L, cB, cL)) return <SheetFrame title="Planta" detail="Completa dimensiones positivas para dibujar la lámina."><div className="sheet-empty">Calcula este módulo para mostrar su resultado en la lámina.</div></SheetFrame>
  const scale = Math.min(470 / B, 290 / L)
  const w = B * scale; const h = L * scale; const x = 165 + (470 - w) / 2; const y = 85 + (290 - h) / 2
  const cw = cB * scale; const ch = cL * scale; const cx = x + (w - cw) / 2; const cy = y + (h - ch) / 2
  const d = oneWay?.effectiveDepthM ?? 0
  const px = cx - d * scale / 2; const py = cy - d * scale / 2; const pw = cw + d * scale; const ph = ch + d * scale
  const barsB = reinforcement ? positions(reinforcement.barsParallelToWidth.count, y + 12, h - 24) : []
  const barsL = reinforcement ? positions(reinforcement.barsParallelToLength.count, x + 12, w - 24) : []
  return <SheetFrame title="Planta — geometría y secciones críticas" detail="Las líneas críticas aparecen solo con resultados calculados.">
    <svg viewBox="0 0 760 470" role="img" aria-label="Planta técnica de zapata aislada">
      <defs><pattern id="plan-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth=".4" /></pattern><pattern id="plan-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" stroke="currentColor" strokeWidth="1" /></pattern><marker id="plan-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M0 0 7 3.5 0 7z" /></marker></defs>
      <rect x="26" y="22" width="708" height="398" className="sheet-frame" /><rect x="26" y="22" width="708" height="398" fill="url(#plan-grid)" className="sheet-grid" />
      <text x="47" y="52" className="sheet-title">PLANTA · ZAPATA AISLADA RECTANGULAR</text>
      <line x1={x - 38} y1={cy + ch / 2} x2={x + w + 38} y2={cy + ch / 2} className="axis-line" /><line x1={cx + cw / 2} y1={y - 38} x2={cx + cw / 2} y2={y + h + 38} className="axis-line" />
      <text x={x + w + 44} y={cy + ch / 2 - 7} className="axis-label">A</text><text x={x - 49} y={cy + ch / 2 - 7} className="axis-label">A</text><text x={cx + cw / 2 + 7} y={y - 42} className="axis-label">B</text><text x={cx + cw / 2 + 7} y={y + h + 49} className="axis-label">B</text>
      {barsB.map((bar, index) => <line key={`b-${index}`} x1={x + 8} x2={x + w - 8} y1={bar} y2={bar} className="rebar-line" />)}
      {barsL.map((bar, index) => <line key={`l-${index}`} x1={bar} x2={bar} y1={y + 8} y2={y + h - 8} className="rebar-line secondary" />)}
      <rect x={x} y={y} width={w} height={h} className="footing-line" />
      {punching && <rect x={px} y={py} width={pw} height={ph} fill="url(#plan-hatch)" className="punching-line" />}
      <rect x={cx} y={cy} width={cw} height={ch} className="column-line" /><text x={cx + cw / 2} y={cy + ch / 2 + 4} textAnchor="middle" className="column-label">COLUMNA</text>
      {oneWay && <><line x1={cx - d * scale} y1={y} x2={cx - d * scale} y2={y + h} className="critical-line" /><line x1={cx + cw + d * scale} y1={y} x2={cx + cw + d * scale} y2={y + h} className="critical-line" /><line x1={x} y1={cy - d * scale} x2={x + w} y2={cy - d * scale} className="critical-line" /><line x1={x} y1={cy + ch + d * scale} x2={x + w} y2={cy + ch + d * scale} className="critical-line" /></>}
      <line x1={x} y1={y + h + 47} x2={x + w} y2={y + h + 47} className="dimension" markerStart="url(#plan-arrow)" markerEnd="url(#plan-arrow)" /><text x={x + w / 2} y={y + h + 66} textAnchor="middle" className="dimension-label">B = {B.toFixed(2)} m</text>
      <line x1={x - 46} y1={y} x2={x - 46} y2={y + h} className="dimension" markerStart="url(#plan-arrow)" markerEnd="url(#plan-arrow)" /><text x={x - 56} y={y + h / 2} transform={`rotate(-90 ${x - 56} ${y + h / 2})`} textAnchor="middle" className="dimension-label">L = {L.toFixed(2)} m</text>
      <line x1={cx + cw / 2} y1="68" x2={cx + cw / 2} y2={cy - 8} className="load-line" markerEnd="url(#plan-arrow)" /><text x={cx + cw / 2 + 10} y="68" className="load-label">P centrada</text>
      <g className="sheet-notes"><text x="548" y="90">Ejes y cortes: A–A / B–B</text>{punching && <><text x="548" y="112">b₀ = {punching.criticalPerimeterM.toFixed(2)} m</text><text x="548" y="134">Vᵤ = {punching.shearDemandKn.toFixed(1)} kN</text></>}{reinforcement && <text x="548" y={punching ? 156 : 112}>Malla inferior: {reinforcement.barsParallelToWidth.count} + {reinforcement.barsParallelToLength.count} barras</text>}</g>
    </svg>
  </SheetFrame>
}

export function FootingSectionSheet({ inputs, contact, oneWay, direction }: Pick<SheetProps, 'inputs' | 'contact' | 'oneWay'> & { direction: 'A–A' | 'B–B' }) {
  const { footingWidthM: B, footingLengthM: L, footingThicknessM: h, columnWidthM: cB, columnLengthM: cL, concreteCoverM: cover, barDiameterM: db } = inputs
  const span = direction === 'A–A' ? B : L; const column = direction === 'A–A' ? cB : cL
  if (!valid(span, column, h)) return <SheetFrame title={`Sección ${direction}`} detail="Completa dimensiones positivas para dibujar la lámina."><div className="sheet-empty">Calcula este módulo para mostrar su resultado en la lámina.</div></SheetFrame>
  const scale = Math.min(510 / span, 145 / h); const w = span * scale; const fh = h * scale; const x = 130 + (510 - w) / 2; const y = 250 - fh; const cw = column * scale; const cx = x + (w - cw) / 2; const d = oneWay?.effectiveDepthM ?? Math.max(0, h - cover - db / 2)
  const shear = direction === 'A–A' ? oneWay?.widthDirection.shearDemandKn : oneWay?.lengthDirection.shearDemandKn
  return <SheetFrame title={`Sección ${direction} — comportamiento transversal`} detail="Representación proporcional; el armado es preliminar y no constituye plano de obra.">
    <svg viewBox="0 0 760 390" role="img" aria-label={`Sección ${direction} de zapata`}>
      <defs><pattern id={`soil-${direction}`} width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12 12 0" stroke="currentColor" strokeWidth=".6" /></pattern><marker id={`section-arrow-${direction}`} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M0 0 7 3.5 0 7z" /></marker></defs>
      <rect x="26" y="22" width="708" height="338" className="sheet-frame" /><path d={`M27 ${y + fh}H733V360H27Z`} fill={`url(#soil-${direction})`} className="soil-area" /><line x1="27" y1={y - 15} x2="733" y2={y - 15} className="ground-line" /><text x="43" y={y - 22} className="ground-label">NIVEL DE TERRENO</text>
      <rect x={cx} y="70" width={cw} height={y - 70} className="column-line" /><rect x={x} y={y} width={w} height={fh} className="footing-fill" />
      {positions(9, x + 21, w - 42).map((bar, index) => <circle key={index} cx={bar} cy={y + fh - Math.max(8, (cover + db / 2) * scale)} r="4" className="section-bar" />)}
      <line x1={cx + cw / 2} y1="42" x2={cx + cw / 2} y2="61" className="load-line" markerEnd={`url(#section-arrow-${direction})`} /><text x={cx + cw / 2 + 10} y="50" className="load-label">Pᵤ</text>
      <line x1={x - 36} y1={y} x2={x - 36} y2={y + fh} className="dimension" markerStart={`url(#section-arrow-${direction})`} markerEnd={`url(#section-arrow-${direction})`} /><text x={x - 46} y={y + fh / 2} transform={`rotate(-90 ${x - 46} ${y + fh / 2})`} textAnchor="middle" className="dimension-label">h = {h.toFixed(3)} m</text>
      <line x1={x + w + 34} y1={y + fh - Math.max(8, (cover + db / 2) * scale)} x2={x + w + 34} y2={y + fh - d * scale} className="dimension" markerStart={`url(#section-arrow-${direction})`} markerEnd={`url(#section-arrow-${direction})`} /><text x={x + w + 46} y={y + fh - d * scale / 2} transform={`rotate(-90 ${x + w + 46} ${y + fh - d * scale / 2})`} textAnchor="middle" className="dimension-label">d = {d.toFixed(3)} m</text>
      <line x1={cx - d * scale} y1={y - 3} x2={cx - d * scale} y2={y + fh + 18} className="critical-line" /><line x1={cx + cw + d * scale} y1={y - 3} x2={cx + cw + d * scale} y2={y + fh + 18} className="critical-line" />
      <text x="65" y="320" className="sheet-notes">Recubrimiento: {cover.toFixed(3)} m · barra inferior Ø{(db * 1000).toFixed(0)} mm</text><text x="65" y="342" className="sheet-notes">{shear ? `Demanda de cortante ${direction}: Vᵤ = ${shear.toFixed(1)} kN` : 'Calcula cortante para mostrar la demanda y la sección crítica.'}</text>{contact && <text x="426" y="342" className="sheet-notes">q servicio = {contact.pressureForComparisonKpa.toFixed(1)} kPa</text>}
    </svg>
  </SheetFrame>
}

export function PunchingDetailSheet({ inputs, punching }: Pick<SheetProps, 'inputs' | 'punching'>) {
  const { footingWidthM: B, footingLengthM: L, columnWidthM: cB, columnLengthM: cL } = inputs
  if (!valid(B, L, cB, cL)) return <SheetFrame title="Detalle de punzonamiento" detail="Completa dimensiones para mostrar el perímetro."><div className="sheet-empty">Calcula este módulo para mostrar su resultado en la lámina.</div></SheetFrame>
  const scale = Math.min(290 / B, 230 / L); const w = B * scale; const h = L * scale; const x = 80 + (290 - w) / 2; const y = 106 + (230 - h) / 2; const cw = cB * scale; const ch = cL * scale; const cx = x + (w - cw) / 2; const cy = y + (h - ch) / 2; const offset = punching?.criticalSectionOffsetM ?? 0; const px = cx - offset * scale; const py = cy - offset * scale; const pw = cw + 2 * offset * scale; const ph = ch + 2 * offset * scale
  const state = statusText(punching?.status)
  return <SheetFrame title="Punzonamiento — perímetro crítico" detail="La trama y las llamadas se activan después de comparar la referencia de guía.">
    <svg viewBox="0 0 760 400" role="img" aria-label="Detalle técnico de punzonamiento"><defs><pattern id="punch-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" stroke="currentColor" strokeWidth="1" /></pattern></defs><rect x="26" y="22" width="708" height="346" className="sheet-frame" /><rect x={x} y={y} width={w} height={h} className="footing-line muted" />{punching ? <><rect x={px} y={py} width={pw} height={ph} fill="url(#punch-hatch)" className={`punching-line ${punching.status}`} /><rect x={cx} y={cy} width={cw} height={ch} className="column-line" /><path d={`M${px} ${py}H${px + pw}V${py + ph}H${px}Z`} className="punching-line" /><line x1={px + pw} y1={py} x2="514" y2="92" className="callout-line" /><text x="521" y="87" className="callout-title">PERÍMETRO CRÍTICO</text><text x="521" y="110" className="callout-value">b₀ = {punching.criticalPerimeterM.toFixed(2)} m</text><text x="521" y="143" className="callout-title">DISTANCIA A LA CARA</text><text x="521" y="166" className="callout-value">d/2 = {punching.criticalSectionOffsetM.toFixed(3)} m</text><text x="521" y="199" className="callout-title">DEMANDA</text><text x="521" y="222" className="callout-value">Vᵤ = {punching.shearDemandKn.toFixed(1)} kN</text><text x="521" y="255" className="callout-title">RESISTENCIA DE REFERENCIA</text><text x="521" y="278" className="callout-value">{punching.designShearStrengthKn.toFixed(1)} kN</text><rect x="521" y="300" width="164" height="40" className={`state-box ${punching.status}`} /><text x="534" y="317" className="state-title">{state}</text><text x="534" y="333" className="state-value">Utilización {(punching.utilization * 100).toFixed(1)}%</text></> : <><rect x={cx} y={cy} width={cw} height={ch} className="column-line" /><text x="420" y="205" className="sheet-empty-label">Calcula punzonamiento para mostrar b₀, Vᵤ y utilización.</text></>}</svg>
  </SheetFrame>
}

export function ReinforcementSheet({ inputs, reinforcement, reinforcementCheck }: Pick<SheetProps, 'inputs' | 'reinforcement' | 'reinforcementCheck'>) {
  const description = reinforcement ? `Distribución preliminar: Ø${(inputs.barDiameterM * 1000).toFixed(0)} mm.` : 'Calcula la distribución para mostrar cantidades y separación real.'
  return <SheetFrame title="Armado inferior — distribución preliminar" detail={description}><div className="reinforcement-summary"><div><span>Dirección B</span><strong>{reinforcement ? `${reinforcement.barsParallelToWidth.count} barras` : 'Pendiente'}</strong><small>{reinforcement ? `s = ${reinforcement.barsParallelToWidth.actualSpacingM.toFixed(3)} m` : '—'}</small><em>{reinforcementCheck ? `${(reinforcementCheck.widthDirection.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m colocada` : 'Sin comparación de acero'}</em></div><div><span>Dirección L</span><strong>{reinforcement ? `${reinforcement.barsParallelToLength.count} barras` : 'Pendiente'}</strong><small>{reinforcement ? `s = ${reinforcement.barsParallelToLength.actualSpacingM.toFixed(3)} m` : '—'}</small><em>{reinforcementCheck ? `${(reinforcementCheck.lengthDirection.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m colocada` : 'Sin comparación de acero'}</em></div></div><p className="sheet-disclaimer">Distribución preliminar de referencia. No constituye un plano constructivo definitivo ni una aprobación normativa.</p></SheetFrame>
}
