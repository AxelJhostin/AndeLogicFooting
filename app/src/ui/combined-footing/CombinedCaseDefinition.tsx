import type { CombinedFootingAnalysis } from '../../application/combined-footing-analysis'
import { CombinedFootingPlanSheet } from '../../components/CombinedFootingTechnicalSheets'
import type { CombinedFootingInputs, ProjectDocument } from '../../domain/projects'
import { combinedCaseFieldDefinitions, combinedCaseFieldGroups, type CombinedCaseField, type CombinedInputText } from './combined-case-fields'

type Props = {
  project: ProjectDocument
  text: CombinedInputText
  openGroup: string
  formatIssue: string | null
  analysis: CombinedFootingAnalysis | null
  onOpenGroup: (id: string) => void
  onNameChange: (name: string) => void
  onFieldChange: (key: CombinedCaseField, value: string) => void
  onBasisChange: (basis: CombinedFootingInputs['bearingCapacityBasis']) => void
  onAnalyze: () => void
}

export function CombinedCaseDefinition({ project, text, openGroup, formatIssue, analysis, onOpenGroup, onNameChange, onFieldChange, onBasisChange, onAnalyze }: Props) {
  return <section className="new-definition"><aside><div className="side-head"><span>01 · ZAPATA COMBINADA</span><h1>Dos columnas alineadas</h1><p>Planta rectangular, presión lineal y contacto completo.</p></div>{formatIssue && <p className="format-issue">{formatIssue}</p>}{combinedCaseFieldGroups.map((group) => { const opened = openGroup === group.id; const completed = group.keys.filter((key) => Number(text[key].replace(',', '.')) > 0).length; return <section className="fold" key={group.id}><button className="fold-trigger" onClick={() => onOpenGroup(opened ? '' : group.id)} aria-expanded={opened}><span><b>{group.label}</b><small>{opened ? group.description : group.keys.length ? `${completed}/${group.keys.length} valores declarados` : 'Identificación y límites'}</small></span><i>{opened ? '−' : '+'}</i></button>{opened && <div className="fold-body">{group.id === 'project' && <><label className="project-field">Nombre del proyecto<input value={project.name} onChange={(event) => onNameChange(event.target.value)}/></label><p className="scope-note">Solo dos columnas interiores. Se bloquean levantamiento, bordes, momentos transferidos y geometría trapezoidal.</p></>}{group.keys.map((key) => { const field = combinedCaseFieldDefinitions.find((item) => item.key === key)!; return <label className="new-input" key={key}><span>{field.label}<small>{field.help}</small></span><div><input value={text[key]} inputMode="decimal" onChange={(event) => onFieldChange(key, event.target.value)}/><em>{field.unit}</em></div></label> })}{group.id === 'soil' && <label className="basis-input"><span>Base de la capacidad declarada</span><select value={project.combinedInputSnapshot.bearingCapacityBasis} onChange={(event) => onBasisChange(event.target.value as CombinedFootingInputs['bearingCapacityBasis'])}><option value="gross">Bruta</option><option value="net">Neta</option></select><small>Debe coincidir con el estudio geotécnico.</small></label>}</div>}</section> })}<button className="side-analyze" onClick={onAnalyze}>Analizar zapata combinada</button></aside><section className="drawing-intro"><div><span>REPRESENTACIÓN PRELIMINAR</span><h1>Planta combinada</h1><p>Las posiciones se miden desde el extremo izquierdo de la zapata.</p></div><CombinedFootingPlanSheet inputs={project.combinedInputSnapshot} analysis={analysis}/></section></section>
}
