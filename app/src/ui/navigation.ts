export const workspaceViews = ['define', 'section', 'plan', 'results', 'calculation', 'theory'] as const
export type WorkspaceView = (typeof workspaceViews)[number]

export const workspaceNavigation: Array<{ id: WorkspaceView; label: string }> = [
  { id: 'define', label: 'Definir caso' },
  { id: 'section', label: 'Sección' },
  { id: 'plan', label: 'Planta' },
  { id: 'results', label: 'Resultados' },
  { id: 'calculation', label: 'Cálculo completo' },
  { id: 'theory', label: 'Teoría' },
]
