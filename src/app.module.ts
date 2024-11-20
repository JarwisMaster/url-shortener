import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentValidationSchema } from './ops/EnvironmenlValidationSchema.const';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './ops/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: EnvironmentValidationSchema }),
    LoggerModule.forRootAsync(loggerConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
