import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@/utils/errors';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class TokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret'
      ) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Token de refresh inválido ou expirado');
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}

export const tokenService = new TokenService();