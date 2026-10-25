const HEADER_SYNONYMS: Record<string, string[]> = {
  apaarId: ['apaar_id', 'apaarid', 'apaar_number', 'apaar', 'student_apaar', 'id_number'],
  name: ['student_name', 'full_name', 'name', 'candidate_name'],
  dateOfBirth: ['dob', 'date_of_birth', 'birth_date', 'birthdate'],
  gender: ['gender', 'sex'],
  guardianName: ['guardian_name', 'father_name', 'mother_name', 'guardian', 'parent_name'],
  email: ['email', 'email_address', 'student_email', 'mail'],
  contactPhone: ['phone', 'mobile', 'phone_number', 'contact_number', 'mobile_number'],
  programmeId: ['programme', 'course', 'course_code', 'programme_id', 'branch'],
  enrollmentYear: ['year', 'admission_year', 'enrollment_year', 'batch'],
};

export function mapHeaders(rawHeader: string): string {
  const clean = rawHeader.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  for (const [standardKey, synonyms] of Object.entries(HEADER_SYNONYMS)) {
    if (synonyms.includes(clean) || standardKey.toLowerCase() === clean) {
      return standardKey;
    }
  }
  return clean;
}
