export type StandardProfileId = 'NEC-2015-GUIDE-TRACEABLE' | 'ARCHIVED-UNSUPPORTED'

export type PublicSource = {
  id: string
  label: string
  version: string
  url: string
  scope: string
}

export type CalculationTrace = {
  id: string
  appliesTo: Array<'isolated' | 'strip' | 'combined'>
  module: string
  basis: 'Equilibrio y geometría' | 'Guía pública NEC 2015' | 'Dato externo obligatorio'
  sourceId?: string
  reference: string
  applicability: string
}

export type StandardProfile = {
  id: StandardProfileId
  label: string
  shortLabel: string
  releaseStatus: 'pending-review'
  sources: PublicSource[]
  traceability: CalculationTrace[]
  releaseBlocker: string
}

const publicSources: PublicSource[] = [
  {
    id: 'nec-se-hm-2015',
    label: 'NEC-SE-HM · Estructuras de Hormigón Armado',
    version: 'NEC-SE-HM 2014',
    url: 'https://www.habitatyvivienda.gob.ec/wp-content/uploads/2023/03/8.-NEC-SE-HM-Hormigon-Armado.pdf',
    scope: 'Marco ecuatoriano de hormigón armado; incorpora referencias externas para materias no desarrolladas íntegramente.',
  },
  {
    id: 'nec-se-gc-2015',
    label: 'NEC-SE-GC · Geotecnia y Cimentaciones',
    version: 'NEC-SE-GC 2014',
    url: 'https://www.habitatyvivienda.gob.ec/wp-content/uploads/2023/03/7.-NEC-SE-GC-Geotecnia-y-Cimentaciones.pdf',
    scope: 'Marco para geotecnia y cimentaciones; la capacidad admisible y asentamientos requieren el estudio geotécnico del proyecto.',
  },
  {
    id: 'nec-se-cg-2015',
    label: 'NEC-SE-CG · Cargas no sísmicas',
    version: 'NEC-SE-CG 2014',
    url: 'https://www.habitatyvivienda.gob.ec/wp-content/uploads/2020/07/2015-01-10_Registro-Oficial-No.-413_AM-No.-0047_Actualizaci%C3%B3n-NEC-SE_AC_MD_VIVIENDA-y-NEC-HS-VIDRIO.pdf',
    scope: 'Marco de cargas y combinaciones; la aplicación usa la carga última declarada por el responsable del caso.',
  },
  {
    id: 'guide-hm-2015',
    label: 'Guía práctica de hormigón armado',
    version: 'NEC 2015 · Guía de diseño 2',
    url: 'https://www.habitatyvivienda.gob.ec/wp-content/uploads/2023/03/GUIA-2-HORMIGON-ARMADO-.pdf',
    scope: 'Procedimiento público usado como referencia para las revisiones de zapata implementadas.',
  },
]

