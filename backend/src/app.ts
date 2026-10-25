import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimit';

// Module route imports
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import institutionRoutes from './modules/institutions/routes';
import programmeRoutes from './modules/programmes/routes';
import studentRoutes from './modules/students/routes';
import uploadRoutes from './modules/uploads/routes';
import caseRoutes from './modules/cases/routes';
import intakeRoutes from './modules/intake/routes';
import verificationRoutes from './modules/verification/routes';
import reportRoutes from './modules/reports/routes';
import notificationRoutes from './modules/notifications/routes';
import auditRoutes from './modules/audit/routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/institutions', institutionRoutes);
app.use('/api/v1/programmes', programmeRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/cases', caseRoutes);
app.use('/api/v1/intake', intakeRoutes);
app.use('/api/v1/verification', verificationRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/audit-logs', auditRoutes);

app.use(errorHandler);

export default app;
