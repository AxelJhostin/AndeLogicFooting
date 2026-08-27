export const PROJECT_SCHEMA_VERSION = 1

import type { StandardProfileId } from '../standards/profiles'

export type StandardProfile = StandardProfileId

export type FootingInputs = {
  axialLoadKn: number
  allowableBearingKpa: number
  columnWidthM: number
  columnLengthM: number
  footingWidthM: number
  footingLengthM: number
}

export type ProjectDocument = {
  schemaVersion: number
  projectId: string
  name: string
  createdAt: string
  updatedAt: string
  productVersion: string
  engineVersion: string
  standardProfile: StandardProfile
  inputSnapshot: FootingInputs
  warnings: string[]
}

const now = () => new Date().toISOString()

export function createNewProject(): ProjectDocument {
  const timestamp = now()

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: crypto.randomUUID(),
    name: 'Zapata sin título',
    createdAt: timestamp,
    updatedAt: timestamp,
    productVersion: '0.1.0-prototype',
    engineVersion: 'not-implemented',
    standardProfile: 'NEC-PENDING',
    inputSnapshot: {
      axialLoadKn: 0,
      allowableBearingKpa: 0,
      columnWidthM: 0.3,
      columnLengthM: 0.3,
      footingWidthM: 1.5,
      footingLengthM: 1.5,
    },
    warnings: [
      'Prototipo de persistencia: todavía no ejecuta verificaciones ni diseño estructural.',
    ],
  }
}

export function isProjectDocument(value: unknown): value is ProjectDocument {
  if (!value || typeof value !== 'object') return false

  const document = value as Partial<ProjectDocument>
  return (
    document.schemaVersion === PROJECT_SCHEMA_VERSION &&
    typeof document.projectId === 'string' &&
    typeof document.name === 'string' &&
    typeof document.createdAt === 'string' &&
    typeof document.updatedAt === 'string' &&
    typeof document.standardProfile === 'string' &&
    typeof document.inputSnapshot === 'object' &&
    document.inputSnapshot !== null &&
    Array.isArray(document.warnings)
  )
}
