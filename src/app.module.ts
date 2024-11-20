import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './ops/logger.config';
import { DBService } from './db.service';
import { environmentValidationSchema } from './ops/environmen.validation-schema';
import { UrlRepository } from './url.repository';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule, CacheModuleOptions } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: environmentValidationSchema }),
    LoggerModule.forRootAsync(loggerConfig),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const storeConfig = {
          url: `redis://localhost:6379`,
          ttl: 60 * 60 * 24
        };
        const store = await redisStore(storeConfig);
        return { store: () => store };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DBService, UrlRepository],
})
export class AppModule { }
