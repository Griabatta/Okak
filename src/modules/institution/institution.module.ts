// src/modules/institution/institution.module.ts
import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
  controllers: [InstitutionController],
  providers: [InstitutionService],
})
export class InstitutionModule {}