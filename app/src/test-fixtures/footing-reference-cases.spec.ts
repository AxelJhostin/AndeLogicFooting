import { describe, expect, it } from 'vitest'
import { checkGuideDevelopmentLength } from '../domain/footing/development-length-guide-check'
import { calculateFlexureDemand } from '../domain/footing/flexure-demand'
import { calculateGuideMinimumReinforcement } from '../domain/footing/minimum-reinforcement'
import { calculateOneWayShearDemand } from '../domain/footing/one-way-shear-demand'
import { checkGuideOneWayShear } from '../domain/footing/one-way-shear-guide-check'
import { checkGuidePunchingShear } from '../domain/footing/punching-shear-guide-check'
import { calculateReinforcementLayout } from '../domain/footing/reinforcement-layout'
import { calculateGuideRequiredReinforcement } from '../domain/footing/required-reinforcement'
import { compareGuideReinforcement } from '../domain/footing/reinforcement-comparison'
import { calculateServiceContact } from '../domain/footing/service-contact'
import { centeredFootingReferenceCase, reinforcementFailureCase, serviceContactFailureCase } from './footing-reference-cases'

describe('fixtures de referencia para zapata centrada', () => {
  it('ejecuta la cadena completa con resultados internos reproducibles', () => {
    const { inputs, expected } = centeredFootingReferenceCase
    const contact = calculateServiceContact({ ...inputs, bearingCapacityBasis: 'gross' })
    const oneWay = calculateOneWayShearDemand(inputs)
    const oneWayGuide = checkGuideOneWayShear({
      concreteStrengthMpa: inputs.concreteStrengthMpa,
      effectiveDepthM: oneWay.effectiveDepthM,
      widthShearDemandKn: oneWay.widthDirection.shearDemandKn,
      widthSectionWidthM: oneWay.widthDirection.tributaryWidthM,
      lengthShearDemandKn: oneWay.lengthDirection.shearDemandKn,
      lengthSectionWidthM: oneWay.lengthDirection.tributaryWidthM,
    })
    const punching = checkGuidePunchingShear({
      concreteStrengthMpa: inputs.concreteStrengthMpa,
      factoredAxialLoadKn: inputs.factoredAxialLoadKn,
      footingWidthM: inputs.footingWidthM,
      footingLengthM: inputs.footingLengthM,
      columnWidthM: inputs.columnWidthM,
      columnLengthM: inputs.columnLengthM,
      effectiveDepthM: oneWay.effectiveDepthM,
    })
    const flexure = calculateFlexureDemand(inputs)
    const layout = calculateReinforcementLayout(inputs)
    const minimum = calculateGuideMinimumReinforcement({
      footingThicknessM: inputs.footingThicknessM,
      barDiameterM: inputs.barDiameterM,
      barsParallelToWidthSpacingM: layout.barsParallelToWidth.actualSpacingM,
      barsParallelToLengthSpacingM: layout.barsParallelToLength.actualSpacingM,
    })
    const required = calculateGuideRequiredReinforcement({
      concreteStrengthMpa: inputs.concreteStrengthMpa,
      steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
      effectiveDepthM: oneWay.effectiveDepthM,
      widthMomentDemandKnM: flexure.widthDirection.momentDemandKnM,
      widthStripWidthM: flexure.widthDirection.stripWidthM,
      lengthMomentDemandKnM: flexure.lengthDirection.momentDemandKnM,
      lengthStripWidthM: flexure.lengthDirection.stripWidthM,
    })
    const reinforcement = compareGuideReinforcement({
      minimumAreaPerMeterMm2: minimum.minimumAreaPerMeterMm2,
      widthProvidedAreaPerMeterMm2: minimum.barsParallelToWidth.providedAreaPerMeterMm2,
      lengthProvidedAreaPerMeterMm2: minimum.barsParallelToLength.providedAreaPerMeterMm2,
      widthRequiredAreaPerMeterMm2: required.widthDirection.requiredAreaPerMeterMm2,
      lengthRequiredAreaPerMeterMm2: required.lengthDirection.requiredAreaPerMeterMm2,
    })
    const development = checkGuideDevelopmentLength({
      concreteStrengthMpa: inputs.concreteStrengthMpa,
      steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
      barDiameterM: inputs.barDiameterM,
      availableLengthWidthM: inputs.developmentAvailableLengthWidthM,
      availableLengthLengthM: inputs.developmentAvailableLengthLengthM,
    })

    expect(contact.grossContactPressureKpa).toBeCloseTo(expected.serviceContactPressureKpa)
    expect(contact.status).toBe('pass')
    expect(oneWay.widthDirection.shearDemandKn).toBeCloseTo(expected.oneWayWidthDemandKn)
    expect(oneWay.lengthDirection.shearDemandKn).toBeCloseTo(expected.oneWayLengthDemandKn)
    expect(oneWayGuide.widthDirection.status).toBe('meets-guide-reference')
    expect(oneWayGuide.lengthDirection.status).toBe('meets-guide-reference')
    expect(punching.shearDemandKn).toBeCloseTo(expected.punchingDemandKn)
    expect(punching.status).toBe('meets-guide-reference')
    expect(flexure.widthDirection.momentDemandKnM).toBeCloseTo(expected.flexureWidthMomentKnM)
    expect(flexure.lengthDirection.momentDemandKnM).toBeCloseTo(expected.flexureLengthMomentKnM)
    expect(reinforcement.widthDirection.status).toBe('meets-guide-reference')
    expect(reinforcement.lengthDirection.status).toBe('meets-guide-reference')
    expect(development.widthDirection.status).toBe('meets-guide-reference')
    expect(development.lengthDirection.status).toBe('meets-guide-reference')
  })

  it('conserva un caso de falla de contacto de servicio', () => {
    const result = calculateServiceContact({ ...serviceContactFailureCase.inputs, bearingCapacityBasis: 'gross' })

    expect(result.status).toBe('fail')
    expect(result.utilization).toBeGreaterThan(1)
  })

  it('conserva un caso de acero insuficiente con el plano realmente distribuido', () => {
    const { inputs } = reinforcementFailureCase
    const layout = calculateReinforcementLayout(inputs)
    const minimum = calculateGuideMinimumReinforcement({
      footingThicknessM: inputs.footingThicknessM,
      barDiameterM: inputs.barDiameterM,
      barsParallelToWidthSpacingM: layout.barsParallelToWidth.actualSpacingM,
      barsParallelToLengthSpacingM: layout.barsParallelToLength.actualSpacingM,
    })
    const flexure = calculateFlexureDemand(inputs)
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

    expect([comparison.widthDirection.status, comparison.lengthDirection.status]).toContain('below-guide-reference')
  })
})
