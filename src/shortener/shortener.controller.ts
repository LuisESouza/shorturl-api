import { Controller, Get, Post, Body, Param, NotFoundException, Redirect, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { ShortenerService } from './shortener.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @UseGuards(AuthGuard)
  @Post('')
  async shortenUrlAuth(@Body() dto: CreateShortUrlDto, @Req() request: Request) {
    const userId = request['user'].id;
    const shortUrl = await this.shortenerService.createShortUrl(dto.url, userId);
    return { shortUrl };
  }

  @Post('guest')
  async shortenUrlGuest(@Body() dto: CreateShortUrlDto, @Req() request: Request) {
    const ip = (request.headers['x-forwarded-for'] as string)?.split(',')[0] || request.socket.remoteAddress;
    const shortUrl = await this.shortenerService.createShortUrl(dto.url, undefined, ip);
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