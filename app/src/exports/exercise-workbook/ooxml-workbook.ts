import type { ExerciseWorkbookModel, WorkbookScalar } from './workbook-model'
import { CALCULATION_FIRST_ROW, INPUT_FIRST_ROW } from './workbook-model'

type Cell = { column: number; value: WorkbookScalar | null; style?: number; formula?: string; cached?: WorkbookScalar | null }
type Sheet = { name: string; rows: Array<{ number: number; height?: number; cells: Cell[] }>; maxColumn: number; widths: number[]; merges?: string[]; freezeRow?: number }

const encoder = new TextEncoder()
const xml = (value: unknown) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
const columnName = (index: number) => {
  let value = index
  let label = ''
  while (value > 0) {
    const remainder = (value - 1) % 26
    label = String.fromCharCode(65 + remainder) + label
    value = Math.floor((value - 1) / 26)
  }
  return label
}

function cellXml(row: number, cell: Cell): string {
  const reference = `${columnName(cell.column)}${row}`
  const style = cell.style === undefined ? '' : ` s="${cell.style}"`
  if (cell.formula) {
    const cached = cell.cached ?? ''
    const type = typeof cached === 'string' ? ' t="str"' : typeof cached === 'boolean' ? ' t="b"' : ''
    const value = typeof cached === 'boolean' ? (cached ? 1 : 0) : cached
    return `<c r="${reference}"${style}${type}><f>${xml(cell.formula.replace(/^=/, ''))}</f><v>${xml(value)}</v></c>`
  }
  if (cell.value === null) return `<c r="${reference}"${style}/>`
  if (typeof cell.value === 'number') return `<c r="${reference}"${style}><v>${cell.value}</v></c>`
  if (typeof cell.value === 'boolean') return `<c r="${reference}"${style} t="b"><v>${cell.value ? 1 : 0}</v></c>`
  return `<c r="${reference}"${style} t="inlineStr"><is><t xml:space="preserve">${xml(cell.value)}</t></is></c>`
}

function sheetXml(sheet: Sheet): string {
  const lastRow = Math.max(...sheet.rows.map((row) => row.number), 1)
  const views = sheet.freezeRow
    ? `<sheetViews><sheetView showGridLines="0" workbookViewId="0"><pane ySplit="${sheet.freezeRow}" topLeftCell="A${sheet.freezeRow + 1}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A${sheet.freezeRow + 1}" sqref="A${sheet.freezeRow + 1}"/></sheetView></sheetViews>`
    : '<sheetViews><sheetView showGridLines="0" workbookViewId="0"/></sheetViews>'
  const cols = sheet.widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join('')
  const rows = sheet.rows.map((row) => `<row r="${row.number}"${row.height ? ` ht="${row.height}" customHeight="1"` : ''}>${row.cells.map((cell) => cellXml(row.number, cell)).join('')}</row>`).join('')
  const merges = sheet.merges?.length ? `<mergeCells count="${sheet.merges.length}">${sheet.merges.map((range) => `<mergeCell ref="${range}"/>`).join('')}</mergeCells>` : ''
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:${columnName(sheet.maxColumn)}${lastRow}"/>${views}<sheetFormatPr defaultRowHeight="18"/><cols>${cols}</cols><sheetData>${rows}</sheetData>${merges}<pageMargins left="0.35" right="0.35" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>`
}

const textCell = (column: number, value: string, style = 0): Cell => ({ column, value, style })
const valueCell = (column: number, value: WorkbookScalar, style = 9): Cell => ({ column, value, style })
const formulaCell = (column: number, formula: string, cached: WorkbookScalar, style = 6): Cell => ({ column, value: null, formula, cached, style })

