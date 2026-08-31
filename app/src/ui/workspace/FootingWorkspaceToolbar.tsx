import type { FootingExample } from '../../domain/examples/footing-examples'
import type { FootingType } from '../../domain/projects'
import { FOOTING_MODEL_BY_TYPE, FOOTING_MODEL_OPTIONS } from './footing-model-options'

type Props = {
  projectName: string
  footingType: FootingType
  examples: readonly FootingExample[]
  selectedExample: FootingExample | undefined
  loadedExampleId: string | null
  hasActiveAnalysis: boolean
  onProjectNameChange: (name: string) => void
  onFootingTypeChange: (footingType: FootingType) => void
  onExampleChange: (exampleId: string) => void
  onLoadExample: () => void
  onAnalyze: () => void
  onSave: () => void
  onExportProject: () => void
  onPrintCalculation: () => void
  onExportWorkbook: () => void
}

export function FootingWorkspaceToolbar(props: Props) {
  const activeModel = FOOTING_MODEL_BY_TYPE[props.footingType]
  const exampleWasLoaded = props.selectedExample?.id === props.loadedExampleId

  return (
    <section className="new-project-strip">
      <label className="project-name-control">
        <span>PROYECTO</span>
        <input value={props.projectName} onChange={(event) => props.onProjectNameChange(event.target.value)} />
      </label>

      <label className="footing-model-picker">
        <span>MODELO DE CIMENTACIÓN</span>
        <select
          aria-label="Modelo de cimentación"
          value={props.footingType}
          onChange={(event) => props.onFootingTypeChange(event.target.value as FootingType)}
        >
          {FOOTING_MODEL_OPTIONS.map((option) => (
            <option value={option.value} key={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <p className="model-description">{activeModel.description}</p>

      <div className="example-library">
        <span>DATOS DE PRUEBA</span>
        <div>
          <select
            aria-label="Ejemplo rápido"
            value={props.selectedExample?.id ?? ''}
            disabled={!props.selectedExample}
            onChange={(event) => props.onExampleChange(event.target.value)}
          >
            {props.examples.map((example) => (
              <option value={example.id} key={example.id}>{example.label}</option>
            ))}
          </select>
          <button
            className="secondary-action load-example-action"
            disabled={!props.selectedExample}
            onClick={props.onLoadExample}
          >
            Cargar datos
          </button>
        </div>
        {exampleWasLoaded ? (
          <small className="example-loaded" role="status">✓ Datos cargados. Ahora presiona «{activeModel.analyzeLabel}».</small>
        ) : props.selectedExample ? (
          <small>
            <b>{props.selectedExample.expectation === 'blocked' ? 'Bloqueo esperado' : props.selectedExample.expectation === 'attention' ? 'Alerta esperada' : 'Cálculo esperado'}:</b>{' '}
            {props.selectedExample.expectedObservation}
          </small>
        ) : (
          <small>Preparando ejemplos probados…</small>
        )}
      </div>

      <button className="main-action" onClick={props.onAnalyze}>{activeModel.analyzeLabel} →</button>

      <div className="document-actions">
        <div>
          <span>ARCHIVO Y DESCARGAS</span>
          <small>{props.hasActiveAnalysis ? 'El cálculo actual está listo para documentarse.' : 'Analiza el caso para habilitar la memoria y el Excel.'}</small>
        </div>
        <div className="document-action-buttons">
          <button onClick={props.onSave}>Guardar</button>
          <button onClick={props.onExportProject}>Proyecto (.json)</button>
          <button
            disabled={!props.hasActiveAnalysis}
            title={props.hasActiveAnalysis ? 'Abrir el diálogo para imprimir o guardar la memoria como PDF' : 'Primero analiza el caso'}
            onClick={props.onPrintCalculation}
          >
            Memoria / PDF
          </button>
          <button
            className="download-excel-action"
            disabled={!props.hasActiveAnalysis}
            title={props.hasActiveAnalysis ? 'Descargar el cálculo auditable en Excel' : 'Primero analiza el caso'}
            onClick={props.onExportWorkbook}
          >
            Descargar Excel
          </button>
        </div>
      </div>
    </section>
  )
}
