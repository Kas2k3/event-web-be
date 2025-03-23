import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'kas2k3',
    });
  }

  async validate(payload: IUser) {
    const user = await this.usersService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { id, name, email, role } = payload;
    return {
      id,
      name,
      email,
      role,
    };
  }
}
