import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PasswordHelper } from '../utils/helpers/password.helper';
import { RefreshToken } from './entities/refresh-token.entity';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await PasswordHelper.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refresh_token);

    return {
      ...tokens,
      user,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const storedToken = await this.refreshTokenRepository.findOne({
        where: {
          id: payload.jti,
          userId: payload.sub,
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

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.storeRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // async logout(userId: number) {
  //     await this.refreshTokenRepository.update(
  //         { userId, isActive: true },
  //         { isActive: false }
  //     );

  //     return { message: 'Logout successful' };
  // }

  async logout(userId: number) {
    await this.refreshTokenRepository.softDelete({ userId, isActive: true });

    return { message: 'Logout successful' };
  }

  private async getTokens(userId: number, email: string) {
    const jwtId = crypto.randomUUID();

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
          jwtid: jwtId,
        },
      ),
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
