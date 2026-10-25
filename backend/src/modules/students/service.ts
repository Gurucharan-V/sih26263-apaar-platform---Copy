import prisma from '../../config/db';
import { encryptPII, hashApaarId } from '../../utils/crypto';

export class StudentService {
  static async createSingle(data: any, institutionId: string) {
    const apaarHash = hashApaarId(data.apaarId);
    
    // Check duplicate
    const existing = await prisma.student.findUnique({ where: { apaarIdHash: apaarHash } });
    if (existing) {
      const err: any = new Error('Student with this APAAR ID already exists');
      err.status = 409;
      throw err;
    }

    return prisma.student.create({
      data: {
        apaarIdHash: apaarHash,
        encryptedApaarId: encryptPII(data.apaarId),
        encryptedName: encryptPII(data.name),
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        guardianName: data.guardianName,
        programmeId: data.programmeId,
        institutionId: institutionId,
        enrollmentYear: Number(data.enrollmentYear) || new Date().getFullYear(),
      },
    });
  }

  static async list(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const [total, students] = await Promise.all([
      prisma.student.count(),
      prisma.student.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          gender: true,
          dateOfBirth: true,
          enrollmentYear: true,
          institutionId: true,
          programmeId: true,
          createdAt: true,
        },
      }),
    ]);

    return { total, page, limit, students };
  }
}
