import type { FlexureDemandResult } from '../domain/footing/flexure-demand'

export function FootingMomentDiagram({ result }: { result: FlexureDemandResult }) {
  const maxMoment = Math.max(result.widthDirection.momentDemandKnM, result.lengthDirection.momentDemandKnM, 1)
  const widthHeight = 96 * result.widthDirection.momentDemandKnM / maxMoment
  const lengthHeight = 96 * result.lengthDirection.momentDemandKnM / maxMoment

  return (
    <figure className="footing-diagram moment-diagram">
      <figcaption>
        <span>Diagrama de momentos</span>
        <strong>Demanda en la cara de la columna</strong>
      </figcaption>
      <svg viewBox="0 0 560 220" role="img" aria-label="Diagramas de momento de flexión en las direcciones B y L">
        <line x1="42" y1="168" x2="518" y2="168" className="dimension-line" />
        <path d={`M 88 168 L 184 ${168 - widthHeight} L 280 168 Z`} className="moment-shape" />
        <path d={`M 280 168 L 376 ${168 - lengthHeight} L 472 168 Z`} className="moment-shape governing" />
        <line x1="280" y1="34" x2="280" y2="184" className="center-line" />
        <text x="184" y="196" textAnchor="middle" className="dimension-text">Dirección B</text>
        <text x="376" y="196" textAnchor="middle" className="dimension-text">Dirección L</text>
        <text x="184" y={Math.max(36, 156 - widthHeight)} textAnchor="middle" className="diagram-label">Mᵤ = {result.widthDirection.momentDemandKnM.toFixed(2)} kN·m</text>
        <text x="376" y={Math.max(36, 156 - lengthHeight)} textAnchor="middle" className="diagram-label">Mᵤ = {result.lengthDirection.momentDemandKnM.toFixed(2)} kN·m</text>
      </svg>
      <p>La altura relativa compara las demandas en ambas direcciones; no representa deformación ni una escala constructiva.</p>
    </figure>
  )
}
