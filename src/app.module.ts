import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './ops/logger.config';
import { DBService } from './db.service';
import { environmentValidationSchema } from './ops/environmen.validation-schema';
import { UrlRepository } from './url.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: environmentValidationSchema }),
    LoggerModule.forRootAsync(loggerConfig)
  ],
  controllers: [AppController],
  providers: [AppService, DBService, UrlRepository],
})
export class AppModule { }