function summarySheet(model: ExerciseWorkbookModel): Sheet {
  const rows: Sheet['rows'] = [
    { number: 1, height: 28, cells: [textCell(1, 'ANDELOGIC ZAPATAS · MEMORIA EXCEL AUDITABLE', 1)] },
    { number: 3, cells: [textCell(1, 'Proyecto', 3), textCell(2, model.project.name, 8), textCell(5, 'Estado del libro', 3), formulaCell(6, '=IF(\'Control\'!$B$10="Sin cambios","ORIGINAL EXPORTADO","MODIFICADO")', 'ORIGINAL EXPORTADO', 11)] },
    { number: 4, cells: [textCell(1, 'Tipología', 3), textCell(2, model.footingTypeLabel, 8), textCell(5, 'Perfil', 3), textCell(6, model.profile.label, 8)] },
    { number: 5, cells: [textCell(1, 'ID de proyecto', 3), textCell(2, model.project.projectId, 8), textCell(5, 'Estado técnico', 3), textCell(6, model.profile.releaseStatus, 7)] },
    { number: 6, cells: [textCell(1, 'Generado', 3), textCell(2, model.generatedAt, 8), textCell(5, 'Versión de motor', 3), textCell(6, model.project.engineVersion, 8)] },
    { number: 8, height: 24, cells: [textCell(1, 'Cómo usar este libro', 2)] },
    { number: 9, height: 36, cells: [textCell(1, 'Edite únicamente la columna azul de Entradas. Excel recalcula la cadena visible; el valor original de AndeLogic permanece al lado para auditar diferencias.', 8)] },
    { number: 11, height: 24, cells: [textCell(1, 'Advertencia de liberación', 2)] },
    { number: 12, height: 42, cells: [textCell(1, model.profile.releaseBlocker, 7)] },
    { number: 14, height: 24, cells: [textCell(1, 'Límites del ejercicio', 2)] },
  ]
  model.limitations.forEach((limit, index) => rows.push({ number: 15 + index, height: 30, cells: [textCell(1, `• ${limit}`, 8)] }))
  return { name: 'Resumen', rows, maxColumn: 8, widths: [23, 28, 3, 3, 21, 36, 3, 3], merges: ['A1:H1', 'B3:D3', 'F3:H3', 'B4:D4', 'F4:H4', 'B5:D5', 'F5:H5', 'B6:D6', 'F6:H6', 'A8:H8', 'A9:H10', 'A11:H11', 'A12:H13', 'A14:H14', ...model.limitations.map((_limit, index) => `A${15 + index}:H${15 + index}`)] }
}

function inputsSheet(model: ExerciseWorkbookModel): Sheet {
  const rows: Sheet['rows'] = [
    { number: 1, height: 28, cells: [textCell(1, 'ENTRADAS · ORIGINAL Y ESCENARIO EDITABLE', 1)] },
    { number: 3, height: 34, cells: [textCell(1, 'Las fórmulas leen la columna D. Los identificadores y etiquetas no deben cambiarse; los valores originales permanecen en C.', 8)] },
    { number: 5, height: 24, cells: ['ID', 'Dato', 'Original AndeLogic', 'Editable / escenario', 'Unidad', 'Control'].map((value, index) => textCell(index + 1, value, 3)) },
  ]
  model.inputRows.forEach((input, index) => {
    const row = INPUT_FIRST_ROW + index
    rows.push({ number: row, cells: [
      textCell(1, input.id, 8),
      textCell(2, input.label, 8),
      valueCell(3, input.originalValue, 4),
      valueCell(4, input.originalValue, input.editable ? 5 : 4),
      textCell(5, input.unit, 8),
      formulaCell(6, `=IF(C${row}=D${row},"Original","Modificada")`, 'Original', 11),
    ] })
  })
  return { name: 'Entradas', rows, maxColumn: 6, widths: [34, 42, 18, 20, 12, 15], merges: ['A1:F1', 'A3:F3'], freezeRow: 5 }
}

