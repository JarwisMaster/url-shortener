import { Injectable } from '@nestjs/common';
import { Url, UrlRepository } from './url.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly urlRepository: UrlRepository
  ) { }

  load(short: string) {
    return this.urlRepository.getOne(short)
  }

  async short(urlString: string) {
    const url = new Url(urlString)
    await this.urlRepository.saveOne(url)
    return `http://${this.configService.get<string>('API_HOST')}:${this.configService.get<string>('API_PORT')}/${url.short}`
  }
}
