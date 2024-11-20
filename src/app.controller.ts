import { BadRequestException, Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

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
  constructor(private readonly appService: AppService) { }

  @Get(':short')
  async load(@Param('short') short: string, @Res() res) {
    const url = await this.appService.load(short);
    if (url.short)
      return res.redirect(url.original)
  }

  @Post('create')
  short(@Body() data: CreateUrlDto) {
    return this.appService.short(data.url);
  }
}
