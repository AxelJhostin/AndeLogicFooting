import type { FootingInputs } from '../projects'

export type ValidationIssue = {
  code:
    | 'MISSING_POSITIVE_VALUE'
    | 'FOOTING_NOT_LARGER_THAN_COLUMN'
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
]

const labels: Record<keyof FootingInputs, string> = {
  axialLoadKn: 'La carga axial centrada',
  allowableBearingKpa: 'La capacidad admisible del suelo',
  columnWidthM: 'El ancho de columna',
  columnLengthM: 'El largo de columna',
  footingWidthM: 'El ancho preliminar de zapata',
  footingLengthM: 'El largo preliminar de zapata',
  footingThicknessM: 'El espesor preliminar de zapata',
}

export function validateFootingInputs(inputs: FootingInputs): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const field of requiredPositiveFields) {
    if (!Number.isFinite(inputs[field]) || inputs[field] <= 0) {
      issues.push({
        code: 'MISSING_POSITIVE_VALUE',
        field,
        message: `${labels[field]} debe ser un valor mayor que cero.`,
      })
    }
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
