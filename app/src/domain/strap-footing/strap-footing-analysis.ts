import type { StrapFootingInputs } from '../projects'
import { checkGuideDevelopmentLength, type GuideDevelopmentLengthResult } from '../footing/development-length-guide-check'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from '../footing/minimum-reinforcement'
import { checkGuideOneWayShear, type GuideOneWayShearDirectionResult } from '../footing/one-way-shear-guide-check'
import { calculateGuideRequiredReinforcement, type GuideReinforcementDirectionResult } from '../footing/required-reinforcement'

export type StrapFootingValidationIssue = {
  field: keyof StrapFootingInputs
  message: string
}

type StrapEquilibrium = {
  eccentricMomentKnM: number
  strapShearKn: number
  exteriorStructuralReactionKn: number
  interiorStructuralReactionKn: number
}

type ReinforcementComparison = {
  providedAreaPerMeterMm2: number
  requiredAreaPerMeterMm2: number | null
  minimumAreaPerMeterMm2: number
  governingAreaPerMeterMm2: number | null
  status: 'meets-guide-reference' | 'below-guide-reference' | 'section-insufficient'
}

type PadDirectionResult = {
  projectionM: number
  shearDemandKn: number
  flexureDemandKnM: number
  shearReference: GuideOneWayShearDirectionResult
  requiredReinforcement: GuideReinforcementDirectionResult
  reinforcement: ReinforcementComparison
}

export type StrapPadAnalysis = {
  areaM2: number
  effectiveDepthM: number
  factoredPressureKpa: number
  longitudinal: PadDirectionResult
  transverse: PadDirectionResult
  minimumReinforcement: MinimumReinforcementResult
}

export type StrapFootingAnalysis = {
  geometry: {
    exteriorEccentricityM: number
    clearStrapLengthM: number
    exteriorAreaM2: number
    interiorAreaM2: number
    exteriorEffectiveDepthM: number
    interiorEffectiveDepthM: number
    beamEffectiveDepthM: number
  }
  service: StrapEquilibrium & {
    exteriorPadSelfWeightKn: number
    interiorPadSelfWeightKn: number
    exteriorSoilCoverWeightKn: number
    interiorSoilCoverWeightKn: number
    clearStrapSelfWeightKn: number
    exteriorGrossReactionKn: number
    interiorGrossReactionKn: number
    exteriorGrossPressureKpa: number
    interiorGrossPressureKpa: number
    exteriorNetPressureKpa: number
    interiorNetPressureKpa: number
    exteriorPressureForComparisonKpa: number
    interiorPressureForComparisonKpa: number
    governingPressureKpa: number
    allowableBearingKpa: number
    utilization: number
    status: 'pass' | 'fail'
  }
  factored: {
    eccentricMomentKnM: number
    strapShearKn: number
    exteriorReactionKn: number
    interiorReactionKn: number
    exteriorPressureKpa: number
    interiorPressureKpa: number
  }
  pads: {
    exterior: StrapPadAnalysis
    interior: StrapPadAnalysis
  }
  beam: {
    momentDemandKnM: number
    shearDemandKn: number
    shearReference: GuideOneWayShearDirectionResult
    requiredReinforcement: GuideReinforcementDirectionResult
    providedLongitudinalAreaMm2: number
    requiredLongitudinalAreaMm2: number | null
    reinforcementStatus: 'meets-guide-reference' | 'below-guide-reference' | 'section-insufficient'
  }
  punching: {
    status: 'not-evaluated'
    reason: string
  }
  development: GuideDevelopmentLengthResult
}

export type StrapFootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: StrapFootingValidationIssue[] }
  | { status: 'calculated'; analysis: StrapFootingAnalysis }

