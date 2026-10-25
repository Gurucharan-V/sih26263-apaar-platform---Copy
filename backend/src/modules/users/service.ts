import prisma from '../../config/db';

export class UserService {
  static async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, institutionId: true, createdAt: true },
    });
  }
}
