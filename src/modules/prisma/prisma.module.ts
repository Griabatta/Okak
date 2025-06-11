// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делает модуль глобальным (доступен во всём приложении)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}