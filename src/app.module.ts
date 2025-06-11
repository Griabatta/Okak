// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { GroupModule } from './modules/group/group.module';
import { ScheduleModule } from './modules/schedule/schedule.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    InstitutionModule,
    GroupModule,
    ScheduleModule,
    PrismaModule
  ],
  providers: [],
})
export class AppModule {}