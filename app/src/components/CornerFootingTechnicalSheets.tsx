import type { CornerFootingAnalysis } from '../application/corner-footing-analysis'
import type { CornerFootingInputs } from '../domain/projects'

type Props = { inputs: CornerFootingInputs; analysis: CornerFootingAnalysis | null }
const n = (value: number, decimals = 2) => value.toFixed(decimals)
const cornerName: Record<CornerFootingInputs['cornerPosition'], string> = { 'bottom-left': 'inferior izquierda', 'bottom-right': 'inferior derecha', 'top-left': 'superior izquierda', 'top-right': 'superior derecha' }

const columnRect = (inputs: CornerFootingInputs) => {
  const left = inputs.cornerPosition.endsWith('left')
  const bottom = inputs.cornerPosition.startsWith('bottom')
  const width = Math.max(38, 500 * inputs.columnLengthM / inputs.footingLengthM)
  const height = Math.max(38, 250 * inputs.columnWidthM / inputs.footingWidthM)
  return { x: left ? 130 : 630 - width, y: bottom ? 315 - height : 65, width, height }
}

export function CornerFootingPlanSheet({ inputs, analysis }: Props) {
  const column = columnRect(inputs)
  const q = analysis?.contact.gross.cornerPressuresKpa
  const resultantX = analysis ? 130 + 500 * (analysis.geometry.centroidXM + analysis.contact.gross.eccentricityXM) / inputs.footingLengthM : 0
  const resultantY = analysis ? 315 - 250 * (analysis.geometry.centroidYM + analysis.contact.gross.eccentricityYM) / inputs.footingWidthM : 0
  return <figure className="engineering-sheet corner-sheet"><figcaption><span>PLANTA GENERAL</span><strong>Zapata de esquina · presión biaxial</strong><small>Dos caras de columna coinciden con linderos adyacentes.</small></figcaption><svg viewBox="0 0 760 430" role="img" aria-label="Planta de zapata de esquina"><rect x="130" y="65" width="500" height="250" className="footing-line"/><line x1="130" y1="190" x2="630" y2="190" className="axis-line"/><line x1="380" y1="65" x2="380" y2="315" className="axis-line"/><line x1={inputs.cornerPosition.endsWith('left') ? 130 : 630} y1="38" x2={inputs.cornerPosition.endsWith('left') ? 130 : 630} y2="338" className="critical-line"/><line x1="100" y1={inputs.cornerPosition.startsWith('bottom') ? 315 : 65} x2="660" y2={inputs.cornerPosition.startsWith('bottom') ? 315 : 65} className="critical-line"/><rect x={column.x} y={column.y} width={column.width} height={column.height} className="column-line"/><text x={column.x + column.width/2} y={column.y + column.height/2 + 4} textAnchor="middle" className="column-label">C</text>{analysis && <><circle cx={resultantX} cy={resultantY} r="7" className="load-line"/><line x1={resultantX-14} y1={resultantY} x2={resultantX+14} y2={resultantY} className="load-line"/><line x1={resultantX} y1={resultantY-14} x2={resultantX} y2={resultantY+14} className="load-line"/><text x={resultantX+10} y={resultantY-12} className="load-label">R</text><text x="140" y="86" className="sheet-notes">{n(q!.topLeft,1)}</text><text x="620" y="86" textAnchor="end" className="sheet-notes">{n(q!.topRight,1)}</text><text x="140" y="304" className="sheet-notes">{n(q!.bottomLeft,1)}</text><text x="620" y="304" textAnchor="end" className="sheet-notes">{n(q!.bottomRight,1)}</text><text x="380" y="342" textAnchor="middle" className="sheet-notes">κ = 6|ex|/L + 6|ey|/B = {n(analysis.contact.gross.kernInteraction,3)} ≤ 1.000</text></>}<line x1="130" y1="370" x2="630" y2="370" className="dimension"/><text x="380" y="392" textAnchor="middle" className="dimension-label">L = {n(inputs.footingLengthM)} m</text><line x1="82" y1="65" x2="82" y2="315" className="dimension"/><text x="62" y="190" transform="rotate(-90 62 190)" textAnchor="middle" className="dimension-label">B = {n(inputs.footingWidthM)} m</text><text x="380" y="420" textAnchor="middle" className="sheet-notes">Presiones en kPa · esquina {cornerName[inputs.cornerPosition]}</text></svg></figure>
}

