import { isValidApaarFormat } from '../engine/validation/apaarFormat';
import { validateStudentRow } from '../engine/validation/rules';

describe('Validation Engine Tests', () => {
  it('validates correct 12-digit APAAR format', () => {
    expect(isValidApaarFormat('982345123490')).toBe(true);
    expect(isValidApaarFormat('1234')).toBe(false);
    expect(isValidApaarFormat('abcdef123456')).toBe(false);
  });

  it('flags missing name or invalid DOB in student record', () => {
    const invalidRow = {
      name: '',
      apaarId: '982345123490',
      dateOfBirth: 'invalid-date',
    };
    const result = validateStudentRow(invalidRow);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
