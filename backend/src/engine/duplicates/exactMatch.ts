import prisma from '../../config/db';
import { hashApaarId } from '../../utils/crypto';

export async function findExactApaarDuplicate(apaarId: string) {
  const hash = hashApaarId(apaarId);
  return prisma.student.findUnique({
    where: { apaarIdHash: hash },
    include: { institution: true, programme: true },
  });
}
