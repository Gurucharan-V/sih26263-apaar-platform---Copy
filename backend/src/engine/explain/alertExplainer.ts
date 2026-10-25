export function generateAnomalyExplanation(anomalyType: string, meta: Record<string, any>): string {
  switch (anomalyType) {
    case 'DUPLICATE_APAAR':
      return `APAAR ID ${meta.apaarId} was previously ingested by ${meta.existingCollege} for student "${meta.existingName}". Simultaneous enrollment across institutions is restricted.`;
    case 'OVER_INTAKE':
      return `Sanctioned AICTE intake capacity of ${meta.approved} exceeded by ${meta.excess} student admissions in ${meta.programmeName}.`;
    case 'AADHAAR_COLLISION':
      return `Cryptographic Aadhaar token collision found with record STU-${meta.matchedStudentId} registered at ${meta.institution}.`;
    default:
      return 'Algorithmic anomaly flagged during data reconciliation.';
  }
}
