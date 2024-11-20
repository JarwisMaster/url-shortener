import { BadRequestException, Body, Controller, Get, Inject, Param, Post, Res, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';
import { Cache, CACHE_MANAGER, CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

const urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator

class CreateUrlDto {
  @ApiProperty({ description: "Url string to be shortened." })
  @ValidateIf((o, urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch (err) {
      throw new BadRequestException('Url must be valid');
    }
  })
  url: string
}

@ApiTags('Shortener')
@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  @Get(':short')
  async load(@Param('short') short: string, @Res() res,) {
    let redirectUrl: string
    const cacheData = await this.cacheManager.get<string>(`short-${short}`)

    if (!cacheData) {
      const url = await this.appService.getOne(short);
      if (url) {
        redirectUrl = url.original
        await this.cacheManager.set(`short-${short}`, url.original)
      }
    } else {
      redirectUrl = cacheData
    }

    return res.redirect(redirectUrl)
  }

  @Post('create')
  async short(@Body() data: CreateUrlDto) {
    const url = await this.appService.short(data.url);
    await this.cacheManager.set(`short-${url.short}`, url.original)
    return `http://${this.configService.get<string>('API_HOST')}:${this.configService.get<string>('API_PORT')}/${url.short}`
  }
}
