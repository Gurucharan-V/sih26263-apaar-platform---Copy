import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import prisma from '../config/db';
import { parseCSV } from '../engine/parser/csv';
import { parseExcel } from '../engine/parser/excel';
import { validateStudentRow } from '../engine/validation/rules';
import { findExactApaarDuplicate } from '../engine/duplicates/exactMatch';
import { encryptPII, hashApaarId } from '../utils/crypto';
import { logger } from '../utils/logger';

export const uploadWorker = new Worker(
  'upload-processing',
  async (job: Job) => {
    const { uploadId, institutionId, programmeId, fileBuffer, filename } = job.data;
    logger.info(`Starting ingestion worker for batch: ${uploadId} (${filename})`);

    const buffer = Buffer.from(fileBuffer, 'base64');
    const isExcel = filename.endsWith('.xlsx') || filename.endsWith('.xls');
    const rows = isExcel ? parseExcel(buffer) : parseCSV(buffer.toString('utf-8'));

    await prisma.upload.update({
      where: { id: uploadId },
      data: { status: 'PROCESSING', totalRows: rows.length },
    });

    let validCount = 0;
    let errorCount = 0;

    for (const r of rows) {
      const validation = validateStudentRow(r.data);
      if (!validation.isValid) {
        errorCount++;
        await prisma.uploadRow.create({
          data: {
            uploadId,
            rowNumber: r.rowNumber,
            rawPayload: r.data,
            isValid: false,
            errorMsg: validation.errors.map((e) => e.message).join('; '),
            fieldViolated: validation.errors[0]?.field,
          },
        });
        continue;
      }

      // Check duplicate
      const duplicate = await findExactApaarDuplicate(r.data.apaarId);
      if (duplicate) {
        errorCount++;
        await prisma.uploadRow.create({
          data: {
            uploadId,
            rowNumber: r.rowNumber,
            rawPayload: r.data,
            isValid: false,
            errorMsg: `APAAR ID already assigned to ${duplicate.institution.name}`,
            fieldViolated: 'apaarId',
          },
        });

        // Create Case for admin review
        await prisma.case.create({
          data: {
            studentId: duplicate.id,
            anomalyType: 'DUPLICATE_APAAR',
            severity: 'HIGH',
            confidence: 1.0,
            description: `APAAR duplicate collision with ${duplicate.institution.name}`,
          },
        });
        continue;
      }

      // Ingest valid student
      validCount++;
      await prisma.student.create({
        data: {
          apaarIdHash: hashApaarId(r.data.apaarId),
          encryptedApaarId: encryptPII(r.data.apaarId),
          encryptedName: encryptPII(r.data.name),
          dateOfBirth: new Date(r.data.dateOfBirth),
          gender: r.data.gender || 'other',
          guardianName: r.data.guardianName,
          programmeId: programmeId || r.data.programmeId,
          institutionId,
          enrollmentYear: Number(r.data.enrollmentYear) || 2024,
        },
      });
    }

    await prisma.upload.update({
      where: { id: uploadId },
      data: {
        status: 'COMPLETED',
        validRows: validCount,
        errorRows: errorCount,
      },
    });

    logger.info(`Batch ${uploadId} finished: ${validCount} valid, ${errorCount} errors.`);
  },
  { connection: redis }
);
