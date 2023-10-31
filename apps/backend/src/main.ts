import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://192.168.254.117:5173', 'http://localhost:5173'],
      credentials: true,
    },
    bufferLogs: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useLogger(app.get(Logger));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
