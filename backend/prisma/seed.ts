import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with institutions, programmes, and test users...');

  // 1. Institution
  const vit = await prisma.institution.upsert({
    where: { aisheCode: 'C-36965' },
    update: {},
    create: {
      aisheCode: 'C-36965',
      name: 'Vellore Institute of Technology',
      state: 'Tamil Nadu',
      district: 'Vellore',
    },
  });

  const dtu = await prisma.institution.upsert({
    where: { aisheCode: 'C-18491' },
    update: {},
    create: {
      aisheCode: 'C-18491',
      name: 'Delhi Technological University',
      state: 'Delhi',
      district: 'New Delhi',
    },
  });

  // 2. Programmes
  await prisma.programme.upsert({
    where: {
      institutionId_code_academicYear: {
        institutionId: vit.id,
        code: 'BTECH-CSE',
        academicYear: '2024-25',
      },
    },
    update: {},
    create: {
      code: 'BTECH-CSE',
      name: 'B.Tech Computer Science and Engineering',
      academicYear: '2024-25',
      approvedIntake: 720,
      institutionId: vit.id,
    },
  });

  // 3. Users
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'nodal@vit.ac.in' },
    update: {},
    create: {
      email: 'nodal@vit.ac.in',
      passwordHash,
      role: Role.COLLEGE_NODAL,
      institutionId: vit.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@state.gov.in' },
    update: {},
    create: {
      email: 'admin@state.gov.in',
      passwordHash,
      role: Role.STATE_ADMIN,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
