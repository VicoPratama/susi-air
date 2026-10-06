import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET, PILOT_ACCOUNT } from '../../../common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    if (payload.username !== PILOT_ACCOUNT.username) {
      throw new UnauthorizedException('Invalid user token');
    }
    return {
      userId: payload.sub,
      username: payload.username,
      name: PILOT_ACCOUNT.name
    };
  }
}
