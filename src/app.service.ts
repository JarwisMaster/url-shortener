import { Injectable } from '@nestjs/common';
import { Url, UrlRepository } from './url.repository';

@Injectable()
export class AppService {
  constructor(private readonly urlRepository: UrlRepository) {}

  getOne(short: string) {
    return this.urlRepository.getOne(short);
  }

  async short(urlString: string) {
    const url = new Url(urlString);
    await this.urlRepository.saveOne(url);
    return url;
  }
}
