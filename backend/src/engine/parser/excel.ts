import * as XLSX from 'xlsx';
import { mapHeaders } from './headerMapper';
import { ParsedStudentRow } from './csv';

export function parseExcel(buffer: Buffer): ParsedStudentRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  
  return rawRows.map((row, index) => {
    const normalizedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      normalizedData[mapHeaders(key.trim())] = typeof value === 'string' ? value.trim() : String(value);
    }
    return {
      rowNumber: index + 2,
      data: normalizedData,
    };
  });
}
