// src/modules/auth/auth.service.ts
import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User, UserRole } from '@prisma/client';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        
        if (!user || !bcrypt.compareSync(pass, user.password)) {
            return null;
        }
        
        // Проверка активности
        if (user.lastActivity) {
            const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
            const isActive = Date.now() - user.lastActivity.getTime() < THIRTY_DAYS;
            if (!isActive) {
            return null;
            }
        }
        
        return user;
    }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId,
      groupId: user.groupId,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        institutionId: user.institutionId,
        groupId: user.groupId,
      }
    };
  }

  async register(data: LoginUserDto & { 
    firstName: string; 
    lastName: string; 
    role: UserRole;
    institutionId: number;
  }) {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    return this.userService.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async refreshToken(user: User) {
    return this.login(user);
  }

  async generateReferralToken(userId: number, institutionId: number) {
    // Проверяем, имеет ли пользователь право создавать реферальные токены
    const user = await this.userService.findById(userId);
    
    const isAuthorized = user && 
        (user.role === UserRole.ADMIN || user.role === UserRole.TEACHER) &&
        user.institutionId === institutionId;

    if (!isAuthorized) {
        throw new ForbiddenException('You do not have permission to generate referral tokens');
    }

    return this.userService.createReferralToken(userId, institutionId);
  }

  async validateReferralToken(token: string, institutionId?: number) {
    return this.userService.validateReferralToken(token, institutionId);
  }

  async useReferralToken(token: string) {
    return this.userService.useReferralToken(token);
  }


    async registerTeacher(data: CreateUserDto & { referralToken: string }) {
        // 1. Валидация реферального токена
        const referralToken = await this.validateReferralToken(data.referralToken);
        
        if (!referralToken) {
            throw new ForbiddenException('Invalid or expired referral token');
        }

        // 2. Проверка, что токен не был использован
        if (referralToken.used) {
            throw new ForbiddenException('Referral token has already been used');
        }

        // 3. Хеширование пароля
        const hashedPassword = bcrypt.hashSync(data.password, 10);

        // 4. Создание пользователя с привязкой к реферальному токену
        const user = await this.prisma.user.create({
            data: {
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            role: UserRole.TEACHER,
            institutionId: referralToken.institutionId,
            referralToken: {
                connect: {
                token: data.referralToken
                }
            }
            }
        });

        // 5. Помечаем токен как использованный
        await this.useReferralToken(data.referralToken);

        return this.login(user);
    }
  
  
}