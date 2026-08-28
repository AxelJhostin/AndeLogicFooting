import type { FootingInputs } from '../domain/projects'
import type { ServiceContactResult } from '../domain/footing/service-contact'
import type { OneWayShearDemandResult } from '../domain/footing/one-way-shear-demand'
import type { GuidePunchingShearResult } from '../domain/footing/punching-shear-guide-check'
import type { ReinforcementLayoutResult } from '../domain/footing/reinforcement-layout'

type Props = {
  view: 'section' | 'plan'
  inputs: FootingInputs
  contact: ServiceContactResult | null
  oneWay: OneWayShearDemandResult | null
  punching: GuidePunchingShearResult | null
  reinforcement: ReinforcementLayoutResult | null
}

const safe = (value: number) => Number.isFinite(value) && value > 0
const lines = (count: number, origin: number, length: number): number[] => {
  const visible = Math.max(2, Math.min(count, 9))
  return Array.from({ length: visible }, (_, index) => origin + length * index / (visible - 1))
}

export function FootingTechnicalPlate({ view, inputs, contact, oneWay, punching, reinforcement }: Props) {
  const { footingWidthM: B, footingLengthM: L, footingThicknessM: h, columnWidthM: cB, columnLengthM: cL, concreteCoverM: cover, barDiameterM: db } = inputs
  if (![B, L, h, cB, cL].every(safe)) return null

  const planScale = Math.min(210 / B, 150 / L)
  const planW = B * planScale
  const planH = L * planScale
  const planX = 82 + (210 - planW) / 2
  const planY = 74 + (150 - planH) / 2
  const colW = cB * planScale
  const colH = cL * planScale
  const colX = planX + (planW - colW) / 2
  const colY = planY + (planH - colH) / 2
  const d = Math.max(0, h - cover - db / 2)
  const punchOffset = punching ? d / 2 : inputs.punchingCriticalSectionOffsetM
  const punchX = colX - punchOffset * planScale
  const punchY = colY - punchOffset * planScale
  const punchW = colW + 2 * punchOffset * planScale
  const punchH = colH + 2 * punchOffset * planScale
  const sectionScale = Math.min(290 / Math.max(B, L), 112 / h)
  const sectionH = h * sectionScale
  const sectionY = 508 - sectionH
  const barsA = reinforcement ? lines(reinforcement.barsParallelToLength.count, 48, 290) : []
  const barsB = reinforcement ? lines(reinforcement.barsParallelToWidth.count, 520, 290) : []

  return (
    <figure className="technical-plate" id="view-plan">
      <figcaption>
        <div><span>Lámina de cálculo · representación del caso</span><strong>Geometría, secciones críticas y armado preliminar</strong></div>
        <p>Los elementos violetas y azules aparecen cuando su módulo tiene resultado.</p>
      </figcaption>
      <svg viewBox={view === 'plan' ? '0 0 920 280' : '0 260 920 330'} role="img" aria-label="Lámina técnica de zapata con planta, punzonamiento y secciones transversales">
        <defs>
          <pattern id="plate-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" /></pattern>
          <marker id="plate-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M0 0 L7 3.5 L0 7z" /></marker>
        </defs>
        {view === 'plan' && <>
        <text x="40" y="34" className="plate-title">PLANTA</text>
        <rect x={planX} y={planY} width={planW} height={planH} className="plate-footing" />
        <rect x={colX} y={colY} width={colW} height={colH} className="plate-column" />
        <line x1={planX} y1={colY + colH / 2} x2={planX + planW} y2={colY + colH / 2} className="plate-cut" />
        <line x1={colX + colW / 2} y1={planY} x2={colX + colW / 2} y2={planY + planH} className="plate-cut" />
        <text x={planX - 16} y={colY + colH / 2 + 4} className="plate-cut-label">A</text><text x={planX + planW + 9} y={colY + colH / 2 + 4} className="plate-cut-label">A</text>
        <text x={colX + colW / 2 - 3} y={planY - 9} className="plate-cut-label">B</text><text x={colX + colW / 2 - 3} y={planY + planH + 17} className="plate-cut-label">B</text>
        <line x1={planX} y1={planY + planH + 25} x2={planX + planW} y2={planY + planH + 25} className="plate-dimension" markerStart="url(#plate-arrow)" markerEnd="url(#plate-arrow)" />
        <text x={planX + planW / 2} y={planY + planH + 40} textAnchor="middle" className="plate-dimension-text">B = {B.toFixed(2)} m</text>
        <line x1={planX - 22} y1={planY} x2={planX - 22} y2={planY + planH} className="plate-dimension" markerStart="url(#plate-arrow)" markerEnd="url(#plate-arrow)" />
        <text x={planX - 31} y={planY + planH / 2} textAnchor="middle" transform={`rotate(-90 ${planX - 31} ${planY + planH / 2})`} className="plate-dimension-text">L = {L.toFixed(2)} m</text>

        <text x="390" y="34" className="plate-title">PUNZONAMIENTO · PLANTA CRÍTICA</text>
        <rect x="408" y="58" width="260" height="184" className="plate-panel" />
        <rect x={438 + (210 - planW) / 2} y={74 + (150 - planH) / 2} width={planW} height={planH} className="plate-footing soft" />
        {punching && <rect x={438 + (punchX - planX)} y={74 + (punchY - planY)} width={punchW} height={punchH} className="plate-punch-area" />}
        <rect x={438 + (colX - planX)} y={74 + (colY - planY)} width={colW} height={colH} className="plate-column" />
        {punching ? <>
          <text x="684" y="92" className="plate-note-title">Perímetro crítico</text>
          <text x="684" y="110" className="plate-note">b₀ = {punching.criticalPerimeterM.toFixed(2)} m</text>
          <text x="684" y="129" className="plate-note">Vᵤ = {punching.shearDemandKn.toFixed(1)} kN</text>
          <text x="684" y="148" className="plate-note">Uso = {(punching.utilization * 100).toFixed(0)}%</text>
        </> : <text x="684" y="110" className="plate-note">Calcula punzonamiento para mostrar el perímetro.</text>}
        </>}

        {view === 'section' && <>
        <text x="40" y="316" className="plate-title">SECCIÓN A–A</text>
        <Section x={48} width={290} columnWidth={cB * sectionScale} totalWidth={B * sectionScale} sectionY={sectionY} sectionH={sectionH} columnHeight={115} label={`B = ${B.toFixed(2)} m`} bars={barsA} d={d} scale={sectionScale} oneWay={oneWay?.widthDirection.shearDemandKn ?? null} />
        <text x="510" y="316" className="plate-title">SECCIÓN B–B</text>
        <Section x={520} width={290} columnWidth={cL * sectionScale} totalWidth={L * sectionScale} sectionY={sectionY} sectionH={sectionH} columnHeight={115} label={`L = ${L.toFixed(2)} m`} bars={barsB} d={d} scale={sectionScale} oneWay={oneWay?.lengthDirection.shearDemandKn ?? null} />
        </>}
        {contact && <text x="40" y={view === 'plan' ? 260 : 565} className="plate-summary">Contacto de servicio: {contact.pressureForComparisonKpa.toFixed(1)} / {contact.allowableBearingKpa.toFixed(1)} kPa · {(contact.utilization * 100).toFixed(0)}%</text>}
      </svg>
      <p>Geometría y cotas siempre visibles. Perímetros, demandas y barras aparecen solo si el módulo correspondiente ha sido calculado; no constituye plano constructivo.</p>
    </figure>
  )
}

