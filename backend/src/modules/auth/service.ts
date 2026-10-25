import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db';
import { env } from '../../config/env';

export class AuthService {
  static async login(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const err: any = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      const err: any = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const payload = { id: user.id, email: user.email, role: user.role, institutionId: user.institutionId };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

    return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) throw new Error('User not found');

      const payload = { id: user.id, email: user.email, role: user.role, institutionId: user.institutionId };
      const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
      return { accessToken };
    } catch (err) {
      const error: any = new Error('Invalid refresh token');
      error.status = 401;
      throw error;
    }
  }
}