function calculationSheet(model: ExerciseWorkbookModel): Sheet {
  const rows: Sheet['rows'] = [
    { number: 1, height: 28, cells: [textCell(1, 'CÁLCULO COMPLETO · FÓRMULAS Y CONTRASTE', 1)] },
    { number: 3, height: 38, cells: [textCell(1, 'F contiene la fórmula viva. H conserva el resultado original del motor; I muestra la diferencia, J controla consistencia y K conserva la fórmula exportada.', 8)] },
    { number: 5, height: 32, cells: ['Paso', 'Sección', 'Variable', 'Expresión', 'Fórmula visible', 'Resultado recalculado', 'Unidad', 'Original AndeLogic', 'Diferencia', 'Consistencia', 'Fórmula original', 'Nota'].map((value, index) => textCell(index + 1, value, 3)) },
  ]
  model.calculationRows.forEach((calculation, index) => {
    const row = CALCULATION_FIRST_ROW + index
    const isNumeric = typeof calculation.originalValue === 'number'
    rows.push({ number: row, height: calculation.note ? 34 : 22, cells: [
      valueCell(1, index + 1, 9),
      textCell(2, calculation.section, 12),
      textCell(3, calculation.label, 8),
      textCell(4, calculation.expression, 8),
      textCell(5, calculation.formula, 10),
      formulaCell(6, calculation.formula, calculation.originalValue, 6),
      textCell(7, calculation.unit, 8),
      valueCell(8, calculation.originalValue, 4),
      isNumeric ? formulaCell(9, `=F${row}-H${row}`, 0, 9) : formulaCell(9, '=""', '', 9),
      formulaCell(10, `=IF(ABS(I${row})<=0.000000001,"Coincide","REVISAR")`, 'Coincide', 11),
      textCell(11, calculation.formula, 10),
      textCell(12, calculation.note, calculation.note ? 7 : 8),
    ] })
  })
  return { name: 'Cálculo completo', rows, maxColumn: 12, widths: [8, 16, 32, 34, 44, 20, 12, 18, 15, 15, 44, 38], merges: ['A1:L1', 'A3:L3'], freezeRow: 5 }
}

function checksSheet(model: ExerciseWorkbookModel): Sheet {
  const rows: Sheet['rows'] = [
    { number: 1, height: 28, cells: [textCell(1, 'COMPROBACIONES DEL ESCENARIO', 1)] },
    { number: 3, height: 34, cells: [textCell(1, 'Los estados reaccionan a las entradas editables. “Dentro de referencia” o “dentro de capacidad” no equivale a aprobación normativa.', 8)] },
    { number: 5, height: 24, cells: ['ID', 'Comprobación', 'Estado recalculado', 'Estado original', 'Detalle'].map((value, index) => textCell(index + 1, value, 3)) },
  ]
  model.checkRows.forEach((check, index) => rows.push({ number: 6 + index, height: 34, cells: [textCell(1, check.id, 8), textCell(2, check.label, 8), formulaCell(3, check.formula, check.originalValue, 11), textCell(4, check.originalValue, 4), textCell(5, check.detail, 8)] }))
  const scopeRow = 7 + model.checkRows.length
  rows.push({ number: scopeRow, height: 24, cells: [textCell(1, 'Módulos no evaluados / límites', 2)] })
  model.limitations.forEach((limit, index) => rows.push({ number: scopeRow + 1 + index, height: 30, cells: [textCell(1, `• ${limit}`, 8)] }))
  return { name: 'Comprobaciones', rows, maxColumn: 5, widths: [22, 34, 24, 22, 74], merges: ['A1:E1', 'A3:E3', `A${scopeRow}:E${scopeRow}`, ...model.limitations.map((_limit, index) => `A${scopeRow + 1 + index}:E${scopeRow + 1 + index}`)], freezeRow: 5 }
}

function traceabilitySheet(model: ExerciseWorkbookModel): Sheet {
  const rows: Sheet['rows'] = [
    { number: 1, height: 28, cells: [textCell(1, 'TRAZABILIDAD TÉCNICA Y NORMATIVA', 1)] },
    { number: 3, height: 38, cells: [textCell(1, 'Las fuentes se identifican por módulo y aplicabilidad. No se reproduce texto protegido ni se amplía el alcance documentado.', 8)] },
    { number: 5, height: 28, cells: ['Módulo', 'Base', 'Fuente', 'Edición / versión', 'Referencia', 'Aplicabilidad', 'URL pública'].map((value, index) => textCell(index + 1, value, 3)) },
  ]
  model.traceabilityRows.forEach((item, index) => rows.push({ number: 6 + index, height: 58, cells: [textCell(1, item.module, 8), textCell(2, item.basis, 8), textCell(3, item.source, 8), textCell(4, item.version, 8), textCell(5, item.reference, 8), textCell(6, item.applicability, 8), textCell(7, item.url, 10)] }))
  return { name: 'Trazabilidad', rows, maxColumn: 7, widths: [28, 28, 38, 20, 48, 56, 58], merges: ['A1:G1', 'A3:G3'], freezeRow: 5 }
}

