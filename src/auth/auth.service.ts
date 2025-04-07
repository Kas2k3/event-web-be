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
  ) { }

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

  private parseTimeToMs(timeString: string): number {
    const timeRegex = /^(\d+)(d|h|m|s)$/;
    const match = RegExp(timeRegex).exec(timeString);

    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];

      switch (unit) {
        case 'd':
          return value * 24 * 60 * 60 * 1000;
        case 'h':
          return value * 60 * 60 * 1000;
        case 'm':
          return value * 60 * 1000;
        case 's':
          return value * 1000;
        default:
          return value;
      }
    }

    return parseInt(timeString, 10) * 1000;
  }

  private getRefreshExpirationMs(): number {
    const refreshExpiresIn =
      this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
    if (
      typeof refreshExpiresIn === 'string' &&
      isNaN(Number(refreshExpiresIn))
    ) {
      return this.parseTimeToMs(refreshExpiresIn);
    }

    return parseInt(refreshExpiresIn as string, 10) * 1000;
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
        status: userData.status,
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
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    const maxAge = this.getRefreshExpirationMs();

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: maxAge,
      path: '/api',
    });

    return {
      accessToken: tokens.accessToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async refreshTokens(request: Request, response: Response) {
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
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
        status: user.status,
      };

      const tokens = await this.getTokens(userInfo);
      await this.storeRefreshToken(userInfo.id, tokens.refreshToken);

      const maxAge =
        this.getConfigNumber('JWT_REFRESH_EXPIRES_IN', 604800) * 1000;

      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: maxAge,
        path: '/api',
      });

      return {
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      response.clearCookie('refreshToken', {
        path: '/api',
      });

      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number, response: Response) {
    await this.refreshTokenRepository.softDelete({ userId, isActive: true });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite:
        this.configService.get('NODE_ENV') === 'production' ? 'strict' : 'lax',
      path: '/api',
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

    const [accessToken, refreshToken] = await Promise.all([
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
      accessToken,
      refreshToken,
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