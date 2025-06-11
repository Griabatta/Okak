// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSuperUser } from './scripts/createSuperUser';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.use(cookieParser());
  
  await createSuperUser();
  
  await app.listen(3001);
}
bootstrap();