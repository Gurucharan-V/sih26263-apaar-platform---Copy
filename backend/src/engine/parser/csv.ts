import Papa from 'papaparse';
import { mapHeaders } from './headerMapper';

export interface ParsedStudentRow {
  rowNumber: number;
  data: Record<string, any>;
  errors?: string[];
}

export function parseCSV(csvContent: string): ParsedStudentRow[] {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => mapHeaders(header.trim()),
  });

  return result.data.map((row: any, index: number) => ({
    rowNumber: index + 2, // 1-indexed, +1 for header
    data: row,
  }));
}