export const standardProfiles: Record<StandardProfileId, StandardProfile> = {
  'NEC-2015-GUIDE-TRACEABLE': {
    id: 'NEC-2015-GUIDE-TRACEABLE',
    label: 'Ecuador · NEC 2015 — guía práctica trazable',
    shortLabel: 'NEC 2015 · guía trazable',
    releaseStatus: 'pending-review',
    sources: publicSources,
    traceability: [
      { id: 'contact', appliesTo: ['isolated'], module: 'Contacto de servicio', basis: 'Equilibrio y geometría', reference: 'P/A, peso propio y sobrecarga de relleno; la capacidad admisible es una entrada del estudio geotécnico.', applicability: 'Zapata rectangular, carga centrada y presión uniforme.' },
      { id: 'one-way-shear', appliesTo: ['isolated'], module: 'Cortante unidireccional', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Guía de diseño 2, sección 1.10.1.', applicability: 'Hormigón de peso normal, columna centrada y presión última uniforme.' },
      { id: 'punching', appliesTo: ['isolated'], module: 'Punzonamiento', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Guía de diseño 2, secciones 1.10.2 a 1.10.4.', applicability: 'Columna interior centrada y hormigón de peso normal.' },
      { id: 'flexure', appliesTo: ['isolated'], module: 'Flexión', basis: 'Equilibrio y geometría', reference: 'Momento de una franja en voladizo con presión uniforme.', applicability: 'Zapata rectangular, columna centrada y presión última uniforme.' },
      { id: 'reinforcement', appliesTo: ['isolated'], module: 'Acero mínimo y requerido', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Guía de diseño 2, sección 1.10.5.', applicability: 'Sección rectangular; no sustituye una comprobación completa de ductilidad y detallado.' },
      { id: 'development', appliesTo: ['isolated'], module: 'Longitud de desarrollo', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Guía de diseño 2, sección 1.10.6.', applicability: 'Barra a tracción sin recubrimiento especial, hormigón de peso normal y coeficientes unitarios.' },
      { id: 'strip-contact', appliesTo: ['strip'], module: 'Contacto por metro lineal', basis: 'Equilibrio y geometría', reference: 'q = P/B para una franja longitudinal de 1.00 m, incluyendo pesos declarados.', applicability: 'Muro y carga lineal centrados; reacción uniforme del suelo.' },
      { id: 'strip-shear', appliesTo: ['strip'], module: 'Cortante unidireccional por metro', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Procedimiento de resistencia de la sección 1.10.1 aplicado a una franja de 1.00 m.', applicability: 'Adaptación seccional para muro centrado y hormigón normal; contraste independiente pendiente.' },
      { id: 'strip-flexure', appliesTo: ['strip'], module: 'Flexión transversal por metro', basis: 'Equilibrio y geometría', reference: 'Mᵤ = qᵤa²/2 en cada voladizo desde la cara del muro.', applicability: 'Muro centrado, presión última uniforme y franja longitudinal de 1.00 m.' },
      { id: 'strip-reinforcement', appliesTo: ['strip'], module: 'Armado transversal y longitudinal', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Expresiones de acero de la sección 1.10.5 adaptadas a una franja de 1.00 m.', applicability: 'Acero transversal por flexión y mínimo; acero longitudinal como mínimo de distribución. Detallado integral pendiente.' },
      { id: 'strip-development', appliesTo: ['strip'], module: 'Desarrollo transversal', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Ejemplo de desarrollo de la sección 1.10.6.', applicability: 'Barra a tracción, hormigón normal y factores unitarios declarados.' },
      { id: 'combined-contact', appliesTo: ['combined'], module: 'Contacto lineal de servicio', basis: 'Equilibrio y geometría', sourceId: 'nec-se-gc-2015', reference: 'NEC-SE-GC 2014, secciones 6.4, 7.1 y 7.2.1; equilibrio de fuerza y momento con presión lineal.', applicability: 'Zapata rectangular rígida, dos columnas alineadas y contacto completo.' },
      { id: 'combined-beam', appliesTo: ['combined'], module: 'Viga longitudinal', basis: 'Equilibrio y geometría', reference: 'Integración de la reacción lineal y cargas puntuales declaradas; V(x) y M(x) satisfacen equilibrio en ambos extremos.', applicability: 'Dos cargas verticales, sin momentos transferidos ni interacción suelo-estructura.' },
      { id: 'combined-shear', appliesTo: ['combined'], module: 'Cortante longitudinal y transversal', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Resistencia de la sección 1.10.1 aplicada a demandas obtenidas por equilibrio.', applicability: 'Hormigón normal y secciones completas a distancia d; adaptación pendiente de contraste independiente.' },
      { id: 'combined-punching', appliesTo: ['combined'], module: 'Punzonamiento por columna', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Secciones 1.10.2 a 1.10.4 con reacción lineal integrada dentro del perímetro.', applicability: 'Dos columnas interiores con perímetros completos; borde, esquina y presión no lineal excluidos.' },
      { id: 'combined-reinforcement', appliesTo: ['combined'], module: 'Flexión y armado combinado', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Sección 1.10.5 para secciones rectangulares: momento positivo inferior, negativo superior y flexión transversal.', applicability: 'Distribución preliminar; no sustituye detallado, ductilidad ni revisión integral.' },
      { id: 'combined-development', appliesTo: ['combined'], module: 'Desarrollo longitudinal y transversal', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Ejemplo de desarrollo de la sección 1.10.6.', applicability: 'Barras a tracción, hormigón normal y factores unitarios declarados.' },
    ],
    releaseBlocker: 'El perfil identifica fuentes y condiciones de cada módulo, pero aún requiere contraste independiente de casos y revisión profesional antes de declarar cumplimiento normativo.',
  },
  'ARCHIVED-UNSUPPORTED': {
    id: 'ARCHIVED-UNSUPPORTED',
    label: 'Proyecto histórico sin perfil compatible',
    shortLabel: 'Perfil histórico no compatible',
    releaseStatus: 'pending-review',
    sources: [],
    traceability: [],
    releaseBlocker: 'Este proyecto conserva una identificación normativa anterior y no se recalculará hasta migrarlo explícitamente a un perfil compatible.',
  },
}

export const getStandardProfile = (id: StandardProfileId) => standardProfiles[id]
