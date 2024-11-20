import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as postgres from 'postgres';

@Injectable()
export class DBService {
  private readonly logger = new Logger(DBService.name);
  client: postgres.Sql;

  constructor(config: ConfigService) {
    this.client = postgres({
      host: config.get<string>('POSTGRES_HOST'),
      port: config.get<number>('POSTGRES_PORT'),
      user: config.get<string>('POSTGRES_USER'),
      password: config.get<string>('POSTGRES_PASSWORD'),
      database: config.get<string>('POSTGRES_DATABASE'),
      onnotice: () => {},
    });

    this.ping();
    this.migrate();
  }

  async ping() {
    try {
      const dbTime = await this.client`SELECT CURRENT_TIMESTAMP;`;
      this.logger.debug(`DBtime is ${dbTime[0]?.current_timestamp}`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  // @TODO write migration parser
  async migrate() {
    try {
      await this.client`
            CREATE TABLE IF NOT EXISTS urls (
                short VARCHAR(16) PRIMARY KEY,
                original TEXT NOT NULL
            );
        `;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
