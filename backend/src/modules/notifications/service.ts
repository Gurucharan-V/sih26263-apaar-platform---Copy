import { logger } from '../../utils/logger';

export class NotificationService {
  static async dispatchAlert(institutionId: string, message: string, type: 'EMAIL' | 'SMS' | 'IN_APP') {
    logger.info(`[Notification] Dispatching ${type} to institution ${institutionId}: ${message}`);
    return { success: true, timestamp: new Date().toISOString() };
  }
}
