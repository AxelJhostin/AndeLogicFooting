import type { ServiceContactResult } from '../domain/footing/service-contact'
import type { GuideOneWayShearCheckResult } from '../domain/footing/one-way-shear-guide-check'
import type { GuidePunchingShearResult } from '../domain/footing/punching-shear-guide-check'
import type { GuideReinforcementComparisonResult } from '../domain/footing/reinforcement-comparison'

type Props = {
  contact: ServiceContactResult | null
  oneWay: GuideOneWayShearCheckResult | null
  punching: GuidePunchingShearResult | null
  reinforcement: GuideReinforcementComparisonResult | null
}

type Metric = { label: string; detail: string; utilization: number; status: 'pass' | 'fail' | 'reference' }

export function FootingResultDashboard({ contact, oneWay, punching, reinforcement }: Props) {
  const metrics: Metric[] = [
    ...(contact ? [{ label: 'Suelo', detail: 'Presión de servicio', utilization: contact.utilization, status: contact.status }] : []),
    ...(oneWay ? [
      { label: 'Cortante B', detail: 'Referencia de guía', utilization: oneWay.widthDirection.utilization, status: oneWay.widthDirection.status === 'meets-guide-reference' ? 'reference' as const : 'fail' as const },
      { label: 'Cortante L', detail: 'Referencia de guía', utilization: oneWay.lengthDirection.utilization, status: oneWay.lengthDirection.status === 'meets-guide-reference' ? 'reference' as const : 'fail' as const },
    ] : []),
    ...(punching ? [{ label: 'Punzonamiento', detail: 'Referencia de guía', utilization: punching.utilization, status: punching.status === 'meets-guide-reference' ? 'reference' as const : 'fail' as const }] : []),
    ...(reinforcement ? [
      { label: 'Acero B', detail: 'Colocado / exigencia', utilization: reinforcement.widthDirection.requiredReferenceAreaPerMeterMm2 === null ? Infinity : reinforcement.widthDirection.requiredReferenceAreaPerMeterMm2 / reinforcement.widthDirection.providedAreaPerMeterMm2, status: reinforcement.widthDirection.status === 'meets-guide-reference' ? 'reference' as const : 'fail' as const },
      { label: 'Acero L', detail: 'Colocado / exigencia', utilization: reinforcement.lengthDirection.requiredReferenceAreaPerMeterMm2 === null ? Infinity : reinforcement.lengthDirection.requiredReferenceAreaPerMeterMm2 / reinforcement.lengthDirection.providedAreaPerMeterMm2, status: reinforcement.lengthDirection.status === 'meets-guide-reference' ? 'reference' as const : 'fail' as const },
    ] : []),
  ]

  if (metrics.length === 0) return null

  const failedMetrics = metrics.filter((metric) => metric.status === 'fail')
  const referenceMetrics = metrics.filter((metric) => metric.status === 'reference')
  const conclusion = failedMetrics.length > 0
    ? {
        state: 'attention',
        title: 'Hay verificaciones que requieren ajuste',
        detail: `Revisa ${failedMetrics.map((metric) => metric.label).join(', ')} antes de continuar con el detalle.`,
      }
    : referenceMetrics.length > 0
      ? {
          state: 'reference',
          title: 'Las referencias calculadas están dentro de su límite',
          detail: 'Aún debes revisar las hipótesis, el detalle constructivo y el estado de validación de cada módulo.',
        }
      : {
          state: 'pass',
          title: 'El contacto de servicio está dentro de la capacidad declarada',
          detail: 'Calcula las demás etapas para completar la lectura del caso.',
        }

  return (
    <section className="result-dashboard" aria-label="Resumen gráfico de resultados">
      <div className="result-dashboard-heading">
        <div>
          <p className="eyebrow">Lectura rápida</p>
          <h2>¿Qué está gobernando?</h2>
        </div>
        <p>Una barra completa llega al 100%. Los resultados de guía son orientativos y siguen en validación.</p>
      </div>
      <div className="utilization-list">
        {metrics.map((metric) => {
          const displayUtilization = Number.isFinite(metric.utilization) ? metric.utilization : 1.25
          return (
            <div className={`utilization-row ${metric.status}`} key={metric.label}>
              <div><strong>{metric.label}</strong><span>{metric.detail}</span></div>
              <div className="utilization-track" aria-label={`${metric.label}: ${(displayUtilization * 100).toFixed(1)} por ciento`}>
                <i style={{ width: `${Math.min(displayUtilization * 100, 125)}%` }} />
                <b aria-hidden="true" />
              </div>
              <strong>{Number.isFinite(metric.utilization) ? `${(metric.utilization * 100).toFixed(0)}%` : 'Revisar'}</strong>
            </div>
          )
        })}
      </div>
      <div className={`result-conclusion ${conclusion.state}`} aria-live="polite">
        <span aria-hidden="true">{conclusion.state === 'attention' ? '!' : '✓'}</span>
        <div>
          <strong>Conclusión provisional: {conclusion.title}</strong>
          <p>{conclusion.detail}</p>
        </div>
      </div>
      <p className="result-dashboard-legend"><i /> Cada barra llega a 100% en el límite de comparación. Verde: dentro de la referencia; naranja: requiere ajuste.</p>
    </section>
  )
}
