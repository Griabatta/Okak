// src/modules/institution/institution.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) {}

  async createInstitution(name: string, description: string, userId: number) {
    // Проверка роли будет в контроллере через guard
    return this.prisma.educationalInstitution.create({
      data: {
        name,
        description,
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async getAllInstitutions() {
    return this.prisma.educationalInstitution.findMany();
  }
}