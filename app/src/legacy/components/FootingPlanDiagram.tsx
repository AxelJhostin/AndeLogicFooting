import type { FootingInputs } from '../domain/projects'
import { getFootingPlanGeometry } from '../domain/footing/plan-geometry'

type FootingPlanDiagramProps = Pick<
  FootingInputs,
  'footingWidthM' | 'footingLengthM' | 'columnWidthM' | 'columnLengthM'
> & { effectiveDepthM?: number; punchingCriticalSectionOffsetM?: number }

export function FootingPlanDiagram({ effectiveDepthM, punchingCriticalSectionOffsetM, ...dimensions }: FootingPlanDiagramProps) {
  const isValid = Object.values(dimensions).every((value) => Number.isFinite(value) && value > 0)
  if (!isValid) {
    return (
      <figure className="footing-diagram diagram-unavailable">
        <figcaption>
          <span>Vista técnica en planta</span>
          <strong>Completa dimensiones positivas para mostrar la geometría</strong>
        </figcaption>
        <p>La gráfica reaparecerá al ingresar dimensiones válidas de columna y zapata.</p>
      </figure>
    )
  }

  const geometry = getFootingPlanGeometry(dimensions)
  const centerX = 280
  const centerY = 150
  const footingX = centerX - geometry.footingWidth / 2
  const footingY = centerY - geometry.footingLength / 2
  const columnX = centerX - geometry.columnWidth / 2
  const columnY = centerY - geometry.columnLength / 2
  const scale = geometry.footingWidth / dimensions.footingWidthM
  const effectiveDepthPx = effectiveDepthM && effectiveDepthM > 0 ? effectiveDepthM * scale : null
  const criticalLeftX = effectiveDepthPx === null ? null : columnX - effectiveDepthPx
  const criticalRightX = effectiveDepthPx === null ? null : columnX + geometry.columnWidth + effectiveDepthPx
  const criticalTopY = effectiveDepthPx === null ? null : columnY - effectiveDepthPx
  const criticalBottomY = effectiveDepthPx === null ? null : columnY + geometry.columnLength + effectiveDepthPx
  const punchingOffsetPx = punchingCriticalSectionOffsetM && punchingCriticalSectionOffsetM > 0
    ? punchingCriticalSectionOffsetM * scale
    : null
  const punchingX = punchingOffsetPx === null ? null : columnX - punchingOffsetPx
  const punchingY = punchingOffsetPx === null ? null : columnY - punchingOffsetPx
  const punchingWidth = punchingOffsetPx === null ? null : geometry.columnWidth + 2 * punchingOffsetPx
  const punchingLength = punchingOffsetPx === null ? null : geometry.columnLength + 2 * punchingOffsetPx
  const punchingFits = punchingX !== null && punchingY !== null && punchingWidth !== null && punchingLength !== null
    && punchingX > footingX && punchingY > footingY
    && punchingX + punchingWidth < footingX + geometry.footingWidth
    && punchingY + punchingLength < footingY + geometry.footingLength

  return (
    <figure className="footing-diagram">
      <figcaption>
        <span>Vista técnica en planta</span>
        <strong>Zapata aislada rectangular · carga centrada</strong>
      </figcaption>
      <svg viewBox="0 0 560 330" role="img" aria-labelledby="footing-plan-title footing-plan-description">
        <title id="footing-plan-title">Vista en planta de la zapata aislada</title>
        <desc id="footing-plan-description">Columna centrada sobre una zapata rectangular con dimensiones editables.</desc>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
          </marker>
          <pattern id="soil-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 0 18 L 18 0" stroke="currentColor" strokeWidth="0.6" opacity="0.12" />
          </pattern>
        </defs>

        <rect x="25" y="24" width="510" height="250" rx="2" className="diagram-frame" />
        <rect x="25" y="24" width="510" height="250" rx="2" fill="url(#soil-grid)" className="diagram-grid" />

        <line x1={centerX} y1="45" x2={centerX} y2={columnY - 14} className="load-arrow" markerEnd="url(#arrow)" />
        <text x={centerX + 12} y="56" className="diagram-label">P</text>

        <rect x={footingX} y={footingY} width={geometry.footingWidth} height={geometry.footingLength} className="footing-shape" />
        <rect x={columnX} y={columnY} width={geometry.columnWidth} height={geometry.columnLength} className="column-shape" />
        {criticalLeftX !== null && criticalLeftX > footingX && (
          <line x1={criticalLeftX} y1={footingY} x2={criticalLeftX} y2={footingY + geometry.footingLength} className="critical-section-line" />
        )}
        {criticalRightX !== null && criticalRightX < footingX + geometry.footingWidth && (
          <line x1={criticalRightX} y1={footingY} x2={criticalRightX} y2={footingY + geometry.footingLength} className="critical-section-line" />
        )}
        {criticalTopY !== null && criticalTopY > footingY && (
          <line x1={footingX} y1={criticalTopY} x2={footingX + geometry.footingWidth} y2={criticalTopY} className="critical-section-line" />
        )}
        {criticalBottomY !== null && criticalBottomY < footingY + geometry.footingLength && (
          <line x1={footingX} y1={criticalBottomY} x2={footingX + geometry.footingWidth} y2={criticalBottomY} className="critical-section-line" />
        )}
        {punchingFits && (
          <rect x={punchingX!} y={punchingY!} width={punchingWidth!} height={punchingLength!} className="punching-perimeter" />
        )}
        <line x1={centerX - 9} y1={centerY} x2={centerX + 9} y2={centerY} className="center-line" />
        <line x1={centerX} y1={centerY - 9} x2={centerX} y2={centerY + 9} className="center-line" />

        <line x1={footingX} y1="294" x2={footingX + geometry.footingWidth} y2="294" className="dimension-line" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <line x1={footingX} y1={footingY + geometry.footingLength + 4} x2={footingX} y2="304" className="extension-line" />
        <line x1={footingX + geometry.footingWidth} y1={footingY + geometry.footingLength + 4} x2={footingX + geometry.footingWidth} y2="304" className="extension-line" />
        <text x={centerX} y="318" textAnchor="middle" className="dimension-text">B = {dimensions.footingWidthM.toFixed(3)} m</text>

        <line x1="48" y1={footingY} x2="48" y2={footingY + geometry.footingLength} className="dimension-line" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
        <line x1="58" y1={footingY} x2={footingX - 5} y2={footingY} className="extension-line" />
        <line x1="58" y1={footingY + geometry.footingLength} x2={footingX - 5} y2={footingY + geometry.footingLength} className="extension-line" />
        <text x="39" y={centerY} textAnchor="middle" transform={`rotate(-90 39 ${centerY})`} className="dimension-text">L = {dimensions.footingLengthM.toFixed(3)} m</text>

        <text x={centerX} y={centerY + 4} textAnchor="middle" className="column-text">COLUMNA</text>
      </svg>
      <p>La escala conserva proporciones. {effectiveDepthPx ? 'Las líneas discontinuas muestran las secciones evaluadas a d desde las caras de la columna. ' : ''}{punchingFits ? 'El rectángulo punteado marca el perímetro de punzonamiento declarado.' : 'La gráfica representa la geometría ingresada, no un detalle constructivo.'}</p>
    </figure>
  )
}
