import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { PasswordHelper } from '../utils/helpers/password.helper';
import { RefreshToken } from './entities/refresh-token.entity';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private getConfigNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get(key);
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Config key "${key}" is required but not provided`);
    }
    return parseInt(value, 10);
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await PasswordHelper.compare(password, user.password))) {
      const { password, ...userData } = user;

      const userInfo: IUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      return userInfo;
    }
    return null;
  }

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user);
    await this.storeRefreshToken(user.id, tokens.refresh_token);

    const maxAge =
      this.getConfigNumber('JWT_REFRESH_EXPIRES_IN', 604800) * 1000;

    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: maxAge,
      path: '/api/auth/refresh',
    });

    return {
      access_token: tokens.access_token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async refreshTokens(request: Request, response: Response) {
    const refresh_token = request.cookies['refresh_token'];

    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const storedToken = await this.refreshTokenRepository.findOne({
        where: {
          id: payload.jti,
          userId: payload.id,
          isActive: true,
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const now = new Date();
      if (storedToken.expiresAt < now) {
        throw new UnauthorizedException('Refresh token expired');
      }

      storedToken.isActive = false;
      await this.refreshTokenRepository.save(storedToken);

      const user = await this.usersService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const userInfo: IUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const tokens = await this.getTokens(userInfo);
      await this.storeRefreshToken(userInfo.id, tokens.refresh_token);

      const maxAge =
        this.getConfigNumber('JWT_REFRESH_EXPIRES_IN', 604800) * 1000;

      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: maxAge,
        path: '/api/auth/refresh',
      });

      return {
        access_token: tokens.access_token,
      };
    } catch (error) {
      response.clearCookie('refresh_token', {
        path: '/api/auth/refresh',
      });

      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number, response: Response) {
    await this.refreshTokenRepository.softDelete({ userId, isActive: true });

    response.clearCookie('refresh_token', {
      path: '/api/auth/refresh',
    });

    return { message: 'Logout successful' };
  }

  private async getTokens(user: IUser) {
    const jwtId = crypto.randomUUID();

    const payload = {
      sub: 'token login',
      iss: 'from server',
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        jwtid: jwtId,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async storeRefreshToken(userId: number, refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);

    const token = this.refreshTokenRepository.create({
      id: decoded.jti,
      userId,
      expiresAt,
      isActive: true,
    });

    await this.refreshTokenRepository.save(token);
  }
}
