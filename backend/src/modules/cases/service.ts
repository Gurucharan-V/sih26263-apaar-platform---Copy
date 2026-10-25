import prisma from '../../config/db';

export class CaseService {
  static async list(query: any) {
    return prisma.case.findMany({
      where: query.status ? { status: query.status } : {},
      include: { student: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async resolve(caseId: string, resolution: any, notes: string, user: string) {
    return prisma.case.update({
      where: { id: caseId },
      data: {
        status: resolution === 'approve' ? 'APPROVED' : resolution === 'reject' ? 'REJECTED' : 'MERGED',
        resolutionNotes: notes,
        resolvedBy: user,
      },
    });
  }
}
