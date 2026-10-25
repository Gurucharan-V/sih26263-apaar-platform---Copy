import prisma from '../../config/db';

export class InstitutionService {
  static async listAll() {
    return prisma.institution.findMany({
      include: {
        _count: { select: { students: true, programmes: true } },
      },
    });
  }

  static async getById(id: string) {
    return prisma.institution.findUnique({
      where: { id },
      include: { programmes: true },
    });
  }
}
