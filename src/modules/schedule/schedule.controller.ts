// src/modules/schedule/schedule.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req, ForbiddenException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async create(@Body() body: any, @Req() req) {
    return this.scheduleService.createSchedule({
      ...body,
      userId: req.user.id,
    });
  }

  @Get('combined')
  async getCombined(@Req() req) {
    if (!req.user.groupId) {
      throw new ForbiddenException('You are not assigned to any group');
    }
    return this.scheduleService.getCombinedLessons(req.user.groupId);
  }
}