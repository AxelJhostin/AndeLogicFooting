export type BenchmarkSourceKind = 'public-reference' | 'independent-calculation' | 'software'

export type BenchmarkContext = {
  standardProfile: string
  assumptionsId: string
}

export type BenchmarkObservation = BenchmarkContext & {
  sourceId: string
  sourceKind: BenchmarkSourceKind
  sourceVersion: string
  metricId: string
  value: number
  unit: string
  evidence: string
  capturedAt: string
}

export type BenchmarkPolicy = {
  absoluteTolerance: number
  relativeTolerance: number
  minimumIndependentSources: number
  requiredSourceKinds: BenchmarkSourceKind[]
  minimumSourcesByKind?: Partial<Record<BenchmarkSourceKind, number>>
}

export type BenchmarkDifference = {
  sourceId: string
  sourceVersion: string
  absoluteDifference: number
  relativeDifference: number
  withinTolerance: boolean
}

export type BenchmarkComparison = {
  status: 'approved' | 'insufficient-evidence' | 'blocked'
  metricId: string
  unit: string
  differences: BenchmarkDifference[]
  reasons: string[]
}
