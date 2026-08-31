import type { FootingType } from '../../domain/projects'
import type { FootingCalculationReport } from '../../reports/footing-calculation-report'
import { FOOTING_THEORY_PAGES } from './theory-content'

type Props = {
  footingType: FootingType
  profile: FootingCalculationReport['profile']
}

export function FootingTheoryPage({ footingType, profile }: Props) {
  const page = FOOTING_THEORY_PAGES[footingType]
  const traces = profile.traceability.filter(({ appliesTo }) => appliesTo.includes(footingType))
  const sourceById = new Map(profile.sources.map((source) => [source.id, source]))

  return (
    <div className="theory-guide">
      <section className="theory-introduction">
        <span>GUÍA CONCEPTUAL DEL MODELO</span>
        <p>{page.introduction}</p>
        <div className="theory-load-path" aria-label="Ruta de cargas">
          {page.loadPath.map((step, index) => (
            <div key={step}>
              <b>{step}</b>
              {index < page.loadPath.length - 1 && <i aria-hidden="true">→</i>}
            </div>
          ))}
        </div>
      </section>

      <section className="theory-scope-facts" aria-label="Resumen del alcance">
        {page.scopeFacts.map((fact) => (
          <article key={fact.label}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </article>
        ))}
      </section>

      <section className="theory-chapters">
        <header>
          <span>DESARROLLO TEÓRICO</span>
          <h2>Del comportamiento físico a la interpretación</h2>
          <p>Abre cada capítulo para estudiar su fundamento, las expresiones usadas por el modelo y sus condiciones de aplicación.</p>
        </header>
        {page.sections.map((section, index) => (
          <details open={index < 2} key={section.title}>
            <summary>
              <i>{String(index + 1).padStart(2, '0')}</i>
              <span><b>{section.title}</b><small>{section.summary}</small></span>
              <em aria-hidden="true">+</em>
            </summary>
            <div className="theory-chapter-body">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
              {section.formulas && (
                <div className="theory-formulas">
                  {section.formulas.map((formula) => (
                    <article key={formula.label}>
                      <span>{formula.label}</span>
                      <code>{formula.expression}</code>
                      <p>{formula.meaning}</p>
                    </article>
                  ))}
                </div>
              )}
              {section.caution && <aside className="theory-caution"><b>Atención:</b> {section.caution}</aside>}
            </div>
          </details>
        ))}
      </section>

      <div className="theory-practice-grid">
        <section className="theory-workflow">
          <header><span>SECUENCIA RECOMENDADA</span><h2>Cómo revisar el caso</h2></header>
          <ol>{page.workflow.map((step) => <li key={step}>{step}</li>)}</ol>
        </section>
        <section className="theory-mistakes">
          <header><span>CONTROL DE CALIDAD</span><h2>Errores frecuentes</h2></header>
          <ul>{page.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
        </section>
      </div>

      <section className="theory-glossary">
        <header><span>GLOSARIO</span><h2>Símbolos y conceptos esenciales</h2></header>
        <dl>{page.glossary.map((entry) => <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}</dl>
      </section>

      <section className="theory-traceability">
        <header>
          <span>FUENTES Y TRAZABILIDAD</span>
          <h2>Qué respalda cada parte del modelo</h2>
          <p>Las referencias se muestran con su aplicabilidad real. Una fuente de apoyo no convierte el resultado en aprobación normativa.</p>
        </header>
        <div>
          {traces.map((trace) => {
            const source = trace.sourceId ? sourceById.get(trace.sourceId) : undefined
            return (
              <article key={trace.id}>
                <div><strong>{trace.module}</strong><span>{trace.basis}</span></div>
                <p>{trace.reference}</p>
                <small>{trace.applicability}</small>
                {source && <a href={source.url} target="_blank" rel="noreferrer">{source.label} · {source.version} ↗</a>}
              </article>
            )
          })}
        </div>
        <aside><b>Estado del perfil:</b> {profile.releaseBlocker}</aside>
      </section>
    </div>
  )
}
