import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, execute } from '@/database/db';
import { User, UserResponse, RegisterRequest, LoginRequest, AuthResponse } from '@/models/User';
import { tokenService } from './tokenService';
import { ConflictError, UnauthorizedError, NotFoundError, ValidationError } from '@/utils/errors';
import {
  validateLoginRequest,
  validateRegisterRequest,
} from '@/utils/validators';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Validate input
    validateRegisterRequest(data.email, data.password, data.fullName, data.username);

    // Check if email already exists
    const existingEmailUser = await queryOne<User>(
      'SELECT id FROM users WHERE email = ?',
      [data.email]
    );

    if (existingEmailUser) {
      throw new ConflictError('Este email já está cadastrado');
    }

    // Check if username already exists
    const existingUsernameUser = await queryOne<User>(
      'SELECT id FROM users WHERE username = ?',
      [data.username]
    );

    if (existingUsernameUser) {
      throw new ConflictError('Este username já está cadastrado');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = uuidv4();
    const now = new Date().toISOString();

    // Create user
    await execute(
      `INSERT INTO users (id, email, username, fullName, password, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, data.email, data.username, data.fullName, hashedPassword, now, now]
    );

    // Get created user
    const user = await queryOne<User>('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      throw new Error('Falha ao criar usuário');
    }

    // Generate tokens
    const token = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = tokenService.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const { password, ...userResponse } = user;

    return {
      token,
      refreshToken,
      user: userResponse as UserResponse,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Validate input
    validateLoginRequest(email, password);

    // Find user
    const user = await queryOne<User>('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    // Generate tokens
    const token = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = tokenService.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userResponse } = user;

    return {
      token,
      refreshToken,
      user: userResponse as UserResponse,
    };
  }

  async getCurrentUser(userId: string): Promise<UserResponse | null> {
    const user = await queryOne<User>('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      return null;
    }

    const { password, ...userResponse } = user;
    return userResponse as UserResponse;
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<UserResponse> {
    const user = await queryOne<User>('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const now = new Date().toISOString();
    const { id, createdAt, ...updateData } = data;

    const updateFields = Object.keys(updateData)
      .filter((key) => updateData[key as keyof typeof updateData] !== undefined)
      .map((key) => `${key} = ?`)
      .join(', ');

    if (updateFields) {
      const values = Object.values(updateData).filter((v) => v !== undefined);
      values.push(now, userId);

      await execute(
        `UPDATE users SET ${updateFields}, updatedAt = ? WHERE id = ?`,
        values
      );
    }

    const updatedUser = await queryOne<User>('SELECT * FROM users WHERE id = ?', [userId]);

    if (!updatedUser) {
      throw new Error('Falha ao atualizar usuário');
    }

    const { password, ...userResponse } = updatedUser;
    return userResponse as UserResponse;
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    const payload = tokenService.verifyRefreshToken(refreshToken);

    const user = await queryOne<User>('SELECT * FROM users WHERE id = ?', [payload.userId]);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const token = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const { password, ...userResponse } = user;

    return {
      token,
      refreshToken,
      user: userResponse as UserResponse,
    };
  }
}

export const authService = new AuthService();