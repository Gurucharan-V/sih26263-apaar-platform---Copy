import { logger } from '../utils/logger';

export interface INotifier {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendSMS(phone: string, message: string): Promise<void>;
}

export class NotificationAdapter implements INotifier {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    logger.info(`[Email Adapter] Sending to ${to}: ${subject}`);
  }

  async sendSMS(phone: string, message: string): Promise<void> {
    logger.info(`[SMS Adapter] Sending to ${phone}: ${message}`);
  }
}
