import type { FootingInputs } from '../projects'

export type ValidationIssue = {
  code:
    | 'MISSING_POSITIVE_VALUE'
    | 'MISSING_NON_NEGATIVE_VALUE'
    | 'SOIL_UNIT_WEIGHT_REQUIRED'
    | 'FOOTING_NOT_LARGER_THAN_COLUMN'
    | 'FACTORED_LOAD_REQUIRED'
    | 'INVALID_EFFECTIVE_DEPTH'
    | 'MATERIAL_STRENGTH_REQUIRED'
    | 'PUNCHING_OFFSET_REQUIRED'
    | 'PUNCHING_PERIMETER_OUTSIDE_FOOTING'
  field: keyof FootingInputs
  message: string
}

const requiredPositiveFields: Array<keyof FootingInputs> = [
  'axialLoadKn',
  'allowableBearingKpa',
  'columnWidthM',
  'columnLengthM',
  'footingWidthM',
  'footingLengthM',
  'footingThicknessM',
  'concreteUnitWeightKnM3',
]

const requiredNonNegativeFields: Array<keyof FootingInputs> = [
  'removedOverburdenKpa',
  'soilCoverDepthM',
  'soilUnitWeightKnM3',
]

const labels: Record<keyof FootingInputs, string> = {
  axialLoadKn: 'La carga axial centrada',
  factoredAxialLoadKn: 'La carga axial última',
  allowableBearingKpa: 'La capacidad admisible del suelo',
  bearingCapacityBasis: 'La base de capacidad admisible',
  removedOverburdenKpa: 'El esfuerzo removido por excavación',
  concreteUnitWeightKnM3: 'El peso unitario del hormigón',
  soilCoverDepthM: 'La profundidad de relleno sobre la zapata',
  soilUnitWeightKnM3: 'El peso unitario del relleno',
  columnWidthM: 'El ancho de columna',
  columnLengthM: 'El largo de columna',
  footingWidthM: 'El ancho preliminar de zapata',
  footingLengthM: 'El largo preliminar de zapata',
  footingThicknessM: 'El espesor preliminar de zapata',
  concreteCoverM: 'El recubrimiento inferior',
  barDiameterM: 'El diámetro de barra considerado',
  concreteStrengthMpa: 'La resistencia a compresión del hormigón f′c',
  steelYieldStrengthMpa: 'El esfuerzo de fluencia del acero fy',
  developmentAvailableLengthWidthM: 'La longitud disponible de desarrollo en dirección B',
  developmentAvailableLengthLengthM: 'La longitud disponible de desarrollo en dirección L',
  punchingCriticalSectionOffsetM: 'La distancia al perímetro crítico de punzonamiento',
  barsParallelToWidthMaxSpacingM: 'La separación máxima de barras paralelas a B',
  barsParallelToLengthMaxSpacingM: 'La separación máxima de barras paralelas a L',
}

export function validateOneWayShearInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues = validateFootingInputs(inputs)

  if (!Number.isFinite(inputs.factoredAxialLoadKn) || inputs.factoredAxialLoadKn <= 0) {
    issues.push({
      code: 'FACTORED_LOAD_REQUIRED',
      field: 'factoredAxialLoadKn',
      message: 'La demanda de cortante requiere una carga axial última mayor que cero.',
    })
  }

  if (
    !Number.isFinite(inputs.concreteCoverM) ||
    inputs.concreteCoverM < 0 ||
    !Number.isFinite(inputs.barDiameterM) ||
    inputs.barDiameterM <= 0 ||
    inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2 <= 0
  ) {
    issues.push({
      code: 'INVALID_EFFECTIVE_DEPTH',
      field: 'concreteCoverM',
      message: 'El espesor, recubrimiento y diámetro deben producir una profundidad efectiva positiva.',
    })
  }

  return issues
}

export function validatePunchingShearInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues = validateFootingInputs(inputs)

  if (!Number.isFinite(inputs.factoredAxialLoadKn) || inputs.factoredAxialLoadKn <= 0) {
    issues.push({
      code: 'FACTORED_LOAD_REQUIRED',
      field: 'factoredAxialLoadKn',
      message: 'La demanda de punzonamiento requiere una carga axial última mayor que cero.',
    })
  }

  const offset = inputs.punchingCriticalSectionOffsetM

  if (!Number.isFinite(offset) || offset <= 0) {
    issues.push({
      code: 'PUNCHING_OFFSET_REQUIRED',
      field: 'punchingCriticalSectionOffsetM',
      message: 'La demanda de punzonamiento requiere una distancia positiva al perímetro crítico.',
    })
    return issues
  }

  if (
    inputs.columnWidthM + 2 * offset >= inputs.footingWidthM ||
    inputs.columnLengthM + 2 * offset >= inputs.footingLengthM
  ) {
    issues.push({
      code: 'PUNCHING_PERIMETER_OUTSIDE_FOOTING',
      field: 'punchingCriticalSectionOffsetM',
      message: 'El perímetro crítico declarado debe quedar completamente dentro de la zapata.',
    })
  }

  return issues
}