function controlSheet(model: ExerciseWorkbookModel): Sheet {
  const inputLast = INPUT_FIRST_ROW + model.inputRows.length - 1
  const calculationLast = CALCULATION_FIRST_ROW + model.calculationRows.length - 1
  const rows: Sheet['rows'] = [
    { number: 1, height: 28, cells: [textCell(1, 'CONTROL DE CAMBIOS Y USO RESPONSABLE', 1)] },
    { number: 3, height: 40, cells: [textCell(1, 'Este control detecta cambios dentro del libro. No firma el archivo ni convierte sus modificaciones en un nuevo proyecto AndeLogic.', 8)] },
    { number: 5, cells: [textCell(1, 'Indicador', 3), textCell(2, 'Valor', 3), textCell(3, 'Interpretación', 3)] },
    { number: 6, cells: [textCell(1, 'Entradas modificadas', 8), formulaCell(2, `=COUNTIF('Entradas'!$F$${INPUT_FIRST_ROW}:$F$${inputLast},"Modificada")`, 0, 9), textCell(3, 'Diferencias entre la columna original y la columna editable.', 8)] },
    { number: 7, cells: [textCell(1, 'Cálculos por revisar', 8), formulaCell(2, `=COUNTIF('Cálculo completo'!$J$${CALCULATION_FIRST_ROW}:$J$${calculationLast},"REVISAR")`, 0, 9), textCell(3, 'Resultados que ya no coinciden con el valor original. K permite comparar manualmente la fórmula.', 8)] },
    { number: 8, cells: [textCell(1, 'Resultados con diferencia', 8), formulaCell(2, `=COUNTIF('Cálculo completo'!$I$${CALCULATION_FIRST_ROW}:$I$${calculationLast},"<>0")`, 0, 9), textCell(3, 'Resultados recalculados distintos del valor original AndeLogic.', 8)] },
    { number: 10, height: 28, cells: [textCell(1, 'Estado general', 3), formulaCell(2, '=IF(SUM(B6:B8)=0,"Sin cambios","Libro modificado")', 'Sin cambios', 11), textCell(3, 'Si hay cambios, repítalos en AndeLogic y vuelva a analizar antes de adoptarlos.', 7)] },
    { number: 12, cells: [textCell(1, 'Código de color', 2)] },
    { number: 13, cells: [textCell(1, 'Azul', 5), textCell(2, 'Entrada editable', 8)] },
    { number: 14, cells: [textCell(1, 'Verde', 6), textCell(2, 'Resultado con fórmula', 8)] },
    { number: 15, cells: [textCell(1, 'Gris', 4), textCell(2, 'Valor original AndeLogic', 8)] },
    { number: 16, cells: [textCell(1, 'Amarillo', 7), textCell(2, 'Advertencia, límite o referencia en validación', 8)] },
  ]
  return { name: 'Control', rows, maxColumn: 5, widths: [28, 22, 72, 4, 4], merges: ['A1:E1', 'A3:E3', 'A12:E12'], freezeRow: 5 }
}

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="4"><font><sz val="10"/><color rgb="FF172033"/><name val="Aptos"/></font><font><b/><sz val="18"/><color rgb="FFFFFFFF"/><name val="Aptos Display"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font><font><sz val="9"/><color rgb="FF334155"/><name val="Aptos Mono"/></font></fonts><fills count="8"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF17365D"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDCE6F1"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE2F0D9"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF2F2F2"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFCE8E6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD7DEE8"/></left><right style="thin"><color rgb="FFD7DEE8"/></right><top style="thin"><color rgb="FFD7DEE8"/></top><bottom style="thin"><color rgb="FFD7DEE8"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="13"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf><xf numFmtId="4" fontId="0" fillId="6" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/><xf numFmtId="4" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/><xf numFmtId="4" fontId="0" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf><xf numFmtId="4" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1" applyBorder="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`

