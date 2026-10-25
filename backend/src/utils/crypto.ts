import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = crypto.createHash('sha256').update(process.env.JWT_SECRET || 'fallback_secret_32_bytes_length!!').digest();

export function encryptPII(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptPII(cipherText: string): string {
  const [ivHex, authTagHex, encrypted] = cipherText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function hashApaarId(apaarId: string): string {
  return crypto.createHmac('sha256', SECRET_KEY).update(apaarId).digest('hex');
}