export function validateFlexureInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues = validateFootingInputs(inputs)

  if (!Number.isFinite(inputs.factoredAxialLoadKn) || inputs.factoredAxialLoadKn <= 0) {
    issues.push({
      code: 'FACTORED_LOAD_REQUIRED',
      field: 'factoredAxialLoadKn',
      message: 'La demanda de flexión requiere una carga axial última mayor que cero.',
    })
  }

  return issues
}

export function validateGuideRequiredReinforcementInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues = validateFlexureInputs(inputs)
  const hasPhysicalDepth = Number.isFinite(inputs.concreteCoverM)
    && inputs.concreteCoverM >= 0
    && Number.isFinite(inputs.barDiameterM)
    && inputs.barDiameterM > 0
    && inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2 > 0

  if (!hasPhysicalDepth) {
    issues.push({
      code: 'INVALID_EFFECTIVE_DEPTH',
      field: 'concreteCoverM',
      message: 'El acero requerido necesita una profundidad efectiva positiva a partir de espesor, recubrimiento y diámetro.',
    })
  }

  for (const field of ['concreteStrengthMpa', 'steelYieldStrengthMpa'] as const) {
    if (!Number.isFinite(inputs[field]) || inputs[field] <= 0) {
      issues.push({
        code: 'MATERIAL_STRENGTH_REQUIRED',
        field,
        message: `${labels[field]} debe ser un valor mayor que cero en MPa.`,
      })
    }
  }

  return issues
}

export function validateGuideOneWayShearInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues = validateOneWayShearInputs(inputs)

  if (!Number.isFinite(inputs.concreteStrengthMpa) || inputs.concreteStrengthMpa <= 0) {
    issues.push({
      code: 'MATERIAL_STRENGTH_REQUIRED',
      field: 'concreteStrengthMpa',
      message: `${labels.concreteStrengthMpa} debe ser un valor mayor que cero en MPa.`,
    })
  }

  return issues
}

export function validateGuidePunchingShearInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues = validateFlexureInputs(inputs)
  const hasPhysicalDepth = Number.isFinite(inputs.concreteCoverM)
    && inputs.concreteCoverM >= 0
    && Number.isFinite(inputs.barDiameterM)
    && inputs.barDiameterM > 0
    && inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2 > 0

  if (!hasPhysicalDepth) {
    issues.push({
      code: 'INVALID_EFFECTIVE_DEPTH',
      field: 'concreteCoverM',
      message: 'El punzonamiento de guía necesita una profundidad efectiva positiva.',
    })
  }
  if (!Number.isFinite(inputs.concreteStrengthMpa) || inputs.concreteStrengthMpa <= 0) {
    issues.push({
      code: 'MATERIAL_STRENGTH_REQUIRED',
      field: 'concreteStrengthMpa',
      message: `${labels.concreteStrengthMpa} debe ser un valor mayor que cero en MPa.`,
    })
  }
  return issues
}

export function validateFootingInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const field of requiredPositiveFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      issues.push({
        code: 'MISSING_POSITIVE_VALUE',
        field,
        message: `${labels[field]} debe ser un valor mayor que cero.`,
      })
    }
  }

  for (const field of requiredNonNegativeFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      issues.push({
        code: 'MISSING_NON_NEGATIVE_VALUE',
        field,
        message: `${labels[field]} debe ser un valor mayor o igual a cero.`,
      })
    }
  }

  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) {
    issues.push({
      code: 'SOIL_UNIT_WEIGHT_REQUIRED',
      field: 'soilUnitWeightKnM3',
      message: 'El relleno sobre la zapata requiere un peso unitario de suelo mayor que cero.',
    })
  }

  if (inputs.footingWidthM > 0 && inputs.columnWidthM > 0 && inputs.footingWidthM <= inputs.columnWidthM) {
    issues.push({
      code: 'FOOTING_NOT_LARGER_THAN_COLUMN',
      field: 'footingWidthM',
      message: 'El ancho preliminar de zapata debe ser mayor que el ancho de la columna.',
    })
  }

  if (inputs.footingLengthM > 0 && inputs.columnLengthM > 0 && inputs.footingLengthM <= inputs.columnLengthM) {
    issues.push({
      code: 'FOOTING_NOT_LARGER_THAN_COLUMN',
      field: 'footingLengthM',
      message: 'El largo preliminar de zapata debe ser mayor que el largo de la columna.',
    })
  }

  return issues
}