function workbookXml(sheets: Sheet[]): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>${sheets.map((sheet, index) => `<sheet name="${xml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join('')}</sheets><calcPr calcMode="auto" fullCalcOnLoad="1" forceFullCalc="1" calcId="191029"/></workbook>`
}

function workbookRelationships(sheets: Sheet[]): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_sheet, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`
}

function contentTypes(sheets: Sheet[]): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_sheet, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`
}

const rootRelationships = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`

const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let index = 0; index < 256; index++) {
    let value = index
    for (let bit = 0; bit < 8; bit++) value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    table[index] = value >>> 0
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function littleEndian(values: Array<[number, number]>): Uint8Array {
  const length = values.reduce((total, [, bytes]) => total + bytes, 0)
  const output = new Uint8Array(length)
  const view = new DataView(output.buffer)
  let offset = 0
  for (const [value, bytes] of values) {
    if (bytes === 2) view.setUint16(offset, value, true)
    else view.setUint32(offset, value >>> 0, true)
    offset += bytes
  }
  return output
}

function concat(parts: Uint8Array[]): Uint8Array {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0))
  let offset = 0
  for (const part of parts) { output.set(part, offset); offset += part.length }
  return output
}

function zip(entries: Array<{ name: string; content: string }>, generatedAt: string): Uint8Array {
  const date = new Date(generatedAt)
  const year = Math.max(1980, date.getUTCFullYear())
  const dosDate = ((year - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate()
  const dosTime = (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | Math.floor(date.getUTCSeconds() / 2)
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0
  for (const entry of entries) {
    const name = encoder.encode(entry.name)
    const data = encoder.encode(entry.content)
    const crc = crc32(data)
    const localHeader = littleEndian([[0x04034b50, 4], [20, 2], [0x0800, 2], [0, 2], [dosTime, 2], [dosDate, 2], [crc, 4], [data.length, 4], [data.length, 4], [name.length, 2], [0, 2]])
    localParts.push(localHeader, name, data)
    const centralHeader = littleEndian([[0x02014b50, 4], [20, 2], [20, 2], [0x0800, 2], [0, 2], [dosTime, 2], [dosDate, 2], [crc, 4], [data.length, 4], [data.length, 4], [name.length, 2], [0, 2], [0, 2], [0, 2], [0, 2], [0, 4], [offset, 4]])
    centralParts.push(centralHeader, name)
    offset += localHeader.length + name.length + data.length
  }
  const local = concat(localParts)
  const central = concat(centralParts)
  const end = littleEndian([[0x06054b50, 4], [0, 2], [0, 2], [entries.length, 2], [entries.length, 2], [central.length, 4], [local.length, 4], [0, 2]])
  return concat([local, central, end])
}

export function createWorkbookPackage(model: ExerciseWorkbookModel): Uint8Array {
  const sheets = [summarySheet(model), inputsSheet(model), calculationSheet(model), checksSheet(model), traceabilitySheet(model), controlSheet(model)]
  const entries = [
    { name: '[Content_Types].xml', content: contentTypes(sheets) },
    { name: '_rels/.rels', content: rootRelationships },
    { name: 'docProps/core.xml', content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(model.project.name)} · cálculo AndeLogic</dc:title><dc:creator>AndeLogic Engineering</dc:creator><dc:description>Memoria Excel editable con fórmulas, resultados originales y trazabilidad.</dc:description><dcterms:created xsi:type="dcterms:W3CDTF">${xml(model.generatedAt)}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${xml(model.generatedAt)}</dcterms:modified></cp:coreProperties>` },
    { name: 'docProps/app.xml', content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>AndeLogic Zapatas</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>${sheets.length}</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="${sheets.length}" baseType="lpstr">${sheets.map((sheet) => `<vt:lpstr>${xml(sheet.name)}</vt:lpstr>`).join('')}</vt:vector></TitlesOfParts></Properties>` },
    { name: 'xl/workbook.xml', content: workbookXml(sheets) },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRelationships(sheets) },
    { name: 'xl/styles.xml', content: stylesXml },
    ...sheets.map((sheet, index) => ({ name: `xl/worksheets/sheet${index + 1}.xml`, content: sheetXml(sheet) })),
  ]
  return zip(entries, model.generatedAt)
}
