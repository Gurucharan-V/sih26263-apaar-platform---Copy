import prisma from '../../config/db';

export class IntakeService {
  static async checkDiscrepancies() {
    const programmes = await prisma.programme.findMany({
      include: {
        institution: true,
        _count: { select: { students: true } },
      },
    });

    return programmes
      .map((p) => {
        const enrolled = p._count.students;
        const delta = enrolled - p.approvedIntake;
        return {
          programmeId: p.id,
          programmeName: p.name,
          institution: p.institution.name,
          approvedIntake: p.approvedIntake,
          enrolledCount: enrolled,
          discrepancy: delta,
          isOverIntake: delta > 0,
        };
      })
      .filter((p) => p.isOverIntake);
  }
}
