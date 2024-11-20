import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { nanoid } from "nanoid";
import { DBService } from "./db.service";
import { Logger } from '@nestjs/common';

export class Url {
    short: string
    original: string

    constructor(original: string, short?: string) {
        this.short = short || nanoid(16)
        this.original = original
    }
}

@Injectable()
export class UrlRepository {
    private readonly logger = new Logger(UrlRepository.name)

    constructor(private readonly dbService: DBService) { }

    async getOne(short: string) {
        let url: Url
        try {
            // @TODO not safe
            const result = await this.dbService.client`SELECT * FROM urls WHERE short = ${short} limit 1;`
            if (result[0]) {
                url = new Url(result[0]?.original, result[0]?.short)
            }
        } catch (e) {
            this.logger.error(e)
            throw new NotFoundException('Grab url error.')
        }
        if (!url)
            throw new NotFoundException('URL Not Found.')
        return url
    }

    async saveOne(url: Url) {
        try {
            // @TODO not safe
            await this.dbService.client`INSERT INTO urls (short, original) values (${url.short}, ${url.original});`
        } catch (e) {
            this.logger.error(e)
            throw new BadRequestException('Short Url Error.')
        }
    }
}