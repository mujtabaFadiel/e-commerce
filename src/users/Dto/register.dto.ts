import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string
    
    @IsString()
    @IsNotEmpty()
    username!: string

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password!: string    

}