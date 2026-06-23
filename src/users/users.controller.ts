import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './Dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRole } from './Entity/users.entity';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) { }

    @Post('register')
    async createUser(@Body() registerDto: RegisterDto) {
        return await this.userService.createUser(registerDto)
    }

    @Get()
    async findAll() {
        return await this.userService.findAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findUserById(@Param('id') id: number) {
        return await this.userService.findUserById(id)
    }

    @Patch(':id/role')
    updateRole(@Param('id', ParseIntPipe) id: number, @Body('role') role: UserRole) {
        return this.userService.updateRole(id, role);
    }
}
