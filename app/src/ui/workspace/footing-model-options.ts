import type { FootingType } from '../../domain/projects'

export type FootingModelOption = {
  value: FootingType
  label: string
  description: string
  analyzeLabel: string
}

export const FOOTING_MODEL_OPTIONS: readonly FootingModelOption[] = [
  {
    value: 'isolated',
    label: 'Zapata aislada centrada',
    description: 'Base rectangular · una columna y carga axial centradas.',
    analyzeLabel: 'Analizar zapata',
  },
  {
    value: 'strip',
    label: 'Zapata corrida',
    description: 'Muro y carga lineal centrados · franja de 1.00 m.',
    analyzeLabel: 'Analizar corrida',
  },
  {
    value: 'combined',
    label: 'Zapata combinada rectangular',
    description: 'Dos columnas interiores alineadas · presión lineal.',
    analyzeLabel: 'Analizar combinada',
  },
  {
    value: 'strap',
    label: 'Zapata medianera con viga centradora',
    description: 'Dos bases separadas · viga sin apoyo en el suelo.',
    analyzeLabel: 'Analizar medianera',
  },
  {
    value: 'trapezoidal',
    label: 'Zapata combinada trapezoidal',
    description: 'Dos columnas interiores · ancho variable y presión lineal.',
    analyzeLabel: 'Analizar trapezoidal',
  },
  {
    value: 'edge',
    label: 'Zapata excéntrica de borde',
    description: 'Una columna al lindero · contacto dentro del tercio central.',
    analyzeLabel: 'Analizar excéntrica',
  },
  {
    value: 'corner',
    label: 'Zapata de esquina',
    description: 'Excentricidad biaxial · contacto completo en cuatro esquinas.',
    analyzeLabel: 'Analizar esquina',
  },
  {
    value: 'mat',
    label: 'Losa de cimentación',
    description: 'Múltiples columnas · evaluación rígida–Winkler preliminar.',
    analyzeLabel: 'Analizar losa',
  },
]

export const FOOTING_MODEL_BY_TYPE = Object.fromEntries(
  FOOTING_MODEL_OPTIONS.map((option) => [option.value, option]),
) as Record<FootingType, FootingModelOption>
