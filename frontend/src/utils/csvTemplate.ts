/**
 * Standard APAAR Student Ingestion CSV Template & Helper Functions
 * Compliant with AICTE / Ministry of Education (MoE) bulk ingestion guidelines.
 */

export interface CsvTemplateColumn {
  field: string;
  header: string;
  required: boolean;
  type: string;
  example: string;
  description: string;
}

export const STANDARD_CSV_COLUMNS: CsvTemplateColumn[] = [
  {
    field: 'name',
    header: 'name',
    required: true,
    type: 'string',
    example: 'Rohan Sundaram',
    description: 'Full legal name matching 10th / 12th official mark sheet and DigiLocker records.'
  },
  {
    field: 'apaarId',
    header: 'apaarId',
    required: true,
    type: '12-digit numeric',
    example: '984210834912',
    description: 'Exact 12-digit APAAR ID (Verhoeff checksum validated, without spaces or hyphens).'
  },
  {
    field: 'dateOfBirth',
    header: 'dateOfBirth',
    required: true,
    type: 'YYYY-MM-DD',
    example: '2004-05-14',
    description: 'Date of birth in standard ISO 8601 format (YYYY-MM-DD).'
  },
  {
    field: 'gender',
    header: 'gender',
    required: true,
    type: 'male | female | other',
    example: 'male',
    description: 'Standard gender representation for national registry compliance.'
  },
  {
    field: 'guardianName',
    header: 'guardianName',
    required: true,
    type: 'string',
    example: 'Sundaram Krishnamurthy',
    description: 'Father / Mother / Legal Guardian name.'
  },
  {
    field: 'email',
    header: 'email',
    required: true,
    type: 'email',
    example: 'rohan.sundaram@institute.ac.in',
    description: 'Institutional or verified personal email address for OTP notifications.'
  },
  {
    field: 'contactPhone',
    header: 'contactPhone',
    required: true,
    type: '10-digit numeric',
    example: '9876543210',
    description: '10-digit Indian mobile phone number.'
  },
  {
    field: 'programmeId',
    header: 'programmeId',
    required: true,
    type: 'string',
    example: 'BTECH-CSE',
    description: 'Approved AICTE / University Programme ID (e.g. BTECH-CSE, BTECH-IT, BTECH-ECE).'
  },
  {
    field: 'enrollmentYear',
    header: 'enrollmentYear',
    required: true,
    type: 'YYYY',
    example: '2024',
    description: 'Admission / Enrollment calendar year.'
  },
  {
    field: 'rollNo',
    header: 'rollNo',
    required: true,
    type: 'string',
    example: 'EEC2024CS001',
    description: 'Unique institutional roll or enrolment registration identifier.'
  },
  {
    field: 'aisheCode',
    header: 'aisheCode',
    required: true,
    type: 'string',
    example: 'C-18491',
    description: 'Official Ministry of Education AISHE institution code of the college.'
  }
];

export const CSV_HEADER_LINE = STANDARD_CSV_COLUMNS.map((c) => c.header).join(',');

/**
 * Generate standard CSV template content for a specific college
 */
export function generateStandardCsvContent(collegeCode: string = 'C-18491', collegeShort: string = 'EEC'): string {
  const rows = [
    CSV_HEADER_LINE,
    `Rohan Sundaram,984210834912,2004-05-14,male,Sundaram Krishnamurthy,rohan.sundaram@${collegeShort.toLowerCase()}.edu.in,9876543210,BTECH-CSE,2024,${collegeShort}2024CS001,${collegeCode}`,
    `Priya Natarajan,984210834913,2004-08-22,female,Natarajan Sankaran,priya.n@${collegeShort.toLowerCase()}.edu.in,9876543211,BTECH-CSE,2024,${collegeShort}2024CS002,${collegeCode}`,
    `Karthik Raja,982044119034,2003-11-10,male,Raja Murugan,karthik.r@${collegeShort.toLowerCase()}.edu.in,9876543212,BTECH-IT,2024,${collegeShort}2024IT001,${collegeCode}`,
    `Ananya Deshpande,984122907811,2004-02-18,female,Girish Deshpande,ananya.d@${collegeShort.toLowerCase()}.edu.in,9876543213,BTECH-ECE,2024,${collegeShort}2024EC001,${collegeCode}`,
    `Deepak Verma,982345123415,2003-09-05,male,Ashok Verma,deepak.v@${collegeShort.toLowerCase()}.edu.in,9876543214,BTECH-MECH,2024,${collegeShort}2024ME001,${collegeCode}`
  ];

  return rows.join('\n');
}

/**
 * In-browser download trigger for the standard CSV template
 */
export function downloadStandardCsvTemplate(collegeCode: string = 'C-18491', collegeShort: string = 'COLLEGE'): void {
  const content = generateStandardCsvContent(collegeCode, collegeShort);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `standard_apaar_template_${collegeCode.replace(/[^A-Za-z0-9]/g, '_')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
