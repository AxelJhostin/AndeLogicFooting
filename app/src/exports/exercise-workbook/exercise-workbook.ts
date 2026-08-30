import type { ProjectDocument } from '../../domain/projects'
import { buildWorkbookModel } from './workbook-model'
import { createWorkbookPackage } from './ooxml-workbook'

export { buildWorkbookModel as buildExerciseWorkbookModel }
export type { ExerciseWorkbookModel } from './workbook-model'

export type ExerciseWorkbookExport = {
  fileName: string
  bytes: Uint8Array
}

function safeFileStem(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'cimentacion'
}

export function exportExerciseWorkbook(project: ProjectDocument, generatedAt = new Date().toISOString()): ExerciseWorkbookExport {
  const model = buildWorkbookModel(project, generatedAt)
  return {
    fileName: `${safeFileStem(project.name)}.andelogic-zapatas-calculo.xlsx`,
    bytes: createWorkbookPackage(model),
  }
}

export function downloadExerciseWorkbook(project: ProjectDocument): string {
  const exported = exportExerciseWorkbook(project)
  const blob = new Blob([exported.bytes as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = exported.fileName
  link.click()
  URL.revokeObjectURL(url)
  return exported.fileName
}
