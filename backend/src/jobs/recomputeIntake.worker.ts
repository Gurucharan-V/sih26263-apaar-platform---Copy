import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import prisma from '../config/db';
import { logger } from '../utils/logger';

export const intakeWorker = new Worker(
  'intake-recompute',
  async (job: Job) => {
    logger.info('Recomputing national intake balances across all programmes...');
    const programmes = await prisma.programme.findMany({
      include: { _count: { select: { students: true } } },
    });

    for (const prog of programmes) {
      if (prog._count.students > prog.approvedIntake) {
        logger.warn(`Intake breach flagged: Programme ${prog.id} exceeds capacity (${prog._count.students}/${prog.approvedIntake})`);
      }
    }
  },
  { connection: redis }
);
