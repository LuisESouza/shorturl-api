import { Controller, Get, Post, Body, Param, NotFoundException, Redirect } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post('shorten')
  async shortenUrl(@Body() dto: CreateShortUrlDto) {
    const shortUrl = await this.shortenerService.createShortUrl(dto.url);
    return { shortUrl };
  }

  @Get(':code')
  @Redirect()
  async redirectToOriginal(@Param('code') code: string) {
    const originalUrl = await this.shortenerService.getOriginalUrl(code);
    if (!originalUrl) {throw new NotFoundException('URL não encontrada')}
    return { url: originalUrl };
  }
}