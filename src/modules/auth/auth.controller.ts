// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Res, HttpStatus, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from '@prisma/client';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
    
    const { access_token, ...userData } = await this.authService.login(user);
    
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });
    
    return res.status(HttpStatus.OK).json(userData);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('Authentication');
    return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: any) {
    return this.authService.refreshToken(req.user);
  }

  @Post('referral/generate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    async generateReferralToken(
    @Req() req,
    @Body() body: { institutionId?: number }
    ) {
    // Админ может создать токен для любого учреждения
    // Преподаватель - только для своего
    const institutionId = req.user.role === UserRole.ADMIN 
        ? body.institutionId 
        : req.user.institutionId;
    
    if (!institutionId) {
        throw new BadRequestException('Institution ID is required');
    }
    
    return this.authService.generateReferralToken(
        req.user.id,
        institutionId
    );
    }

    @Post('register/teacher')
    async registerTeacher(
    @Body() data: CreateUserDto & { referralToken: string }
    ) {
        try {
            return this.authService.registerTeacher(data);
        } catch (e) {
            return { message: e.message || e.text || "Unexcepted Error", code: e.status || e.code || 500}
        }
    }
}