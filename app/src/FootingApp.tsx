import { useEffect, useRef, useState } from 'react'
import { createNewProject, DEFAULT_STRIP_FOOTING_INPUTS, isProjectDocument, normalizeProjectDocument, type FootingInputs, type ProjectDocument, type StripFootingInputs } from './domain/projects'
import { analyzeFootingCase, type FootingAnalysis } from './application/footing-analysis'
import { analyzeStripFootingCase, type StripFootingAnalysis } from './application/strip-footing-analysis'
import { buildFootingCalculationReport } from './reports/footing-calculation-report'
import { buildStripFootingCalculationReport } from './reports/strip-footing-calculation-report'
import { browserProjectRepository } from './persistence/browser-project-repository'
import { FootingPlanSheet, FootingSectionSheet, PunchingDetailSheet, ReinforcementSheet } from './components/FootingTechnicalSheets'
import { caseFieldDefinitions, caseFieldGroups, inputTextFrom, type CaseField as Field } from './ui/case-definition/case-fields'
import { workspaceNavigation, type WorkspaceView as View } from './ui/navigation'
import { buildResultCards, resultCardLabel } from './ui/results/result-cards'
import { CalculationMemo } from './ui/calculation/CalculationMemo'
import { StripCaseDefinition } from './ui/strip-footing/StripCaseDefinition'
import { stripInputTextFrom, type StripCaseField } from './ui/strip-footing/strip-case-fields'
import { buildStripResultCards } from './ui/strip-footing/strip-result-cards'
import { StripCalculationMemo } from './ui/strip-footing/StripCalculationMemo'
import { StripFootingPlanSheet, StripFootingSectionSheet, StripReinforcementSummary } from './components/StripFootingTechnicalSheets'
import './FootingApp.css'

const example: FootingInputs = { axialLoadKn: 450, factoredAxialLoadKn: 900, allowableBearingKpa: 180, bearingCapacityBasis: 'gross', removedOverburdenKpa: 0, concreteUnitWeightKnM3: 24, soilCoverDepthM: 0, soilUnitWeightKnM3: 0, columnWidthM: .4, columnLengthM: .6, footingWidthM: 2, footingLengthM: 3, footingThicknessM: .5, concreteCoverM: .075, barDiameterM: .016, concreteStrengthMpa: 23.54, steelYieldStrengthMpa: 412.08, developmentAvailableLengthWidthM: 1.3, developmentAvailableLengthLengthM: 1.3, punchingCriticalSectionOffsetM: .21, barsParallelToWidthMaxSpacingM: .15, barsParallelToLengthMaxSpacingM: .15 }
const stripExample: StripFootingInputs = { ...DEFAULT_STRIP_FOOTING_INPUTS, developmentAvailableLengthM: .8 }
const decimal = /^(?:\d+(?:[.,]\d*)?|[.,]\d*)?$/

