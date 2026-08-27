import Dexie, { type Table } from 'dexie'
import { normalizeProjectDocument, type ProjectDocument } from '../domain/projects'

class FootingDatabase extends Dexie {
  projects!: Table<ProjectDocument, string>

  constructor() {
    super('andelogic-footing')
    this.version(1).stores({ projects: 'projectId, updatedAt' })
  }
}

const database = new FootingDatabase()

export const browserProjectRepository = {
  list: async () => (await database.projects.orderBy('updatedAt').reverse().toArray()).map(normalizeProjectDocument),
  get: async (projectId: string) => {
    const project = await database.projects.get(projectId)
    return project ? normalizeProjectDocument(project) : undefined
  },
  save: async (project: ProjectDocument) => {
    await database.projects.put(project)
    return project
  },
}
