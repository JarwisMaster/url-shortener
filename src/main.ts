import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService)
  const logger = app.get(Logger)

  const swaggerConfig = new DocumentBuilder().setTitle('Link shortener docs').build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, swaggerDocument)

  await app.listen(config.get<number>('API_PORT'));
  logger.log('Swagger runnin at http://localhost:8080/docs')
}
bootstrap();
