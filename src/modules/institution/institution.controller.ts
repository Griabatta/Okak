// src/modules/institution/institution.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('institutions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() body: { name: string; description?: string },
    @Req() req,
  ) {
    return this.institutionService.createInstitution(
      body.name,
      body.description || '',
      req.user.id,
    );
  }

  @Get()
  async getAll() {
    return this.institutionService.getAllInstitutions();
  }
}