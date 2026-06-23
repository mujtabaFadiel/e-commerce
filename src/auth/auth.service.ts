import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/users/Dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersSerivce: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.usersSerivce.findUserByEmail(loginDto.email)
        if (!user) throw new ConflictException('This Email Not Found');

        const isMatch = await bcrypt.compare(loginDto.password, user.password)
        if (!isMatch) throw new UnauthorizedException("Wrong Password");

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }

        const access_token = await this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'), 
            expiresIn: '1h'
        });

        const refresh_token = await this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'), 
            expiresIn: '7d'
        });

        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            }}
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const newPayload = { 
                sub: payload.sub, 
                email: payload.email, 
                role: payload.role 
            };

            const access_token = await this.jwtService.sign(newPayload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h',
            });

            return { access_token };
        } catch (error) {
            throw new UnauthorizedException('Invalid or Expired Refresh Token');
        }
    }
}
