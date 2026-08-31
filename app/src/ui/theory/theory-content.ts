import type { FootingType } from '../../domain/projects'

export type TheoryFormula = {
  label: string
  expression: string
  meaning: string
}

export type TheorySection = {
  title: string
  summary: string
  paragraphs: readonly string[]
  points?: readonly string[]
  formulas?: readonly TheoryFormula[]
  caution?: string
}

export type TheoryPage = {
  title: string
  subtitle: string
  introduction: string
  loadPath: readonly string[]
  scopeFacts: readonly { label: string; value: string }[]
  sections: readonly TheorySection[]
  workflow: readonly string[]
  commonMistakes: readonly string[]
  glossary: readonly { term: string; definition: string }[]
}

export const FOOTING_THEORY_PAGES: Record<FootingType, TheoryPage> = {
  isolated: {
    title: 'Teoría de zapata aislada centrada',
    subtitle: 'Comportamiento, contacto, secciones críticas, armado e interpretación de una base rectangular bajo una columna interior.',
    introduction: 'Una zapata aislada distribuye sobre el terreno la carga concentrada de una columna. El modelo activo estudia una base rectangular de espesor constante, con columna y carga axial centradas; esa simetría permite representar el contacto como una presión uniforme y estudiar cada dirección como un voladizo desde la cara de la columna.',
    loadPath: ['Columna', 'Compresión local', 'Zapata', 'Presión de contacto', 'Suelo'],
    scopeFacts: [
      { label: 'Acción incluida', value: 'Carga axial centrada' },
      { label: 'Contacto', value: 'Uniforme y completamente comprimido' },
      { label: 'Revisiones', value: 'Contacto, cortante, punzonamiento, flexión, acero y desarrollo' },
    ],
    sections: [
      {
        title: 'Función estructural y comportamiento',
        summary: 'Cómo una carga concentrada se transforma en una reacción distribuida.',
        paragraphs: [
          'La columna introduce una fuerza sobre una región pequeña. La zapata aumenta el área de transmisión para que la presión media sobre el suelo pueda compararse con la capacidad admisible declarada por el estudio geotécnico.',
          'Estructuralmente, las porciones que sobresalen de las caras de la columna trabajan como voladizos. La reacción del suelo actúa hacia arriba y genera cortante y flexión en la zapata, mientras la carga de la columna actúa hacia abajo.',
        ],
        points: ['La geometría B × L controla el área de contacto.', 'El espesor h y el peralte efectivo d controlan las secciones resistentes.', 'Las direcciones B y L se revisan por separado porque sus voladizos pueden ser distintos.'],
      },
      {
        title: 'Contacto de servicio: presión bruta y neta',
        summary: 'Qué se compara con la capacidad admisible y por qué la base debe coincidir.',
        paragraphs: [
          'La revisión geotécnica usa acciones de servicio declaradas. En base bruta se consideran la carga de columna y los pesos incluidos sobre la superficie de contacto. En base neta se descuenta el esfuerzo geoestático removido que el usuario declara.',
          'Capacidad y presión deben expresarse con la misma base. Comparar una presión bruta con una capacidad neta —o al contrario— mezcla definiciones y puede producir una conclusión incorrecta aunque la aritmética sea correcta.',
        ],
        formulas: [
          { label: 'Área', expression: 'A = B · L', meaning: 'Superficie rectangular de contacto.' },
          { label: 'Presión uniforme', expression: 'q = Pserv,total / A', meaning: 'Presión media para carga centrada y contacto completo.' },
          { label: 'Utilización', expression: 'η = qseleccionada / qadm', meaning: 'Relación entre la presión compatible y la capacidad declarada.' },
        ],
        caution: 'AndeLogic no calcula qadm ni asentamientos. Ambos dependen del estudio geotécnico aplicable.',
      },
      {
        title: 'Peralte efectivo y cortante unidireccional',
        summary: 'La sección crítica se ubica a una distancia d desde la cara de la columna.',
        paragraphs: [
          'El peralte efectivo representa la distancia aproximada desde la fibra comprimida hasta el centro del acero inferior a tracción. No es igual al espesor total: descuenta recubrimiento y medio diámetro de la barra según la definición geométrica activa.',
          'Para cortante unidireccional se aísla el área exterior a la sección crítica. La reacción del suelo contenida en esa franja produce la demanda Vu. Se estudian las dos direcciones y gobierna la relación más exigente.',
        ],
        formulas: [
          { label: 'Peralte efectivo', expression: 'd = h − recubrimiento − φbarra/2', meaning: 'Distancia geométrica hasta el centro de la barra inferior.' },
          { label: 'Demanda conceptual', expression: 'Vu = qu · área exterior', meaning: 'Reacción última fuera de la sección crítica.' },
        ],
      },
      {
        title: 'Punzonamiento alrededor de la columna',
        summary: 'Una falla bidireccional distinta del cortante de viga.',
        paragraphs: [
          'El punzonamiento representa la posibilidad de que la columna atraviese la zapata formando una superficie crítica alrededor de su perímetro. Para la columna interior centrada, el contorno crítico es cerrado y queda contenido completamente en la base.',
          'La demanda se obtiene restando de la carga última la reacción del suelo situada dentro del perímetro. El informe muestra perímetro, área interior, reacción interior, demanda y utilización para que la revisión pueda reconstruirse.',
        ],
        formulas: [
          { label: 'Demanda', expression: 'Vu = Pu − qu · Ainterior', meaning: 'Carga que debe cruzar el perímetro crítico.' },
        ],
        caution: 'La referencia implementada corresponde únicamente a columna interior centrada. No debe extrapolarse a borde o esquina.',
      },
      {
        title: 'Flexión, acero inferior y desarrollo',
        summary: 'Del momento de voladizo a una disposición preliminar de barras.',
        paragraphs: [
          'La flexión se evalúa en la cara de la columna, donde el momento del voladizo es máximo. Cada dirección utiliza su proyección libre y la dimensión perpendicular como ancho resistente.',
          'El área gobernante es el mayor valor entre el acero mínimo de referencia y el acero requerido por la demanda. Luego se compara con el área realmente proporcionada por el diámetro y la separación declarados.',
          'La longitud de desarrollo comprueba si la barra dispone de recorrido suficiente para transferir su esfuerzo al hormigón. No equivale a un plano de armado: anclajes, empalmes, ganchos y detalles especiales permanecen fuera del módulo simplificado.',
        ],
        formulas: [
          { label: 'Momento de voladizo', expression: 'Mu = qu · ancho · a² / 2', meaning: 'Demanda en la cara de la columna bajo presión uniforme.' },
          { label: 'Acero colocado por metro', expression: 'As,prov = Abarra / separación', meaning: 'Área distribuida de barras por unidad de ancho.' },
        ],
      },
      {
        title: 'Cómo interpretar los estados',
        summary: 'Calculado, referencia, ajuste y fuera de alcance no significan lo mismo.',
        paragraphs: [
          '“Calculado” indica que se obtuvo una magnitud física por equilibrio. “Dentro de referencia” indica que la utilización del procedimiento público implementado no supera su límite. Ninguno de los dos estados constituye por sí mismo una aprobación normativa integral.',
          'Una alerta pide modificar entradas o revisar la hipótesis. Un resultado no evaluado exige una comprobación externa; no debe interpretarse como cero demanda ni como aprobación automática.',
        ],
        caution: 'El diseño final requiere cargas completas, estudio geotécnico, detallado, compatibilidad normativa y revisión profesional.',
      },
    ],
    workflow: ['Confirmar que columna y carga estén centradas.', 'Verificar que capacidad y presión usen la misma base bruta o neta.', 'Revisar dimensiones, espesor, recubrimiento y barra declarada.', 'Analizar contacto de servicio.', 'Revisar cortante, punzonamiento y flexión con carga última.', 'Comparar acero requerido, mínimo, colocado y desarrollo.', 'Leer límites y documentar toda comprobación externa pendiente.'],
    commonMistakes: ['Usar una capacidad admisible sin identificar si es bruta o neta.', 'Confundir espesor total h con peralte efectivo d.', 'Aplicar la fórmula de columna interior a una columna de borde o esquina.', 'Interpretar una referencia de guía como aprobación integral.', 'Adoptar el armado mostrado sin revisar anclajes, empalmes y detallado constructivo.'],
    glossary: [
      { term: 'qadm', definition: 'Capacidad admisible suministrada por el estudio geotécnico.' },
      { term: 'qu', definition: 'Presión de contacto asociada a la carga última declarada.' },
      { term: 'd', definition: 'Peralte efectivo hasta el centroide del acero a tracción.' },
      { term: 'b₀', definition: 'Longitud del perímetro crítico de punzonamiento.' },
      { term: 'η', definition: 'Utilización: demanda o efecto dividido para su referencia disponible.' },
    ],
  },
  strip: {
    title: 'Teoría de zapata corrida',
    subtitle: 'Modelo por metro lineal para un muro continuo, centrado sobre una base de ancho constante.',
    introduction: 'Una zapata corrida distribuye una carga lineal de muro a lo largo de una cimentación continua. Cuando muro, carga y geometría son uniformes, una franja longitudinal de 1.00 m representa el comportamiento transversal repetitivo.',
    loadPath: ['Muro continuo', 'Franja de 1 m', 'Voladizos transversales', 'Suelo'],
    scopeFacts: [
      { label: 'Entrada principal', value: 'Carga lineal en kN/m' },
      { label: 'Modelo', value: 'Franja longitudinal de 1.00 m' },
      { label: 'No aplica', value: 'Punzonamiento de columna' },
    ],
    sections: [
      { title: 'Idealización por franja', summary: 'Por qué una cimentación continua puede estudiarse por cada metro.', paragraphs: ['La continuidad longitudinal permite aislar una franja de ancho unitario cuando no existen extremos, aberturas ni cambios de carga o sección. Las acciones, reacciones y áreas de acero se expresan por metro lineal.', 'La sección transversal contiene el ancho B de la base, el espesor h y el espesor del muro. Cada lado de la zapata actúa como un voladizo desde la cara del muro.'], points: ['P se expresa en kN/m.', 'Mu se expresa en kN·m por metro.', 'As se expresa como cm²/m o mm²/m.'] },
      { title: 'Contacto uniforme', summary: 'Carga lineal dividida para el ancho de la base.', paragraphs: ['Con el muro centrado y sin momento lineal, la resultante pasa por el centro de la sección. La reacción del suelo es uniforme sobre el ancho.', 'En servicio pueden incorporarse los pesos declarados de la franja. La comparación bruta o neta mantiene la misma regla de compatibilidad con la capacidad admisible.'], formulas: [{ label: 'Presión', expression: 'q = Plineal,total / B', meaning: 'Presión uniforme por cada metro de longitud.' }, { label: 'Presión última', expression: 'qu = Pu / B', meaning: 'Reacción usada en las demandas estructurales.' }] },
      { title: 'Cortante y flexión transversal', summary: 'Los dos lados trabajan como voladizos simétricos.', paragraphs: ['La proyección libre es la mitad de la diferencia entre el ancho de la zapata y el espesor del muro. El cortante se obtiene con la reacción situada más allá de la sección a distancia d.', 'El momento máximo se presenta en la cara del muro. Para carga uniforme, la integración del voladizo produce una expresión cuadrática con la proyección.'], formulas: [{ label: 'Voladizo', expression: 'a = (B − tmuro) / 2', meaning: 'Proyección libre a cada lado.' }, { label: 'Cortante', expression: 'Vu = qu · max(a − d, 0) · 1 m', meaning: 'Demanda exterior a la sección crítica.' }, { label: 'Flexión', expression: 'Mu = qu · 1 m · a² / 2', meaning: 'Momento en la cara del muro.' }] },
      { title: 'Armado transversal y longitudinal', summary: 'Acero principal frente a acero de distribución.', paragraphs: ['Las barras transversales resisten la flexión producida por los voladizos y constituyen el armado principal. Las barras longitudinales se mantienen como distribución mínima dentro del modelo actual.', 'La separación, desarrollo, continuidad, empalmes y encuentros deben revisarse como parte del detallado; la aplicación solo presenta una distribución preliminar.'] },
      { title: 'Cuándo deja de ser válida la franja', summary: 'Extremos, discontinuidades y cargas discretas requieren otro modelo.', paragraphs: ['Cerca de extremos, esquinas, aberturas, cambios de espesor o concentraciones de carga, el comportamiento deja de ser estrictamente repetitivo. Una fila de columnas no debe reemplazarse silenciosamente por un muro continuo.', 'Un muro excéntrico introduce momento y presión no uniforme; ese caso tampoco pertenece al motor de zapata corrida centrada.'], caution: 'El modelo no cubre extremos, aberturas, muros excéntricos, vigas de cimentación ni asentamientos diferenciales.' },
      { title: 'Lectura de resultados', summary: 'Qué significa revisar por metro y qué debe continuar fuera de la aplicación.', paragraphs: ['Los valores presentados corresponden a una franja unitaria y deben interpretarse junto con su unidad por metro. El punzonamiento de columna se marca como no aplicable, no como una comprobación omitida.', 'La continuidad real, juntas, encuentros y detalles de obra requieren el modelo global y la revisión profesional del proyecto.'] },
    ],
    workflow: ['Confirmar continuidad y carga lineal centrada.', 'Definir el metro de referencia y las unidades por longitud.', 'Revisar contacto con la capacidad compatible.', 'Obtener voladizo, d, cortante y momento transversal.', 'Comparar acero transversal, longitudinal y desarrollo.', 'Revisar extremos y discontinuidades fuera del modelo unitario.'],
    commonMistakes: ['Ingresar una carga puntual en un campo de kN/m.', 'Modelar una fila de columnas discretas como muro continuo.', 'Interpretar acero por metro como acero total.', 'Ignorar extremos, huecos o cambios de sección.', 'Buscar punzonamiento de columna en un modelo continuo bajo muro.'],
    glossary: [{ term: 'Franja unitaria', definition: 'Porción longitudinal de 1.00 m usada para representar la continuidad.' }, { term: 'Carga lineal', definition: 'Fuerza distribuida a lo largo del muro, expresada en kN/m.' }, { term: 'a', definition: 'Proyección transversal libre desde la cara del muro.' }, { term: 'Acero principal', definition: 'Refuerzo transversal que responde a la flexión del voladizo.' }, { term: 'Acero de distribución', definition: 'Refuerzo longitudinal mínimo del modelo actual.' }],
  },
  combined: {
    title: 'Teoría de zapata combinada rectangular',
    subtitle: 'Equilibrio de dos columnas interiores sobre una base común de ancho constante.',
    introduction: 'Una zapata combinada rectangular soporta dos columnas mediante una sola base. La posición y magnitud de ambas cargas determinan una resultante; su distancia al centroide geométrico controla si la presión es uniforme o varía linealmente a lo largo de la zapata.',
    loadPath: ['Columna 1 + Columna 2', 'Base común', 'Reacción longitudinal', 'Suelo'],
    scopeFacts: [{ label: 'Columnas', value: 'Dos interiores y alineadas' }, { label: 'Contacto', value: 'Lineal y completamente comprimido' }, { label: 'Modelo resistente', value: 'Viga longitudinal + voladizos transversales' }],
    sections: [
      { title: 'Resultante de cargas y centroide', summary: 'La geometría debe equilibrar fuerza y momento.', paragraphs: ['La suma de cargas define la fuerza vertical total. El momento respecto del centro de la base depende de la posición de cada columna. Si la resultante coincide con el centroide, la presión es uniforme; si no coincide pero permanece dentro del núcleo, la presión es lineal.', 'Los pesos uniformes de servicio actúan en el centroide y aumentan P sin introducir momento adicional.'], formulas: [{ label: 'Excentricidad', expression: 'e = M / P', meaning: 'Separación entre resultante y centroide de la base.' }, { label: 'Presiones extremas', expression: 'qizq,der = qprom · (1 ∓ 6e/L)', meaning: 'Valores lineales en los extremos para base rectangular.' }] },
      { title: 'Contacto completo y núcleo central', summary: 'La presión mínima no puede ser negativa en este modelo.', paragraphs: ['El suelo se idealiza trabajando a compresión. Si una presión extrema es negativa, parte de la base perdería contacto y la distribución lineal completa dejaría de representar el problema.', 'AndeLogic bloquea ese caso porque no implementa área efectiva, contacto parcial ni una redistribución no lineal.'], caution: 'Un bloqueo por presión negativa no significa que la estructura sea imposible; significa que necesita otro modelo.' },
      { title: 'Comportamiento como viga longitudinal', summary: 'Reacción hacia arriba y cargas puntuales hacia abajo.', paragraphs: ['La reacción distribuida por unidad de longitud es w(x)=Bq(x). Al integrar w(x) y descontar las cargas de columnas se obtienen los diagramas de cortante V(x) y momento M(x).', 'Los momentos positivos suelen asociarse al acero inferior y los negativos al acero superior, pero su detallado real debe respetar continuidad, anclaje y extensión de barras.'], formulas: [{ label: 'Reacción lineal', expression: 'w(x) = B · q(x)', meaning: 'Carga ascendente por unidad de longitud.' }, { label: 'Equilibrio final', expression: 'V(L)=0; M(L)=0', meaning: 'Control numérico de fuerza y momento en el extremo.' }] },
      { title: 'Revisiones locales en cada columna', summary: 'La respuesta global no elimina cortante, punzonamiento y flexión transversal.', paragraphs: ['El cortante longitudinal se estudia cerca de las caras de ambas columnas. Transversalmente, la base trabaja como voladizo a cada lado del ancho de columna.', 'Cada columna interior conserva un perímetro de punzonamiento cerrado. La reacción dentro de ese perímetro debe integrarse usando la presión local, no una presión media arbitraria.'] },
      { title: 'Armado longitudinal y transversal', summary: 'Zonas superiores, inferiores y franjas transversales tienen funciones distintas.', paragraphs: ['El armado longitudinal responde a la envolvente de momentos de la viga. El armado transversal responde a los voladizos laterales en las posiciones de columna.', 'El acero requerido se compara con el mínimo y el colocado, manteniendo visibles las secciones insuficientes y los largos de desarrollo declarados.'] },
      { title: 'Alcance y lectura profesional', summary: 'Dos columnas interiores no representan cualquier cimentación combinada.', paragraphs: ['El motor excluye columnas de borde, momentos transferidos, fuerzas horizontales, más de dos columnas, contacto parcial, asentamientos e interacción suelo-estructura.', 'La compatibilidad de asentamientos entre columnas y la rigidez real de la base requieren evaluación geotécnica y estructural adicional.'] },
    ],
    workflow: ['Comprobar que existen exactamente dos columnas interiores alineadas.', 'Ubicar cargas y centroide en el mismo sistema de coordenadas.', 'Revisar resultante, excentricidad y presiones extremas.', 'Auditar cierre de V(L) y M(L).', 'Revisar secciones longitudinales, transversales y punzonamiento por columna.', 'Definir zonas de acero y desarrollo.', 'Completar asentamientos y detallado fuera del motor.'],
    commonMistakes: ['Usar distancias desde orígenes distintos.', 'Suponer presión uniforme cuando la resultante no coincide con el centroide.', 'Continuar el cálculo con presión extrema negativa.', 'Usar una sola presión para ambos perímetros de punzonamiento.', 'Olvidar el acero superior asociado al momento negativo.'],
    glossary: [{ term: 'Resultante', definition: 'Fuerza equivalente a la suma de cargas con una posición definida por momentos.' }, { term: 'Núcleo central', definition: 'Región en la que debe quedar la resultante para conservar compresión completa.' }, { term: 'w(x)', definition: 'Reacción ascendente por unidad longitudinal.' }, { term: 'Momento negativo', definition: 'Curvatura que normalmente requiere acero superior en la zona entre columnas.' }, { term: 'Cierre de equilibrio', definition: 'Comprobación de que cortante y momento regresan a cero al final de la base.' }],
  },
  strap: {
    title: 'Teoría de zapata medianera con viga centradora',
    subtitle: 'Transferencia del momento excéntrico entre una base exterior y una base interior.',
    introduction: 'Cuando una columna próxima a un lindero no puede centrarse sobre su zapata, una viga centradora puede enlazarla con una base interior. El modelo idealiza una viga rígida cuyo tramo libre no recibe reacción del suelo y que redistribuye las reacciones de las dos zapatas.',
    loadPath: ['Columna exterior', 'Momento excéntrico', 'Viga centradora', 'Base interior', 'Dos reacciones de suelo'],
    scopeFacts: [{ label: 'Sistema', value: 'Dos bases separadas' }, { label: 'Hipótesis clave', value: 'Viga rígida sin apoyo en suelo' }, { label: 'Punzonamiento', value: 'No evaluado en los encuentros' }],
    sections: [
      { title: 'Origen del problema medianero', summary: 'La carga exterior no pasa por el centro de su base.', paragraphs: ['La restricción del lindero desplaza la columna respecto del centro de la zapata exterior. Esa excentricidad genera un momento P·e que, sin otro mecanismo, produciría presión no uniforme o pérdida de contacto.', 'La viga centradora transmite ese momento hacia el sistema interior para que cada base pueda idealizarse con una reacción positiva y uniforme dentro del alcance adoptado.'] },
      { title: 'Equilibrio de la transferencia', summary: 'La viga aumenta una reacción y reduce la otra sin crear fuerza vertical.', paragraphs: ['El momento exterior se transforma en un par de fuerzas separado por la distancia S entre centros de zapatas. La transferencia V=M/S se suma a la reacción exterior y se resta de la interior.', 'La suma Rext+Rint permanece igual a la suma de cargas verticales. Una reacción interior no positiva invalida el modelo porque implicaría levantamiento.'], formulas: [{ label: 'Momento excéntrico', expression: 'M = Pext · e', meaning: 'Acción que debe equilibrar la viga.' }, { label: 'Transferencia', expression: 'Vstrap = M / S', meaning: 'Fuerza del par entre las dos bases.' }, { label: 'Reacciones', expression: 'Rext=Pext+Vstrap; Rint=Pint−Vstrap', meaning: 'Reacciones equilibradas del sistema ideal.' }] },
      { title: 'Contacto de las dos bases', summary: 'Cada zapata se revisa por separado.', paragraphs: ['Después de obtener las reacciones, cada área recibe una presión uniforme propia. Los pesos de servicio declarados se incorporan según la definición del modelo, mientras la combinación última usa las cargas últimas declaradas.', 'Las capacidades admisibles y asentamientos deben ser compatibles con el mismo perfil de suelo y con las dimensiones de cada base.'] },
      { title: 'Diseño conceptual de la viga', summary: 'La viga transmite momento y cortante, pero no debe apoyarse accidentalmente en el suelo.', paragraphs: ['La demanda principal de flexión está asociada al momento de excentricidad y el cortante a su transferencia entre bases. La rigidez supuesta es esencial: una viga flexible o apoyada en el terreno cambia la distribución.', 'Estribos, confinamiento, nudos, anclaje dentro de columnas y zapatas y compatibilidad de deformaciones requieren un detallado especializado.'] },
      { title: 'Bases, punzonamiento y encuentro', summary: 'La presencia de la viga altera la región crítica.', paragraphs: ['Las dos bases se revisan por cortante y flexión como placas bajo presión uniforme. Sin embargo, la viga cruza la región próxima a la columna y modifica la transferencia de cortante y momento.', 'Por esa razón AndeLogic no reutiliza el perímetro de una columna interior aislada: el punzonamiento de los encuentros permanece expresamente no evaluado.'], caution: 'No evaluado no significa que el punzonamiento no exista; exige un modelo y una referencia específicos.' },
      { title: 'Condiciones que requieren otro análisis', summary: 'La idealización rígida tiene límites claros.', paragraphs: ['Quedan fuera la excentricidad biaxial, columna de esquina, momentos adicionales, viga en contacto con suelo, interacción suelo-estructura, asentamientos diferenciales y diseño completo de nudos.', 'El sistema debe revisarse como conjunto: una base que cumple individualmente no garantiza que la transferencia ni la compatibilidad sean satisfactorias.'] },
    ],
    workflow: ['Definir lindero, centros, excentricidad e y separación S.', 'Calcular momento y transferencia.', 'Comprobar reacciones positivas y cierre vertical.', 'Revisar contacto de cada base.', 'Revisar cortante, flexión, acero y desarrollo de las bases.', 'Revisar viga por momento y cortante.', 'Enviar encuentros, nudos y punzonamiento a revisión especializada.'],
    commonMistakes: ['Permitir que el tramo libre de la viga apoye en el suelo dentro del mismo modelo.', 'Medir S entre caras en vez de entre centros.', 'Ignorar una reacción interior negativa.', 'Tratar la viga como simple amarre sin transferencia de momento.', 'Aplicar punzonamiento de columna interior en el encuentro atravesado por la viga.'],
    glossary: [{ term: 'e', definition: 'Excentricidad entre carga exterior y centro de su base.' }, { term: 'S', definition: 'Separación entre centros de las dos zapatas.' }, { term: 'Vstrap', definition: 'Transferencia vertical equivalente al par resistente.' }, { term: 'Viga centradora', definition: 'Elemento rígido que enlaza bases y equilibra el momento excéntrico.' }, { term: 'Reacción positiva', definition: 'Compresión bajo la base; una reacción no positiva queda fuera del modelo.' }],
  },
  trapezoidal: {
    title: 'Teoría de zapata combinada trapezoidal',
    subtitle: 'Dos columnas interiores sobre una base cuyo ancho cambia linealmente.',
    introduction: 'La geometría trapezoidal desplaza el centroide del área hacia el extremo más ancho. Esto permite aproximar el centroide de la base a la resultante de dos cargas cuando una zapata rectangular no ofrece una distribución conveniente dentro de las restricciones del proyecto.',
    loadPath: ['Dos columnas', 'Trapecio rígido', 'Ancho variable B(x)', 'Reacción w(x)', 'Suelo'],
    scopeFacts: [{ label: 'Geometría', value: 'B1 y B2 unidos linealmente' }, { label: 'Contacto', value: 'q(x) lineal y completo' }, { label: 'Reacción longitudinal', value: 'w(x)=q(x)B(x), función cuadrática' }],
    sections: [
      { title: 'Por qué cambia el ancho', summary: 'El centroide geométrico depende de B1, B2 y L.', paragraphs: ['Aumentar un ancho extremo agrega más área en ese lado y desplaza el centroide. El objetivo conceptual es reducir la excentricidad entre la resultante de cargas y el centroide del área.', 'El motor admite presión lineal aunque ambos puntos no coincidan exactamente; no presupone presión uniforme.'] },
      { title: 'Propiedades geométricas del trapecio', summary: 'Área, primer y segundo momento se obtienen integrando el ancho local.', paragraphs: ['El ancho local B(x) cambia linealmente. Su integral entrega el área; la integral xB(x) entrega el primer momento y permite ubicar el centroide; la integral x²B(x) participa en la solución de presión.', 'Estas propiedades se calculan analíticamente para evitar discretizaciones ocultas.'], formulas: [{ label: 'Ancho local', expression: 'B(x)=B1+(B2−B1)x/L', meaning: 'Variación lineal del ancho.' }, { label: 'Área', expression: 'A=L(B1+B2)/2', meaning: 'Área de la planta trapezoidal.' }] },
      { title: 'Presión obtenida por equilibrio', summary: 'Dos ecuaciones determinan los coeficientes a y b.', paragraphs: ['La forma q(x)=a+bx debe recuperar simultáneamente la fuerza vertical y el momento de todas las cargas. Los coeficientes no se eligen visualmente ni se fuerzan a producir presión uniforme.', 'Las presiones de ambos extremos deben ser no negativas en servicio y última para conservar contacto completo.'], formulas: [{ label: 'Presión', expression: 'q(x)=a+bx', meaning: 'Plano uniaxial de contacto.' }, { label: 'Equilibrio', expression: 'aA+bQ=P; aQ+bJ=M0', meaning: 'Sistema que recupera fuerza y momento.' }] },
      { title: 'Viga longitudinal de ancho variable', summary: 'El producto de dos funciones lineales genera una reacción cuadrática.', paragraphs: ['La reacción por longitud w(x) combina presión y ancho local. Al integrarla se obtienen cortante y momento; las cargas de columna introducen saltos en cortante y cambios de pendiente en momento.', 'El ancho resistente de una sección no es constante: las revisiones locales deben usar B(x) en la posición correspondiente.'], formulas: [{ label: 'Reacción', expression: 'w(x)=q(x)·B(x)', meaning: 'Carga ascendente longitudinal, generalmente cuadrática.' }] },
      { title: 'Revisiones en las columnas', summary: 'El ancho local afecta voladizos, punzonamiento y armado.', paragraphs: ['En cada columna, la dirección transversal usa el ancho local. El perímetro de punzonamiento debe quedar completamente dentro de los bordes inclinados.', 'Si un perímetro alcanza el borde, el caso deja de corresponder a una columna interior con contorno completo y el motor lo bloquea.'] },
      { title: 'Alcance y decisiones de diseño', summary: 'La forma trapezoidal no resuelve por sí sola toda restricción de lindero.', paragraphs: ['Se excluyen trapecios no simétricos respecto del eje, espesor variable, columnas de borde, momentos transferidos, acciones horizontales, contacto parcial y más de dos columnas.', 'La selección de B1 y B2 sigue siendo una decisión de predimensionamiento y coordinación geométrica; AndeLogic verifica los valores declarados.'] },
    ],
    workflow: ['Definir B1, B2, L y posiciones desde un único origen.', 'Comprobar área, centroide y ubicación de columnas.', 'Resolver q(x) por fuerza y momento.', 'Verificar presiones extremas y contacto completo.', 'Auditar w(x), V(x), M(x) y cierre de equilibrio.', 'Revisar ancho local, cortante, punzonamiento, flexión y acero.', 'Completar asentamientos y detallado externo.'],
    commonMistakes: ['Usar el promedio de B1 y B2 como ancho constante en todas las revisiones.', 'Forzar presión uniforme sin verificar centroides.', 'Invertir B1 y B2 sin actualizar el origen de posiciones.', 'Ignorar que w(x) suele ser cuadrática.', 'Aceptar un perímetro de punzonamiento que cruza el borde inclinado.'],
    glossary: [{ term: 'B(x)', definition: 'Ancho local del trapecio en la posición x.' }, { term: 'x̄', definition: 'Centroide longitudinal del área trapezoidal.' }, { term: 'Q', definition: 'Primer momento del área respecto del origen.' }, { term: 'J', definition: 'Segundo momento geométrico usado en el equilibrio de presión.' }, { term: 'w(x)', definition: 'Reacción longitudinal resultante del producto q(x)B(x).' }],
  },
  edge: {
    title: 'Teoría de zapata excéntrica de borde',
    subtitle: 'Una columna alineada a un lindero, sin viga centradora y con contacto completo.',
    introduction: 'En una zapata de borde, una cara de la columna coincide con el límite de la base. La carga queda desplazada respecto del centroide y produce un momento uniaxial; por ello la presión de contacto varía linealmente a lo largo de la dimensión excéntrica.',
    loadPath: ['Columna al borde', 'Carga excéntrica', 'Base rectangular', 'Presión lineal', 'Suelo'],
    scopeFacts: [{ label: 'Excentricidad', value: 'Geométrica y uniaxial' }, { label: 'Condición', value: 'Resultante dentro del tercio central' }, { label: 'Punzonamiento', value: 'No evaluado por perímetro truncado' }],
    sections: [
      { title: 'Origen geométrico de la excentricidad', summary: 'La posición de la columna crea momento aun sin momento aplicado.', paragraphs: ['La carga axial pasa por el centro de la columna, pero ese punto no coincide con el centro de la base. El producto de la carga por la distancia al centroide genera el momento de contacto.', 'El usuario declara si el lindero está a izquierda o derecha. Ambos casos deben producir magnitudes iguales e intercambiar las presiones extremas.'], formulas: [{ label: 'Momento', expression: 'M=Pcol(xp−L/2)', meaning: 'Momento de la carga respecto del centroide.' }, { label: 'Excentricidad', expression: 'e=M/Ptotal', meaning: 'Posición de la resultante total.' }] },
      { title: 'Tercio central y contacto completo', summary: 'La resultante debe permanecer dentro de L/6.', paragraphs: ['Para una base rectangular con presión lineal, la condición |e|≤L/6 mantiene ambos extremos en compresión. En el límite, una presión llega a cero.', 'Fuera del tercio central aparece contacto parcial. El motor lo bloquea en vez de recortar automáticamente la base activa.'], formulas: [{ label: 'Presiones', expression: 'qizq,der=qprom(1∓6e/L)', meaning: 'Valores de contacto en los extremos.' }] },
      { title: 'Servicio y combinación última', summary: 'Los pesos centrados cambian P pero no el momento de la columna.', paragraphs: ['En servicio, el peso propio y el relleno uniforme aumentan la carga total y pueden reducir la excentricidad e=M/P. La comparación usa la base bruta o neta compatible.', 'En la revisión estructural se utiliza la carga última declarada sin inventar factores para pesos permanentes. La hipótesis de contacto completo también debe cumplirse en última.'] },
      { title: 'Cortante y flexión con presión variable', summary: 'Las demandas se obtienen integrando q(x), no usando un promedio indiscriminado.', paragraphs: ['La reacción longitudinal w(x)=Bq(x) varía linealmente. Su integración recupera cortante y momento, y debe cerrar el equilibrio en el extremo.', 'Los voladizos a ambos lados de la cara de columna son diferentes. En dirección transversal se integra la presión a lo largo de la base antes de revisar el voladizo.'] },
      { title: 'Punzonamiento de borde', summary: 'El perímetro crítico no es el de una columna interior.', paragraphs: ['La cara exterior coincide con el borde y corta el contorno crítico. Cambian geometría, longitud y transferencia de esfuerzos.', 'AndeLogic lo presenta como no evaluado hasta incorporar una referencia específica y casos independientes.'], caution: 'No reutilices la resistencia de columna interior para cerrar esta comprobación.' },
      { title: 'Cuándo elegir otro sistema', summary: 'Una viga centradora o un modelo de contacto parcial pueden ser necesarios.', paragraphs: ['Si la resultante sale del tercio central, si existe momento adicional, excentricidad biaxial, fuerzas horizontales o interacción con otra base, el motor deja de ser aplicable.', 'La herramienta verifica una geometría declarada; no decide automáticamente si conviene cambiar a una zapata medianera con viga centradora.'] },
    ],
    workflow: ['Definir orientación del lindero y posición geométrica de la columna.', 'Calcular P, M y e en servicio.', 'Comprobar tercio central y presiones extremas.', 'Repetir la condición con la carga última declarada.', 'Integrar reacción para cortante y flexión.', 'Revisar acero y desarrollo.', 'Enviar punzonamiento de borde y contacto parcial a un modelo específico.'],
    commonMistakes: ['Tratar la carga como centrada porque no se declaró un momento externo.', 'Comprobar solo qmáx y olvidar qmín.', 'Usar Pcol en el denominador de e cuando existen pesos centrados de servicio.', 'Promediar la presión para todas las demandas.', 'Aplicar el perímetro de punzonamiento interior.'],
    glossary: [{ term: 'xp', definition: 'Posición del centro de la columna desde el origen longitudinal.' }, { term: 'e', definition: 'Excentricidad de la resultante respecto del centroide.' }, { term: 'Tercio central', definition: 'Intervalo |e|≤L/6 que conserva compresión completa.' }, { term: 'Contacto parcial', definition: 'Estado con una porción de la base sin compresión; fuera del motor.' }, { term: 'Caso espejo', definition: 'Orientación opuesta con iguales magnitudes y extremos intercambiados.' }],
  },
  corner: {
    title: 'Teoría de zapata de esquina',
    subtitle: 'Excentricidad simultánea en X y Y y presión plana en cuatro esquinas.',
    introduction: 'Cuando dos caras de una columna coinciden con bordes adyacentes, la carga axial queda desplazada respecto del centroide en ambas direcciones. La base debe equilibrar una fuerza vertical y dos momentos mediante un único plano de presiones.',
    loadPath: ['Columna en esquina', 'Dos excentricidades', 'Base rectangular', 'Plano q(x,y)', 'Suelo'],
    scopeFacts: [{ label: 'Acción', value: 'Carga axial con excentricidad geométrica biaxial' }, { label: 'Contacto', value: 'Cuatro esquinas comprimidas' }, { label: 'Punzonamiento', value: 'No evaluado por dos bordes truncados' }],
    sections: [
      { title: 'Dos momentos inseparables', summary: 'El problema no son dos cálculos uniaxiales independientes.', paragraphs: ['La posición (xp,yp) de la columna produce My=P(xp−L/2) y Mx=P(yp−B/2). Ambos efectos actúan al mismo tiempo sobre las presiones de esquina.', 'El plano q(x,y) combina una presión media y dos pendientes. Su integración debe recuperar P, Mx y My.'], formulas: [{ label: 'Plano', expression: 'q=P/A + My(x−L/2)/Iy + Mx(y−B/2)/Ix', meaning: 'Distribución lineal compatible con fuerza y dos momentos.' }] },
      { title: 'Núcleo central biaxial', summary: 'Las excentricidades interactúan de forma aditiva.', paragraphs: ['Cumplir |ex|≤L/6 y |ey|≤B/6 por separado no garantiza que todas las esquinas estén comprimidas. La esquina opuesta recibe simultáneamente ambos descensos.', 'La interacción κ=6|ex|/L+6|ey|/B debe ser menor o igual que uno. El margen 1−κ indica la distancia relativa al límite de contacto completo.'], formulas: [{ label: 'Interacción', expression: 'κ=6|ex|/L+6|ey|/B≤1', meaning: 'Condición de compresión en las cuatro esquinas.' }] },
      { title: 'Lectura de las cuatro presiones', summary: 'Cada esquina combina signos distintos de los dos momentos.', paragraphs: ['Las presiones no deben interpretarse como cuatro comprobaciones aisladas: son puntos del mismo plano. La mayor identifica la zona de mayor compresión y la menor controla la pérdida de contacto.', 'Cambiar a la esquina opuesta debe intercambiar posiciones sin cambiar qmín, qmáx ni la utilización global.'] },
      { title: 'Demandas direccionales', summary: 'Las proyecciones X/Y auditan equilibrio y generan demandas de franja.', paragraphs: ['La presión plana se integra transversalmente para construir una reacción equivalente en X y longitudinalmente para construir otra en Y. Cada proyección debe cerrar fuerza y momento.', 'Estas franjas completas permiten revisar demandas direccionales dentro del modelo, pero no sustituyen un análisis general de placa cuando la rigidez y distribución bidimensional sean relevantes.'] },
      { title: 'Punzonamiento de esquina y armado', summary: 'El contorno está truncado en dos direcciones.', paragraphs: ['La cercanía de dos bordes modifica el perímetro y la transferencia. El motor no aproxima esta condición con una columna interior ni con una columna de borde.', 'La malla X/Y presentada es preliminar y se basa en demandas direccionales; continuidad, concentración de barras y detalle local alrededor de la columna requieren revisión adicional.'], caution: 'Punzonamiento de esquina permanece no evaluado.' },
      { title: 'Límites del plano rígido', summary: 'Contacto parcial y flexibilidad exigen modelos superiores.', paragraphs: ['Se excluyen momentos adicionales de columna, fuerzas horizontales, torsión, levantamiento, presión no lineal, asentamientos e interacción suelo-estructura.', 'Una presión negativa bloquea el caso; no se reemplaza con un área efectiva improvisada.'] },
    ],
    workflow: ['Definir esquina y coordenadas con un origen coherente.', 'Sumar cargas y obtener Mx, My, ex y ey.', 'Comprobar κ y las cuatro presiones.', 'Auditar fuerza y ambos momentos.', 'Revisar demandas X/Y, acero y desarrollo.', 'Mantener punzonamiento de esquina como no evaluado.', 'Completar placa, contacto parcial y asentamientos externamente.'],
    commonMistakes: ['Revisar los sextos X e Y por separado.', 'Intercambiar Mx y My por no declarar la convención de ejes.', 'Comparar solo la presión máxima y omitir la mínima.', 'Suponer que el caso espejo cambia las magnitudes.', 'Usar punzonamiento interior o de borde para una esquina.'],
    glossary: [{ term: 'ex, ey', definition: 'Excentricidades de la resultante en los dos ejes.' }, { term: 'κ', definition: 'Interacción biaxial del núcleo central.' }, { term: 'Ix, Iy', definition: 'Momentos de inercia del área de contacto respecto de sus ejes centroidales.' }, { term: 'Plano de presión', definition: 'Superficie lineal q(x,y) que equilibra fuerza y dos momentos.' }, { term: 'Caso espejo', definition: 'Cambio de esquina que permuta las presiones sin alterar sus extremos.' }],
  },
  mat: {
    title: 'Teoría de losa de cimentación',
    subtitle: 'Contacto global de múltiples columnas y pantalla rígida–Winkler preliminar.',
    introduction: 'Una losa de cimentación reúne varias columnas sobre una base común. El motor actual estudia el equilibrio global de una losa rectangular idealmente rígida, el plano de presiones con contacto completo y una estimación preliminar s=q/k cuando el usuario aporta un módulo de balasto compatible.',
    loadPath: ['Múltiples columnas', 'Resultante global', 'Losa rígida', 'Plano de presión', 'Suelo / resortes Winkler'],
    scopeFacts: [{ label: 'Columnas', value: '2 a 24 cargas axiales' }, { label: 'Contacto', value: 'Plano lineal y cuatro esquinas comprimidas' }, { label: 'No evaluado', value: 'Placa, punzonamiento y armado' }],
    sections: [
      { title: 'Resultante multicolumna', summary: 'Todas las cargas participan en una sola fuerza y dos momentos.', paragraphs: ['Cada columna aporta su carga y su brazo respecto del centroide de la losa. La suma define P, Mx y My; dividir los momentos para P produce las excentricidades globales.', 'Los pesos uniformes de servicio aumentan P en el centroide. No corrigen automáticamente una mala distribución de columnas ni sustituyen combinaciones de carga.'], formulas: [{ label: 'Fuerza', expression: 'P=ΣPi + cargas centradas', meaning: 'Resultante vertical global.' }, { label: 'Momentos', expression: 'My=ΣPi(xi−L/2); Mx=ΣPi(yi−B/2)', meaning: 'Momentos de las columnas respecto del centroide.' }] },
      { title: 'Plano de contacto y núcleo biaxial', summary: 'La base rígida recupera fuerza y dos momentos.', paragraphs: ['La misma forma de plano usada en la zapata de esquina se aplica a la resultante de todas las columnas. Las cuatro presiones extremas resumen el estado de contacto global.', 'La condición κ≤1 conserva compresión en toda la losa. Si falla, el modelo lineal de área completa deja de ser aplicable.'], formulas: [{ label: 'Contacto', expression: 'q(x,y)=P/A+Myξ/Iy+Mxη/Ix', meaning: 'Plano lineal respecto del centroide.' }, { label: 'Núcleo', expression: '6|ex|/L+6|ey|/B≤1', meaning: 'Condición de contacto completo.' }] },
      { title: 'Pantalla rígida–Winkler', summary: 'q=k·s es una idealización local, no un análisis geotécnico completo.', paragraphs: ['El modelo Winkler representa el suelo mediante resortes independientes. Para un k declarado, la estimación s=q/k transforma cada presión de esquina en un desplazamiento local.', 'El módulo k no es una propiedad universal del suelo: depende también de dimensiones, forma, profundidad, rigidez y procedimiento de obtención. Debe ser compatible con la cimentación y con la base de presión utilizada.'], formulas: [{ label: 'Asentamiento preliminar', expression: 's=qseleccionada/k', meaning: 'Desplazamiento de esquina bajo la idealización rígida–Winkler.' }], caution: 'No representa consolidación, estratigrafía, interacción entre resortes ni flexibilidad de la losa.' },
      { title: 'Equilibrio global frente a diseño de placa', summary: 'Cerrar fuerzas y momentos no dimensiona la losa.', paragraphs: ['Las proyecciones X/Y demuestran que el plano recupera las cargas y momentos declarados. Son una auditoría del contacto, no franjas de diseño estructural.', 'La flexión real de placa depende de rigidez, columnas, suelo, continuidad y redistribución bidimensional. Por ello el motor no genera acero ni momentos de diseño de placa.'] },
      { title: 'Punzonamiento y zonas locales', summary: 'Cada columna requiere una transferencia local que el modelo global no resuelve.', paragraphs: ['Aunque el plano global proporcione presión bajo la losa, el punzonamiento depende de la geometría local de cada columna, profundidad efectiva, momentos transferidos y estado de la placa.', 'AndeLogic marca punzonamiento, cortante, flexión y armado como no evaluados para impedir que el equilibrio global parezca un diseño estructural completo.'] },
      { title: 'Cuándo se necesita un modelo avanzado', summary: 'Rigidez finita, suelo no uniforme y contacto parcial cambian la respuesta.', paragraphs: ['Una losa flexible, capas de suelo, resortes variables, muros, cargas distribuidas, momentos de columna, levantamiento o interacción avanzada requieren un modelo de placa o elementos finitos y parámetros geotécnicos compatibles.', 'La pantalla actual es útil para revisar la resultante, detectar pérdida de contacto y comparar órdenes de magnitud de presión y asentamiento declarado.'] },
    ],
    workflow: ['Definir dimensiones, origen y todas las columnas.', 'Comprobar contención, separación e IDs únicos.', 'Sumar P, Mx y My.', 'Revisar κ y las cuatro presiones.', 'Comparar q con capacidad admisible compatible.', 'Usar s=q/k solo con k y límites externos compatibles.', 'Enviar placa, punzonamiento, armado y asentamientos avanzados a un modelo específico.'],
    commonMistakes: ['Interpretar la losa como infinitamente rígida en cualquier geometría.', 'Usar un k tomado de otra cimentación sin verificar compatibilidad.', 'Confundir una proyección de equilibrio con una franja de diseño.', 'Suponer que presión global permite revisar punzonamiento sin modelo local.', 'Continuar después de una esquina con presión negativa.'],
    glossary: [{ term: 'Resultante global', definition: 'Fuerza y momentos equivalentes de todas las columnas.' }, { term: 'Winkler', definition: 'Idealización del suelo como resortes locales independientes.' }, { term: 'k', definition: 'Módulo de balasto compatible declarado en kN/m³.' }, { term: 'Δs', definition: 'Diferencia entre asentamientos extremos estimados.' }, { term: 'Rigidez de placa', definition: 'Capacidad de la losa para redistribuir acciones mediante flexión bidimensional; no evaluada aquí.' }],
  },
}
