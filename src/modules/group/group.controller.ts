// src/modules/group/group.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { GroupService } from './group.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(
    @Body() body: { name: string; class: number; institutionId: number },
    @Req() req,
  ) {
    return this.groupService.createGroup(
      body.name,
      body.class,
      body.institutionId,
      req.user.id,
    );
  }

  @Get()
  async getAll(@Req() req) {
    // Админ видит все группы, преподаватель - только своего учреждения
    const institutionId = req.user.role === 'ADMIN' 
      ? undefined 
      : req.user.institutionId;
    
    return this.groupService.getGroups(institutionId);
  }
}