export interface IntakeComparison {
  programmeCode: string;
  approvedIntake: number;
  currentEnrolled: number;
  newBatchCount: number;
  projectedTotal: number;
  isOverLimit: boolean;
  excessCount: number;
}

export function evaluateIntakeCapacity(
  approved: number,
  existingCount: number,
  incomingCount: number
): IntakeComparison {
  const projected = existingCount + incomingCount;
  const isOver = projected > approved;
  return {
    programmeCode: '',
    approvedIntake: approved,
    currentEnrolled: existingCount,
    newBatchCount: incomingCount,
    projectedTotal: projected,
    isOverLimit: isOver,
    excessCount: isOver ? projected - approved : 0,
  };
}
