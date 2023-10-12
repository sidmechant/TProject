import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Middleware pour les cookies
    app.use(cookieParser());

    // Configuration CORS
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });

    // Pipes globaux
    app.useGlobalPipes(new ValidationPipe());

    // Filtres d'exception globaux
    // app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(3000);
  } catch (error) {
    console.log("Error in main:", error);
  }
}

bootstrap();
