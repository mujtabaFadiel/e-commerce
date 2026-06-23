import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/Dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authSerivce: AuthService
    ){}

    @Post('login')
    async login(@Body() dto: LoginDto){
        return await this.authSerivce.login(dto)
    }

    @Post('refresh')
    async refresh(@Body('refresh_token') refreshToken: string) {
        return await this.authSerivce.refresh(refreshToken);
    }
}