import { useEffect, useRef, useState } from 'react'
import {
  createNewProject,
  isProjectDocument,
  normalizeProjectDocument,
  type FootingInputs,
  type ProjectDocument,
} from './domain/projects'
import { checkCalculationReadiness } from './application/check-readiness'
import { calculateServiceContact, type ServiceContactResult } from './domain/footing/service-contact'
import { calculateOneWayShearDemand, type OneWayShearDemandResult } from './domain/footing/one-way-shear-demand'
import { calculatePunchingShearDemand, type PunchingShearDemandResult } from './domain/footing/punching-shear-demand'
import { calculateFlexureDemand, type FlexureDemandResult } from './domain/footing/flexure-demand'
import { calculateReinforcementLayout as buildReinforcementLayout, type ReinforcementLayoutResult } from './domain/footing/reinforcement-layout'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from './domain/footing/minimum-reinforcement'
import { calculateGuideRequiredReinforcement, type GuideRequiredReinforcementResult } from './domain/footing/required-reinforcement'
import { compareGuideReinforcement, type GuideReinforcementComparisonResult } from './domain/footing/reinforcement-comparison'
import { checkGuideOneWayShear, type GuideOneWayShearCheckResult } from './domain/footing/one-way-shear-guide-check'
import { checkGuidePunchingShear, type GuidePunchingShearResult } from './domain/footing/punching-shear-guide-check'
import { checkGuideDevelopmentLength, type GuideDevelopmentLengthResult } from './domain/footing/development-length-guide-check'
import { validateFootingInputs, validateGuideOneWayShearInputs, validateGuidePunchingShearInputs, validateGuideRequiredReinforcementInputs, validateOneWayShearInputs, validatePunchingShearInputs, validateFlexureInputs } from './domain/validation/footing-input'
import { FootingPlanDiagram } from './components/FootingPlanDiagram'
import { FootingElevationDiagram } from './components/FootingElevationDiagram'
import { FootingMomentDiagram } from './components/FootingMomentDiagram'
import { FootingResultDashboard } from './components/FootingResultDashboard'
import { browserProjectRepository } from './persistence/browser-project-repository'
import { moduleValidationCatalog } from './validation/benchmarks/catalog'
import './App.css'

type NumberField = Exclude<keyof FootingInputs, 'bearingCapacityBasis'>

const inputFields: Array<{ key: NumberField; label: string; unit: string }> = [
  { key: 'axialLoadKn', label: 'Carga de servicio centrada', unit: 'kN' },
  { key: 'factoredAxialLoadKn', label: 'Carga axial última declarada', unit: 'kN' },
  { key: 'allowableBearingKpa', label: 'Capacidad admisible declarada', unit: 'kPa' },
  { key: 'removedOverburdenKpa', label: 'Esfuerzo removido en desplante', unit: 'kPa' },
  { key: 'concreteUnitWeightKnM3', label: 'Peso unitario del hormigón', unit: 'kN/m³' },
  { key: 'soilCoverDepthM', label: 'Relleno sobre la zapata', unit: 'm' },
  { key: 'soilUnitWeightKnM3', label: 'Peso unitario del relleno', unit: 'kN/m³' },
  { key: 'columnWidthM', label: 'Ancho de columna', unit: 'm' },
  { key: 'columnLengthM', label: 'Largo de columna', unit: 'm' },
  { key: 'footingWidthM', label: 'Ancho preliminar de zapata', unit: 'm' },
  { key: 'footingLengthM', label: 'Largo preliminar de zapata', unit: 'm' },
  { key: 'footingThicknessM', label: 'Espesor preliminar de zapata', unit: 'm' },
  { key: 'concreteCoverM', label: 'Recubrimiento inferior', unit: 'm' },
  { key: 'barDiameterM', label: 'Diámetro de barra considerado', unit: 'm' },
  { key: 'concreteStrengthMpa', label: 'Resistencia del hormigón f′c', unit: 'MPa' },
  { key: 'steelYieldStrengthMpa', label: 'Fluencia del acero fy', unit: 'MPa' },
  { key: 'developmentAvailableLengthWidthM', label: 'Longitud disponible de desarrollo · B', unit: 'm' },
  { key: 'developmentAvailableLengthLengthM', label: 'Longitud disponible de desarrollo · L', unit: 'm' },
  { key: 'punchingCriticalSectionOffsetM', label: 'Distancia al perímetro crítico de punzonamiento', unit: 'm' },
  { key: 'barsParallelToWidthMaxSpacingM', label: 'Separación máxima: barras paralelas a B', unit: 'm' },
  { key: 'barsParallelToLengthMaxSpacingM', label: 'Separación máxima: barras paralelas a L', unit: 'm' },
]

const inputHelp: Record<NumberField, string> = {
  axialLoadKn: 'Carga de uso normal. Tómala del análisis estructural o de la hoja de cargas.',
  factoredAxialLoadKn: 'Carga para revisar resistencia. Proviene de una combinación última del análisis estructural.',
  allowableBearingKpa: 'Dato del informe geotécnico. No lo calcula esta aplicación.',
  removedOverburdenKpa: 'Presión del suelo excavado, solo si tu informe trabaja con capacidad neta.',
  concreteUnitWeightKnM3: 'Peso propio del hormigón. Usa el valor especificado para tu material.',
  soilCoverDepthM: 'Altura de relleno que queda sobre la zapata después de construirla.',
  soilUnitWeightKnM3: 'Peso del suelo de relleno. Busca el valor en el informe geotécnico.',
  columnWidthM: 'Dimensión menor de la columna que llega a la zapata, tomada del plano estructural.',
  columnLengthM: 'La otra dimensión de la columna, tomada del plano estructural.',
  footingWidthM: 'Dimensión B de la zapata que estás proponiendo o verificando.',
  footingLengthM: 'Dimensión L de la zapata que estás proponiendo o verificando.',
  footingThicknessM: 'Espesor h que propones para la zapata.',
  concreteCoverM: 'Distancia desde la cara inferior del hormigón hasta la barra. Sale del detalle constructivo.',
  barDiameterM: 'Diámetro de las barras inferiores que deseas revisar.',
  concreteStrengthMpa: 'Resistencia f′c indicada en las especificaciones del hormigón.',
  steelYieldStrengthMpa: 'Fluencia fy indicada para las barras de acero usadas.',
  developmentAvailableLengthWidthM: 'Largo recto disponible para anclar una barra en B, medido desde el detalle real.',
  developmentAvailableLengthLengthM: 'Largo recto disponible para anclar una barra en L, medido desde el detalle real.',
  punchingCriticalSectionOffsetM: 'Distancia de la sección que quieres analizar para la demanda de punzonamiento.',
  barsParallelToWidthMaxSpacingM: 'Máxima separación deseada entre las barras que van en dirección B.',
  barsParallelToLengthMaxSpacingM: 'Máxima separación deseada entre las barras que van en dirección L.',
}

