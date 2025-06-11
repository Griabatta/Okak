// src/modules/user/dto/register-teacher.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RegisterTeacherDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNumber()
  institutionId: number;
}