const positiveFields: Array<keyof StrapFootingInputs> = [
  'serviceExteriorLoadKn', 'serviceInteriorLoadKn', 'factoredExteriorLoadKn', 'factoredInteriorLoadKn',
  'allowableBearingKpa', 'concreteUnitWeightKnM3', 'exteriorFootingWidthM', 'exteriorFootingLengthM',
  'exteriorFootingThicknessM', 'interiorFootingWidthM', 'interiorFootingLengthM',
  'interiorFootingThicknessM', 'footingCenterSpacingM', 'exteriorColumnWidthM', 'exteriorColumnLengthM',
  'exteriorColumnCenterFromOuterEdgeM', 'interiorColumnWidthM', 'interiorColumnLengthM',
  'strapBeamWidthM', 'strapBeamDepthM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa',
  'padLongitudinalBarSpacingM', 'padTransverseBarSpacingM', 'beamLongitudinalBarCount',
  'padDevelopmentAvailableM', 'beamDevelopmentAvailableM',
]

const nonNegativeFields: Array<keyof StrapFootingInputs> = [
  'removedOverburdenKpa', 'soilCoverDepthM', 'soilUnitWeightKnM3', 'concreteCoverM',
]

const equilibrium = (exteriorLoadKn: number, interiorLoadKn: number, eccentricityM: number, spacingM: number): StrapEquilibrium => {
  const eccentricMomentKnM = exteriorLoadKn * eccentricityM
  const strapShearKn = eccentricMomentKnM / spacingM
  return {
    eccentricMomentKnM,
    strapShearKn,
    exteriorStructuralReactionKn: exteriorLoadKn + strapShearKn,
    interiorStructuralReactionKn: interiorLoadKn - strapShearKn,
  }
}

export function validateStrapFootingInputs(inputs: StrapFootingInputs): StrapFootingValidationIssue[] {
  const issues: StrapFootingValidationIssue[] = []
  for (const field of positiveFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      issues.push({ field, message: 'Este valor debe ser un número mayor que cero.' })
    }
  }
  for (const field of nonNegativeFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      issues.push({ field, message: 'Este valor debe ser un número mayor o igual a cero.' })
    }
  }
  if (!Number.isInteger(inputs.beamLongitudinalBarCount)) {
    issues.push({ field: 'beamLongitudinalBarCount', message: 'La cantidad de barras de la viga debe ser un entero positivo.' })
  }
  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) {
    issues.push({ field: 'soilUnitWeightKnM3', message: 'El relleno declarado requiere un peso unitario mayor que cero.' })
  }

  const exteriorColumnLeftM = inputs.exteriorColumnCenterFromOuterEdgeM - inputs.exteriorColumnLengthM / 2
  const exteriorColumnRightM = inputs.exteriorColumnCenterFromOuterEdgeM + inputs.exteriorColumnLengthM / 2
  if (exteriorColumnLeftM <= 0 || exteriorColumnRightM >= inputs.exteriorFootingLengthM) {
    issues.push({ field: 'exteriorColumnCenterFromOuterEdgeM', message: 'La columna exterior debe quedar completamente dentro de su zapata.' })
  }
  if (inputs.exteriorColumnWidthM >= inputs.exteriorFootingWidthM) {
    issues.push({ field: 'exteriorColumnWidthM', message: 'La columna exterior debe ser más angosta que su zapata.' })
  }
  if (inputs.interiorColumnWidthM >= inputs.interiorFootingWidthM || inputs.interiorColumnLengthM >= inputs.interiorFootingLengthM) {
    issues.push({ field: 'interiorColumnWidthM', message: 'La columna interior debe quedar completamente dentro de su zapata centrada.' })
  }

  const eccentricityM = inputs.exteriorFootingLengthM / 2 - inputs.exteriorColumnCenterFromOuterEdgeM
  if (eccentricityM <= 0) {
    issues.push({ field: 'exteriorColumnCenterFromOuterEdgeM', message: 'La columna exterior debe quedar hacia la medianera respecto del centro de su zapata.' })
  }
  const clearStrapLengthM = inputs.footingCenterSpacingM
    - inputs.exteriorFootingLengthM / 2 - inputs.interiorFootingLengthM / 2
  if (clearStrapLengthM <= 0) {
    issues.push({ field: 'footingCenterSpacingM', message: 'Las dos zapatas no pueden superponerse; debe existir un tramo libre para la viga centradora.' })
  }
  if (inputs.strapBeamWidthM >= Math.min(inputs.exteriorFootingWidthM, inputs.interiorFootingWidthM)) {
    issues.push({ field: 'strapBeamWidthM', message: 'La viga centradora debe ser más angosta que ambas zapatas.' })
  }

  const exteriorEffectiveDepthM = inputs.exteriorFootingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const interiorEffectiveDepthM = inputs.interiorFootingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const beamEffectiveDepthM = inputs.strapBeamDepthM - inputs.concreteCoverM - inputs.barDiameterM / 2
  if (Math.min(exteriorEffectiveDepthM, interiorEffectiveDepthM, beamEffectiveDepthM) <= 0) {
    issues.push({ field: 'concreteCoverM', message: 'Espesores, recubrimiento y barra deben producir profundidades efectivas positivas.' })
  }

  if (issues.length === 0) {
    const service = equilibrium(inputs.serviceExteriorLoadKn, inputs.serviceInteriorLoadKn, eccentricityM, inputs.footingCenterSpacingM)
    const factored = equilibrium(inputs.factoredExteriorLoadKn, inputs.factoredInteriorLoadKn, eccentricityM, inputs.footingCenterSpacingM)
    if (Math.min(
      service.exteriorStructuralReactionKn,
      service.interiorStructuralReactionKn,
      factored.exteriorStructuralReactionKn,
      factored.interiorStructuralReactionKn,
    ) <= 0) {
      issues.push({ field: 'factoredInteriorLoadKn', message: 'El modelo rígido requiere reacciones positivas bajo ambas zapatas; el levantamiento queda fuera de alcance.' })
    }
  }
  return issues
}