type SectionProps = { x: number; width: number; columnWidth: number; totalWidth: number; sectionY: number; sectionH: number; columnHeight: number; label: string; bars: number[]; d: number; scale: number; oneWay: number | null }

function Section({ x, width, columnWidth, totalWidth, sectionY, sectionH, columnHeight, label, bars, d, scale, oneWay }: SectionProps) {
  const footingX = x + (width - totalWidth) / 2
  const columnX = x + (width - columnWidth) / 2
  const barY = sectionY + sectionH - 11
  const criticalX = columnX + columnWidth / 2 + d * scale
  return <g>
    <rect x={footingX} y={sectionY} width={totalWidth} height={sectionH} className="plate-section-footing" />
    <rect x={columnX} y={sectionY - columnHeight} width={columnWidth} height={columnHeight} className="plate-section-column" />
    {bars.map((bar) => <circle key={bar} cx={bar} cy={barY} r="3" className="plate-bar" />)}
    <line x1={footingX} y1={sectionY + sectionH + 18} x2={footingX + totalWidth} y2={sectionY + sectionH + 18} className="plate-dimension" markerStart="url(#plate-arrow)" markerEnd="url(#plate-arrow)" />
    <text x={footingX + totalWidth / 2} y={sectionY + sectionH + 33} textAnchor="middle" className="plate-dimension-text">{label}</text>
    <line x1={footingX - 14} y1={sectionY} x2={footingX - 14} y2={sectionY + sectionH} className="plate-dimension" markerStart="url(#plate-arrow)" markerEnd="url(#plate-arrow)" />
    <text x={footingX - 23} y={sectionY + sectionH / 2} textAnchor="middle" transform={`rotate(-90 ${footingX - 23} ${sectionY + sectionH / 2})`} className="plate-dimension-text">h = {(sectionH / scale).toFixed(2)} m</text>
    {oneWay !== null && <><line x1={criticalX} y1={sectionY - 12} x2={criticalX} y2={sectionY + sectionH + 5} className="plate-critical-line" /><text x={criticalX + 5} y={sectionY + 14} className="plate-note">Vᵤ = {oneWay.toFixed(1)} kN</text></>}
    {bars.length > 0 && <text x={footingX} y={sectionY + sectionH - 20} className="plate-rebar-note">Barras inferiores · distribución calculada</text>}
  </g>
}
