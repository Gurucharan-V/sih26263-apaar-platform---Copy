import prisma from '../../config/db';

export class ReportService {
  static async getSystemSummary() {
    const [institutions, students, cases, uploads] = await Promise.all([
      prisma.institution.count(),
      prisma.student.count(),
      prisma.case.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.upload.count(),
    ]);

    return {
      totalInstitutions: institutions,
      totalStudentsEnrolled: students,
      pendingCases: cases,
      totalUploadBatches: uploads,
    };
  }
}