const reinforcementComparison = (
  providedAreaPerMeterMm2: number,
  minimumAreaPerMeterMm2: number,
  required: GuideReinforcementDirectionResult,
): ReinforcementComparison => {
  if (required.status === 'section-insufficient' || required.requiredAreaPerMeterMm2 === null) {
    return {
      providedAreaPerMeterMm2,
      requiredAreaPerMeterMm2: null,
      minimumAreaPerMeterMm2,
      governingAreaPerMeterMm2: null,
      status: 'section-insufficient',
    }
  }
  const governingAreaPerMeterMm2 = Math.max(minimumAreaPerMeterMm2, required.requiredAreaPerMeterMm2)
  return {
    providedAreaPerMeterMm2,
    requiredAreaPerMeterMm2: required.requiredAreaPerMeterMm2,
    minimumAreaPerMeterMm2,
    governingAreaPerMeterMm2,
    status: providedAreaPerMeterMm2 >= governingAreaPerMeterMm2 ? 'meets-guide-reference' : 'below-guide-reference',
  }
}

type PadDefinition = {
  widthM: number
  lengthM: number
  thicknessM: number
  columnWidthM: number
  columnLengthM: number
  leftProjectionM: number
  rightProjectionM: number
  pressureKpa: number
}

const analyzePad = (inputs: StrapFootingInputs, pad: PadDefinition): StrapPadAnalysis => {
  const effectiveDepthM = pad.thicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const longitudinalProjectionM = Math.max(pad.leftProjectionM, pad.rightProjectionM)
  const transverseProjectionM = (pad.widthM - pad.columnWidthM) / 2
  const longitudinalLoadedLengthM = Math.max(longitudinalProjectionM - effectiveDepthM, 0)
  const transverseLoadedLengthM = Math.max(transverseProjectionM - effectiveDepthM, 0)
  const longitudinalShearDemandKn = pad.pressureKpa * pad.widthM * longitudinalLoadedLengthM
  const transverseShearDemandKn = pad.pressureKpa * pad.lengthM * transverseLoadedLengthM
  const longitudinalMomentKnM = pad.pressureKpa * pad.widthM * longitudinalProjectionM ** 2 / 2
  const transverseMomentKnM = pad.pressureKpa * pad.lengthM * transverseProjectionM ** 2 / 2
  const shear = checkGuideOneWayShear({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    effectiveDepthM,
    widthShearDemandKn: longitudinalShearDemandKn,
    widthSectionWidthM: pad.widthM,
    lengthShearDemandKn: transverseShearDemandKn,
    lengthSectionWidthM: pad.lengthM,
  })
  const required = calculateGuideRequiredReinforcement({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    effectiveDepthM,
    widthMomentDemandKnM: longitudinalMomentKnM,
    widthStripWidthM: pad.widthM,
    lengthMomentDemandKnM: transverseMomentKnM,
    lengthStripWidthM: pad.lengthM,
  })
  const minimum = calculateGuideMinimumReinforcement({
    footingThicknessM: pad.thicknessM,
    barDiameterM: inputs.barDiameterM,
    barsParallelToWidthSpacingM: inputs.padTransverseBarSpacingM,
    barsParallelToLengthSpacingM: inputs.padLongitudinalBarSpacingM,
  })
  return {
    areaM2: pad.widthM * pad.lengthM,
    effectiveDepthM,
    factoredPressureKpa: pad.pressureKpa,
    longitudinal: {
      projectionM: longitudinalProjectionM,
      shearDemandKn: longitudinalShearDemandKn,
      flexureDemandKnM: longitudinalMomentKnM,
      shearReference: shear.widthDirection,
      requiredReinforcement: required.widthDirection,
      reinforcement: reinforcementComparison(
        minimum.barsParallelToLength.providedAreaPerMeterMm2,
        minimum.minimumAreaPerMeterMm2,
        required.widthDirection,
      ),
    },
    transverse: {
      projectionM: transverseProjectionM,
      shearDemandKn: transverseShearDemandKn,
      flexureDemandKnM: transverseMomentKnM,
      shearReference: shear.lengthDirection,
      requiredReinforcement: required.lengthDirection,
      reinforcement: reinforcementComparison(
        minimum.barsParallelToWidth.providedAreaPerMeterMm2,
        minimum.minimumAreaPerMeterMm2,
        required.lengthDirection,
      ),
    },
    minimumReinforcement: minimum,
  }
}

