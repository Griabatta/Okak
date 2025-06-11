// src/modules/schedule/schedule.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Parity, User, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(data: {
    subject: string;
    teacher: string;
    classroom: string;
    startTime: Date;
    endTime: Date;
    dayOfWeek: number;
    orderNumber: number;
    parity: Parity;
    groupIds: number[];
    institutionId: number;
    userId: number;
  }) {
    // Проверка прав пользователя
    const user: any = await this.prisma.user.findUnique({
      where: { id: data.userId },
      select: { role: true, institutionId: true },
    });

    if (user.role !== 'ADMIN' && user.institutionId !== data.institutionId) {
      throw new ForbiddenException('You can only create schedules in your institution');
    }

    // Проверка на пересечение с другими уроками
    await this.checkScheduleConflicts(data);

    return this.prisma.schedule.create({
      data: {
        subject: data.subject,
        teacher: data.teacher,
        classroom: data.classroom,
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek,
        orderNumber: data.orderNumber,
        parity: data.parity,
        institutionId: data.institutionId,
        isCombined: data.groupIds.length > 1,
        groups: {
          create: data.groupIds.map(groupId => ({
            group: { connect: { id: groupId } },
          })),
        },
      },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
  }

  private async checkScheduleConflicts(data: {
    groupIds: number[];
    startTime: Date;
    endTime: Date;
    dayOfWeek: number;
    parity: Parity;
  }) {
    for (const groupId of data.groupIds) {
      const conflicts = await this.prisma.schedule.findMany({
        where: {
          groups: {
            some: { groupId },
          },
          dayOfWeek: data.dayOfWeek,
          parity: { in: [data.parity, 'BOTH'] },
          OR: [
            {
              startTime: { lt: data.endTime },
              endTime: { gt: data.startTime },
            },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new ForbiddenException(
          `Schedule conflict detected for group ${groupId}`,
        );
      }
    }
  }

  async getCombinedLessons(groupId: number) {
    // Находим все объединенные уроки для группы
    return this.prisma.schedule.findMany({
      where: {
        isCombined: true,
        groups: {
          some: { groupId },
        },
      },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
  };

  async getScheduleByClass(userId: number) {
    const user = await this.prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            institutionId: true,
            groupId: true,
            id: true
        }
    })
    if (!user) {
        throw new Error("User not found");
    };

    const schedule = await this.prisma.schedule.findMany({
        where: {
            institutionId: user.institutionId,
            groups
        }
    })

    

  }
}