function App() {
  const [project, setProject] = useState<ProjectDocument>(createNewProject)
  const [projects, setProjects] = useState<ProjectDocument[]>([])
  const [status, setStatus] = useState('Proyecto nuevo: aún no está guardado en este navegador.')
  const [serviceContactResult, setServiceContactResult] = useState<ServiceContactResult | null>(null)
  const [oneWayShearResult, setOneWayShearResult] = useState<OneWayShearDemandResult | null>(null)
  const [punchingShearResult, setPunchingShearResult] = useState<PunchingShearDemandResult | null>(null)
  const [flexureResult, setFlexureResult] = useState<FlexureDemandResult | null>(null)
  const [reinforcementLayout, setReinforcementLayout] = useState<ReinforcementLayoutResult | null>(null)
  const [minimumReinforcementResult, setMinimumReinforcementResult] = useState<MinimumReinforcementResult | null>(null)
  const [requiredReinforcementResult, setRequiredReinforcementResult] = useState<GuideRequiredReinforcementResult | null>(null)
  const [reinforcementComparisonResult, setReinforcementComparisonResult] = useState<GuideReinforcementComparisonResult | null>(null)
  const [oneWayShearGuideResult, setOneWayShearGuideResult] = useState<GuideOneWayShearCheckResult | null>(null)
  const [punchingShearGuideResult, setPunchingShearGuideResult] = useState<GuidePunchingShearResult | null>(null)
  const [developmentLengthResult, setDevelopmentLengthResult] = useState<GuideDevelopmentLengthResult | null>(null)
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
    setServiceContactResult(null)
    setOneWayShearResult(null)
    setPunchingShearResult(null)
    setFlexureResult(null)
    setReinforcementLayout(null)
    setMinimumReinforcementResult(null)
    setRequiredReinforcementResult(null)
    setReinforcementComparisonResult(null)
    setOneWayShearGuideResult(null)
    setPunchingShearGuideResult(null)
    setDevelopmentLengthResult(null)
    setProject((current) => ({
      ...current,
      inputSnapshot: { ...current.inputSnapshot, [key]: Number(value) || 0 },
    }))
  }

  const updateBearingCapacityBasis = (basis: FootingInputs['bearingCapacityBasis']) => {
    setServiceContactResult(null)
    setOneWayShearResult(null)
    setPunchingShearResult(null)
    setFlexureResult(null)
    setReinforcementLayout(null)
    setMinimumReinforcementResult(null)
    setRequiredReinforcementResult(null)
    setReinforcementComparisonResult(null)
    setOneWayShearGuideResult(null)
    setPunchingShearGuideResult(null)
    setDevelopmentLengthResult(null)
    setProject((current) => ({
      ...current,
      inputSnapshot: { ...current.inputSnapshot, bearingCapacityBasis: basis },
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
    setServiceContactResult(null)
    setOneWayShearResult(null)
    setPunchingShearResult(null)
    setFlexureResult(null)
    setReinforcementLayout(null)
    setMinimumReinforcementResult(null)
    setRequiredReinforcementResult(null)
    setReinforcementComparisonResult(null)
    setOneWayShearGuideResult(null)
    setPunchingShearGuideResult(null)
    setDevelopmentLengthResult(null)
    setStatus('Proyecto abierto desde la biblioteca local.')
  }

  const exportProject = () => {
    const content = JSON.stringify(project, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.name.trim().replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase() || 'zapata'}.andelogic-zapatas-project.json`
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
    setServiceContactResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const { inputSnapshot } = project
    const result = calculateServiceContact({
      appliedServiceLoadKn: inputSnapshot.axialLoadKn,
      footingWidthM: inputSnapshot.footingWidthM,
      footingLengthM: inputSnapshot.footingLengthM,
      footingThicknessM: inputSnapshot.footingThicknessM,
      concreteUnitWeightKnM3: inputSnapshot.concreteUnitWeightKnM3,
      soilCoverDepthM: inputSnapshot.soilCoverDepthM,
      soilUnitWeightKnM3: inputSnapshot.soilUnitWeightKnM3,
      allowableBearingKpa: inputSnapshot.allowableBearingKpa,
      bearingCapacityBasis: inputSnapshot.bearingCapacityBasis,
      removedOverburdenKpa: inputSnapshot.removedOverburdenKpa,
    })
    setServiceContactResult(result)
    setStatus('Contacto de servicio calculado. Confirma que capacidad y presión usan la misma base: bruta o neta.')
  }

  const calculateOneWayShear = () => {
    const issues = validateOneWayShearInputs(project.inputSnapshot)
    if (issues.length > 0) {
      setOneWayShearResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const inputs = project.inputSnapshot
    const result = calculateOneWayShearDemand({
      factoredAxialLoadKn: inputs.factoredAxialLoadKn,
      footingWidthM: inputs.footingWidthM,
      footingLengthM: inputs.footingLengthM,
      columnWidthM: inputs.columnWidthM,
      columnLengthM: inputs.columnLengthM,
      footingThicknessM: inputs.footingThicknessM,
      concreteCoverM: inputs.concreteCoverM,
      barDiameterM: inputs.barDiameterM,
    })

    setOneWayShearResult(result)
    setStatus('Demanda de cortante calculada en ambos ejes. La resistencia normativa continúa pendiente de revisión.')
  }

  const checkGuideOneWayShearReference = () => {
    const issues = validateGuideOneWayShearInputs(project.inputSnapshot)
    if (issues.length > 0) {
      setOneWayShearGuideResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const inputs = project.inputSnapshot
    const demand = calculateOneWayShearDemand({
      factoredAxialLoadKn: inputs.factoredAxialLoadKn,
      footingWidthM: inputs.footingWidthM,
      footingLengthM: inputs.footingLengthM,
      columnWidthM: inputs.columnWidthM,
      columnLengthM: inputs.columnLengthM,
      footingThicknessM: inputs.footingThicknessM,
      concreteCoverM: inputs.concreteCoverM,
      barDiameterM: inputs.barDiameterM,
    })
    const result = checkGuideOneWayShear({
      concreteStrengthMpa: inputs.concreteStrengthMpa,
      effectiveDepthM: demand.effectiveDepthM,
      widthShearDemandKn: demand.widthDirection.shearDemandKn,
      widthSectionWidthM: demand.widthDirection.tributaryWidthM,
      lengthShearDemandKn: demand.lengthDirection.shearDemandKn,
      lengthSectionWidthM: demand.lengthDirection.tributaryWidthM,
    })
    setOneWayShearResult(demand)
    setOneWayShearGuideResult(result)
    setStatus('Cortante unidireccional comparado con la referencia de guía. El resultado no constituye todavía una verificación NEC liberada.')
  }

  const calculatePunchingShear = () => {
    const issues = validatePunchingShearInputs(project.inputSnapshot)
    if (issues.length > 0) {
      setPunchingShearResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const inputs = project.inputSnapshot
    const result = calculatePunchingShearDemand({
      factoredAxialLoadKn: inputs.factoredAxialLoadKn,
      footingWidthM: inputs.footingWidthM,
      footingLengthM: inputs.footingLengthM,
      columnWidthM: inputs.columnWidthM,
      columnLengthM: inputs.columnLengthM,
      criticalSectionOffsetM: inputs.punchingCriticalSectionOffsetM,
    })

    setPunchingShearResult(result)
    setStatus('Demanda de punzonamiento calculada. La distancia del perímetro es una hipótesis declarada; la resistencia NEC continúa pendiente.')
  }

  const checkGuidePunchingShearReference = () => {
    const issues = validateGuidePunchingShearInputs(project.inputSnapshot)
    if (issues.length > 0) {
      setPunchingShearGuideResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const inputs = project.inputSnapshot
    try {
      const result = checkGuidePunchingShear({
        concreteStrengthMpa: inputs.concreteStrengthMpa,
        factoredAxialLoadKn: inputs.factoredAxialLoadKn,
        footingWidthM: inputs.footingWidthM,
        footingLengthM: inputs.footingLengthM,
        columnWidthM: inputs.columnWidthM,
        columnLengthM: inputs.columnLengthM,
        effectiveDepthM: inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2,
      })
      setPunchingShearGuideResult(result)
      setStatus('Punzonamiento comparado con la referencia de guía para columna interior centrada. No es una verificación NEC liberada.')
    } catch (error) {
      setPunchingShearGuideResult(null)
      setStatus(error instanceof Error ? error.message : 'No fue posible revisar el punzonamiento de guía.')
    }
  }

  const calculateFlexure = () => {
    const issues = validateFlexureInputs(project.inputSnapshot)
    if (issues.length > 0) {
      setFlexureResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const inputs = project.inputSnapshot
    const result = calculateFlexureDemand({
      factoredAxialLoadKn: inputs.factoredAxialLoadKn,
      footingWidthM: inputs.footingWidthM,
      footingLengthM: inputs.footingLengthM,
      columnWidthM: inputs.columnWidthM,
      columnLengthM: inputs.columnLengthM,
    })

    setFlexureResult(result)
    setStatus('Demanda de flexión calculada en ambas direcciones. El diseño de acero y la resistencia NEC continúan pendientes.')
  }

  const calculateReinforcementLayout = () => {
    const inputs = project.inputSnapshot
    try {
      const result = buildReinforcementLayout({
        footingWidthM: inputs.footingWidthM,
        footingLengthM: inputs.footingLengthM,
        concreteCoverM: inputs.concreteCoverM,
        barDiameterM: inputs.barDiameterM,
        barsParallelToWidthMaxSpacingM: inputs.barsParallelToWidthMaxSpacingM,
        barsParallelToLengthMaxSpacingM: inputs.barsParallelToLengthMaxSpacingM,
      })
      setReinforcementLayout(result)
      setStatus('Plano geométrico de barras calculado. La separación es declarada y no equivale a un diseño de acero.')
    } catch (error) {
      setReinforcementLayout(null)
      setStatus(error instanceof Error ? error.message : 'No fue posible calcular el plano de barras.')
    }
  }

  const calculateGuideMinimumSteel = () => {
    const inputs = project.inputSnapshot
    try {
      const layout = buildReinforcementLayout({
        footingWidthM: inputs.footingWidthM,
        footingLengthM: inputs.footingLengthM,
        concreteCoverM: inputs.concreteCoverM,
        barDiameterM: inputs.barDiameterM,
        barsParallelToWidthMaxSpacingM: inputs.barsParallelToWidthMaxSpacingM,
        barsParallelToLengthMaxSpacingM: inputs.barsParallelToLengthMaxSpacingM,
      })
      const result = calculateGuideMinimumReinforcement({
        footingThicknessM: inputs.footingThicknessM,
        barDiameterM: inputs.barDiameterM,
        barsParallelToWidthSpacingM: layout.barsParallelToWidth.actualSpacingM,
        barsParallelToLengthSpacingM: layout.barsParallelToLength.actualSpacingM,
      })
      setReinforcementLayout(layout)
      setMinimumReinforcementResult(result)
      setStatus('Referencia de acero mínimo de la guía calculada con la separación real del plano. Aún no sustituye el diseño de acero requerido por flexión.')
    } catch (error) {
      setMinimumReinforcementResult(null)
      setStatus(error instanceof Error ? error.message : 'No fue posible revisar el acero mínimo de guía.')
    }
  }

  const calculateGuideRequiredSteel = () => {
    const inputs = project.inputSnapshot
    const issues = validateGuideRequiredReinforcementInputs(inputs)
    if (issues.length > 0) {
      setRequiredReinforcementResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    const flexure = calculateFlexureDemand({
      factoredAxialLoadKn: inputs.factoredAxialLoadKn,
      footingWidthM: inputs.footingWidthM,
      footingLengthM: inputs.footingLengthM,
      columnWidthM: inputs.columnWidthM,
      columnLengthM: inputs.columnLengthM,
    })
    const result = calculateGuideRequiredReinforcement({
      concreteStrengthMpa: inputs.concreteStrengthMpa,
      steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
      effectiveDepthM: inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2,
      widthMomentDemandKnM: flexure.widthDirection.momentDemandKnM,
      widthStripWidthM: flexure.widthDirection.stripWidthM,
      lengthMomentDemandKnM: flexure.lengthDirection.momentDemandKnM,
      lengthStripWidthM: flexure.lengthDirection.stripWidthM,
    })
    setFlexureResult(flexure)
    setRequiredReinforcementResult(result)
    setStatus('Acero requerido de referencia calculado con los momentos visibles. Revisa también el acero mínimo y el detallado.')
  }

  const checkGuideDevelopmentLengthReference = () => {
    const inputs = project.inputSnapshot
    try {
      const result = checkGuideDevelopmentLength({
        concreteStrengthMpa: inputs.concreteStrengthMpa,
        steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
        barDiameterM: inputs.barDiameterM,
        availableLengthWidthM: inputs.developmentAvailableLengthWidthM,
        availableLengthLengthM: inputs.developmentAvailableLengthLengthM,
      })
      setDevelopmentLengthResult(result)
      setStatus('Longitud de desarrollo comparada con la referencia de guía. Revisa que los largos declarados correspondan al detalle real.')
    } catch (error) {
      setDevelopmentLengthResult(null)
      setStatus(error instanceof Error ? error.message : 'No fue posible revisar la longitud de desarrollo.')
    }
  }

  const compareGuideSteel = () => {
    const inputs = project.inputSnapshot
    const issues = validateGuideRequiredReinforcementInputs(inputs)
    if (issues.length > 0) {
      setReinforcementComparisonResult(null)
      setOneWayShearGuideResult(null)
      setPunchingShearGuideResult(null)
      setDevelopmentLengthResult(null)
      setStatus(issues.map((issue) => issue.message).join(' '))
      return
    }

    try {
      const layout = buildReinforcementLayout({
        footingWidthM: inputs.footingWidthM,
        footingLengthM: inputs.footingLengthM,
        concreteCoverM: inputs.concreteCoverM,
        barDiameterM: inputs.barDiameterM,
        barsParallelToWidthMaxSpacingM: inputs.barsParallelToWidthMaxSpacingM,
        barsParallelToLengthMaxSpacingM: inputs.barsParallelToLengthMaxSpacingM,
      })
      const minimum = calculateGuideMinimumReinforcement({
        footingThicknessM: inputs.footingThicknessM,
        barDiameterM: inputs.barDiameterM,
        barsParallelToWidthSpacingM: layout.barsParallelToWidth.actualSpacingM,
        barsParallelToLengthSpacingM: layout.barsParallelToLength.actualSpacingM,
      })
      const flexure = calculateFlexureDemand({
        factoredAxialLoadKn: inputs.factoredAxialLoadKn,
        footingWidthM: inputs.footingWidthM,
        footingLengthM: inputs.footingLengthM,
        columnWidthM: inputs.columnWidthM,
        columnLengthM: inputs.columnLengthM,
      })
      const required = calculateGuideRequiredReinforcement({
        concreteStrengthMpa: inputs.concreteStrengthMpa,
        steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
        effectiveDepthM: inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2,
        widthMomentDemandKnM: flexure.widthDirection.momentDemandKnM,
        widthStripWidthM: flexure.widthDirection.stripWidthM,
        lengthMomentDemandKnM: flexure.lengthDirection.momentDemandKnM,
        lengthStripWidthM: flexure.lengthDirection.stripWidthM,
      })
      const comparison = compareGuideReinforcement({
        minimumAreaPerMeterMm2: minimum.minimumAreaPerMeterMm2,
        widthProvidedAreaPerMeterMm2: minimum.barsParallelToWidth.providedAreaPerMeterMm2,
        lengthProvidedAreaPerMeterMm2: minimum.barsParallelToLength.providedAreaPerMeterMm2,
        widthRequiredAreaPerMeterMm2: required.widthDirection.requiredAreaPerMeterMm2,
        lengthRequiredAreaPerMeterMm2: required.lengthDirection.requiredAreaPerMeterMm2,
      })
      setFlexureResult(flexure)
      setReinforcementLayout(layout)
      setMinimumReinforcementResult(minimum)
      setRequiredReinforcementResult(required)
      setReinforcementComparisonResult(comparison)
      setStatus('Comparación integrada de acero terminada. Es una referencia de guía; el detallado y las resistencias pendientes siguen visibles.')
    } catch (error) {
      setReinforcementComparisonResult(null)
      setStatus(error instanceof Error ? error.message : 'No fue posible comparar el acero de referencia.')
    }
  }

  const printExperimentalReport = () => {
    window.print()
  }

  const importProject = async (file?: File) => {
    if (!file) return

    try {
      const candidate: unknown = JSON.parse(await file.text())
      if (!isProjectDocument(candidate)) {
        throw new Error('El archivo no corresponde al esquema compatible de AndeLogic Zapatas.')
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
        <a className="brand" href="/" aria-label="AndeLogic Engineering Zapatas">
          <span className="brand-mark">A</span>
          <span>AndeLogic <strong>Zapatas</strong></span>
        </a>
        <span className="prototype-badge">PROTOCOLO · PERSISTENCIA</span>
      </header>

      <section className="intro">
        <p className="eyebrow">AndeLogic Engineering · Producto 01 · Ecuador</p>
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
      setServiceContactResult(null)
      setOneWayShearResult(null)
      setPunchingShearResult(null)
      setFlexureResult(null)
      setReinforcementLayout(null)
      setMinimumReinforcementResult(null)
      setRequiredReinforcementResult(null)
      setReinforcementComparisonResult(null)
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
            <strong>Alcance actual:</strong> zapata aislada rectangular y columna centrada. Calcula contacto de servicio y demandas de cortante, punzonamiento y flexión; la resistencia normativa sigue pendiente de revisión.
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
              effectiveDepthM={project.inputSnapshot.footingThicknessM - project.inputSnapshot.concreteCoverM - project.inputSnapshot.barDiameterM / 2}
              punchingCriticalSectionOffsetM={project.inputSnapshot.punchingCriticalSectionOffsetM}
            />
            <FootingElevationDiagram
              footingWidthM={project.inputSnapshot.footingWidthM}
              columnWidthM={project.inputSnapshot.columnWidthM}
              footingThicknessM={project.inputSnapshot.footingThicknessM}
            />
            {flexureResult && <FootingMomentDiagram result={flexureResult} />}
          </div>

          <section className="input-stage" aria-labelledby="input-stage-title">
            <div className="stage-heading">
              <div><p className="eyebrow">Paso 1</p><h2 id="input-stage-title">Describe tu zapata</h2></div>
              <p>Ingresa datos de tu plano, análisis estructural e informe geotécnico. Ningún valor se estima en silencio.</p>
            </div>
            <div className="input-guide">
              <p><strong>Cargas y suelo:</strong> provienen del análisis estructural y del informe geotécnico.</p>
              <p><strong>Geometría y armado:</strong> provienen de tu anteproyecto, planos o detalle que estás revisando.</p>
              <p><strong>Materiales:</strong> usa los valores especificados para el hormigón y las barras del caso.</p>
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
                <small className="input-help">{inputHelp[key]}</small>
              </label>
            ))}
          </div>

          <label className="basis-select">
            <span>Base de la capacidad declarada</span>
            <select
              value={project.inputSnapshot.bearingCapacityBasis}
              onChange={(event) => updateBearingCapacityBasis(event.target.value as FootingInputs['bearingCapacityBasis'])}
            >
              <option value="gross">Bruta: comparar presión bruta</option>
              <option value="net">Neta: descontar esfuerzo removido</option>
            </select>
            <small>Usa exactamente la base indicada en el informe geotécnico.</small>
          </label>
          </section>

          <section className="action-stage" aria-labelledby="action-stage-title">
            <div className="stage-heading"><div><p className="eyebrow">Paso 2</p><h2 id="action-stage-title">Revisa por etapas</h2></div><p>Empieza por el suelo; después revisa cortantes, flexión y armado.</p></div>
            <div className="action-groups">
              <div className="action-group"><span>Suelo</span><button type="button" className="primary" onClick={calculateContact}>Revisar contacto de servicio</button><button type="button" className="secondary" onClick={reviewScope}>Ver alcance</button></div>
              <div className="action-group"><span>Cortantes</span><button type="button" className="primary" onClick={calculateOneWayShear}>Demanda unidireccional</button><button type="button" className="secondary" onClick={checkGuideOneWayShearReference}>Referencia de cortante</button><button type="button" className="primary" onClick={calculatePunchingShear}>Demanda de punzonamiento</button><button type="button" className="secondary" onClick={checkGuidePunchingShearReference}>Referencia de punzonamiento</button></div>
              <div className="action-group"><span>Flexión y barras</span><button type="button" className="primary" onClick={calculateFlexure}>Calcular flexión</button><button type="button" className="secondary" onClick={calculateReinforcementLayout}>Ver distribución</button><button type="button" className="secondary" onClick={calculateGuideMinimumSteel}>Acero mínimo</button><button type="button" className="secondary" onClick={calculateGuideRequiredSteel}>Acero requerido</button><button type="button" className="primary" onClick={compareGuideSteel}>Comparar acero</button><button type="button" className="secondary" onClick={checkGuideDevelopmentLengthReference}>Revisar desarrollo</button></div>
              <div className="action-group"><span>Proyecto</span><button type="button" className="primary" onClick={() => void saveProject()}>Guardar en este equipo</button><button type="button" className="secondary" onClick={exportProject}>Descargar archivo</button><button type="button" className="secondary" onClick={() => importInput.current?.click()}>Abrir archivo</button>{(serviceContactResult || oneWayShearResult || punchingShearResult || flexureResult || reinforcementLayout || minimumReinforcementResult || requiredReinforcementResult || reinforcementComparisonResult || oneWayShearGuideResult || punchingShearGuideResult || developmentLengthResult) && (<button type="button" className="secondary" onClick={printExperimentalReport}>Imprimir informe</button>)}</div>
            </div>
            <input
              ref={importInput}
              className="visually-hidden"
              type="file"
              accept="application/json,.json"
              onChange={(event) => void importProject(event.target.files?.[0])}
            />
          </section>
          <section className="results-stage" aria-labelledby="results-stage-title">
            <div className="stage-heading"><div><p className="eyebrow">Paso 3</p><h2 id="results-stage-title">Entiende los resultados</h2></div><p>Revisa primero el tablero; luego abre las tarjetas para ver el detalle y los límites.</p></div>
            <FootingResultDashboard contact={serviceContactResult} oneWay={oneWayShearGuideResult} punching={punchingShearGuideResult} reinforcement={reinforcementComparisonResult} />
          </section>
          {serviceContactResult && (
            <section className={serviceContactResult.status === 'pass' ? 'result-card pass' : 'result-card fail'} aria-live="polite">
              <p className="eyebrow">Contacto de servicio · sin diseño estructural</p>
              <h2>{serviceContactResult.status === 'pass' ? 'Presión de servicio dentro de la capacidad declarada' : 'Presión de servicio supera la capacidad declarada'}</h2>
              <div className="result-grid">
                <p><span>Área de zapata</span><strong>{serviceContactResult.grossAreaM2.toFixed(3)} m²</strong></p>
                <p><span>Peso propio</span><strong>{serviceContactResult.footingSelfWeightKn.toFixed(2)} kN</strong></p>
                <p><span>Peso de relleno</span><strong>{serviceContactResult.soilCoverWeightKn.toFixed(2)} kN</strong></p>
                <p><span>Carga total de servicio</span><strong>{serviceContactResult.totalServiceLoadKn.toFixed(2)} kN</strong></p>
                <p><span>Presión bruta</span><strong>{serviceContactResult.grossContactPressureKpa.toFixed(2)} kPa</strong></p>
                <p><span>Presión neta</span><strong>{serviceContactResult.netContactPressureKpa.toFixed(2)} kPa</strong></p>
                <p><span>Presión comparada ({serviceContactResult.bearingCapacityBasis === 'gross' ? 'bruta' : 'neta'})</span><strong>{serviceContactResult.pressureForComparisonKpa.toFixed(2)} kPa</strong></p>
                <p><span>Capacidad declarada</span><strong>{serviceContactResult.allowableBearingKpa.toFixed(2)} kPa</strong></p>
                <p><span>Área mínima orientativa</span><strong>{serviceContactResult.minimumRequiredAreaM2 === null ? 'No existe con los datos' : `${serviceContactResult.minimumRequiredAreaM2.toFixed(3)} m²`}</strong></p>
                <p><span>Lado cuadrado equivalente</span><strong>{serviceContactResult.equivalentSquareSideM === null ? 'No aplica' : `${serviceContactResult.equivalentSquareSideM.toFixed(3)} m`}</strong></p>
                <p><span>Utilización</span><strong>{(serviceContactResult.utilization * 100).toFixed(1)}%</strong></p>
              </div>
              <p className="result-limit">La comparación es válida solo si presión y capacidad usan la misma base. La presión neta descuenta el esfuerzo removido declarado en el desplante. Supone carga centrada y presión uniforme; no incluye asentamientos, excentricidad, volcamiento, deslizamiento, cortantes, punzonamiento, flexión ni armado.</p>
            </section>
          )}
          {oneWayShearResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Cortante unidireccional · demanda por equilibrio</p>
              <h2>Acción calculada en las dos direcciones</h2>
              <div className="result-grid">
                <p><span>Carga axial última</span><strong>{oneWayShearResult.factoredAxialLoadKn.toFixed(2)} kN</strong></p>
                <p><span>Presión última uniforme</span><strong>{oneWayShearResult.factoredContactPressureKpa.toFixed(2)} kPa</strong></p>
                <p><span>Profundidad efectiva d</span><strong>{oneWayShearResult.effectiveDepthM.toFixed(3)} m</strong></p>
                <p><span>Voladizo en ancho B</span><strong>{oneWayShearResult.widthDirection.cantileverProjectionM.toFixed(3)} m</strong></p>
                <p><span>Longitud cargada exterior · B</span><strong>{oneWayShearResult.widthDirection.loadedLengthBeyondSectionM.toFixed(3)} m</strong></p>
                <p><span>Demanda Vᵤ · dirección B</span><strong>{oneWayShearResult.widthDirection.shearDemandKn.toFixed(2)} kN</strong></p>
                <p><span>Voladizo en largo L</span><strong>{oneWayShearResult.lengthDirection.cantileverProjectionM.toFixed(3)} m</strong></p>
                <p><span>Longitud cargada exterior · L</span><strong>{oneWayShearResult.lengthDirection.loadedLengthBeyondSectionM.toFixed(3)} m</strong></p>
                <p><span>Demanda Vᵤ · dirección L</span><strong>{oneWayShearResult.lengthDirection.shearDemandKn.toFixed(2)} kN</strong></p>
                <p><span>Dirección gobernante</span><strong>{oneWayShearResult.governingDirection === 'equal' ? 'Iguales' : oneWayShearResult.governingDirection === 'width' ? 'Ancho B' : 'Largo L'}</strong></p>
                <p><span>Demanda gobernante</span><strong>{oneWayShearResult.governingShearDemandKn.toFixed(2)} kN</strong></p>
              </div>
              <p className="result-limit">La presión última se obtiene de la carga axial última declarada dividida para el área de la zapata. Las líneas discontinuas del plano representan la sección evaluada a una distancia d de cada cara. Este resultado es solo demanda: todavía no calcula φVᶜ, utilización ni cumplimiento NEC.</p>
            </section>
          )}
          {oneWayShearGuideResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Cortante unidireccional · referencia de guía NEC 2015</p>
              <h2>Demanda frente a resistencia de referencia</h2>
              <div className="result-grid">
                <p><span>f′c declarado</span><strong>{oneWayShearGuideResult.concreteStrengthMpa.toFixed(2)} MPa</strong></p>
                <p><span>Profundidad efectiva usada</span><strong>{oneWayShearGuideResult.effectiveDepthM.toFixed(3)} m</strong></p>
                <p><span>Tensión de cortante de referencia</span><strong>{oneWayShearGuideResult.concreteShearStressMpa.toFixed(3)} MPa</strong></p>
                <p><span>Factor de reducción de guía</span><strong>φ = {oneWayShearGuideResult.strengthReductionFactor.toFixed(2)}</strong></p>
                <p><span>Resistencia de referencia · B</span><strong>{oneWayShearGuideResult.widthDirection.designShearStrengthKn.toFixed(2)} kN</strong></p>
                <p><span>Utilización · B</span><strong>{(oneWayShearGuideResult.widthDirection.utilization * 100).toFixed(1)}%</strong></p>
                <p><span>Estado · B</span><strong>{oneWayShearGuideResult.widthDirection.status === 'meets-guide-reference' ? 'Alcanza referencia de guía' : 'No alcanza referencia de guía'}</strong></p>
                <p><span>Resistencia de referencia · L</span><strong>{oneWayShearGuideResult.lengthDirection.designShearStrengthKn.toFixed(2)} kN</strong></p>
                <p><span>Utilización · L</span><strong>{(oneWayShearGuideResult.lengthDirection.utilization * 100).toFixed(1)}%</strong></p>
                <p><span>Estado · L</span><strong>{oneWayShearGuideResult.lengthDirection.status === 'meets-guide-reference' ? 'Alcanza referencia de guía' : 'No alcanza referencia de guía'}</strong></p>
              </div>
              <p className="result-limit">Resultado limitado al procedimiento del ejemplo de la Guía práctica conforme a NEC 2015, sección 1.10.1, para hormigón de peso normal y la presión uniforme del alcance actual. No cubre presión no uniforme, excentricidad, sismo, armadura de cortante u otros requisitos del perfil NEC. Sigue siendo una referencia de guía, no una liberación normativa.</p>
            </section>
          )}
          {punchingShearResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Punzonamiento · demanda por equilibrio</p>
              <h2>Acción en el perímetro crítico declarado</h2>
              <div className="result-grid">
                <p><span>Presión última uniforme</span><strong>{punchingShearResult.factoredContactPressureKpa.toFixed(2)} kPa</strong></p>
                <p><span>Distancia declarada a la cara</span><strong>{punchingShearResult.criticalSectionOffsetM.toFixed(3)} m</strong></p>
                <p><span>Perímetro crítico b₀</span><strong>{punchingShearResult.criticalPerimeterM.toFixed(3)} m</strong></p>
                <p><span>Dimensión interior · B</span><strong>{punchingShearResult.criticalSectionWidthM.toFixed(3)} m</strong></p>
                <p><span>Dimensión interior · L</span><strong>{punchingShearResult.criticalSectionLengthM.toFixed(3)} m</strong></p>
                <p><span>Área interior al perímetro</span><strong>{punchingShearResult.criticalSectionAreaM2.toFixed(3)} m²</strong></p>
                <p><span>Área exterior cargada</span><strong>{punchingShearResult.exteriorTributaryAreaM2.toFixed(3)} m²</strong></p>
                <p><span>Demanda Vᵤ de punzonamiento</span><strong>{punchingShearResult.shearDemandKn.toFixed(2)} kN</strong></p>
              </div>
              <p className="result-limit">El rectángulo punteado del plano representa el perímetro crítico declarado. El motor integra la presión última uniforme sobre el área exterior. Este resultado no calcula resistencia de punzonamiento, factores de reducción ni cumplimiento NEC.</p>
            </section>
          )}
          {punchingShearGuideResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Punzonamiento · referencia de guía NEC 2015</p>
              <h2>Demanda frente a resistencia de columna interior</h2>
              <div className="result-grid">
                <p><span>Tipo de columna</span><strong>{punchingShearGuideResult.columnShape === 'square' ? 'Cuadrada' : 'Rectangular'}</strong></p>
                <p><span>Distancia del perímetro a la cara</span><strong>{punchingShearGuideResult.criticalSectionOffsetM.toFixed(3)} m</strong></p>
                <p><span>Perímetro crítico b₀</span><strong>{punchingShearGuideResult.criticalPerimeterM.toFixed(3)} m</strong></p>
                <p><span>Demanda Vᵤ</span><strong>{punchingShearGuideResult.shearDemandKn.toFixed(2)} kN</strong></p>
                <p><span>Alternativa gobernante</span><strong>{punchingShearGuideResult.governingAlternative === 'square-only' ? 'Única para columna cuadrada' : punchingShearGuideResult.governingAlternative.replace('alternative-', 'Alternativa ')}</strong></p>
                <p><span>Tensión de referencia gobernante</span><strong>{punchingShearGuideResult.governingConcreteShearStressMpa.toFixed(3)} MPa</strong></p>
                <p><span>Resistencia de referencia</span><strong>{punchingShearGuideResult.designShearStrengthKn.toFixed(2)} kN</strong></p>
                <p><span>Utilización</span><strong>{(punchingShearGuideResult.utilization * 100).toFixed(1)}%</strong></p>
                <p><span>Estado</span><strong>{punchingShearGuideResult.status === 'meets-guide-reference' ? 'Alcanza referencia de guía' : 'No alcanza referencia de guía'}</strong></p>
              </div>
              <p className="result-limit">Esta referencia usa un perímetro a media profundidad efectiva, columna interior centrada, hormigón de peso normal y presión última uniforme. Se bloquea si el perímetro sale de la zapata. No cubre borde, esquina, excentricidad, momentos transmitidos, sismo ni un cumplimiento NEC liberado.</p>
            </section>
          )}
          {flexureResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Flexión · demanda por equilibrio</p>
              <h2>Momentos en la cara de la columna</h2>
              <div className="result-grid">
                <p><span>Presión última uniforme</span><strong>{flexureResult.factoredContactPressureKpa.toFixed(2)} kPa</strong></p>
                <p><span>Voladizo en dirección B</span><strong>{flexureResult.widthDirection.cantileverProjectionM.toFixed(3)} m</strong></p>
                <p><span>Franja transversal B</span><strong>{flexureResult.widthDirection.stripWidthM.toFixed(3)} m</strong></p>
                <p><span>Momento Mᵤ · dirección B</span><strong>{flexureResult.widthDirection.momentDemandKnM.toFixed(2)} kN·m</strong></p>
                <p><span>Voladizo en dirección L</span><strong>{flexureResult.lengthDirection.cantileverProjectionM.toFixed(3)} m</strong></p>
                <p><span>Franja transversal L</span><strong>{flexureResult.lengthDirection.stripWidthM.toFixed(3)} m</strong></p>
                <p><span>Momento Mᵤ · dirección L</span><strong>{flexureResult.lengthDirection.momentDemandKnM.toFixed(2)} kN·m</strong></p>
                <p><span>Dirección gobernante</span><strong>{flexureResult.governingDirection === 'equal' ? 'Iguales' : flexureResult.governingDirection === 'width' ? 'Ancho B' : 'Largo L'}</strong></p>
              </div>
              <p className="result-limit">Cada proyección se modela como un voladizo bajo presión última uniforme y se evalúa en la cara de la columna. El diagrama compara la demanda de momentos. No dimensiona acero ni calcula resistencia o cumplimiento NEC.</p>
            </section>
          )}
          {reinforcementLayout && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Refuerzo inferior · distribución declarada</p>
              <h2>Plano geométrico de barras</h2>
              <div className="result-grid">
                <p><span>Barras paralelas a B</span><strong>{reinforcementLayout.barsParallelToWidth.count} barras</strong></p>
                <p><span>Separación real paralelas a B</span><strong>{reinforcementLayout.barsParallelToWidth.actualSpacingM.toFixed(3)} m</strong></p>
                <p><span>Barras paralelas a L</span><strong>{reinforcementLayout.barsParallelToLength.count} barras</strong></p>
                <p><span>Separación real paralelas a L</span><strong>{reinforcementLayout.barsParallelToLength.actualSpacingM.toFixed(3)} m</strong></p>
              </div>
              <p className="result-limit">Las cantidades se distribuyen dentro del recubrimiento declarado usando la separación máxima ingresada. La separación real calculada alimenta las referencias de acero; aún no verifica separación normativa, anclaje ni resistencia completa.</p>
            </section>
          )}
          {minimumReinforcementResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Acero mínimo · referencia de guía NEC 2015</p>
              <h2>Comparación por metro de ancho útil</h2>
              <div className="result-grid">
                <p><span>Acero mínimo de referencia</span><strong>{minimumReinforcementResult.minimumAreaPerMeterCm2.toFixed(2)} cm²/m</strong></p>
                <p><span>Aportado · barras paralelas a B</span><strong>{(minimumReinforcementResult.barsParallelToWidth.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m</strong></p>
                <p><span>Estado · paralelas a B</span><strong>{minimumReinforcementResult.barsParallelToWidth.status === 'meets-guide-minimum' ? 'Alcanza el mínimo de guía' : 'No alcanza el mínimo de guía'}</strong></p>
                <p><span>Aportado · barras paralelas a L</span><strong>{(minimumReinforcementResult.barsParallelToLength.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m</strong></p>
                <p><span>Estado · paralelas a L</span><strong>{minimumReinforcementResult.barsParallelToLength.status === 'meets-guide-minimum' ? 'Alcanza el mínimo de guía' : 'No alcanza el mínimo de guía'}</strong></p>
              </div>
              <p className="result-limit">Referencia obtenida del ejemplo de zapatas de la Guía práctica de hormigón armado conforme a NEC 2015, sección 1.10.5. Compara únicamente el acero declarado por metro con el mínimo mostrado por la guía. No calcula acero requerido por momento, resistencia, anclaje, separaciones normativas ni cumplimiento NEC completo.</p>
            </section>
          )}
          {requiredReinforcementResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Acero requerido · referencia de guía NEC 2015</p>
              <h2>Resultado por las dos direcciones de flexión</h2>
              <div className="result-grid">
                <p><span>Profundidad efectiva usada</span><strong>{requiredReinforcementResult.effectiveDepthM.toFixed(3)} m</strong></p>
                <p><span>f′c declarado</span><strong>{requiredReinforcementResult.concreteStrengthMpa.toFixed(2)} MPa</strong></p>
                <p><span>fy declarado</span><strong>{requiredReinforcementResult.steelYieldStrengthMpa.toFixed(2)} MPa</strong></p>
                <p><span>Factor de reducción de guía</span><strong>φ = {requiredReinforcementResult.strengthReductionFactor.toFixed(2)}</strong></p>
                <p><span>Acero requerido · dirección B</span><strong>{requiredReinforcementResult.widthDirection.requiredAreaPerMeterCm2 === null ? 'Sección insuficiente' : `${requiredReinforcementResult.widthDirection.requiredAreaPerMeterCm2.toFixed(2)} cm²/m`}</strong></p>
                <p><span>Acero requerido · dirección L</span><strong>{requiredReinforcementResult.lengthDirection.requiredAreaPerMeterCm2 === null ? 'Sección insuficiente' : `${requiredReinforcementResult.lengthDirection.requiredAreaPerMeterCm2.toFixed(2)} cm²/m`}</strong></p>
              </div>
              <p className="result-limit">La aplicación toma los momentos en cara de columna ya calculados y la profundidad efectiva declarada. Reproduce la expresión mostrada en el ejemplo de zapata de la Guía práctica conforme a NEC 2015, sección 1.10.5. Si indica “sección insuficiente”, la expresión no tiene solución real para esos datos; no selecciona automáticamente otra sección. Falta comparar con el acero mínimo, verificar resistencia, cuantías, corte, desarrollo y el resto de requisitos antes de cualquier conclusión de diseño.</p>
            </section>
          )}
          {reinforcementComparisonResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Acero declarado frente a referencia de guía</p>
              <h2>Comparación integrada por dirección</h2>
              <div className="result-grid">
                <p><span>Acero colocado · dirección B</span><strong>{(reinforcementComparisonResult.widthDirection.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m</strong></p>
                <p><span>Exigencia de referencia · B</span><strong>{reinforcementComparisonResult.widthDirection.requiredReferenceAreaPerMeterCm2 === null ? 'Sección insuficiente' : `${reinforcementComparisonResult.widthDirection.requiredReferenceAreaPerMeterCm2.toFixed(2)} cm²/m`}</strong></p>
                <p><span>Estado · B</span><strong>{reinforcementComparisonResult.widthDirection.status === 'meets-guide-reference' ? 'Alcanza referencia de guía' : reinforcementComparisonResult.widthDirection.status === 'below-guide-reference' ? 'No alcanza referencia de guía' : 'Sección insuficiente'}</strong></p>
                <p><span>Acero colocado · dirección L</span><strong>{(reinforcementComparisonResult.lengthDirection.providedAreaPerMeterMm2 / 100).toFixed(2)} cm²/m</strong></p>
                <p><span>Exigencia de referencia · L</span><strong>{reinforcementComparisonResult.lengthDirection.requiredReferenceAreaPerMeterCm2 === null ? 'Sección insuficiente' : `${reinforcementComparisonResult.lengthDirection.requiredReferenceAreaPerMeterCm2.toFixed(2)} cm²/m`}</strong></p>
                <p><span>Estado · L</span><strong>{reinforcementComparisonResult.lengthDirection.status === 'meets-guide-reference' ? 'Alcanza referencia de guía' : reinforcementComparisonResult.lengthDirection.status === 'below-guide-reference' ? 'No alcanza referencia de guía' : 'Sección insuficiente'}</strong></p>
              </div>
              <p className="result-limit">La exigencia de cada dirección es el mayor valor entre el acero mínimo y el requerido de las referencias de guía ya mostradas. Esta tarjeta no incorpora nuevas reglas ni equivale a una aprobación NEC: deben cerrarse corte, punzonamiento, resistencia, detallado, desarrollo y la matriz de contraste externo.</p>
            </section>
          )}
          {developmentLengthResult && (
            <section className="result-card demand-only" aria-live="polite">
              <p className="eyebrow">Longitud de desarrollo · referencia de guía NEC 2015</p>
              <h2>Longitud requerida frente a largo declarado</h2>
              <div className="result-grid">
                <p><span>Longitud requerida de referencia</span><strong>{developmentLengthResult.requiredDevelopmentLengthM.toFixed(3)} m</strong></p>
                <p><span>Diámetro considerado</span><strong>{(developmentLengthResult.barDiameterM * 1000).toFixed(0)} mm</strong></p>
                <p><span>Largo disponible declarado · B</span><strong>{developmentLengthResult.widthDirection.availableLengthM.toFixed(3)} m</strong></p>
                <p><span>Estado · B</span><strong>{developmentLengthResult.widthDirection.status === 'meets-guide-reference' ? 'Alcanza referencia de guía' : 'No alcanza referencia de guía'}</strong></p>
                <p><span>Largo disponible declarado · L</span><strong>{developmentLengthResult.lengthDirection.availableLengthM.toFixed(3)} m</strong></p>
                <p><span>Estado · L</span><strong>{developmentLengthResult.lengthDirection.status === 'meets-guide-reference' ? 'Alcanza referencia de guía' : 'No alcanza referencia de guía'}</strong></p>
              </div>
              <p className="result-limit">Referencia limitada al caso de la Guía práctica conforme a NEC 2015, sección 1.10.6: barra sin recubrimiento especial, otros casos y hormigón de peso normal. El largo disponible es un dato declarado desde el detalle; esta tarjeta no evalúa ganchos, patillas, empalmes, barras superiores ni otras condiciones de anclaje.</p>
            </section>
          )}
          <p className="status" role="status">{status}</p>
        </section>
      </section>
    </main>
  )
}

export default App
