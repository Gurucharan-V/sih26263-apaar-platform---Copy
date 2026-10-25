import { isValidApaarFormat } from './apaarFormat';

export interface ValidationResult {
  isValid: boolean;
  errors: { field: string; message: string }[];
}

export function validateStudentRow(row: Record<string, any>): ValidationResult {
  const errors: { field: string; message: string }[] = [];

  if (!row.name || String(row.name).trim().length < 2) {
    errors.push({ field: 'name', message: 'Student full name is required and must be >= 2 characters' });
  }

  if (!row.apaarId || !isValidApaarFormat(String(row.apaarId).trim())) {
    errors.push({ field: 'apaarId', message: 'APAAR ID must be exactly 12 digits satisfying Verhoeff checksum' });
  }

  if (!row.dateOfBirth || isNaN(Date.parse(row.dateOfBirth))) {
    errors.push({ field: 'dateOfBirth', message: 'Valid date of birth in YYYY-MM-DD or standard format required' });
  }

  if (row.contactPhone && !/^[0-9]{10}$/.test(String(row.contactPhone).replace(/[^0-9]/g, ''))) {
    errors.push({ field: 'contactPhone', message: 'Mobile number must be a 10-digit number' });
  }

  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email))) {
    errors.push({ field: 'email', message: 'Invalid student email syntax' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