function DirectionSheet({ inputs, analysis, axis }: Props & { axis: 'x' | 'y' }) {
  const direction = analysis?.directions[axis]
  const length = axis === 'x' ? inputs.footingLengthM : inputs.footingWidthM
  const columnCenter = axis === 'x' ? (analysis?.geometry.columnCenterXM ?? inputs.columnLengthM/2) : (analysis?.geometry.columnCenterYM ?? inputs.columnWidthM/2)
  const columnSize = axis === 'x' ? inputs.columnLengthM : inputs.columnWidthM
  const sx = (value: number) => 110 + 540 * value / length
  const columnX = sx(columnCenter)
  const columnLength = Math.max(40, 540 * columnSize / length)
  const qStart = direction?.pressureStartKpa ?? 0
  const qEnd = direction?.pressureEndKpa ?? 0
  const qMax = Math.max(qStart, qEnd, 1)
  const yStart = 305 - 55*qStart/qMax
  const yEnd = 305 - 55*qEnd/qMax
  const maximumMoment = direction ? Math.max(...direction.diagram.map((point) => Math.abs(point.momentKnM)), 1) : 1
  const path = direction?.diagram.map((point,index) => `${index ? 'L' : 'M'}${sx(point.coordinateM)},${368-point.momentKnM/maximumMoment*36}`).join(' ') ?? ''
  return <figure className="engineering-sheet corner-sheet"><figcaption><span>SECCIÓN {axis.toUpperCase()}–{axis.toUpperCase()}</span><strong>Equilibrio direccional en {axis.toUpperCase()}</strong><small>Promedio de la presión plana sobre la dimensión perpendicular.</small></figcaption><svg viewBox="0 0 760 430" role="img" aria-label={`Sección direccional ${axis}`}><rect x="110" y="175" width="540" height="62" className="footing-line"/><rect x={columnX-columnLength/2} y="72" width={columnLength} height="103" className="column-line"/><line x1={columnX} y1="30" x2={columnX} y2="62" className="load-line"/><text x={columnX+8} y="44" className="load-label">Pᵤ</text>{direction && <><path d={`M110 305 L110 ${yStart} L650 ${yEnd} L650 305 Z`} className="pressure-fill"/><line x1="110" y1={yStart} x2="650" y2={yEnd} className="pressure-line"/><text x="116" y="326" className="sheet-notes">q inicio = {n(qStart,1)} kPa</text><text x="644" y="326" textAnchor="end" className="sheet-notes">q final = {n(qEnd,1)} kPa</text><line x1="110" y1="368" x2="650" y2="368" className="axis-line"/><path d={path} className="moment-line"/><text x="116" y="356" className="sheet-notes">M cara gob. = {n(direction.governingFlexureDemandKnM,2)} kN·m</text></>}<line x1="110" y1="405" x2="650" y2="405" className="dimension"/><text x="380" y="426" textAnchor="middle" className="dimension-label">{axis === 'x' ? 'L' : 'B'} = {n(length)} m · cierre V={direction ? n(direction.endShearKn,6) : '—'} kN</text></svg></figure>
}

export function CornerFootingSectionSheets(props: Props) { return <div className="new-section-grid"><DirectionSheet {...props} axis="x"/><DirectionSheet {...props} axis="y"/></div> }

export function CornerReinforcementSummary({ inputs, analysis }: Props) {
  if (!analysis) return <section className="sheet-empty">Analiza el caso para revisar el armado de la zapata de esquina.</section>
  const status = (value: string) => value === 'meets-guide-reference' ? 'Dentro de referencia' : value === 'section-insufficient' ? 'Sección insuficiente' : 'Requiere ajuste'
  return <section className="strip-rebar-summary"><header><span>ARMADO PRELIMINAR</span><h3>Malla inferior en X y Y</h3></header><dl><div><dt>Dirección X</dt><dd>Ø{n(inputs.barDiameterM*1000,0)} @ {n(inputs.longitudinalBarSpacingM)} m · {n(analysis.reinforcement.x.providedAreaPerMeterMm2/100)} cm²/m</dd></div><div><dt>Estado X</dt><dd>{status(analysis.reinforcement.x.status)}</dd></div><div><dt>Dirección Y</dt><dd>Ø{n(inputs.barDiameterM*1000,0)} @ {n(inputs.transverseBarSpacingM)} m · {n(analysis.reinforcement.y.providedAreaPerMeterMm2/100)} cm²/m</dd></div><div><dt>Estado Y</dt><dd>{status(analysis.reinforcement.y.status)}</dd></div><div><dt>Desarrollo requerido</dt><dd>{n(analysis.development.requiredDevelopmentLengthM)} m</dd></div><div><dt>Punzonamiento</dt><dd>No evaluado · perímetro de esquina</dd></div></dl><p>La distribución es preliminar y no constituye plano constructivo ni resuelve el anclaje junto a los dos linderos.</p></section>
}