export default function NewApp() {
  const [project, setProject] = useState<ProjectDocument>(createNewProject)
  const [text, setText] = useState<Record<Field, string>>(() => inputTextFrom(project.inputSnapshot))
  const [stripText, setStripText] = useState<Record<StripCaseField, string>>(() => stripInputTextFrom(project.stripInputSnapshot))
  const [view, setView] = useState<View>('define')
  const [openGroup, setOpenGroup] = useState('loads')
  const [menuOpen, setMenuOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectDocument[]>([])
  const [status, setStatus] = useState('Completa las entradas y analiza el caso. Los resultados se invalidan al modificar un dato.')
  const [formatIssue, setFormatIssue] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<FootingAnalysis | null>(null)
  const [stripAnalysis, setStripAnalysis] = useState<StripFootingAnalysis | null>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const clear = () => { setAnalysis(null); setStripAnalysis(null) }
  const isStrip = project.footingType === 'strip'
  const contact = analysis?.contact ?? null
  const oneWay = analysis?.oneWay ?? null
  const layout = analysis?.reinforcementLayout ?? null
  const steel = analysis?.reinforcement ?? null
  const punchingGuide = analysis?.punchingGuide ?? null
  const refresh = async () => setProjects(await browserProjectRepository.list())
  useEffect(() => {
    let active = true
    void browserProjectRepository.list().then((storedProjects) => {
      if (active) setProjects(storedProjects)
    })
    return () => { active = false }
  }, [])

  const change = (key: Field, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 450, 0.50 o 1,6.'); return }; setFormatIssue(null); clear(); setText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, inputSnapshot: { ...current.inputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar para actualizar las referencias.') }
  const changeStrip = (key: StripCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 180, 0.35 o 1,2.'); return }; setFormatIssue(null); clear(); setStripText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, stripInputSnapshot: { ...current.stripInputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar la zapata corrida.') }
  const changeFootingType = (footingType: ProjectDocument['footingType']) => { clear(); setProject((current) => ({ ...current, footingType })); setView('define'); setOpenGroup('loads'); setStatus(footingType === 'strip' ? 'Zapata corrida seleccionada. Las cargas se expresan por metro lineal.' : 'Zapata aislada seleccionada. Las cargas corresponden a la columna centrada.') }
  const loadExample = () => { if (isStrip) { setProject((current) => ({ ...current, name: 'Zapata corrida · caso didáctico', stripInputSnapshot: stripExample })); setStripText(stripInputTextFrom(stripExample)) } else { setProject((current) => ({ ...current, name: 'Zapata rectangular · caso didáctico', inputSnapshot: example })); setText(inputTextFrom(example)) }; clear(); setOpenGroup('loads'); setStatus('Ejemplo didáctico cargado. No representa un diseño aprobado.') }
  const analyze = () => {
    try {
      if (isStrip) {
        const outcome = analyzeStripFootingCase(project)
        if (outcome.status === 'invalid-input') {
          setStatus(outcome.issues.map((issue) => issue.message).join(' '))
          setView('define')
          return
        }
        setStripAnalysis(outcome.analysis)
        setView('results')
        setStatus('Zapata corrida analizada por metro lineal. Las resistencias permanecen como referencias de guía trazables.')
        return
      }
      const outcome = analyzeFootingCase(project)
      if (outcome.status === 'invalid-input') {
        setStatus(outcome.issues.map((issue) => issue.message).join(' '))
        setView('define')
        return
      }
      setAnalysis(outcome.analysis)
      setView('results')
      setStatus('Análisis completado. Las resistencias son referencias de guía en validación, no una aprobación normativa.')
    } catch (error) {
      clear()
      setStatus(error instanceof Error ? error.message : 'No fue posible analizar el caso.')
    }
  }
  const save = async () => { const saved = { ...project, updatedAt: new Date().toISOString() }; await browserProjectRepository.save(saved); setProject(saved); await refresh(); setMenuOpen(false); setStatus('Proyecto guardado localmente en este navegador.') }
  const newProject = () => { const fresh = createNewProject(); setProject(fresh); setText(inputTextFrom(fresh.inputSnapshot)); setStripText(stripInputTextFrom(fresh.stripInputSnapshot)); clear(); setMenuOpen(false); setView('define'); setStatus('Proyecto nuevo. Completa los datos o carga un ejemplo didáctico.') }
  const exportFile = () => { const link = document.createElement('a'); const url = URL.createObjectURL(new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })); link.href = url; link.download = `${project.name.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase() || 'zapata'}.andelogic-zapatas-project.json`; link.click(); URL.revokeObjectURL(url); setMenuOpen(false); setStatus('Archivo de proyecto descargado.') }
  const importFile = async (file?: File) => { if (!file) return; try { const candidate: unknown = JSON.parse(await file.text()); if (!isProjectDocument(candidate)) throw new Error('El archivo no corresponde al esquema compatible de AndeLogic Zapatas.'); const imported = { ...normalizeProjectDocument(candidate), projectId: crypto.randomUUID(), name: `Importado — ${candidate.name}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; await browserProjectRepository.save(imported); setProject(imported); setText(inputTextFrom(imported.inputSnapshot)); setStripText(stripInputTextFrom(imported.stripInputSnapshot)); clear(); await refresh(); setStatus('Archivo importado como una copia local.'); } catch (error) { setStatus(error instanceof Error ? error.message : 'No fue posible importar el archivo.'); } finally { if (importRef.current) importRef.current.value = ''; setMenuOpen(false) } }
  const cards = isStrip ? buildStripResultCards(stripAnalysis) : buildResultCards(analysis)
  const issues = cards.filter((card) => card.state === 'attention')
  const isolatedReport = buildFootingCalculationReport(project)
  const stripReport = buildStripFootingCalculationReport(project)
  const report = isStrip ? stripReport : isolatedReport
  return <main className="new-app"><header className="new-topbar"><a href="/" className="new-brand"><b>A</b><span>AndeLogic <strong>Zapatas</strong></span></a><nav aria-label="Vistas de cálculo">{workspaceNavigation.map(({ id, label }) => <button className={view === id ? 'active' : ''} onClick={() => setView(id)} key={id}>{label}</button>)}</nav><span className="technical-profile">{report.profile.shortLabel}</span><div className="file-menu"><button onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>Proyecto ⌄</button>{menuOpen && <div><button onClick={newProject}>Nuevo proyecto</button><button onClick={() => void save()}>Guardar</button><button onClick={exportFile}>Descargar archivo</button><button onClick={() => importRef.current?.click()}>Importar archivo</button><button onClick={() => window.print()}>Imprimir informe</button>{projects.map((item) => <button className="stored" onClick={() => void (async () => { const found = await browserProjectRepository.get(item.projectId); if (found) { setProject(found); setText(inputTextFrom(found.inputSnapshot)); setStripText(stripInputTextFrom(found.stripInputSnapshot)); clear(); setView('define'); setMenuOpen(false); setStatus('Proyecto abierto. Vuelve a analizar el caso.') } })()} key={item.projectId}>{item.name}</button>)}</div>}</div></header><section className="new-project-strip"><label><span>PROYECTO</span><input value={project.name} onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))}/></label><div className="footing-type-selector" aria-label="Tipo de zapata"><button className={!isStrip ? 'active' : ''} onClick={() => changeFootingType('isolated')}>Aislada</button><button className={isStrip ? 'active' : ''} onClick={() => changeFootingType('strip')}>Corrida</button></div><p>{isStrip ? 'Zapata corrida · muro y carga lineal centrados · franja de 1.00 m.' : 'Zapata aislada rectangular · columna y carga axial centradas.'}</p><button className="secondary-action" onClick={loadExample}>Cargar ejemplo aleatorio</button><button className="main-action" onClick={analyze}>Analizar {isStrip ? 'corrida' : 'zapata'} →</button></section>
    {view === 'define' && !isStrip && <section className="new-definition"><aside><div className="side-head"><span>01 · DEFINIR CASO</span><h1>Entradas del modelo</h1><p>Campos agrupados por procedencia. Editar un valor requiere recalcular.</p></div>{formatIssue && <p className="format-issue">{formatIssue}</p>}{caseFieldGroups.map((group) => { const opened = openGroup === group.id; const completed = group.keys.filter((key) => Number(text[key].replace(',', '.')) > 0).length; return <section className="fold" key={group.id}><button className="fold-trigger" onClick={() => setOpenGroup(opened ? '' : group.id)} aria-expanded={opened}><span><b>{group.label}</b><small>{opened ? group.description : group.keys.length ? `${completed}/${group.keys.length} valores declarados` : 'Identificación y límites'}</small></span><i>{opened ? '−' : '+'}</i></button>{opened && <div className="fold-body">{group.id === 'project' && <><label className="project-field">Nombre del proyecto<input value={project.name} onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))}/></label><p className="scope-note">Fuera de alcance: excentricidad, presión no uniforme, zapatas combinadas, corridas, losas y asentamientos.</p></>}{group.keys.map((key) => { const field = caseFieldDefinitions.find((item) => item.key === key)!; return <label className="new-input" key={key}><span>{field.label}<small>{field.help}</small></span><div><input value={text[key]} inputMode="decimal" onChange={(event) => change(key, event.target.value)}/><em>{field.unit}</em></div></label> })}{group.id === 'soil' && <label className="basis-input"><span>Base de la capacidad declarada</span><select value={project.inputSnapshot.bearingCapacityBasis} onChange={(event) => { clear(); setProject((current) => ({ ...current, inputSnapshot: { ...current.inputSnapshot, bearingCapacityBasis: event.target.value as FootingInputs['bearingCapacityBasis'] } })); setStatus('Base actualizada: vuelve a analizar el caso.') }}><option value="gross">Bruta</option><option value="net">Neta</option></select><small>Debe coincidir con la base del informe geotécnico.</small></label>}</div>}</section> })}<button className="side-analyze" onClick={analyze}>Analizar zapata</button></aside><section className="drawing-intro"><div><span>REPRESENTACIÓN PRELIMINAR</span><h1>Planta de la zapata</h1><p>La geometría se actualiza con dimensiones válidas. Las revisiones se activan al analizar.</p></div><FootingPlanSheet inputs={project.inputSnapshot} oneWay={oneWay} punching={punchingGuide} reinforcement={layout}/></section></section>}
    {view === 'define' && isStrip && <StripCaseDefinition project={project} text={stripText} openGroup={openGroup} formatIssue={formatIssue} analysis={stripAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeStrip} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, stripInputSnapshot: { ...current.stripInputSnapshot, bearingCapacityBasis } })); setStatus('Base actualizada: vuelve a analizar la zapata corrida.') }} onAnalyze={analyze}/>}
    {view === 'section' && !isStrip && <ViewShell number="02" title="Cortes de la zapata" detail="Profundidad efectiva, líneas críticas de cortante y carga axial declarada."><div className="new-section-grid"><FootingSectionSheet inputs={project.inputSnapshot} contact={contact} oneWay={oneWay} direction="A–A"/><FootingSectionSheet inputs={project.inputSnapshot} contact={contact} oneWay={oneWay} direction="B–B"/></div></ViewShell>}
    {view === 'section' && isStrip && <ViewShell number="02" title="Sección transversal T–T" detail="Franja de un metro, profundidad efectiva y cortante a distancia d de la cara del muro."><StripFootingSectionSheet inputs={project.stripInputSnapshot} analysis={stripAnalysis}/></ViewShell>}
    {view === 'plan' && !isStrip && <ViewShell number="03" title="Planta y armado preliminar" detail="Relación directa entre geometría, perímetro crítico y malla inferior."><div className="new-plan-grid"><FootingPlanSheet inputs={project.inputSnapshot} oneWay={oneWay} punching={punchingGuide} reinforcement={layout}/><div><PunchingDetailSheet inputs={project.inputSnapshot} punching={punchingGuide}/><ReinforcementSheet inputs={project.inputSnapshot} reinforcement={layout} reinforcementCheck={steel}/></div></div></ViewShell>}
    {view === 'plan' && isStrip && <ViewShell number="03" title="Planta y armado por metro" detail="Continuidad longitudinal y distinción entre acero transversal principal y longitudinal de distribución."><div className="new-plan-grid"><StripFootingPlanSheet inputs={project.stripInputSnapshot} analysis={stripAnalysis}/><StripReinforcementSummary inputs={project.stripInputSnapshot} analysis={stripAnalysis}/></div></ViewShell>}
    {view === 'results' && <ViewShell number="04" title="Resumen de revisiones" detail="Las referencias de guía no equivalen a una aprobación normativa."><div className="new-result-grid">{cards.map((card) => <button className={`new-result ${card.state}`} key={card.id} onClick={() => setView(card.destination)}><span><i>{card.state === 'pending' ? '○' : card.state === 'reference' ? '✓' : '!'}</i>{resultCardLabel(card.state)}</span><strong>{card.title}</strong><b>{card.value}</b><small>{card.detail}</small><em>Ver detalle →</em></button>)}</div><section className={`new-conclusion ${issues.length ? 'attention' : ''}`}><i>{issues.length ? '!' : 'i'}</i><div><h2>{issues.length ? `Requiere ajuste: ${issues.map((item) => item.title).join(', ')}` : 'Resultados disponibles como referencia de guía'}</h2><p>{issues.length ? 'Ajusta el caso y analiza de nuevo. La evaluación normativa integral continúa fuera del alcance actual.' : 'La utilización identifica el resultado gobernante. La matriz de evidencia externa sigue pendiente de liberación.'}</p></div></section></ViewShell>}
    {view === 'calculation' && !isStrip && <ViewShell number="05" title="Memoria de revisión" detail="Secuencia completa de datos, procedimiento, sustitución y resultados del motor."><CalculationMemo analysis={analysis} inputs={project.inputSnapshot} report={isolatedReport} cards={cards}/></ViewShell>}
    {view === 'calculation' && isStrip && <ViewShell number="05" title="Memoria de zapata corrida" detail="Revisión completa por franja longitudinal de un metro."><StripCalculationMemo analysis={stripAnalysis} inputs={project.stripInputSnapshot} report={stripReport} cards={cards}/></ViewShell>}
    {view === 'theory' && !isStrip && <ViewShell number="06" title="Teoría y metodología" detail="Lectura técnica del caso y de los límites actuales."><section className="new-theory"><div className="load-path"><b>Columna</b><i>↓</i><b>Zapata</b><i>↓</i><b>Suelo</b></div><Theory title="Zapata aislada">Distribuye al suelo la carga de una columna. Esta aplicación modela una zapata rectangular con columna centrada y carga axial centrada.</Theory><Theory title="Contacto de servicio">La presión se compara con capacidad admisible declarada. La base bruta o neta debe coincidir con el informe geotécnico.</Theory><Theory title="Cortante, punzonamiento y flexión">Las líneas a profundidad efectiva representan cortante; el perímetro alrededor de la columna representa punzonamiento; la flexión se revisa en la cara de columna.</Theory><Theory title="Acero y desarrollo">La distribución inferior es preliminar. Área, separación y desarrollo se comparan con referencias de guía y no con un detalle definitivo de obra.</Theory><Theory title="Alcance y validación">No calcula momentos, excentricidad, presión no uniforme, zapatas combinadas, corridas, losas, capacidad portante ni asentamientos. “Dentro de referencia” no significa aprobado.</Theory></section></ViewShell>}
    {view === 'theory' && isStrip && <ViewShell number="06" title="Teoría de zapata corrida" detail="Comportamiento transversal de una cimentación continua bajo muro."><section className="new-theory"><div className="load-path"><b>Muro</b><i>↓</i><b>Franja de 1 m</b><i>↓</i><b>Suelo</b></div><Theory title="Modelo por metro lineal">La carga del muro se expresa en kN/m. Una franja longitudinal de 1.00 m transforma el problema en una sección transversal repetitiva.</Theory><Theory title="Contacto">Con muro centrado y sin momento, la reacción se considera uniforme y la presión se obtiene dividiendo la carga lineal total para el ancho B.</Theory><Theory title="Cortante y flexión transversal">Cada lado trabaja como un voladizo desde la cara del muro. El cortante se revisa a distancia d y el momento en la cara.</Theory><Theory title="Armado">El acero transversal resiste la flexión principal; el longitudinal funciona como distribución mínima dentro del alcance actual.</Theory><Theory title="Límites">No modela muros excéntricos, momentos, extremos, esquinas, aberturas, vigas de cimentación ni asentamientos diferenciales. El punzonamiento de columna no aplica al modelo continuo.</Theory></section></ViewShell>}
    <footer className="new-status" role="status"><span>Estado de sesión</span>{status}</footer><input className="visually-hidden" ref={importRef} type="file" accept="application/json,.json" onChange={(event) => void importFile(event.target.files?.[0])}/></main>
}

function ViewShell({ number, title, detail, children }: { number: string; title: string; detail: string; children: React.ReactNode }) { return <section className="new-view"><header><span>{number} · VISTA TÉCNICA</span><h1>{title}</h1><p>{detail}</p></header>{children}</section> }
function Theory({ title, children }: { title: string; children: React.ReactNode }) { return <article><h2>{title}</h2><p>{children}</p></article> }
