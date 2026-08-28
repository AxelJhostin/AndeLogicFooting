import type { FootingInputs } from '../domain/projects'
import type { ServiceContactResult } from '../domain/footing/service-contact'
import type { OneWayShearDemandResult } from '../domain/footing/one-way-shear-demand'
import type { GuidePunchingShearResult } from '../domain/footing/punching-shear-guide-check'
import type { FlexureDemandResult } from '../domain/footing/flexure-demand'
import type { ReinforcementLayoutResult } from '../domain/footing/reinforcement-layout'

type Props = Pick<FootingInputs, 'footingWidthM' | 'footingLengthM' | 'columnWidthM' | 'columnLengthM'> & {
  contact: ServiceContactResult | null
  oneWay: OneWayShearDemandResult | null
  punching: GuidePunchingShearResult | null
  flexure: FlexureDemandResult | null
  reinforcement: ReinforcementLayoutResult | null
}

const scaledLines = (count: number, start: number, span: number) => {
  const visible = Math.max(2, Math.min(count, 11))
  return Array.from({ length: visible }, (_, index) => start + span * index / (visible - 1))
}

export function FootingAnalysisDiagram({ contact, oneWay, punching, flexure, reinforcement, ...dimensions }: Props) {
  const isValid = Object.values(dimensions).every((value) => Number.isFinite(value) && value > 0)
  if (!isValid) return null

  const maxWidth = 350
  const maxLength = 228
  const scale = Math.min(maxWidth / dimensions.footingWidthM, maxLength / dimensions.footingLengthM)
  const footingWidth = dimensions.footingWidthM * scale
  const footingLength = dimensions.footingLengthM * scale
  const footingX = 105 + (maxWidth - footingWidth) / 2
  const footingY = 64 + (maxLength - footingLength) / 2
  const columnWidth = dimensions.columnWidthM * scale
  const columnLength = dimensions.columnLengthM * scale
  const columnX = footingX + (footingWidth - columnWidth) / 2
  const columnY = footingY + (footingLength - columnLength) / 2
  const effectiveDepth = oneWay?.effectiveDepthM ?? 0
  const depthPx = effectiveDepth * scale
  const punchingWidth = punching ? (dimensions.columnWidthM + effectiveDepth) * scale : 0
  const punchingLength = punching ? (dimensions.columnLengthM + effectiveDepth) * scale : 0
  const punchingX = columnX - depthPx / 2
  const punchingY = columnY - depthPx / 2
  const barsB = reinforcement ? scaledLines(reinforcement.barsParallelToWidth.count, footingY + 12, footingLength - 24) : []
  const barsL = reinforcement ? scaledLines(reinforcement.barsParallelToLength.count, footingX + 12, footingWidth - 24) : []

  return (
    <figure className="footing-analysis-diagram">
      <figcaption>
        <div>
          <span>Lectura gráfica de resultados</span>
          <strong>Planta de la zapata con las revisiones calculadas</strong>
        </div>
        <p>Los trazos aparecen únicamente cuando calculas su módulo.</p>
      </figcaption>
      <svg viewBox="0 0 560 390" role="img" aria-label="Representación en planta de la zapata con resultados de contacto, cortante, punzonamiento, flexión y armado">
        <defs>
          <pattern id="analysis-grid" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M 0 14 L 14 0" /></pattern>
          <linearGradient id="pressure-fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#58cdbb" stopOpacity=".42" /><stop offset="1" stopColor="#174451" stopOpacity=".72" /></linearGradient>
        </defs>
        <rect x="26" y="24" width="508" height="306" rx="3" className="analysis-frame" />
        <rect x={footingX} y={footingY} width={footingWidth} height={footingLength} className="analysis-footing" />
        <rect x={footingX} y={footingY} width={footingWidth} height={footingLength} fill="url(#analysis-grid)" className="analysis-grid" />

        {barsB.map((y) => <line key={`b-${y}`} x1={footingX + 8} y1={y} x2={footingX + footingWidth - 8} y2={y} className="analysis-bar" />)}
        {barsL.map((x) => <line key={`l-${x}`} x1={x} y1={footingY + 8} x2={x} y2={footingY + footingLength - 8} className="analysis-bar secondary" />)}

        {oneWay && depthPx > 0 && <>
          <line x1={columnX - depthPx} y1={footingY} x2={columnX - depthPx} y2={footingY + footingLength} className="analysis-shear" />
          <line x1={columnX + columnWidth + depthPx} y1={footingY} x2={columnX + columnWidth + depthPx} y2={footingY + footingLength} className="analysis-shear" />
          <line x1={footingX} y1={columnY - depthPx} x2={footingX + footingWidth} y2={columnY - depthPx} className="analysis-shear" />
          <line x1={footingX} y1={columnY + columnLength + depthPx} x2={footingX + footingWidth} y2={columnY + columnLength + depthPx} className="analysis-shear" />
        </>}
        {punching && <rect x={punchingX} y={punchingY} width={punchingWidth} height={punchingLength} className={punching.status === 'meets-guide-reference' ? 'analysis-punching pass' : 'analysis-punching fail'} />}
        <rect x={columnX} y={columnY} width={columnWidth} height={columnLength} className="analysis-column" />
        <text x={columnX + columnWidth / 2} y={columnY + columnLength / 2 + 4} textAnchor="middle" className="analysis-column-text">COLUMNA</text>

        {contact && <g className="analysis-callout"><rect x="42" y="43" width="166" height="42" rx="3" /><text x="52" y="60">PRESIÓN DE CONTACTO</text><text x="52" y="76">{contact.pressureForComparisonKpa.toFixed(1)} / {contact.allowableBearingKpa.toFixed(1)} kPa</text></g>}
        {oneWay && <g className="analysis-callout"><rect x="340" y="43" width="157" height="42" rx="3" /><text x="350" y="60">CORTANTE A d</text><text x="350" y="76">B {oneWay.widthDirection.shearDemandKn.toFixed(1)} · L {oneWay.lengthDirection.shearDemandKn.toFixed(1)} kN</text></g>}
        {punching && <g className={`analysis-callout punch ${punching.status === 'meets-guide-reference' ? 'pass' : 'fail'}`}><rect x="340" y="286" width="157" height="43" rx="3" /><text x="350" y="303">PUNZONAMIENTO</text><text x="350" y="319">Vᵤ {punching.shearDemandKn.toFixed(1)} kN · {(punching.utilization * 100).toFixed(0)}%</text></g>}
        {reinforcement && <text x="43" y="315" className="analysis-note">Malla inferior: {reinforcement.barsParallelToWidth.count} barras ∥ B · {reinforcement.barsParallelToLength.count} barras ∥ L</text>}
        {flexure && <text x="43" y="300" className="analysis-note">Flexión en cara de columna: Mᵤ B = {flexure.widthDirection.momentDemandKnM.toFixed(1)} · L = {flexure.lengthDirection.momentDemandKnM.toFixed(1)} kN·m</text>}
      </svg>
      <div className="analysis-legend">
        <span><i className="contact" /> Presión uniforme calculada</span>
        <span><i className="shear" /> Secciones de cortante a d</span>
        <span><i className="punching" /> Perímetro de punzonamiento</span>
        <span><i className="bars" /> Distribución de barras</span>
      </div>
      <p className="diagram-limit">Es una representación de las hipótesis y resultados ingresados, no un plano de construcción ni una aprobación normativa.</p>
    </figure>
  )
}
