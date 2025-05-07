import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { generateShortCode } from '../common/utils/create-short-url';

@Injectable()
export class ShortenerService {
  constructor(private readonly prisma: PrismaService) {}
  async createShortUrl(originalUrl: string): Promise<string> {
    const code = generateShortCode();
    const exists = await this.prisma.url.findUnique({where: { shortCode: code }});
    if (exists) return this.createShortUrl(originalUrl);
    await this.prisma.url.create({data: {original: originalUrl, shortCode: code,}});
    return `http://localhost:4004/shortener/${code}`;
  }
  async getOriginalUrl(code: string): Promise<string | null> {
    const record = await this.prisma.url.findUnique({where: { shortCode: code },});
    if (!record) {throw new NotFoundException('URL não encontrada');}
    return record.original;
  }
}