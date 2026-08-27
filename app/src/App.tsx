import { useEffect, useRef, useState } from 'react'
import {
  createNewProject,
  isProjectDocument,
  normalizeProjectDocument,
  type FootingInputs,
  type ProjectDocument,
} from './domain/projects'
import { checkCalculationReadiness } from './application/check-readiness'
import { calculatePreliminaryContact, type PreliminaryContactResult } from './domain/footing/preliminary-contact'
import { validateFootingInputs } from './domain/validation/footing-input'
import { FootingPlanDiagram } from './components/FootingPlanDiagram'
import { FootingElevationDiagram } from './components/FootingElevationDiagram'
import { browserProjectRepository } from './persistence/browser-project-repository'
import { moduleValidationCatalog } from './validation/benchmarks/catalog'
import './App.css'

type NumberField = keyof FootingInputs

const inputFields: Array<{ key: NumberField; label: string; unit: string }> = [
  { key: 'axialLoadKn', label: 'Carga axial centrada', unit: 'kN' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible del suelo', unit: 'kPa' },
  { key: 'columnWidthM', label: 'Ancho de columna', unit: 'm' },
  { key: 'columnLengthM', label: 'Largo de columna', unit: 'm' },
  { key: 'footingWidthM', label: 'Ancho preliminar de zapata', unit: 'm' },
  { key: 'footingLengthM', label: 'Largo preliminar de zapata', unit: 'm' },
  { key: 'footingThicknessM', label: 'Espesor preliminar de zapata', unit: 'm' },
]

function App() {
  const [project, setProject] = useState<ProjectDocument>(createNewProject)
  const [projects, setProjects] = useState<ProjectDocument[]>([])
  const [status, setStatus] = useState('Proyecto nuevo: aún no está guardado en este navegador.')
  const [preliminaryResult, setPreliminaryResult] = useState<PreliminaryContactResult | null>(null)
  const importInput = useRef<HTMLInputElement>(null)

  const refreshProjects = async () => {
    setProjects(await browserProjectRepository.list())
  }

  useEffect(() => {
    let isCurrent = true

    const loadStoredProjects = async () => {
      const storedProjects = await browserProjectRepository.list()
      if (isCurrent) setProjects(storedProjects)
    }

    void loadStoredProjects()
    return () => {
      isCurrent = false
    }
  }, [])

  const updateInput = (key: NumberField, value: string) => {
    setPreliminaryResult(null)
    setProject((current) => ({
      ...current,
      inputSnapshot: { ...current.inputSnapshot, [key]: Number(value) || 0 },
    }))
  }

  const saveProject = async () => {
    const savedProject = { ...project, updatedAt: new Date().toISOString() }
    await browserProjectRepository.save(savedProject)
    setProject(savedProject)
    await refreshProjects()
    setStatus('Guardado localmente en este navegador.')
  }

  const openProject = async (projectId: string) => {
    const savedProject = await browserProjectRepository.get(projectId)
    if (!savedProject) return
    setProject(savedProject)
    setPreliminaryResult(null)
    setStatus('Proyecto abierto desde la biblioteca local.')
  }

  const exportProject = () => {
    const content = JSON.stringify(project, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name.trim().replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase() || 'zapata'}.andelogic-footing-project.json`
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Archivo exportado. Guárdalo para abrirlo en otra computadora.')
  }

  const reviewScope = () => {
    const readiness = checkCalculationReadiness(project)
    if (readiness.status === 'invalid-input') {
      setStatus(readiness.issues.map((issue) => issue.message).join(' '))
      return
    }

    setStatus(readiness.reason)
  }

  const calculateContact = () => {
    const issues = validateFootingInputs(project.inputSnapshot)
    if (issues.length > 0) {
      setPreliminaryResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const result = calculatePreliminaryContact(project.inputSnapshot)
    setPreliminaryResult(result)
    setStatus('Resultado preliminar calculado. Revisa sus límites antes de usarlo para cualquier decisión.')
  }

  const printExperimentalReport = () => {
    window.print()
  }

  const importProject = async (file?: File) => {
    if (!file) return

    try {
      const candidate: unknown = JSON.parse(await file.text())
      if (!isProjectDocument(candidate)) {
        throw new Error('El archivo no corresponde al esquema compatible de AndeLogic Footing.')
      }

      const imported: ProjectDocument = {
        ...normalizeProjectDocument(candidate),
        projectId: crypto.randomUUID(),
        name: `Importado — ${candidate.name}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await browserProjectRepository.save(imported)
      setProject(imported)
      await refreshProjects()
      setStatus('Proyecto importado como una copia local. Conserva el archivo original como respaldo.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No fue posible importar el archivo.')
    } finally {
      if (importInput.current) importInput.current.value = ''
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="AndeLogic Footing">
          <span className="brand-mark">A</span>
          <span>AndeLogic <strong>Footing</strong></span>
        </a>
        <span className="prototype-badge">PROTOCOLO · PERSISTENCIA</span>
      </header>

      <section className="intro">
        <p className="eyebrow">Producto 01 · Ecuador</p>
        <h1>Diseño visible. Evidencia verificable.</h1>
        <p>
          Prototipo local-first para construir un calculador de zapatas auditable. Cada módulo normativo
          avanza con tu revisión de fuentes trazables y comparadores independientes.
        </p>
      </section>

      <section className="workspace" aria-label="Prototipo de proyecto">
        <aside className="project-list">
          <div className="section-heading">
            <p>Biblioteca local</p>
            <button type="button" className="text-button" onClick={() => {
              setProject(createNewProject())
              setPreliminaryResult(null)
              setStatus('Proyecto nuevo: guárdalo cuando quieras conservarlo.')
            }}>
              + Nuevo
            </button>
          </div>
          <p className="storage-note">Solo se guarda en este navegador y dispositivo.</p>
          {projects.length === 0 ? (
            <p className="empty-state">Aún no hay proyectos guardados.</p>
          ) : (
            <ul>
              {projects.map((item) => (
                <li key={item.projectId}>
                  <button
                    type="button"
                    className={item.projectId === project.projectId ? 'project-item selected' : 'project-item'}
                    onClick={() => void openProject(item.projectId)}
                  >
                    <strong>{item.name}</strong>
                    <span>{new Date(item.updatedAt).toLocaleString('es-EC')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="editor">
          <div className="editor-heading">
            <div>
              <p className="eyebrow">Documento de proyecto</p>
              <input
                className="project-name"
                value={project.name}
                onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))}
                aria-label="Nombre del proyecto"
              />
            </div>
            <span className="profile">{project.standardProfile}</span>
          </div>

          <div className="notice">
            <strong>Alcance actual:</strong> zapata aislada rectangular, columna centrada y carga axial. El contacto P/A es experimental; NEC/ACI está pendiente de tu revisión de trazabilidad y contrastes externos.
          </div>

          <section className="validation-panel" aria-labelledby="validation-title">
            <div className="validation-heading">
              <div>
                <p className="eyebrow">Control de confianza</p>
                <h2 id="validation-title">Estado real de los módulos</h2>
              </div>
              <span className="validation-lock">0 módulos liberados</span>
            </div>
            <div className="validation-grid">
              {moduleValidationCatalog.map((module) => (
                <article key={module.id} className={`validation-module ${module.state}`}>
                  <div>
                    <span className="module-state">
                      {module.state === 'internal-testing' ? 'Prueba interna' : module.state === 'approved' ? 'Aprobado' : 'Pendiente de revisión'}
                    </span>
                    <strong>{module.label}</strong>
                  </div>
                  <p>{module.note}</p>
                  <small>{module.completedExternalBenchmarks}/{module.requiredExternalBenchmarks} evidencias externas completas</small>
                </article>
              ))}
            </div>
          </section>

          <div className="technical-drawings">
            <FootingPlanDiagram
              footingWidthM={project.inputSnapshot.footingWidthM}
              footingLengthM={project.inputSnapshot.footingLengthM}
              columnWidthM={project.inputSnapshot.columnWidthM}
              columnLengthM={project.inputSnapshot.columnLengthM}
            />
            <FootingElevationDiagram
              footingWidthM={project.inputSnapshot.footingWidthM}
              columnWidthM={project.inputSnapshot.columnWidthM}
              footingThicknessM={project.inputSnapshot.footingThicknessM}
            />
          </div>

          <div className="field-grid">
            {inputFields.map(({ key, label, unit }) => (
              <label key={key}>
                <span>{label}</span>
                <div className="number-input">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={project.inputSnapshot[key]}
                    onChange={(event) => updateInput(key, event.target.value)}
                  />
                  <small>{unit}</small>
                </div>
              </label>
            ))}
          </div>

          <div className="actions">
            <button type="button" className="primary" onClick={calculateContact}>
              Calcular contacto preliminar
            </button>
            <button type="button" className="secondary" onClick={reviewScope}>
              Revisar alcance
            </button>
            <button type="button" className="primary" onClick={() => void saveProject()}>
              Guardar en este equipo
            </button>
            <button type="button" className="secondary" onClick={exportProject}>
              Descargar archivo
            </button>
            <button type="button" className="secondary" onClick={() => importInput.current?.click()}>
              Abrir archivo
            </button>
            {preliminaryResult && (
              <button type="button" className="secondary" onClick={printExperimentalReport}>
                Imprimir informe
              </button>
            )}
            <input
              ref={importInput}
              className="visually-hidden"
              type="file"
              accept="application/json,.json"
              onChange={(event) => void importProject(event.target.files?.[0])}
            />
          </div>
          {preliminaryResult && (
            <section className={preliminaryResult.status === 'pass' ? 'result-card pass' : 'result-card fail'} aria-live="polite">
              <p className="eyebrow">Resultado experimental · sin diseño normativo</p>
              <h2>{preliminaryResult.status === 'pass' ? 'Presión promedio dentro de la capacidad ingresada' : 'Presión promedio supera la capacidad ingresada'}</h2>
              <div className="result-grid">
                <p><span>Área bruta</span><strong>{preliminaryResult.grossAreaM2.toFixed(3)} m²</strong></p>
                <p><span>Área mínima orientativa</span><strong>{preliminaryResult.minimumRequiredAreaM2.toFixed(3)} m²</strong></p>
                <p><span>Lado cuadrado equivalente</span><strong>{preliminaryResult.equivalentSquareSideM.toFixed(3)} m</strong></p>
                <p><span>Presión promedio</span><strong>{preliminaryResult.contactPressureKpa.toFixed(2)} kPa</strong></p>
                <p><span>Capacidad ingresada</span><strong>{preliminaryResult.allowableBearingKpa.toFixed(2)} kPa</strong></p>
                <p><span>Utilización</span><strong>{(preliminaryResult.utilization * 100).toFixed(1)}%</strong></p>
              </div>
              <p className="result-limit">Área mínima orientativa = carga axial / capacidad admisible; el lado es solo su equivalente cuadrado. Supone carga axial centrada y presión uniforme. No incluye peso propio, combinaciones de carga, excentricidad, asentamientos, cortantes, punzonamiento, flexión ni armado.</p>
            </section>
          )}
          <p className="status" role="status">{status}</p>
        </section>
      </section>
    </main>
  )
}

export default App
