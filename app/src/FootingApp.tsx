import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createNewProject, isProjectDocument, normalizeProjectDocument, type FootingInputs, type MatColumnInput, type ProjectDocument } from './domain/projects'
import { analyzeFootingCase, type FootingAnalysis } from './application/footing-analysis'
import { analyzeStripFootingCase, type StripFootingAnalysis } from './application/strip-footing-analysis'
import { analyzeCombinedFootingCase, type CombinedFootingAnalysis } from './application/combined-footing-analysis'
import { analyzeStrapFootingCase, type StrapFootingAnalysis } from './application/strap-footing-analysis'
import { analyzeTrapezoidalFootingCase, type TrapezoidalFootingAnalysis } from './application/trapezoidal-footing-analysis'
import { analyzeEdgeFootingCase, type EdgeFootingAnalysis } from './application/edge-footing-analysis'
import { analyzeCornerFootingCase, type CornerFootingAnalysis } from './application/corner-footing-analysis'
import { analyzeMatFootingCase, type MatFootingAnalysis } from './application/mat-footing-analysis'
import { buildFootingCalculationReport } from './reports/footing-calculation-report'
import { buildStripFootingCalculationReport } from './reports/strip-footing-calculation-report'
import { buildCombinedFootingCalculationReport } from './reports/combined-footing-calculation-report'
import { buildStrapFootingCalculationReport } from './reports/strap-footing-calculation-report'
import { buildTrapezoidalFootingCalculationReport } from './reports/trapezoidal-footing-calculation-report'
import { buildEdgeFootingCalculationReport } from './reports/edge-footing-calculation-report'
import { buildCornerFootingCalculationReport } from './reports/corner-footing-calculation-report'
import { buildMatFootingCalculationReport } from './reports/mat-footing-calculation-report'
import { browserProjectRepository } from './persistence/browser-project-repository'
import { FootingPlanSheet, FootingSectionSheet, PunchingDetailSheet, ReinforcementSheet } from './components/FootingTechnicalSheets'
import { caseFieldDefinitions, caseFieldGroups, inputTextFrom, type CaseField as Field } from './ui/case-definition/case-fields'
import { workspaceNavigation, type WorkspaceView as View } from './ui/navigation'
import { buildResultCards, resultCardLabel } from './ui/results/result-cards'
import { StripCaseDefinition } from './ui/strip-footing/StripCaseDefinition'
import { stripInputTextFrom, type StripCaseField } from './ui/strip-footing/strip-case-fields'
import { buildStripResultCards } from './ui/strip-footing/strip-result-cards'
import { StripFootingPlanSheet, StripFootingSectionSheet, StripReinforcementSummary } from './components/StripFootingTechnicalSheets'
import { CombinedFootingLongitudinalSheet, CombinedFootingPlanSheet, CombinedReinforcementSummary } from './components/CombinedFootingTechnicalSheets'
import { combinedInputTextFrom, type CombinedCaseField } from './ui/combined-footing/combined-case-fields'
import { buildCombinedResultCards } from './ui/combined-footing/combined-result-cards'
import { strapInputTextFrom, type StrapCaseField } from './ui/strap-footing/strap-case-fields'
import { buildStrapResultCards } from './ui/strap-footing/strap-result-cards'
import { trapezoidalInputTextFrom, type TrapezoidalCaseField } from './ui/trapezoidal-footing/trapezoidal-case-fields'
import { buildTrapezoidalResultCards } from './ui/trapezoidal-footing/trapezoidal-result-cards'
import { edgeInputTextFrom, type EdgeCaseField } from './ui/edge-footing/edge-case-fields'
import { buildEdgeResultCards } from './ui/edge-footing/edge-result-cards'
import { cornerInputTextFrom, type CornerCaseField } from './ui/corner-footing/corner-case-fields'
import { buildCornerResultCards } from './ui/corner-footing/corner-result-cards'
import { matInputTextFrom, type MatCaseField } from './ui/mat-footing/mat-case-fields'
import { buildMatResultCards } from './ui/mat-footing/mat-result-cards'
import './FootingApp.css'

const decimal = /^(?:\d+(?:[.,]\d*)?|[.,]\d*)?$/
type FootingExamplesModule = typeof import('./domain/examples/footing-examples')
const CalculationMemo = lazy(async () => ({ default: (await import('./ui/calculation/CalculationMemo')).CalculationMemo }))
const StripCalculationMemo = lazy(async () => ({ default: (await import('./ui/strip-footing/StripCalculationMemo')).StripCalculationMemo }))
const CombinedCalculationMemo = lazy(async () => ({ default: (await import('./ui/combined-footing/CombinedCalculationMemo')).CombinedCalculationMemo }))
const StrapCalculationMemo = lazy(async () => ({ default: (await import('./ui/strap-footing/StrapCalculationMemo')).StrapCalculationMemo }))
const TrapezoidalCalculationMemo = lazy(async () => ({ default: (await import('./ui/trapezoidal-footing/TrapezoidalCalculationMemo')).TrapezoidalCalculationMemo }))
const EdgeCalculationMemo = lazy(async () => ({ default: (await import('./ui/edge-footing/EdgeCalculationMemo')).EdgeCalculationMemo }))
const CornerCalculationMemo = lazy(async () => ({ default: (await import('./ui/corner-footing/CornerCalculationMemo')).CornerCalculationMemo }))
const MatCalculationMemo = lazy(async () => ({ default: (await import('./ui/mat-footing/MatCalculationMemo')).MatCalculationMemo }))
const TrapezoidalCaseDefinition = lazy(async () => ({ default: (await import('./ui/trapezoidal-footing/TrapezoidalCaseDefinition')).TrapezoidalCaseDefinition }))
const TrapezoidalFootingLongitudinalSheet = lazy(async () => ({ default: (await import('./components/TrapezoidalFootingTechnicalSheets')).TrapezoidalFootingLongitudinalSheet }))
const TrapezoidalFootingPlanSheet = lazy(async () => ({ default: (await import('./components/TrapezoidalFootingTechnicalSheets')).TrapezoidalFootingPlanSheet }))
const TrapezoidalReinforcementSummary = lazy(async () => ({ default: (await import('./components/TrapezoidalFootingTechnicalSheets')).TrapezoidalReinforcementSummary }))
const EdgeCaseDefinition = lazy(async () => ({ default: (await import('./ui/edge-footing/EdgeCaseDefinition')).EdgeCaseDefinition }))
const EdgeFootingLongitudinalSheet = lazy(async () => ({ default: (await import('./components/EdgeFootingTechnicalSheets')).EdgeFootingLongitudinalSheet }))
const EdgeFootingPlanSheet = lazy(async () => ({ default: (await import('./components/EdgeFootingTechnicalSheets')).EdgeFootingPlanSheet }))
const EdgeReinforcementSummary = lazy(async () => ({ default: (await import('./components/EdgeFootingTechnicalSheets')).EdgeReinforcementSummary }))
const CornerCaseDefinition = lazy(async () => ({ default: (await import('./ui/corner-footing/CornerCaseDefinition')).CornerCaseDefinition }))
const CornerFootingPlanSheet = lazy(async () => ({ default: (await import('./components/CornerFootingTechnicalSheets')).CornerFootingPlanSheet }))
const CornerFootingSectionSheets = lazy(async () => ({ default: (await import('./components/CornerFootingTechnicalSheets')).CornerFootingSectionSheets }))
const CornerReinforcementSummary = lazy(async () => ({ default: (await import('./components/CornerFootingTechnicalSheets')).CornerReinforcementSummary }))
const MatCaseDefinition = lazy(async () => ({ default: (await import('./ui/mat-footing/MatCaseDefinition')).MatCaseDefinition }))
const MatFootingPlanSheet = lazy(async () => ({ default: (await import('./components/MatFootingTechnicalSheets')).MatFootingPlanSheet }))
const MatFootingProjectionSheets = lazy(async () => ({ default: (await import('./components/MatFootingTechnicalSheets')).MatFootingProjectionSheets }))
const MatFootingScopeSummary = lazy(async () => ({ default: (await import('./components/MatFootingTechnicalSheets')).MatFootingScopeSummary }))
const StrapCaseDefinition = lazy(async () => ({ default: (await import('./ui/strap-footing/StrapCaseDefinition')).StrapCaseDefinition }))
const StrapFootingLongitudinalSheet = lazy(async () => ({ default: (await import('./components/StrapFootingTechnicalSheets')).StrapFootingLongitudinalSheet }))
const StrapFootingPlanSheet = lazy(async () => ({ default: (await import('./components/StrapFootingTechnicalSheets')).StrapFootingPlanSheet }))
const StrapReinforcementSummary = lazy(async () => ({ default: (await import('./components/StrapFootingTechnicalSheets')).StrapReinforcementSummary }))
const CombinedCaseDefinition = lazy(async () => ({ default: (await import('./ui/combined-footing/CombinedCaseDefinition')).CombinedCaseDefinition }))

