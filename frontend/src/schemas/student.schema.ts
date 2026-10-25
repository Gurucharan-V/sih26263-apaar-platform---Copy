import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  apaarId: z.string().regex(/^[0-9]{12}$/, 'APAAR ID must be exactly 12 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  guardianName: z.string().optional(),
  contactPhone: z.string().regex(/^[0-9]{10}$/, 'Must be a 10-digit mobile number').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  programmeId: z.string().min(1, 'Programme is required'),
  enrollmentYear: z.coerce.number().min(2000).max(2100),
});

export type StudentInput = z.infer<typeof studentSchema>;
