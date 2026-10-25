import prisma from '../../config/db';
import { uploadQueue } from '../../jobs/queues';

export class UploadService {
  static async processUpload(file: Express.Multer.File, institutionId: string, programmeId: string) {
    const upload = await prisma.upload.create({
      data: {
        institutionId,
        filename: file.originalname,
        s3Key: `uploads/${Date.now()}_${file.originalname}`,
        status: 'QUEUED',
      },
    });

    // Enqueue background processing job
    await uploadQueue.add('process-file', {
      uploadId: upload.id,
      institutionId,
      programmeId,
      fileBuffer: file.buffer.toString('base64'),
      filename: file.originalname,
    });

    return { uploadId: upload.id, status: 'QUEUED' };
  }

  static async getById(uploadId: string) {
    return prisma.upload.findUnique({
      where: { id: uploadId },
      include: { uploadRows: { take: 50 } },
    });
  }

  static async list(institutionId?: string) {
    return prisma.upload.findMany({
      where: institutionId ? { institutionId } : {},
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