export default function NewApp() {
  const [project, setProject] = useState<ProjectDocument>(createNewProject)
  const [text, setText] = useState<Record<Field, string>>(() => inputTextFrom(project.inputSnapshot))
  const [stripText, setStripText] = useState<Record<StripCaseField, string>>(() => stripInputTextFrom(project.stripInputSnapshot))
  const [combinedText, setCombinedText] = useState<Record<CombinedCaseField, string>>(() => combinedInputTextFrom(project.combinedInputSnapshot))
  const [strapText, setStrapText] = useState<Record<StrapCaseField, string>>(() => strapInputTextFrom(project.strapInputSnapshot))
  const [trapezoidalText, setTrapezoidalText] = useState<Record<TrapezoidalCaseField, string>>(() => trapezoidalInputTextFrom(project.trapezoidalInputSnapshot))
  const [edgeText, setEdgeText] = useState<Record<EdgeCaseField, string>>(() => edgeInputTextFrom(project.edgeInputSnapshot))
  const [cornerText, setCornerText] = useState<Record<CornerCaseField, string>>(() => cornerInputTextFrom(project.cornerInputSnapshot))
  const [matText, setMatText] = useState<Record<MatCaseField, string>>(() => matInputTextFrom(project.matInputSnapshot))
  const [view, setView] = useState<View>('define')
  const [openGroup, setOpenGroup] = useState('loads')
  const [exampleLibrary, setExampleLibrary] = useState<FootingExamplesModule | null>(null)
  const [selectedExampleId, setSelectedExampleId] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectDocument[]>([])
  const [status, setStatus] = useState('Completa las entradas y analiza el caso. Los resultados se invalidan al modificar un dato.')
  const [formatIssue, setFormatIssue] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<FootingAnalysis | null>(null)
  const [stripAnalysis, setStripAnalysis] = useState<StripFootingAnalysis | null>(null)
  const [combinedAnalysis, setCombinedAnalysis] = useState<CombinedFootingAnalysis | null>(null)
  const [strapAnalysis, setStrapAnalysis] = useState<StrapFootingAnalysis | null>(null)
  const [trapezoidalAnalysis, setTrapezoidalAnalysis] = useState<TrapezoidalFootingAnalysis | null>(null)
  const [edgeAnalysis, setEdgeAnalysis] = useState<EdgeFootingAnalysis | null>(null)
  const [cornerAnalysis, setCornerAnalysis] = useState<CornerFootingAnalysis | null>(null)
  const [matAnalysis, setMatAnalysis] = useState<MatFootingAnalysis | null>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const clear = () => { setAnalysis(null); setStripAnalysis(null); setCombinedAnalysis(null); setStrapAnalysis(null); setTrapezoidalAnalysis(null); setEdgeAnalysis(null); setCornerAnalysis(null); setMatAnalysis(null) }
  const isStrip = project.footingType === 'strip'
  const isCombined = project.footingType === 'combined'
  const isStrap = project.footingType === 'strap'
  const isTrapezoidal = project.footingType === 'trapezoidal'
  const isEdge = project.footingType === 'edge'
  const isCorner = project.footingType === 'corner'
  const isMat = project.footingType === 'mat'
  const isIsolated = project.footingType === 'isolated'
  const activeExamples = exampleLibrary?.examplesForFootingType(project.footingType) ?? []
  const selectedExample = activeExamples.find(({ id }) => id === selectedExampleId)
    ?? activeExamples.find(({ category }) => category === 'reference')
    ?? activeExamples[0]
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
  useEffect(() => {
    let active = true
    void import('./domain/examples/footing-examples').then((library) => {
      if (active) setExampleLibrary(library)
    })
    return () => { active = false }
  }, [])
  const change = (key: Field, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 450, 0.50 o 1,6.'); return }; setFormatIssue(null); clear(); setText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, inputSnapshot: { ...current.inputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar para actualizar las referencias.') }
  const changeStrip = (key: StripCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 180, 0.35 o 1,2.'); return }; setFormatIssue(null); clear(); setStripText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, stripInputSnapshot: { ...current.stripInputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar la zapata corrida.') }
  const changeCombined = (key: CombinedCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 700, 0.55 o 5,4.'); return }; setFormatIssue(null); clear(); setCombinedText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, combinedInputSnapshot: { ...current.combinedInputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar la zapata combinada.') }
  const changeStrap = (key: StrapCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 600, 0.65 o 5,0.'); return }; setFormatIssue(null); clear(); setStrapText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, strapInputSnapshot: { ...current.strapInputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar la zapata medianera.') }
  const changeTrapezoidal = (key: TrapezoidalCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 500, 1.50 o 6,0.'); return }; setFormatIssue(null); clear(); setTrapezoidalText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, trapezoidalInputSnapshot: { ...current.trapezoidalInputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar la zapata trapezoidal.') }
  const changeEdge = (key: EdgeCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 160, 0.45 o 2,4.'); return }; setFormatIssue(null); clear(); setEdgeText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, edgeInputSnapshot: { ...current.edgeInputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar la zapata excéntrica.') }
  const changeCorner = (key: CornerCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 40, 0.45 o 0,525.'); return }; setFormatIssue(null); clear(); setCornerText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, cornerInputSnapshot: { ...current.cornerInputSnapshot, [key]: key === 'barDiameterM' ? numeric / 1000 : numeric } })); setStatus('Datos modificados: vuelve a analizar la zapata de esquina.') }
  const changeMat = (key: MatCaseField, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales, por ejemplo 150, 0.70 o 15000.'); return }; setFormatIssue(null); clear(); setMatText((current) => ({ ...current, [key]: value })); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, matInputSnapshot: { ...current.matInputSnapshot, [key]: numeric } })); setStatus('Datos modificados: vuelve a analizar la losa de cimentación.') }
  const changeMatColumnId = (index: number, value: string) => { clear(); setProject((current) => ({ ...current, matInputSnapshot: { ...current.matInputSnapshot, columns: current.matInputSnapshot.columns.map((column, position) => position === index ? { ...column, id: value, label: value || column.label } : column) } })); setStatus('Columna modificada: vuelve a analizar la losa.') }
  const changeMatColumn = (index: number, key: Exclude<keyof MatColumnInput, 'id' | 'label'>, value: string) => { if (!decimal.test(value)) { setFormatIssue('Usa solo números y decimales en las columnas.'); return }; setFormatIssue(null); clear(); const numeric = value.trim() ? Number(value.replace(',', '.')) : 0; setProject((current) => ({ ...current, matInputSnapshot: { ...current.matInputSnapshot, columns: current.matInputSnapshot.columns.map((column, position) => position === index ? { ...column, [key]: numeric } : column) } })); setStatus('Columna modificada: vuelve a analizar la losa.') }
  const addMatColumn = () => { clear(); setProject((current) => { const columns = current.matInputSnapshot.columns; let suffix = columns.length + 1; while (columns.some(({ id }) => id === `C${suffix}`)) suffix += 1; const column: MatColumnInput = { id: `C${suffix}`, label: `Columna ${suffix}`, serviceLoadKn: 500, factoredLoadKn: 750, widthM: 0.5, lengthM: 0.5, centerXM: current.matInputSnapshot.footingLengthM / 2, centerYM: current.matInputSnapshot.footingWidthM / 2 }; return { ...current, matInputSnapshot: { ...current.matInputSnapshot, columns: [...columns, column] } } }); setStatus('Columna agregada. Ajusta su posición para evitar superposiciones.') }
  const removeMatColumn = (index: number) => { clear(); setProject((current) => ({ ...current, matInputSnapshot: { ...current.matInputSnapshot, columns: current.matInputSnapshot.columns.filter((_, position) => position !== index) } })); setStatus('Columna retirada. Vuelve a analizar la losa.') }
  const changeFootingType = (footingType: ProjectDocument['footingType']) => { clear(); setProject((current) => ({ ...current, footingType })); setView('define'); setOpenGroup(footingType === 'mat' ? 'project' : 'loads'); setStatus(footingType === 'strip' ? 'Zapata corrida seleccionada. Las cargas se expresan por metro lineal.' : footingType === 'combined' ? 'Zapata combinada seleccionada. Declara cargas y posición de las dos columnas.' : footingType === 'strap' ? 'Zapata medianera seleccionada. La viga centradora enlaza dos bases sin apoyar en el suelo.' : footingType === 'trapezoidal' ? 'Zapata trapezoidal seleccionada. Los dos anchos extremos definen una base combinada variable.' : footingType === 'edge' ? 'Zapata excéntrica seleccionada. Una cara de la columna coincide con el lindero.' : footingType === 'corner' ? 'Zapata de esquina seleccionada. Dos caras de la columna coinciden con linderos adyacentes.' : footingType === 'mat' ? 'Losa de cimentación seleccionada. Declara todas las columnas y los parámetros geotécnicos externos.' : 'Zapata aislada seleccionada. Las cargas corresponden a la columna centrada.') }
  const loadExample = () => {
    if (!exampleLibrary || !selectedExample) return
    setProject((current) => exampleLibrary.applyFootingExample(current, selectedExample))
    switch (selectedExample.footingType) {
      case 'isolated': setText(inputTextFrom(selectedExample.inputs)); break
      case 'strip': setStripText(stripInputTextFrom(selectedExample.inputs)); break
      case 'combined': setCombinedText(combinedInputTextFrom(selectedExample.inputs)); break
      case 'strap': setStrapText(strapInputTextFrom(selectedExample.inputs)); break
      case 'trapezoidal': setTrapezoidalText(trapezoidalInputTextFrom(selectedExample.inputs)); break
      case 'edge': setEdgeText(edgeInputTextFrom(selectedExample.inputs)); break
      case 'corner': setCornerText(cornerInputTextFrom(selectedExample.inputs)); break
      case 'mat': setMatText(matInputTextFrom(selectedExample.inputs)); break
    }
    clear()
    setOpenGroup('loads')
    setView('define')
    setStatus(`Ejemplo cargado. Esperado: ${selectedExample.expectedObservation} No representa un diseño aprobado.`)
  }
  const analyze = () => {
    try {
      if (isMat) {
        const outcome = analyzeMatFootingCase(project)
        if (outcome.status === 'invalid-input') {
          setStatus(outcome.issues.map((issue) => issue.message).join(' '))
          setView('define')
          return
        }
        setMatAnalysis(outcome.analysis)
        setView('results')
        setStatus('Losa analizada. Contacto, asentamiento preliminar y equilibrio global calculados; placa, punzonamiento y armado permanecen no evaluados.')
        return
      }
      if (isCorner) {
        const outcome = analyzeCornerFootingCase(project)
        if (outcome.status === 'invalid-input') {
          setStatus(outcome.issues.map((issue) => issue.message).join(' '))
          setView('define')
          return
        }
        setCornerAnalysis(outcome.analysis)
        setView('results')
        setStatus('Zapata de esquina analizada. Se verificaron las cuatro presiones, el núcleo biaxial y el equilibrio en ambos ejes.')
        return
      }
      if (isEdge) {
        const outcome = analyzeEdgeFootingCase(project)
        if (outcome.status === 'invalid-input') {
          setStatus(outcome.issues.map((issue) => issue.message).join(' '))
          setView('define')
          return
        }
        setEdgeAnalysis(outcome.analysis)
        setView('results')
        setStatus('Zapata excéntrica analizada. Se verificaron tercio central, presión lineal, equilibrio y referencias estructurales disponibles.')
        return
      }
      if (isTrapezoidal) {
        const outcome = analyzeTrapezoidalFootingCase(project)
        if (outcome.status === 'invalid-input') {
          setStatus(outcome.issues.map((issue) => issue.message).join(' '))
          setView('define')
          return
        }
        setTrapezoidalAnalysis(outcome.analysis)
        setView('results')
        setStatus('Zapata trapezoidal analizada. Se resolvieron presión lineal, ancho variable y revisiones estructurales trazables.')
        return
      }
      if (isStrap) {
        const outcome = analyzeStrapFootingCase(project)
        if (outcome.status === 'invalid-input') {
          setStatus(outcome.issues.map((issue) => issue.message).join(' '))
          setView('define')
          return
        }
        setStrapAnalysis(outcome.analysis)
        setView('results')
        setStatus('Zapata medianera analizada. Equilibrio y bases calculados; el punzonamiento de los encuentros permanece fuera de alcance.')
        return
      }
      if (isCombined) {
        const outcome = analyzeCombinedFootingCase(project)
        if (outcome.status === 'invalid-input') {
          setStatus(outcome.issues.map((issue) => issue.message).join(' '))
          setView('define')
          return
        }
        setCombinedAnalysis(outcome.analysis)
        setView('results')
        setStatus('Zapata combinada analizada. Equilibrio completo; las resistencias permanecen como referencias de guía trazables.')
        return
      }
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
  const newProject = () => { const fresh = createNewProject(); setProject(fresh); setText(inputTextFrom(fresh.inputSnapshot)); setStripText(stripInputTextFrom(fresh.stripInputSnapshot)); setCombinedText(combinedInputTextFrom(fresh.combinedInputSnapshot)); setStrapText(strapInputTextFrom(fresh.strapInputSnapshot)); setTrapezoidalText(trapezoidalInputTextFrom(fresh.trapezoidalInputSnapshot)); setEdgeText(edgeInputTextFrom(fresh.edgeInputSnapshot)); setCornerText(cornerInputTextFrom(fresh.cornerInputSnapshot)); setMatText(matInputTextFrom(fresh.matInputSnapshot)); clear(); setMenuOpen(false); setView('define'); setStatus('Proyecto nuevo. Completa los datos o carga un ejemplo didáctico.') }
  const exportFile = () => { const link = document.createElement('a'); const url = URL.createObjectURL(new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })); link.href = url; link.download = `${project.name.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase() || 'zapata'}.andelogic-zapatas-project.json`; link.click(); URL.revokeObjectURL(url); setMenuOpen(false); setStatus('Archivo de proyecto descargado.') }
  const importFile = async (file?: File) => { if (!file) return; try { const candidate: unknown = JSON.parse(await file.text()); if (!isProjectDocument(candidate)) throw new Error('El archivo no corresponde al esquema compatible de AndeLogic Zapatas.'); const imported = { ...normalizeProjectDocument(candidate), projectId: crypto.randomUUID(), name: `Importado — ${candidate.name}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; await browserProjectRepository.save(imported); setProject(imported); setText(inputTextFrom(imported.inputSnapshot)); setStripText(stripInputTextFrom(imported.stripInputSnapshot)); setCombinedText(combinedInputTextFrom(imported.combinedInputSnapshot)); setStrapText(strapInputTextFrom(imported.strapInputSnapshot)); setTrapezoidalText(trapezoidalInputTextFrom(imported.trapezoidalInputSnapshot)); setEdgeText(edgeInputTextFrom(imported.edgeInputSnapshot)); setCornerText(cornerInputTextFrom(imported.cornerInputSnapshot)); setMatText(matInputTextFrom(imported.matInputSnapshot)); clear(); await refresh(); setStatus('Archivo importado como una copia local.'); } catch (error) { setStatus(error instanceof Error ? error.message : 'No fue posible importar el archivo.'); } finally { if (importRef.current) importRef.current.value = ''; setMenuOpen(false) } }
  const cards = isMat ? buildMatResultCards(matAnalysis) : isStrip ? buildStripResultCards(stripAnalysis) : isCombined ? buildCombinedResultCards(combinedAnalysis) : isStrap ? buildStrapResultCards(strapAnalysis) : isTrapezoidal ? buildTrapezoidalResultCards(trapezoidalAnalysis) : isEdge ? buildEdgeResultCards(edgeAnalysis) : isCorner ? buildCornerResultCards(cornerAnalysis) : buildResultCards(analysis)
  const issues = cards.filter((card) => card.state === 'attention')
  const isolatedReport = buildFootingCalculationReport(project)
  const stripReport = buildStripFootingCalculationReport(project)
  const combinedReport = buildCombinedFootingCalculationReport(project)
  const strapReport = buildStrapFootingCalculationReport(project)
  const trapezoidalReport = buildTrapezoidalFootingCalculationReport(project)
  const edgeReport = buildEdgeFootingCalculationReport(project)
  const cornerReport = buildCornerFootingCalculationReport(project)
  const matReport = buildMatFootingCalculationReport(project)
  const report = isMat ? matReport : isStrip ? stripReport : isCombined ? combinedReport : isStrap ? strapReport : isTrapezoidal ? trapezoidalReport : isEdge ? edgeReport : isCorner ? cornerReport : isolatedReport
  return <main className="new-app">
    <header className="new-topbar"><a href="/" className="new-brand"><b>A</b><span>AndeLogic <strong>Zapatas</strong></span></a><nav aria-label="Vistas de cálculo">{workspaceNavigation.map(({ id, label }) => <button className={view === id ? 'active' : ''} onClick={() => setView(id)} key={id}>{label}</button>)}</nav><span className="technical-profile">{report.profile.shortLabel}</span><div className="file-menu"><button onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>Proyecto ⌄</button>{menuOpen && <div><button onClick={newProject}>Nuevo proyecto</button><button onClick={() => void save()}>Guardar</button><button onClick={exportFile}>Descargar archivo</button><button onClick={() => importRef.current?.click()}>Importar archivo</button><button onClick={() => window.print()}>Imprimir informe</button>{projects.map((item) => <button className="stored" onClick={() => void (async () => { const found = await browserProjectRepository.get(item.projectId); if (found) { setProject(found); setText(inputTextFrom(found.inputSnapshot)); setStripText(stripInputTextFrom(found.stripInputSnapshot)); setCombinedText(combinedInputTextFrom(found.combinedInputSnapshot)); setStrapText(strapInputTextFrom(found.strapInputSnapshot)); setTrapezoidalText(trapezoidalInputTextFrom(found.trapezoidalInputSnapshot)); setEdgeText(edgeInputTextFrom(found.edgeInputSnapshot)); setCornerText(cornerInputTextFrom(found.cornerInputSnapshot)); setMatText(matInputTextFrom(found.matInputSnapshot)); clear(); setView('define'); setMenuOpen(false); setStatus('Proyecto abierto. Vuelve a analizar el caso.') } })()} key={item.projectId}>{item.name}</button>)}</div>}</div></header>
    <section className="new-project-strip"><label><span>PROYECTO</span><input value={project.name} onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))}/></label><div className="footing-type-selector" aria-label="Tipo de zapata"><button className={isIsolated ? 'active' : ''} onClick={() => changeFootingType('isolated')}>Aislada</button><button className={isStrip ? 'active' : ''} onClick={() => changeFootingType('strip')}>Corrida</button><button className={isCombined ? 'active' : ''} onClick={() => changeFootingType('combined')}>Combinada</button><button className={isStrap ? 'active' : ''} onClick={() => changeFootingType('strap')}>Medianera</button><button className={isTrapezoidal ? 'active' : ''} onClick={() => changeFootingType('trapezoidal')}>Trapezoidal</button><button className={isEdge ? 'active' : ''} onClick={() => changeFootingType('edge')}>Excéntrica</button><button className={isCorner ? 'active' : ''} onClick={() => changeFootingType('corner')}>Esquina</button><button className={isMat ? 'active' : ''} onClick={() => changeFootingType('mat')}>Losa</button></div><p>{isMat ? 'Losa de cimentación rectangular · múltiples columnas · evaluación rígida–Winkler preliminar.' : isStrip ? 'Zapata corrida · muro y carga lineal centrados · franja de 1.00 m.' : isCombined ? 'Zapata combinada rectangular · dos columnas interiores alineadas · presión lineal.' : isStrap ? 'Zapata medianera · dos bases separadas · viga centradora sin apoyo en el suelo.' : isTrapezoidal ? 'Zapata combinada trapezoidal · dos columnas interiores · ancho variable y presión lineal.' : isEdge ? 'Zapata aislada excéntrica · columna al borde · contacto completo dentro del tercio central.' : isCorner ? 'Zapata de esquina · excentricidad biaxial · contacto completo en las cuatro esquinas.' : 'Zapata aislada rectangular · columna y carga axial centradas.'}</p><div className="example-library"><span>PRUEBA RÁPIDA</span><div><select aria-label="Ejemplo rápido" value={selectedExample?.id ?? ''} disabled={!selectedExample} onChange={(event) => setSelectedExampleId(event.target.value)}>{activeExamples.map((example) => <option value={example.id} key={example.id}>{example.label}</option>)}</select><button className="secondary-action" disabled={!selectedExample} onClick={loadExample}>Cargar</button></div>{selectedExample ? <small><b>{selectedExample.expectation === 'blocked' ? 'Bloqueo esperado' : selectedExample.expectation === 'attention' ? 'Alerta esperada' : 'Cálculo esperado'}:</b> {selectedExample.expectedObservation}</small> : <small>Preparando ejemplos probados…</small>}</div><button className="main-action" onClick={analyze}>Analizar {isMat ? 'losa' : isStrip ? 'corrida' : isCombined ? 'combinada' : isStrap ? 'medianera' : isTrapezoidal ? 'trapezoidal' : isEdge ? 'excéntrica' : isCorner ? 'esquina' : 'zapata'} →</button></section>
    {view === 'define' && isIsolated && <section className="new-definition"><aside><div className="side-head"><span>01 · DEFINIR CASO</span><h1>Entradas del modelo</h1><p>Campos agrupados por procedencia. Editar un valor requiere recalcular.</p></div>{formatIssue && <p className="format-issue">{formatIssue}</p>}{caseFieldGroups.map((group) => { const opened = openGroup === group.id; const completed = group.keys.filter((key) => Number(text[key].replace(',', '.')) > 0).length; return <section className="fold" key={group.id}><button className="fold-trigger" onClick={() => setOpenGroup(opened ? '' : group.id)} aria-expanded={opened}><span><b>{group.label}</b><small>{opened ? group.description : group.keys.length ? `${completed}/${group.keys.length} valores declarados` : 'Identificación y límites'}</small></span><i>{opened ? '−' : '+'}</i></button>{opened && <div className="fold-body">{group.id === 'project' && <><label className="project-field">Nombre del proyecto<input value={project.name} onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))}/></label><p className="scope-note">Fuera de alcance: excentricidad, presión no uniforme, zapatas combinadas, corridas, losas y asentamientos.</p></>}{group.keys.map((key) => { const field = caseFieldDefinitions.find((item) => item.key === key)!; return <label className="new-input" key={key}><span>{field.label}<small>{field.help}</small></span><div><input value={text[key]} inputMode="decimal" onChange={(event) => change(key, event.target.value)}/><em>{field.unit}</em></div></label> })}{group.id === 'soil' && <label className="basis-input"><span>Base de la capacidad declarada</span><select value={project.inputSnapshot.bearingCapacityBasis} onChange={(event) => { clear(); setProject((current) => ({ ...current, inputSnapshot: { ...current.inputSnapshot, bearingCapacityBasis: event.target.value as FootingInputs['bearingCapacityBasis'] } })); setStatus('Base actualizada: vuelve a analizar el caso.') }}><option value="gross">Bruta</option><option value="net">Neta</option></select><small>Debe coincidir con la base del informe geotécnico.</small></label>}</div>}</section> })}<button className="side-analyze" onClick={analyze}>Analizar zapata</button></aside><section className="drawing-intro"><div><span>REPRESENTACIÓN PRELIMINAR</span><h1>Planta de la zapata</h1><p>La geometría se actualiza con dimensiones válidas. Las revisiones se activan al analizar.</p></div><FootingPlanSheet inputs={project.inputSnapshot} oneWay={oneWay} punching={punchingGuide} reinforcement={layout}/></section></section>}
    {view === 'define' && isStrip && <StripCaseDefinition project={project} text={stripText} openGroup={openGroup} formatIssue={formatIssue} analysis={stripAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeStrip} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, stripInputSnapshot: { ...current.stripInputSnapshot, bearingCapacityBasis } })); setStatus('Base actualizada: vuelve a analizar la zapata corrida.') }} onAnalyze={analyze}/>}
    {view === 'define' && isCombined && <Suspense fallback={<section className="memo-empty"><h2>Preparando el modelo combinado…</h2></section>}><CombinedCaseDefinition project={project} text={combinedText} openGroup={openGroup} formatIssue={formatIssue} analysis={combinedAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeCombined} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, combinedInputSnapshot: { ...current.combinedInputSnapshot, bearingCapacityBasis } })); setStatus('Base actualizada: vuelve a analizar la zapata combinada.') }} onAnalyze={analyze}/></Suspense>}
    {view === 'define' && isStrap && <Suspense fallback={<section className="memo-empty"><h2>Preparando el modelo medianero…</h2></section>}><StrapCaseDefinition project={project} text={strapText} openGroup={openGroup} formatIssue={formatIssue} analysis={strapAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeStrap} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, strapInputSnapshot: { ...current.strapInputSnapshot, bearingCapacityBasis } })); setStatus('Base actualizada: vuelve a analizar la zapata medianera.') }} onAnalyze={analyze}/></Suspense>}
    {view === 'define' && isTrapezoidal && <Suspense fallback={<section className="memo-empty"><h2>Preparando el modelo trapezoidal…</h2></section>}><TrapezoidalCaseDefinition project={project} text={trapezoidalText} openGroup={openGroup} formatIssue={formatIssue} analysis={trapezoidalAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeTrapezoidal} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, trapezoidalInputSnapshot: { ...current.trapezoidalInputSnapshot, bearingCapacityBasis } })); setStatus('Base actualizada: vuelve a analizar la zapata trapezoidal.') }} onAnalyze={analyze}/></Suspense>}
    {view === 'define' && isEdge && <Suspense fallback={<section className="memo-empty"><h2>Preparando el modelo excéntrico…</h2></section>}><EdgeCaseDefinition project={project} text={edgeText} openGroup={openGroup} formatIssue={formatIssue} analysis={edgeAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeEdge} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, edgeInputSnapshot: { ...current.edgeInputSnapshot, bearingCapacityBasis } })); setStatus('Base actualizada: vuelve a analizar la zapata excéntrica.') }} onEdgeSideChange={(edgeSide) => { clear(); setProject((current) => ({ ...current, edgeInputSnapshot: { ...current.edgeInputSnapshot, edgeSide } })); setStatus('Borde actualizado: vuelve a analizar la zapata excéntrica.') }} onAnalyze={analyze}/></Suspense>}
    {view === 'define' && isCorner && <Suspense fallback={<section className="memo-empty"><h2>Preparando el modelo de esquina…</h2></section>}><CornerCaseDefinition project={project} text={cornerText} openGroup={openGroup} formatIssue={formatIssue} analysis={cornerAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeCorner} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, cornerInputSnapshot: { ...current.cornerInputSnapshot, bearingCapacityBasis } })); setStatus('Base actualizada: vuelve a analizar la zapata de esquina.') }} onCornerPositionChange={(cornerPosition) => { clear(); setProject((current) => ({ ...current, cornerInputSnapshot: { ...current.cornerInputSnapshot, cornerPosition } })); setStatus('Esquina actualizada: vuelve a analizar el caso biaxial.') }} onAnalyze={analyze}/></Suspense>}
    {view === 'define' && isMat && <Suspense fallback={<section className="memo-empty"><h2>Preparando el modelo multicolumna…</h2></section>}><MatCaseDefinition project={project} text={matText} openGroup={openGroup} formatIssue={formatIssue} analysis={matAnalysis} onOpenGroup={setOpenGroup} onNameChange={(name) => setProject((current) => ({ ...current, name }))} onFieldChange={changeMat} onBasisChange={(bearingCapacityBasis) => { clear(); setProject((current) => ({ ...current, matInputSnapshot: { ...current.matInputSnapshot, bearingCapacityBasis } })); setStatus('Base de capacidad actualizada: vuelve a analizar la losa.') }} onSettlementBasisChange={(settlementPressureBasis) => { clear(); setProject((current) => ({ ...current, matInputSnapshot: { ...current.matInputSnapshot, settlementPressureBasis } })); setStatus('Base de asentamiento actualizada: vuelve a analizar la losa.') }} onColumnIdChange={changeMatColumnId} onColumnFieldChange={changeMatColumn} onAddColumn={addMatColumn} onRemoveColumn={removeMatColumn} onAnalyze={analyze}/></Suspense>}
    {view === 'section' && isIsolated && <ViewShell number="02" title="Cortes de la zapata" detail="Profundidad efectiva, líneas críticas de cortante y carga axial declarada."><div className="new-section-grid"><FootingSectionSheet inputs={project.inputSnapshot} contact={contact} oneWay={oneWay} direction="A–A"/><FootingSectionSheet inputs={project.inputSnapshot} contact={contact} oneWay={oneWay} direction="B–B"/></div></ViewShell>}
    {view === 'section' && isStrip && <ViewShell number="02" title="Sección transversal T–T" detail="Franja de un metro, profundidad efectiva y cortante a distancia d de la cara del muro."><StripFootingSectionSheet inputs={project.stripInputSnapshot} analysis={stripAnalysis}/></ViewShell>}
    {view === 'section' && isCombined && <ViewShell number="02" title="Sección y diagrama longitudinal" detail="Cargas por columna, presión lineal, equilibrio y envolvente de momento."><CombinedFootingLongitudinalSheet inputs={project.combinedInputSnapshot} analysis={combinedAnalysis}/></ViewShell>}
    {view === 'section' && isStrap && <ViewShell number="02" title="Sección longitudinal del sistema" detail="Excentricidad, transferencia por la viga y reacciones independientes bajo las dos bases."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><StrapFootingLongitudinalSheet inputs={project.strapInputSnapshot} analysis={strapAnalysis}/></Suspense></ViewShell>}
    {view === 'section' && isTrapezoidal && <ViewShell number="02" title="Sección y equilibrio longitudinal" detail="Presión lineal, ancho variable, reacción cuadrática y diagrama de momento."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><TrapezoidalFootingLongitudinalSheet inputs={project.trapezoidalInputSnapshot} analysis={trapezoidalAnalysis}/></Suspense></ViewShell>}
    {view === 'section' && isEdge && <ViewShell number="02" title="Sección y equilibrio excéntrico" detail="Lindero, carga desplazada, presión lineal y diagrama longitudinal."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><EdgeFootingLongitudinalSheet inputs={project.edgeInputSnapshot} analysis={edgeAnalysis}/></Suspense></ViewShell>}
    {view === 'section' && isCorner && <ViewShell number="02" title="Secciones y equilibrio biaxial" detail="Integración direccional de la presión plana, cortante y momento en X y Y."><Suspense fallback={<section className="sheet-empty">Preparando láminas…</section>}><CornerFootingSectionSheets inputs={project.cornerInputSnapshot} analysis={cornerAnalysis}/></Suspense></ViewShell>}
    {view === 'section' && isMat && <ViewShell number="02" title="Proyecciones de equilibrio global" detail="Integración de la presión última y de todas las cargas en X y Y; no constituye diseño de franjas."><Suspense fallback={<section className="sheet-empty">Preparando láminas…</section>}><MatFootingProjectionSheets inputs={project.matInputSnapshot} analysis={matAnalysis}/></Suspense></ViewShell>}
    {view === 'plan' && isIsolated && <ViewShell number="03" title="Planta y armado preliminar" detail="Relación directa entre geometría, perímetro crítico y malla inferior."><div className="new-plan-grid"><FootingPlanSheet inputs={project.inputSnapshot} oneWay={oneWay} punching={punchingGuide} reinforcement={layout}/><div><PunchingDetailSheet inputs={project.inputSnapshot} punching={punchingGuide}/><ReinforcementSheet inputs={project.inputSnapshot} reinforcement={layout} reinforcementCheck={steel}/></div></div></ViewShell>}
    {view === 'plan' && isStrip && <ViewShell number="03" title="Planta y armado por metro" detail="Continuidad longitudinal y distinción entre acero transversal principal y longitudinal de distribución."><div className="new-plan-grid"><StripFootingPlanSheet inputs={project.stripInputSnapshot} analysis={stripAnalysis}/><StripReinforcementSummary inputs={project.stripInputSnapshot} analysis={stripAnalysis}/></div></ViewShell>}
    {view === 'plan' && isCombined && <ViewShell number="03" title="Planta, punzonamiento y armado" detail="Dos perímetros interiores y zonas longitudinales superior e inferior."><div className="new-plan-grid"><CombinedFootingPlanSheet inputs={project.combinedInputSnapshot} analysis={combinedAnalysis}/><CombinedReinforcementSummary inputs={project.combinedInputSnapshot} analysis={combinedAnalysis}/></div></ViewShell>}
    {view === 'plan' && isStrap && <ViewShell number="03" title="Planta y armado del sistema" detail="Lindero, dos bases, viga centradora y resumen explícito del armado preliminar."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><div className="new-plan-grid"><StrapFootingPlanSheet inputs={project.strapInputSnapshot} analysis={strapAnalysis}/><StrapReinforcementSummary inputs={project.strapInputSnapshot} analysis={strapAnalysis}/></div></Suspense></ViewShell>}
    {view === 'plan' && isTrapezoidal && <ViewShell number="03" title="Planta, centroides y armado" detail="Anchos extremos, bordes inclinados, perímetros interiores y armado preliminar."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><div className="new-plan-grid"><TrapezoidalFootingPlanSheet inputs={project.trapezoidalInputSnapshot} analysis={trapezoidalAnalysis}/><TrapezoidalReinforcementSummary inputs={project.trapezoidalInputSnapshot} analysis={trapezoidalAnalysis}/></div></Suspense></ViewShell>}
    {view === 'plan' && isEdge && <ViewShell number="03" title="Planta, lindero y armado" detail="Orientación del borde, resultante, perímetro truncado y distribución preliminar."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><div className="new-plan-grid"><EdgeFootingPlanSheet inputs={project.edgeInputSnapshot} analysis={edgeAnalysis}/><EdgeReinforcementSummary inputs={project.edgeInputSnapshot} analysis={edgeAnalysis}/></div></Suspense></ViewShell>}
    {view === 'plan' && isCorner && <ViewShell number="03" title="Planta, cuatro presiones y armado" detail="Linderos adyacentes, resultante biaxial, núcleo central y malla preliminar."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><div className="new-plan-grid"><CornerFootingPlanSheet inputs={project.cornerInputSnapshot} analysis={cornerAnalysis}/><CornerReinforcementSummary inputs={project.cornerInputSnapshot} analysis={cornerAnalysis}/></div></Suspense></ViewShell>}
    {view === 'plan' && isMat && <ViewShell number="03" title="Planta, columnas y alcance" detail="Ubicación de columnas, plano de presiones y separación explícita del análisis estructural de placa."><Suspense fallback={<section className="sheet-empty">Preparando lámina…</section>}><div className="new-plan-grid"><MatFootingPlanSheet inputs={project.matInputSnapshot} analysis={matAnalysis}/><MatFootingScopeSummary analysis={matAnalysis}/></div></Suspense></ViewShell>}
    {view === 'results' && <ViewShell number="04" title="Resumen de revisiones" detail="Las referencias de guía no equivalen a una aprobación normativa."><div className="new-result-grid">{cards.map((card) => <button className={`new-result ${card.state}`} key={card.id} onClick={() => setView(card.destination)}><span><i>{card.state === 'pending' ? '○' : card.state === 'calculated' ? '=' : card.state === 'reference' ? '✓' : card.state === 'out-of-scope' ? '×' : '!'}</i>{resultCardLabel(card.state)}</span><strong>{card.title}</strong><b>{card.value}</b><small>{card.detail}</small><em>Ver detalle →</em></button>)}</div><section className={`new-conclusion ${issues.length ? 'attention' : ''}`}><i>{issues.length ? '!' : 'i'}</i><div><h2>{issues.length ? `Requiere ajuste: ${issues.map((item) => item.title).join(', ')}` : 'Resultados disponibles como referencia de guía'}</h2><p>{issues.length ? 'Ajusta el caso y analiza de nuevo. La evaluación normativa integral continúa fuera del alcance actual.' : 'La utilización identifica el resultado gobernante. Los elementos marcados fuera de alcance requieren revisión especializada.'}</p></div></section></ViewShell>}
    <Suspense fallback={<section className="memo-empty"><h2>Preparando memoria de cálculo…</h2></section>}>
      {view === 'calculation' && isIsolated && <ViewShell number="05" title="Memoria de revisión" detail="Secuencia completa de datos, procedimiento, sustitución y resultados del motor."><CalculationMemo analysis={analysis} inputs={project.inputSnapshot} report={isolatedReport} cards={cards}/></ViewShell>}
      {view === 'calculation' && isStrip && <ViewShell number="05" title="Memoria de zapata corrida" detail="Revisión completa por franja longitudinal de un metro."><StripCalculationMemo analysis={stripAnalysis} inputs={project.stripInputSnapshot} report={stripReport} cards={cards}/></ViewShell>}
      {view === 'calculation' && isCombined && <ViewShell number="05" title="Memoria de zapata combinada" detail="Equilibrio, presión lineal y verificaciones de las dos columnas de punta a punta."><CombinedCalculationMemo analysis={combinedAnalysis} inputs={project.combinedInputSnapshot} report={combinedReport} cards={cards}/></ViewShell>}
      {view === 'calculation' && isStrap && <ViewShell number="05" title="Memoria de zapata medianera" detail="Excentricidad, transferencia, contacto, bases y viga documentados de punta a punta."><StrapCalculationMemo analysis={strapAnalysis} inputs={project.strapInputSnapshot} report={strapReport} cards={cards}/></ViewShell>}
      {view === 'calculation' && isTrapezoidal && <ViewShell number="05" title="Memoria de zapata trapezoidal" detail="Geometría, presión, reacción variable y verificaciones documentadas de punta a punta."><TrapezoidalCalculationMemo analysis={trapezoidalAnalysis} inputs={project.trapezoidalInputSnapshot} report={trapezoidalReport} cards={cards}/></ViewShell>}
      {view === 'calculation' && isEdge && <ViewShell number="05" title="Memoria de zapata excéntrica" detail="Excentricidad, tercio central, presión lineal y verificaciones documentadas de punta a punta."><EdgeCalculationMemo analysis={edgeAnalysis} inputs={project.edgeInputSnapshot} report={edgeReport} cards={cards}/></ViewShell>}
      {view === 'calculation' && isCorner && <ViewShell number="05" title="Memoria de zapata de esquina" detail="Dos momentos, interacción del núcleo, cuatro presiones y verificaciones documentadas de punta a punta."><CornerCalculationMemo analysis={cornerAnalysis} inputs={project.cornerInputSnapshot} report={cornerReport} cards={cards}/></ViewShell>}
      {view === 'calculation' && isMat && <ViewShell number="05" title="Memoria de losa de cimentación" detail="Columnas, equilibrio, cuatro presiones, asentamiento y límites documentados de punta a punta."><MatCalculationMemo analysis={matAnalysis} inputs={project.matInputSnapshot} report={matReport} cards={cards}/></ViewShell>}
    </Suspense>
    {view === 'theory' && isIsolated && <ViewShell number="06" title="Teoría y metodología" detail="Lectura técnica del caso y de los límites actuales."><section className="new-theory"><div className="load-path"><b>Columna</b><i>↓</i><b>Zapata</b><i>↓</i><b>Suelo</b></div><Theory title="Zapata aislada">Distribuye al suelo la carga de una columna. Esta aplicación modela una zapata rectangular con columna centrada y carga axial centrada.</Theory><Theory title="Contacto de servicio">La presión se compara con capacidad admisible declarada. La base bruta o neta debe coincidir con el informe geotécnico.</Theory><Theory title="Cortante, punzonamiento y flexión">Las líneas a profundidad efectiva representan cortante; el perímetro alrededor de la columna representa punzonamiento; la flexión se revisa en la cara de columna.</Theory><Theory title="Acero y desarrollo">La distribución inferior es preliminar. Área, separación y desarrollo se comparan con referencias de guía y no con un detalle definitivo de obra.</Theory><Theory title="Alcance y validación">No calcula momentos, excentricidad, presión no uniforme, zapatas combinadas, corridas, losas, capacidad portante ni asentamientos. “Dentro de referencia” no significa aprobado.</Theory></section></ViewShell>}
    {view === 'theory' && isStrip && <ViewShell number="06" title="Teoría de zapata corrida" detail="Comportamiento transversal de una cimentación continua bajo muro."><section className="new-theory"><div className="load-path"><b>Muro</b><i>↓</i><b>Franja de 1 m</b><i>↓</i><b>Suelo</b></div><Theory title="Modelo por metro lineal">La carga del muro se expresa en kN/m. Una franja longitudinal de 1.00 m transforma el problema en una sección transversal repetitiva.</Theory><Theory title="Contacto">Con muro centrado y sin momento, la reacción se considera uniforme y la presión se obtiene dividiendo la carga lineal total para el ancho B.</Theory><Theory title="Cortante y flexión transversal">Cada lado trabaja como un voladizo desde la cara del muro. El cortante se revisa a distancia d y el momento en la cara.</Theory><Theory title="Armado">El acero transversal resiste la flexión principal; el longitudinal funciona como distribución mínima dentro del alcance actual.</Theory><Theory title="Límites">No modela muros excéntricos, momentos, extremos, esquinas, aberturas, vigas de cimentación ni asentamientos diferenciales. El punzonamiento de columna no aplica al modelo continuo.</Theory></section></ViewShell>}
    {view === 'theory' && isCombined && <ViewShell number="06" title="Teoría de zapata combinada" detail="Equilibrio de dos columnas sobre una única base rectangular."><section className="new-theory"><div className="load-path"><b>Columna 1 + Columna 2</b><i>↓</i><b>Zapata rígida</b><i>↓</i><b>Suelo</b></div><Theory title="Resultante y centroide">Las cargas de ambas columnas producen una resultante. Su distancia al centro geométrico determina la pendiente de la presión de contacto.</Theory><Theory title="Contacto completo">La presión varía linealmente entre extremos. Si el mínimo resulta negativo, aparece levantamiento y la aplicación bloquea el caso en vez de analizar contacto parcial.</Theory><Theory title="Viga longitudinal">La zapata se interpreta como una viga cargada hacia arriba por el suelo y hacia abajo por las columnas. La integración genera cortante y momento en toda la longitud.</Theory><Theory title="Punzonamiento y flexión transversal">Cada columna conserva un perímetro interior completo; transversalmente se revisa el voladizo desde la cara de la columna gobernante.</Theory><Theory title="Límites">No incluye columnas de borde, momentos transmitidos, acciones horizontales, zapata trapezoidal, viga de equilibrio, asentamientos ni interacción suelo-estructura.</Theory></section></ViewShell>}
    {view === 'theory' && isStrap && <ViewShell number="06" title="Teoría de zapata medianera" detail="Cómo la viga centradora equilibra una columna excéntrica junto al lindero."><section className="new-theory"><div className="load-path"><b>Columna medianera</b><i>⇄</i><b>Viga centradora</b><i>⇄</i><b>Columna interior</b></div><Theory title="Por qué se usa">La columna junto al lindero no puede centrarse sobre su base. La viga rígida transmite el momento excéntrico hacia la base interior para conservar compresión bajo ambas zapatas.</Theory><Theory title="Equilibrio">El momento Pₑe produce una transferencia V=M/S. Esa transferencia aumenta la reacción exterior y reduce la interior sin alterar la suma total de cargas verticales.</Theory><Theory title="Contacto del suelo">Cada base se revisa por separado con presión uniforme. El tramo libre de la viga debe quedar sin contacto con el suelo y no aporta capacidad portante.</Theory><Theory title="Bases y viga">Las bases se revisan como voladizos en dos direcciones. La viga se revisa con el momento y el cortante transferidos, manteniendo sus resultados como referencias públicas trazables.</Theory><Theory title="Límites explícitos">El punzonamiento en los encuentros no se evalúa porque la viga atraviesa la región crítica. Tampoco se incluyen momentos de columna, fuerzas horizontales, asentamientos diferenciales, estribos, nudos ni detallado constructivo definitivo.</Theory></section></ViewShell>}
    {view === 'theory' && isTrapezoidal && <ViewShell number="06" title="Teoría de zapata trapezoidal" detail="Equilibrio de dos columnas sobre una base combinada de ancho variable."><section className="new-theory"><div className="load-path"><b>Dos columnas</b><i>↓</i><b>Trapecio rígido</b><i>↓</i><b>Suelo</b></div><Theory title="Por qué cambia el ancho">El trapecio desplaza el centroide del área hacia el extremo más ancho. Esto ayuda a acercarlo a la resultante de cargas cuando una base rectangular no distribuye convenientemente la presión.</Theory><Theory title="Presión por equilibrio">El motor no presupone que la presión sea uniforme: resuelve los coeficientes de q(x)=a+bx para satisfacer simultáneamente fuerza vertical y momento.</Theory><Theory title="Contacto completo">Los dos extremos deben permanecer comprimidos. Una presión negativa implica levantamiento y el caso se bloquea en lugar de recortar la base activa.</Theory><Theory title="Viga de ancho variable">Como q(x) y B(x) son lineales, la reacción w(x)=q(x)B(x) es cuadrática. Su integración genera los diagramas de cortante y momento.</Theory><Theory title="Límites">Solo se incluyen columnas interiores sobre el eje. No se modelan momentos transferidos, fuerzas horizontales, bordes, esquinas, contacto parcial, espesor variable ni asentamientos.</Theory></section></ViewShell>}
    {view === 'theory' && isEdge && <ViewShell number="06" title="Teoría de zapata excéntrica de borde" detail="Una columna junto al lindero sin viga centradora."><section className="new-theory"><div className="load-path"><b>Columna al borde</b><i>↓</i><b>Base excéntrica</b><i>↓</i><b>Presión lineal</b></div><Theory title="Origen de la excentricidad">La cara de la columna coincide con el lindero, por lo que su carga no pasa por el centroide de la base. El motor obtiene el momento directamente de esa distancia.</Theory><Theory title="Tercio central">Mientras la resultante permanezca dentro de L/6 desde el centroide, la distribución lineal conserva compresión en ambos extremos. Fuera de ese límite aparece contacto parcial y el caso se bloquea.</Theory><Theory title="Servicio y última">En servicio se incluyen peso propio y relleno centrados. Para la revisión estructural se usa la carga última declarada, sin crear combinaciones ni factores adicionales.</Theory><Theory title="Demandas estructurales">La presión lineal se integra para obtener cortante y momento. Las caras desiguales de la columna y los voladizos transversales se revisan de forma independiente.</Theory><Theory title="Punzonamiento y límites">El perímetro de una columna de borde está truncado. AndeLogic no reutiliza la referencia de columna interior: lo identifica como no evaluado. También quedan fuera contacto parcial, momento adicional, acciones horizontales, esquina, asentamientos y detallado definitivo.</Theory></section></ViewShell>}
    {view === 'theory' && isCorner && <ViewShell number="06" title="Teoría de zapata de esquina" detail="Una columna junto a dos linderos y excentricidad simultánea en X y Y."><section className="new-theory"><div className="load-path"><b>Columna en esquina</b><i>↓</i><b>Base biaxial</b><i>↓</i><b>Plano de presión</b></div><Theory title="Dos excentricidades">La carga de la columna está desplazada respecto del centroide en X y Y. Eso produce dos momentos y un plano lineal de presiones, no dos problemas aislados.</Theory><Theory title="Núcleo central biaxial">El contacto completo exige 6|ex|/L + 6|ey|/B ≤ 1. Verificar cada sexto por separado no basta porque la esquina opuesta recibe ambos efectos simultáneamente.</Theory><Theory title="Cuatro presiones">El motor calcula cada esquina del plano y bloquea el caso si cualquiera entra en tracción. En servicio incluye pesos centrados; en última usa la carga declarada.</Theory><Theory title="Demandas en X y Y">La presión se integra sobre franjas completas para cerrar fuerza, cortante y momento en ambas direcciones. Un análisis de placa más avanzado permanece fuera del alcance.</Theory><Theory title="Punzonamiento y límites">El perímetro está truncado por dos bordes y se informa como no evaluado. También se excluyen contacto parcial, momentos adicionales, fuerzas horizontales, torsión, asentamientos e interacción suelo-estructura.</Theory></section></ViewShell>}
    {view === 'theory' && isMat && <ViewShell number="06" title="Teoría de losa de cimentación" detail="Contacto global, pantalla Winkler y frontera del análisis estructural de placa."><section className="new-theory"><div className="load-path"><b>Múltiples columnas</b><i>↓</i><b>Losa rígida</b><i>↓</i><b>Suelo Winkler</b></div><Theory title="Resultante multicolumna">Cada carga aporta fuerza y momento respecto del centroide. La suma determina dos excentricidades y un único plano lineal de presiones.</Theory><Theory title="Contacto completo">La interacción 6|ex|/L + 6|ey|/B debe ser menor o igual que uno. Si una esquina entra en tracción, la hipótesis rígida de contacto completo deja de ser válida y el motor bloquea el caso.</Theory><Theory title="Asentamiento preliminar">Cuando se declara k, la pantalla usa s=q/k en cada esquina. k depende del suelo y también de tamaño, forma, profundidad y rigidez; por eso debe proceder de una evaluación compatible.</Theory><Theory title="Equilibrio, no diseño de placa">Las proyecciones X/Y demuestran que la presión recupera cargas y momentos. No representan franjas de diseño ni capturan redistribución por rigidez de la placa.</Theory><Theory title="Límites explícitos">Flexión, cortante, punzonamiento y armado no se evalúan todavía. También quedan fuera muros, momentos de columna, acciones horizontales, contacto parcial, consolidación, losas pilotadas y elementos finitos.</Theory></section></ViewShell>}
    <footer className="new-status" role="status"><span>Estado de sesión</span>{status}</footer><input className="visually-hidden" ref={importRef} type="file" accept="application/json,.json" onChange={(event) => void importFile(event.target.files?.[0])}/></main>
}

function ViewShell({ number, title, detail, children }: { number: string; title: string; detail: string; children: React.ReactNode }) { return <section className="new-view"><header><span>{number} · VISTA TÉCNICA</span><h1>{title}</h1><p>{detail}</p></header>{children}</section> }
function Theory({ title, children }: { title: string; children: React.ReactNode }) { return <article><h2>{title}</h2><p>{children}</p></article> }