/**
 * Analiza dos zapatas rectangulares enlazadas por una viga centradora rígida.
 * La viga equilibra la excentricidad de la columna medianera y se supone separada del suelo.
 */
export function analyzeStrapFooting(inputs: StrapFootingInputs): StrapFootingAnalysisOutcome {
  const issues = validateStrapFootingInputs(inputs)
  if (issues.length) return { status: 'invalid-input', issues }

  const exteriorAreaM2 = inputs.exteriorFootingWidthM * inputs.exteriorFootingLengthM
  const interiorAreaM2 = inputs.interiorFootingWidthM * inputs.interiorFootingLengthM
  const exteriorEccentricityM = inputs.exteriorFootingLengthM / 2 - inputs.exteriorColumnCenterFromOuterEdgeM
  const clearStrapLengthM = inputs.footingCenterSpacingM
    - inputs.exteriorFootingLengthM / 2 - inputs.interiorFootingLengthM / 2
  const exteriorEffectiveDepthM = inputs.exteriorFootingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const interiorEffectiveDepthM = inputs.interiorFootingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const beamEffectiveDepthM = inputs.strapBeamDepthM - inputs.concreteCoverM - inputs.barDiameterM / 2

  const serviceEquilibrium = equilibrium(
    inputs.serviceExteriorLoadKn,
    inputs.serviceInteriorLoadKn,
    exteriorEccentricityM,
    inputs.footingCenterSpacingM,
  )
  const factoredEquilibrium = equilibrium(
    inputs.factoredExteriorLoadKn,
    inputs.factoredInteriorLoadKn,
    exteriorEccentricityM,
    inputs.footingCenterSpacingM,
  )

  const exteriorPadSelfWeightKn = exteriorAreaM2 * inputs.exteriorFootingThicknessM * inputs.concreteUnitWeightKnM3
  const interiorPadSelfWeightKn = interiorAreaM2 * inputs.interiorFootingThicknessM * inputs.concreteUnitWeightKnM3
  const exteriorSoilCoverWeightKn = exteriorAreaM2 * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const interiorSoilCoverWeightKn = interiorAreaM2 * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const clearStrapSelfWeightKn = clearStrapLengthM * inputs.strapBeamWidthM * inputs.strapBeamDepthM * inputs.concreteUnitWeightKnM3
  const exteriorGrossReactionKn = serviceEquilibrium.exteriorStructuralReactionKn
    + exteriorPadSelfWeightKn + exteriorSoilCoverWeightKn + clearStrapSelfWeightKn / 2
  const interiorGrossReactionKn = serviceEquilibrium.interiorStructuralReactionKn
    + interiorPadSelfWeightKn + interiorSoilCoverWeightKn + clearStrapSelfWeightKn / 2
  const exteriorGrossPressureKpa = exteriorGrossReactionKn / exteriorAreaM2
  const interiorGrossPressureKpa = interiorGrossReactionKn / interiorAreaM2
  const exteriorNetPressureKpa = exteriorGrossPressureKpa - inputs.removedOverburdenKpa
  const interiorNetPressureKpa = interiorGrossPressureKpa - inputs.removedOverburdenKpa
  const exteriorPressureForComparisonKpa = inputs.bearingCapacityBasis === 'gross'
    ? exteriorGrossPressureKpa : exteriorNetPressureKpa
  const interiorPressureForComparisonKpa = inputs.bearingCapacityBasis === 'gross'
    ? interiorGrossPressureKpa : interiorNetPressureKpa
  const governingPressureKpa = Math.max(exteriorPressureForComparisonKpa, interiorPressureForComparisonKpa)
  if (Math.min(exteriorPressureForComparisonKpa, interiorPressureForComparisonKpa) <= 0) {
    return {
      status: 'invalid-input',
      issues: [{ field: 'removedOverburdenKpa', message: 'Las presiones seleccionadas para comparación deben ser positivas bajo ambas zapatas.' }],
    }
  }

  const exteriorFactoredPressureKpa = factoredEquilibrium.exteriorStructuralReactionKn / exteriorAreaM2
  const interiorFactoredPressureKpa = factoredEquilibrium.interiorStructuralReactionKn / interiorAreaM2
  const exteriorColumnLeftM = inputs.exteriorColumnCenterFromOuterEdgeM - inputs.exteriorColumnLengthM / 2
  const exteriorColumnRightM = inputs.exteriorColumnCenterFromOuterEdgeM + inputs.exteriorColumnLengthM / 2
  const exteriorPad = analyzePad(inputs, {
    widthM: inputs.exteriorFootingWidthM,
    lengthM: inputs.exteriorFootingLengthM,
    thicknessM: inputs.exteriorFootingThicknessM,
    columnWidthM: inputs.exteriorColumnWidthM,
    columnLengthM: inputs.exteriorColumnLengthM,
    leftProjectionM: exteriorColumnLeftM,
    rightProjectionM: inputs.exteriorFootingLengthM - exteriorColumnRightM,
    pressureKpa: exteriorFactoredPressureKpa,
  })
  const interiorLongitudinalProjectionM = (inputs.interiorFootingLengthM - inputs.interiorColumnLengthM) / 2
  const interiorPad = analyzePad(inputs, {
    widthM: inputs.interiorFootingWidthM,
    lengthM: inputs.interiorFootingLengthM,
    thicknessM: inputs.interiorFootingThicknessM,
    columnWidthM: inputs.interiorColumnWidthM,
    columnLengthM: inputs.interiorColumnLengthM,
    leftProjectionM: interiorLongitudinalProjectionM,
    rightProjectionM: interiorLongitudinalProjectionM,
    pressureKpa: interiorFactoredPressureKpa,
  })

  const beamShear = checkGuideOneWayShear({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    effectiveDepthM: beamEffectiveDepthM,
    widthShearDemandKn: factoredEquilibrium.strapShearKn,
    widthSectionWidthM: inputs.strapBeamWidthM,
    lengthShearDemandKn: factoredEquilibrium.strapShearKn,
    lengthSectionWidthM: inputs.strapBeamWidthM,
  }).widthDirection
  const beamRequired = calculateGuideRequiredReinforcement({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    effectiveDepthM: beamEffectiveDepthM,
    widthMomentDemandKnM: factoredEquilibrium.eccentricMomentKnM,
    widthStripWidthM: inputs.strapBeamWidthM,
    lengthMomentDemandKnM: factoredEquilibrium.eccentricMomentKnM,
    lengthStripWidthM: inputs.strapBeamWidthM,
  }).widthDirection
  const barAreaMm2 = Math.PI * (inputs.barDiameterM * 1000) ** 2 / 4
  const providedLongitudinalAreaMm2 = inputs.beamLongitudinalBarCount * barAreaMm2
  const beamReinforcementStatus = beamRequired.status === 'section-insufficient' || beamRequired.requiredAreaMm2 === null
    ? 'section-insufficient'
    : providedLongitudinalAreaMm2 >= beamRequired.requiredAreaMm2
      ? 'meets-guide-reference'
      : 'below-guide-reference'
  const development = checkGuideDevelopmentLength({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    barDiameterM: inputs.barDiameterM,
    availableLengthWidthM: inputs.padDevelopmentAvailableM,
    availableLengthLengthM: inputs.beamDevelopmentAvailableM,
  })

  return {
    status: 'calculated',
    analysis: {
      geometry: {
        exteriorEccentricityM,
        clearStrapLengthM,
        exteriorAreaM2,
        interiorAreaM2,
        exteriorEffectiveDepthM,
        interiorEffectiveDepthM,
        beamEffectiveDepthM,
      },
      service: {
        ...serviceEquilibrium,
        exteriorPadSelfWeightKn,
        interiorPadSelfWeightKn,
        exteriorSoilCoverWeightKn,
        interiorSoilCoverWeightKn,
        clearStrapSelfWeightKn,
        exteriorGrossReactionKn,
        interiorGrossReactionKn,
        exteriorGrossPressureKpa,
        interiorGrossPressureKpa,
        exteriorNetPressureKpa,
        interiorNetPressureKpa,
        exteriorPressureForComparisonKpa,
        interiorPressureForComparisonKpa,
        governingPressureKpa,
        allowableBearingKpa: inputs.allowableBearingKpa,
        utilization: governingPressureKpa / inputs.allowableBearingKpa,
        status: governingPressureKpa <= inputs.allowableBearingKpa ? 'pass' : 'fail',
      },
      factored: {
        eccentricMomentKnM: factoredEquilibrium.eccentricMomentKnM,
        strapShearKn: factoredEquilibrium.strapShearKn,
        exteriorReactionKn: factoredEquilibrium.exteriorStructuralReactionKn,
        interiorReactionKn: factoredEquilibrium.interiorStructuralReactionKn,
        exteriorPressureKpa: exteriorFactoredPressureKpa,
        interiorPressureKpa: interiorFactoredPressureKpa,
      },
      pads: { exterior: exteriorPad, interior: interiorPad },
      beam: {
        momentDemandKnM: factoredEquilibrium.eccentricMomentKnM,
        shearDemandKn: factoredEquilibrium.strapShearKn,
        shearReference: beamShear,
        requiredReinforcement: beamRequired,
        providedLongitudinalAreaMm2,
        requiredLongitudinalAreaMm2: beamRequired.requiredAreaMm2,
        reinforcementStatus: beamReinforcementStatus,
      },
      punching: {
        status: 'not-evaluated',
        reason: 'La viga centradora cruza la región crítica de ambas columnas; este caso no reutiliza silenciosamente el perímetro interior de una zapata aislada.',
      },
      development,
    },
  }
}
