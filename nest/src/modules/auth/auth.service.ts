import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PILOT_ACCOUNT } from '../../common/constants';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Validate hardcoded pilot credentials as per technical test brief
    if (
      username !== PILOT_ACCOUNT.username ||
      password !== PILOT_ACCOUNT.password
    ) {
      throw new UnauthorizedException('Invalid crew username or password');
    }

    const payload = {
      sub: 'pilot_001',
      username: PILOT_ACCOUNT.username,
      name: PILOT_ACCOUNT.name
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
      user: {
        username: PILOT_ACCOUNT.username,
        name: PILOT_ACCOUNT.name
      }
    };
  }
}
