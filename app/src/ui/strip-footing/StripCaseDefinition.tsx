import type { ProjectDocument, StripFootingInputs } from '../../domain/projects'
import type { StripFootingAnalysis } from '../../application/strip-footing-analysis'
import { StripFootingPlanSheet } from '../../components/StripFootingTechnicalSheets'
import { stripCaseFieldDefinitions, stripCaseFieldGroups, type StripCaseField } from './strip-case-fields'

type Props = {
  project: ProjectDocument
  text: Record<StripCaseField, string>
  openGroup: string
  formatIssue: string | null
  analysis: StripFootingAnalysis | null
  onOpenGroup: (id: string) => void
  onNameChange: (name: string) => void
  onFieldChange: (key: StripCaseField, value: string) => void
  onBasisChange: (basis: StripFootingInputs['bearingCapacityBasis']) => void
  onAnalyze: () => void
}

export function StripCaseDefinition({ project, text, openGroup, formatIssue, analysis, onOpenGroup, onNameChange, onFieldChange, onBasisChange, onAnalyze }: Props) {
  return <section className="new-definition"><aside><div className="side-head"><span>01 · ZAPATA CORRIDA</span><h1>Entradas por metro lineal</h1><p>Muro centrado, franja de 1.00 m y reacción uniforme.</p></div>{formatIssue && <p className="format-issue">{formatIssue}</p>}{stripCaseFieldGroups.map((group) => { const opened = openGroup === group.id; const completed = group.keys.filter((key) => Number(text[key].replace(',', '.')) > 0).length; return <section className="fold" key={group.id}><button className="fold-trigger" onClick={() => onOpenGroup(opened ? '' : group.id)} aria-expanded={opened}><span><b>{group.label}</b><small>{opened ? group.description : group.keys.length ? `${completed}/${group.keys.length} valores declarados` : 'Identificación y alcance'}</small></span><i>{opened ? '−' : '+'}</i></button>{opened && <div className="fold-body">{group.id === 'project' && <><label className="project-field">Nombre del proyecto<input value={project.name} onChange={(event) => onNameChange(event.target.value)}/></label><p className="scope-note">Modelo: muro continuo y carga vertical centrada. No incluye excentricidad, extremos, esquinas, asentamientos ni vigas de cimentación.</p></>}{group.keys.map((key) => { const field = stripCaseFieldDefinitions.find((item) => item.key === key)!; return <label className="new-input" key={key}><span>{field.label}<small>{field.help}</small></span><div><input value={text[key]} inputMode="decimal" onChange={(event) => onFieldChange(key, event.target.value)}/><em>{field.unit}</em></div></label> })}{group.id === 'soil' && <label className="basis-input"><span>Base de la capacidad declarada</span><select value={project.stripInputSnapshot.bearingCapacityBasis} onChange={(event) => onBasisChange(event.target.value as StripFootingInputs['bearingCapacityBasis'])}><option value="gross">Bruta</option><option value="net">Neta</option></select><small>Debe coincidir con el estudio geotécnico.</small></label>}</div>}</section> })}<button className="side-analyze" onClick={onAnalyze}>Analizar zapata corrida</button></aside><section className="drawing-intro"><div><span>REPRESENTACIÓN PRELIMINAR</span><h1>Planta continua</h1><p>La longitud es representativa; las magnitudes se calculan por metro lineal.</p></div><StripFootingPlanSheet inputs={project.stripInputSnapshot} analysis={analysis}/></section></section>
}
