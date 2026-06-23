import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './Entity/users.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './Dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ){}

    async createUser (registerDto: RegisterDto){
        const existingEmail = await this.userRepo.findOneBy({
            email: registerDto.email
        })
        
        if (existingEmail) throw new ConflictException('Email already exists');
        
        const hashedPass = await bcrypt.hash(registerDto.password, 10)
        
        const user = await this.userRepo.create({
            email: registerDto.email,
            username: registerDto.username,
            password: hashedPass
        })

        await this.userRepo.save(user)
        const { password, ...result } = user
        return result
    }

    async findAll() {
        const users = await this.userRepo.find()
        return users.map((user) => {
            const { password, ...rest } = user
            return rest
        })
    }
    async findUserById(userId: number) {
        const user = await this.userRepo.findOneBy({ id: userId })
        if(!user) throw new ConflictException('No user with the given id ' + userId);
        const { password, ...rest } = user
        return rest
    }

    async findUserByEmail(email: string) {
        const user = await this.userRepo.findOne({ where: {email} })
        return user
    }

    async updateRole(id: number, role: UserRole) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    user.role = role;
    return this.userRepo.save(user);
}
}
