import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userSerivce: UsersService,
    private configService: ConfigService 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret123'
    });
  }

  async validate(payload: { sub: number, email: string, role: string }) {
      const user = await this.userSerivce.findUserById(payload.sub)
      if (!user) throw new UnauthorizedException()
      return user
  }
}