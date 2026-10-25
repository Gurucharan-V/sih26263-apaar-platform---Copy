import prisma from '../../config/db';

export class ProgrammeService {
  static async list(institutionId?: string) {
    return prisma.programme.findMany({
      where: institutionId ? { institutionId } : {},
      include: { _count: { select: { students: true } } },
    });
  }
}
