import prisma from '../../config/db';
import { hashApaarId, decryptPII } from '../../utils/crypto';

export class VerificationService {
  static async verifyApaar(apaarId: string) {
    const hash = hashApaarId(apaarId);
    const student = await prisma.student.findUnique({
      where: { apaarIdHash: hash },
      include: { institution: true, programme: true },
    });

    if (!student) {
      return { found: false, message: 'APAAR ID not found in registry' };
    }

    return {
      found: true,
      student: {
        id: student.id,
        name: decryptPII(student.encryptedName),
        institution: student.institution.name,
        programme: student.programme.name,
        enrollmentYear: student.enrollmentYear,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
      },
    };
  }
}
