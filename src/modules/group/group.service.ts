// src/modules/group/group.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async createGroup(name: string, classNumber: number, institutionId: number, userId: number) {
    // Проверка что пользователь имеет право создавать группу в этом учреждении
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, institutionId: true },
    });

    if (user.role !== 'ADMIN' && user.institutionId !== institutionId) {
      throw new ForbiddenException('You can only create groups in your institution');
    }

    return this.prisma.group.create({
      data: {
        name,
        class: classNumber,
        institutionId,
      },
    });
  }

  async getGroups(institutionId?: number) {
    return this.prisma.group.findMany({
      where: institutionId ? { institutionId } : undefined,
      include: {
        institution: true,
        students: true,
      },
    });
  }
}