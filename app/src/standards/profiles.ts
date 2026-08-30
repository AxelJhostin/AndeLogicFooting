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
  appliesTo: Array<'isolated' | 'strip' | 'combined' | 'strap' | 'trapezoidal' | 'edge' | 'corner' | 'mat'>
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
    url: 'https://www.mit.gob.ec/wp-content/uploads/downloads/2026/03/4.-NEC-SE-GC-Geotecnia-y-Cimentaciones.pdf',
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
  {
    id: 'usace-em-1110-1-1905-2025',
    label: 'USACE EM 1110-1-1905 · Shallow Foundations on Soils',
    version: '31 julio 2025',
    url: 'https://publibrary.sec.usace.army.mil/api/download?filename=EM+1110-1-1905_Geotechincal+Design+of+Shallow+Foundations+on+Soils_2025+07+22+-+Final.pdf&id=54658636-77d2-48df-f26b-5295a01899a7&preview=true',
    scope: 'Fuente técnica pública para tipologías superficiales, vigas centradoras y tratamiento explícito de cargas excéntricas; no reemplaza la NEC ni constituye normativa ecuatoriana.',
  },
  {
    id: 'fhwa-nhi-06-089',
    label: 'FHWA NHI-06-089 · Soils and Foundations Reference Manual, Vol. II',
    version: '2006',
    url: 'https://www.fhwa.dot.gov/engineering/geotech/pubs/010943.pdf',
    scope: 'Fuente técnica pública para excentricidad biaxial, losas multicolumna, cimentación Winkler y distribución lineal bajo bases rígidas; no reemplaza la NEC.',
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
      { id: 'strap-model', appliesTo: ['strap'], module: 'Modelo de viga centradora', basis: 'Equilibrio y geometría', sourceId: 'usace-em-1110-1-1905-2025', reference: 'USACE EM 1110-1-1905, 2-5.d.(2): dos bases enlazadas por una viga rígida que no transmite carga directamente al suelo.', applicability: 'Dos zapatas separadas, viga sin contacto con el suelo, cargas verticales y transferencia rígida del momento excéntrico.' },
      { id: 'strap-contact', appliesTo: ['strap'], module: 'Contacto independiente de cada base', basis: 'Equilibrio y geometría', sourceId: 'nec-se-gc-2015', reference: 'NEC-SE-GC 2014, secciones 6.4, 7.1 y 7.2.1; equilibrio y comparación con capacidad admisible declarada.', applicability: 'Reacción positiva y presión uniforme bajo cada base; contacto parcial excluido.' },
      { id: 'strap-equilibrium', appliesTo: ['strap'], module: 'Transferencia por la viga', basis: 'Equilibrio y geometría', reference: 'M = Pₑe; V = M/S; Rₑ = Pₑ + V; Rᵢ = Pᵢ − V.', applicability: 'Viga idealmente rígida, excentricidad en un eje y separación S entre centros.' },
      { id: 'strap-pad-shear', appliesTo: ['strap'], module: 'Cortante de las bases', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Resistencia de la sección 1.10.1 aplicada a demandas de voladizo por base.', applicability: 'Presión última uniforme por base y hormigón normal; adaptación pendiente de contraste independiente.' },
      { id: 'strap-pad-flexure', appliesTo: ['strap'], module: 'Flexión y armado de las bases', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Demanda de voladizo y expresiones de acero de la sección 1.10.5.', applicability: 'Armado preliminar en ambas direcciones; no sustituye el detallado integral.' },
      { id: 'strap-beam', appliesTo: ['strap'], module: 'Viga centradora', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Demandas por equilibrio M y V; resistencias seccionales de 1.10.1 y 1.10.5 usadas como referencia pública.', applicability: 'Sección rectangular; estribos, confinamiento, nudos y detallado definitivo requieren revisión especializada.' },
      { id: 'strap-punching', appliesTo: ['strap'], module: 'Punzonamiento en los encuentros', basis: 'Dato externo obligatorio', reference: 'No evaluado: la viga cruza la región crítica y el perímetro interior aislado no es aplicable sin una regla específica.', applicability: 'Resultado explícitamente fuera de alcance; exige revisión estructural especializada.' },
      { id: 'strap-development', appliesTo: ['strap'], module: 'Desarrollo en bases y anclaje de viga', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Ejemplo de desarrollo de la sección 1.10.6.', applicability: 'Barra a tracción, hormigón normal y factores unitarios declarados.' },
      { id: 'trapezoidal-model', appliesTo: ['trapezoidal'], module: 'Geometría trapezoidal', basis: 'Equilibrio y geometría', sourceId: 'usace-em-1110-1-1905-2025', reference: 'USACE EM 1110-1-1905, 2-5.d.(1): zapatas combinadas rectangulares, trapezoidales o en T; coincidencia de centroides para presión uniforme.', applicability: 'Trapecio simétrico respecto del eje longitudinal, dos columnas interiores y espesor constante.' },
      { id: 'trapezoidal-contact', appliesTo: ['trapezoidal'], module: 'Contacto lineal sobre ancho variable', basis: 'Equilibrio y geometría', sourceId: 'nec-se-gc-2015', reference: 'NEC-SE-GC 2014, secciones 6.4, 7.1 y 7.2.1; solución de fuerza y momento con q(x)=a+bx y B(x) lineal.', applicability: 'Contacto completo; se bloquea cualquier presión extrema negativa.' },
      { id: 'trapezoidal-beam', appliesTo: ['trapezoidal'], module: 'Viga longitudinal de ancho variable', basis: 'Equilibrio y geometría', reference: 'w(x)=q(x)B(x); integración analítica de la reacción cuadrática y cargas puntuales.', applicability: 'Dos cargas verticales, sin momentos transferidos ni interacción suelo-estructura.' },
      { id: 'trapezoidal-shear', appliesTo: ['trapezoidal'], module: 'Cortante longitudinal y transversal', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Resistencia de la sección 1.10.1 usando la demanda y el ancho local de cada sección.', applicability: 'Hormigón normal; adaptación a geometría variable pendiente de contraste independiente.' },
      { id: 'trapezoidal-punching', appliesTo: ['trapezoidal'], module: 'Punzonamiento por columna', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Secciones 1.10.2 a 1.10.4 con integración de q(x) dentro del perímetro.', applicability: 'Columnas interiores y perímetros completos contenidos por los bordes inclinados.' },
      { id: 'trapezoidal-reinforcement', appliesTo: ['trapezoidal'], module: 'Flexión y armado', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Sección 1.10.5 aplicada al ancho local en momentos longitudinales y a franja transversal de un metro.', applicability: 'Distribución preliminar; detallado integral pendiente.' },
      { id: 'trapezoidal-development', appliesTo: ['trapezoidal'], module: 'Desarrollo longitudinal y transversal', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Ejemplo de desarrollo de la sección 1.10.6.', applicability: 'Barras a tracción, hormigón normal y factores unitarios declarados.' },
      { id: 'edge-model', appliesTo: ['edge'], module: 'Modelo excéntrico de borde', basis: 'Equilibrio y geometría', sourceId: 'usace-em-1110-1-1905-2025', reference: 'USACE EM 1110-1-1905, 5-2 y 5-4: cargas verticales, peso de cimentación y tratamiento explícito de la excentricidad.', applicability: 'Una columna alineada a un borde, excentricidad uniaxial y contacto completo.' },
      { id: 'edge-contact', appliesTo: ['edge'], module: 'Contacto lineal y tercio central', basis: 'Equilibrio y geometría', sourceId: 'nec-se-gc-2015', reference: 'NEC-SE-GC 2014, secciones 6.4, 7.1 y 7.2.1; fuerza y momento con presión longitudinal lineal.', applicability: 'Resultante dentro del tercio central; contacto parcial bloqueado.' },
      { id: 'edge-shear', appliesTo: ['edge'], module: 'Cortante unidireccional', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Resistencia de la sección 1.10.1 aplicada a demandas integradas de presión lineal.', applicability: 'Hormigón normal; adaptación excéntrica pendiente de contraste independiente.' },
      { id: 'edge-punching', appliesTo: ['edge'], module: 'Punzonamiento de borde', basis: 'Dato externo obligatorio', reference: 'No evaluado: el perímetro crítico queda truncado por el borde y no se reutiliza la referencia de columna interior.', applicability: 'Resultado explícitamente fuera de alcance hasta registrar una referencia específica.' },
      { id: 'edge-reinforcement', appliesTo: ['edge'], module: 'Flexión y armado', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Demandas integradas en las caras y expresiones de acero de la sección 1.10.5.', applicability: 'Armado preliminar longitudinal y transversal; detallado integral pendiente.' },
      { id: 'edge-development', appliesTo: ['edge'], module: 'Desarrollo longitudinal y transversal', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Ejemplo de desarrollo de la sección 1.10.6.', applicability: 'Barras a tracción, hormigón normal y factores unitarios declarados.' },
      { id: 'corner-model', appliesTo: ['corner'], module: 'Modelo de esquina biaxial', basis: 'Equilibrio y geometría', sourceId: 'fhwa-nhi-06-089', reference: 'FHWA NHI-06-089, sección 6.4.1: excentricidades en dos direcciones y dimensiones efectivas B′ y L′.', applicability: 'Una columna con dos caras alineadas a bordes adyacentes, carga axial y base rectangular rígida.' },
      { id: 'corner-contact', appliesTo: ['corner'], module: 'Plano de contacto y núcleo biaxial', basis: 'Equilibrio y geometría', sourceId: 'nec-se-gc-2015', reference: 'NEC-SE-GC 2014, secciones 6.4, 7.1, 7.2.1 y 7.3; equilibrio de fuerza y momentos. Derivación AXC-CORNER-DER-001 registrada en docs/22.', applicability: 'Presión plana lineal y compresión en las cuatro esquinas; contacto parcial bloqueado.' },
      { id: 'corner-shear', appliesTo: ['corner'], module: 'Cortante unidireccional en X y Y', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Resistencia de la sección 1.10.1 aplicada a demandas direccionales obtenidas al integrar la presión plana.', applicability: 'Franjas completas y hormigón normal; análisis de placa fuera de alcance.' },
      { id: 'corner-punching', appliesTo: ['corner'], module: 'Punzonamiento de esquina', basis: 'Dato externo obligatorio', reference: 'No evaluado: el perímetro crítico queda truncado en dos direcciones y no se reutiliza una referencia interior o de borde.', applicability: 'Resultado explícitamente fuera de alcance hasta registrar una referencia específica.' },
      { id: 'corner-reinforcement', appliesTo: ['corner'], module: 'Flexión y armado biaxial', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Demandas direccionales integradas y expresiones de acero de la sección 1.10.5.', applicability: 'Malla preliminar en X y Y; no sustituye análisis de placa ni detallado integral.' },
      { id: 'corner-development', appliesTo: ['corner'], module: 'Desarrollo en X y Y', basis: 'Guía pública NEC 2015', sourceId: 'guide-hm-2015', reference: 'Ejemplo de desarrollo de la sección 1.10.6.', applicability: 'Barras a tracción, hormigón normal y factores unitarios declarados.' },
      { id: 'mat-model', appliesTo: ['mat'], module: 'Losa rígida multicolumna', basis: 'Equilibrio y geometría', sourceId: 'fhwa-nhi-06-089', reference: 'FHWA NHI-06-089, secciones 2.6 y 8.6; losas para múltiples columnas, capacidad y asentamientos.', applicability: 'Losa rectangular rígida, 2 a 24 columnas y cargas axiales verticales.' },
      { id: 'mat-contact', appliesTo: ['mat'], module: 'Plano biaxial de contacto', basis: 'Equilibrio y geometría', sourceId: 'nec-se-gc-2015', reference: 'NEC-SE-GC 2014, secciones 6.4 y 7; derivación AXC-MAT-DER-001 registrada en docs/23.', applicability: 'Contacto completo, presión plana lineal y comparación bruta o neta con dato geotécnico externo.' },
      { id: 'mat-settlement', appliesTo: ['mat'], module: 'Pantalla rígida–Winkler', basis: 'Dato externo obligatorio', sourceId: 'fhwa-nhi-06-089', reference: 'FHWA NHI-06-089, sección 8.6: q = k·s y advertencia de que k depende del suelo y de la cimentación.', applicability: 'Módulo de balasto y límites suministrados externamente; no representa consolidación ni flexibilidad de placa.' },
      { id: 'mat-plate', appliesTo: ['mat'], module: 'Placa, punzonamiento y armado', basis: 'Dato externo obligatorio', reference: 'No evaluado en esta etapa: requiere modelo de rigidez de placa, suelo y criterios estructurales específicos.', applicability: 'Se informa explícitamente fuera de alcance; las proyecciones globales se usan solo para auditar equilibrio.' },
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
