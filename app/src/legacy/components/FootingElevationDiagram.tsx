import type { FootingInputs } from '../domain/projects'

type FootingElevationDiagramProps = Pick<FootingInputs, 'footingWidthM' | 'columnWidthM' | 'footingThicknessM'>

export function FootingElevationDiagram({ footingWidthM, columnWidthM, footingThicknessM }: FootingElevationDiagramProps) {
  const values = [footingWidthM, columnWidthM, footingThicknessM]
  const isValid = values.every((value) => Number.isFinite(value) && value > 0)
  if (!isValid) {
    return (
      <figure className="footing-diagram diagram-unavailable">
        <figcaption>
          <span>Elevación técnica</span>
          <strong>Completa las dimensiones para mostrar el corte</strong>
        </figcaption>
      </figure>
    )
  }

  const scale = 270 / Math.max(footingWidthM, footingThicknessM * 1.6)
  const footingWidth = footingWidthM * scale
  const footingHeight = footingThicknessM * scale
  const columnWidth = columnWidthM * scale
  const centerX = 280
  const footingX = centerX - footingWidth / 2
  const footingY = 205
  const columnX = centerX - columnWidth / 2

  return (
    <figure className="footing-diagram">
      <figcaption>
        <span>Elevación técnica</span>
        <strong>Corte transversal B - h</strong>
      </figcaption>
      <svg viewBox="0 0 560 330" role="img" aria-labelledby="footing-elevation-title footing-elevation-description">
        <title id="footing-elevation-title">Elevación de zapata aislada rectangular</title>
        <desc id="footing-elevation-description">Corte esquemático de columna centrada sobre zapata con espesor ingresado.</desc>
        <defs>
          <marker id="elevation-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
          </marker>
          <pattern id="soil-hatch" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 0 16 L 16 0" stroke="currentColor" strokeWidth="0.6" opacity="0.12" />
          </pattern>
        </defs>
        <rect x="25" y="24" width="510" height="250" rx="2" className="diagram-frame" />
        <path d={`M 25 ${footingY + footingHeight} H 535 V 274 H 25 Z`} fill="url(#soil-hatch)" className="diagram-grid" />
        <rect x={columnX} y="62" width={columnWidth} height={footingY - 62} className="column-shape" />
        <rect x={footingX} y={footingY} width={footingWidth} height={footingHeight} className="footing-shape" />
        <line x1={centerX} y1="39" x2={centerX} y2="55" className="load-arrow" markerEnd="url(#elevation-arrow)" />
        <text x={centerX + 12} y="49" className="diagram-label">P</text>
        <line x1={footingX} y1="294" x2={footingX + footingWidth} y2="294" className="dimension-line" markerStart="url(#elevation-arrow)" markerEnd="url(#elevation-arrow)" />
        <line x1={footingX} y1={footingY + footingHeight + 3} x2={footingX} y2="304" className="extension-line" />
        <line x1={footingX + footingWidth} y1={footingY + footingHeight + 3} x2={footingX + footingWidth} y2="304" className="extension-line" />
        <text x={centerX} y="318" textAnchor="middle" className="dimension-text">B = {footingWidthM.toFixed(3)} m</text>
        <line x1={footingX - 20} y1={footingY} x2={footingX - 20} y2={footingY + footingHeight} className="dimension-line" markerStart="url(#elevation-arrow)" markerEnd="url(#elevation-arrow)" />
        <text x={footingX - 30} y={footingY + footingHeight / 2} textAnchor="middle" transform={`rotate(-90 ${footingX - 30} ${footingY + footingHeight / 2})`} className="dimension-text">h = {footingThicknessM.toFixed(3)} m</text>
        <text x={centerX} y="102" textAnchor="middle" className="column-text">COLUMNA</text>
      </svg>
      <p>El espesor es una entrada geométrica experimental; no implica verificación de cortante, punzonamiento o flexión.</p>
    </figure>
  )
}
