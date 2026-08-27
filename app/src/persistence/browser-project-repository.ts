import Dexie, { type Table } from 'dexie'
import type { ProjectDocument } from '../domain/projects'

class FootingDatabase extends Dexie {
  projects!: Table<ProjectDocument, string>

  constructor() {
    super('andelogic-footing')
    this.version(1).stores({ projects: 'projectId, updatedAt' })
  }
}

const database = new FootingDatabase()

export const browserProjectRepository = {
  list: () => database.projects.orderBy('updatedAt').reverse().toArray(),
  get: (projectId: string) => database.projects.get(projectId),
  save: async (project: ProjectDocument) => {
    await database.projects.put(project)
    return project
  },
}
