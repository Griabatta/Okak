// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSuperUser } from './scripts/createSuperUser';

async function bootstrap() {
  await createSuperUser(); // Создаем админа перед запуском приложения
  
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();