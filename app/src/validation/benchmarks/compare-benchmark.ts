import type {
  BenchmarkComparison,
  BenchmarkObservation,
  BenchmarkPolicy,
  BenchmarkSourceKind,
} from './types'

const describeMissingKinds = (
  required: BenchmarkSourceKind[],
  observations: BenchmarkObservation[],
) => required.filter((kind) => !observations.some((observation) => observation.sourceKind === kind))

export function compareBenchmark(
  engineResult: BenchmarkObservation,
  references: BenchmarkObservation[],
  policy: BenchmarkPolicy,
): BenchmarkComparison {
  const reasons: string[] = []

  if (
    !Number.isFinite(policy.absoluteTolerance) ||
    policy.absoluteTolerance < 0 ||
    !Number.isFinite(policy.relativeTolerance) ||
    policy.relativeTolerance < 0 ||
    !Number.isInteger(policy.minimumIndependentSources) ||
    policy.minimumIndependentSources < 1
  ) {
    reasons.push('La política de tolerancias o fuentes mínimas es inválida.')
  }

  if (!Number.isFinite(engineResult.value)) {
    reasons.push('El resultado de AndeLogic no es un número finito.')
  }

  const observationsWithIncompleteEvidence = [engineResult, ...references].filter(
    (observation) =>
      !observation.sourceId.trim() ||
      !observation.sourceVersion.trim() ||
      !observation.standardProfile.trim() ||
      !observation.assumptionsId.trim() ||
      !observation.metricId.trim() ||
      !observation.unit.trim() ||
      !observation.evidence.trim() ||
      !observation.capturedAt.trim(),
  )
  if (observationsWithIncompleteEvidence.length > 0) {
    reasons.push('Hay observaciones sin versión, contexto, unidad, evidencia o fecha completas.')
  }

  const uniqueSources = new Set(references.map((reference) => reference.sourceId))
  if (uniqueSources.size < policy.minimumIndependentSources) {
    reasons.push(
      `Se requieren ${policy.minimumIndependentSources} fuentes independientes y solo hay ${uniqueSources.size}.`,
    )
  }

  const missingKinds = describeMissingKinds(policy.requiredSourceKinds, references)
  if (missingKinds.length > 0) {
    reasons.push(`Faltan clases de evidencia: ${missingKinds.join(', ')}.`)
  }

  const insufficientKinds = Object.entries(policy.minimumSourcesByKind ?? {}).flatMap(
    ([kind, minimum]) => {
      const sourceKind = kind as BenchmarkSourceKind
      const available = new Set(
        references
          .filter((reference) => reference.sourceKind === sourceKind)
          .map((reference) => reference.sourceId),
      ).size

      return available < minimum
        ? [`Se requieren ${minimum} fuentes de tipo ${sourceKind} y solo hay ${available}.`]
        : []
    },
  )
  reasons.push(...insufficientKinds)

  const incompatibleReferences = references.filter(
    (reference) =>
      reference.metricId !== engineResult.metricId ||
      reference.unit !== engineResult.unit ||
      reference.standardProfile !== engineResult.standardProfile ||
      reference.assumptionsId !== engineResult.assumptionsId ||
      !Number.isFinite(reference.value),
  )

  if (incompatibleReferences.length > 0) {
    reasons.push(
      `Contexto incompatible o valor inválido en: ${incompatibleReferences.map((item) => item.sourceId).join(', ')}.`,
    )
  }

  const comparableReferences = references.filter(
    (reference) => !incompatibleReferences.includes(reference),
  )
  const differences = comparableReferences.map((reference) => {
    const absoluteDifference = Math.abs(engineResult.value - reference.value)
    const denominator = Math.max(Math.abs(engineResult.value), Math.abs(reference.value), Number.EPSILON)
    const relativeDifference = absoluteDifference / denominator

    return {
      sourceId: reference.sourceId,
      sourceVersion: reference.sourceVersion,
      absoluteDifference,
      relativeDifference,
      withinTolerance:
        absoluteDifference <= policy.absoluteTolerance ||
        relativeDifference <= policy.relativeTolerance,
    }
  })

  const outsideTolerance = differences.filter((difference) => !difference.withinTolerance)
  if (outsideTolerance.length > 0) {
    reasons.push(
      `Diferencia fuera de tolerancia en: ${outsideTolerance.map((item) => item.sourceId).join(', ')}.`,
    )
  }

  const hasBlockingProblem =
    incompatibleReferences.length > 0 ||
    outsideTolerance.length > 0 ||
    !Number.isFinite(engineResult.value) ||
    observationsWithIncompleteEvidence.length > 0 ||
    reasons.includes('La política de tolerancias o fuentes mínimas es inválida.')
  const hasInsufficientEvidence =
    uniqueSources.size < policy.minimumIndependentSources ||
    missingKinds.length > 0 ||
    insufficientKinds.length > 0

  return {
    status: hasBlockingProblem ? 'blocked' : hasInsufficientEvidence ? 'insufficient-evidence' : 'approved',
    metricId: engineResult.metricId,
    unit: engineResult.unit,
    differences,
    reasons,
  }
}
