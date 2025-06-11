// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ 
      where: { id },
      include: {
        group: true,
        institution: true,
      }
    });
  }

  async promoteToLeader(newLeaderEmail: string, oldLeaderEmail?: string) {
    // Если указан старый староста - понижаем его
    if (oldLeaderEmail) {
        await this.prisma.user.updateMany({
        where: { 
            email: oldLeaderEmail,
            role: UserRole.GROUP_LEADER 
        },
        data: { role: UserRole.STUDENT },
        });
    }
    
    // Назначаем нового старосту
    return this.prisma.user.update({
        where: { email: newLeaderEmail },
        data: { role: UserRole.GROUP_LEADER },
    });
    }

    async getUserGroupByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
        where: { email },
        include: { group: true },
    });
    
    return user?.group;
    }

    async updateLastActivity(userId: number): Promise<User> {
    return this.prisma.user.update({
        where: { id: userId },
        data: { lastActivity: new Date() },
    });
    }

    async checkUserActivity(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { lastActivity: true },
    });
    
    if (!user || !user.lastActivity) return false;
    
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    return Date.now() - user.lastActivity.getTime() < THIRTY_DAYS;
    }
    async createReferralToken(createdById: number, institutionId: number) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней
    
    return this.prisma.referralToken.create({
        data: {
        token,
        createdById,
        institutionId,
        expiresAt,
        },
    });
    }

    async validateReferralToken(token: string, institutionId?: number) {
    const referralToken = await this.prisma.referralToken.findUnique({
        where: { token },
        include: { createdBy: true },
    });
    
    if (!referralToken || 
        referralToken.used || 
        referralToken.expiresAt < new Date() ||
        (institutionId && referralToken.institutionId !== institutionId)) {
        return null;
    }
    
    return referralToken;
    }

    public async useReferralToken(token: string) {
    return this.prisma.referralToken.update({
        where: { token },
        data: { used: true },
    });
    }

    


}