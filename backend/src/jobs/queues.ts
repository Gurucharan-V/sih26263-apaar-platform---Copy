import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const uploadQueue = new Queue('upload-processing', {
  connection: redis,
});

export const intakeQueue = new Queue('intake-recompute', {
  connection: redis,
});
