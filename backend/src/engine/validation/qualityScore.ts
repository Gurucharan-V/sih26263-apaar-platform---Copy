export interface QualityMetrics {
  totalRows: number;
  validRows: number;
  errorRows: number;
  completenessScore: number; // 0 - 100
  accuracyScore: number;     // 0 - 100
  overallScore: number;      // 0 - 100
}

export function calculateQualityScore(total: number, valid: number, fieldErrors: number): QualityMetrics {
  if (total === 0) {
    return { totalRows: 0, validRows: 0, errorRows: 0, completenessScore: 100, accuracyScore: 100, overallScore: 100 };
  }

  const accuracy = Math.round((valid / total) * 100);
  const completeness = Math.max(0, Math.round(100 - (fieldErrors / (total * 5)) * 100));
  const overall = Math.round((accuracy * 0.7) + (completeness * 0.3));

  return {
    totalRows: total,
    validRows: valid,
    errorRows: total - valid,
    completenessScore: completeness,
    accuracyScore: accuracy,
    overallScore: overall,
  };
}
