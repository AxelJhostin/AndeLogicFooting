import type { EdgeFootingAnalysis } from '../../application/edge-footing-analysis'
import { EdgeFootingPlanSheet } from '../../components/EdgeFootingTechnicalSheets'
import type { EdgeFootingInputs, ProjectDocument } from '../../domain/projects'
import { edgeCaseFieldDefinitions, edgeCaseFieldGroups, type EdgeCaseField, type EdgeInputText } from './edge-case-fields'

type Props = {
  project: ProjectDocument
  text: EdgeInputText
  openGroup: string
  formatIssue: string | null
  analysis: EdgeFootingAnalysis | null
  onOpenGroup: (id: string) => void
  onNameChange: (name: string) => void
  onFieldChange: (key: EdgeCaseField, value: string) => void
  onBasisChange: (basis: EdgeFootingInputs['bearingCapacityBasis']) => void
  onEdgeSideChange: (edgeSide: EdgeFootingInputs['edgeSide']) => void
  onAnalyze: () => void
}

export function EdgeCaseDefinition({ project, text, openGroup, formatIssue, analysis, onOpenGroup, onNameChange, onFieldChange, onBasisChange, onEdgeSideChange, onAnalyze }: Props) {
  return <section className="new-definition"><aside><div className="side-head"><span>01 · AISLADA EXCÉNTRICA</span><h1>Columna al borde</h1><p>Una cara coincide con el lindero y la base debe permanecer totalmente comprimida.</p></div>{formatIssue && <p className="format-issue">{formatIssue}</p>}{edgeCaseFieldGroups.map((group) => { const opened = openGroup === group.id; const completed = group.keys.filter((key) => Number(text[key].replace(',', '.')) > 0).length; return <section className="fold" key={group.id}><button className="fold-trigger" onClick={() => onOpenGroup(opened ? '' : group.id)} aria-expanded={opened}><span><b>{group.label}</b><small>{opened ? group.description : group.keys.length ? `${completed}/${group.keys.length} valores declarados` : 'Identificación y límites'}</small></span><i>{opened ? '−' : '+'}</i></button>{opened && <div className="fold-body">{group.id === 'project' && <><label className="project-field">Nombre del proyecto<input value={project.name} onChange={(event) => onNameChange(event.target.value)}/></label><p className="scope-note">Solo excentricidad uniaxial y contacto completo. Se bloquea la resultante fuera del tercio central. El punzonamiento de borde no se aproxima como columna interior.</p></>}{group.id === 'geometry' && <label className="basis-input"><span>Borde exterior o lindero</span><select value={project.edgeInputSnapshot.edgeSide} onChange={(event) => onEdgeSideChange(event.target.value as EdgeFootingInputs['edgeSide'])}><option value="left">Izquierdo</option><option value="right">Derecho</option></select><small>La cara correspondiente de la columna queda alineada con este borde.</small></label>}{group.keys.map((key) => { const field = edgeCaseFieldDefinitions.find((item) => item.key === key)!; return <label className="new-input" key={key}><span>{field.label}<small>{field.help}</small></span><div><input value={text[key]} inputMode="decimal" onChange={(event) => onFieldChange(key, event.target.value)}/><em>{field.unit}</em></div></label> })}{group.id === 'soil' && <label className="basis-input"><span>Base de la capacidad declarada</span><select value={project.edgeInputSnapshot.bearingCapacityBasis} onChange={(event) => onBasisChange(event.target.value as EdgeFootingInputs['bearingCapacityBasis'])}><option value="gross">Bruta</option><option value="net">Neta</option></select><small>Debe coincidir con el estudio geotécnico.</small></label>}</div>}</section> })}<button className="side-analyze" onClick={onAnalyze}>Analizar zapata excéntrica</button></aside><section className="drawing-intro"><div><span>REPRESENTACIÓN PRELIMINAR</span><h1>Planta junto al lindero</h1><p>La orientación, las dimensiones y la columna definen automáticamente la excentricidad.</p></div><EdgeFootingPlanSheet inputs={project.edgeInputSnapshot} analysis={analysis}/></section></section>
}
