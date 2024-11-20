import { ConfigService } from "@nestjs/config"
import { LoggerModuleAsyncParams } from "nestjs-pino"

export const loggerConfig: LoggerModuleAsyncParams = {
    useFactory: (configService: ConfigService) => {
      return {
        pinoHttp: {
          level: configService.get('API_ENV') !== 'prod' ? 'debug' : 'info',
          transport: configService.get('REQUEST_INLINE_LOGGER') ? undefined : { target: 'pino-pretty' },
          autoLogging: configService.get('REQUEST_LOGGER')
        },
      }
    },
    inject: [ConfigService],
  }