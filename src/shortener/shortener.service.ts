import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { generateShortCode } from '../common/utils/create-short-url';

@Injectable()
export class ShortenerService {
  constructor(private readonly prisma: PrismaService) {}


  async createShortUrl(originalUrl: string, userId?: string, ip?: string): Promise<string> {
    if (!userId && ip) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const jaCriouHoje = await this.prisma.url.findFirst({where: {ip: ip, created_at: { gte: hoje }}});
      if (jaCriouHoje) {throw new Error('Usuários não autenticados só podem encurtar 1 link por dia.');}
    }
    const code = generateShortCode();
    const exists = await this.prisma.url.findUnique({ where: { shortCode: code } });
    if (exists) return this.createShortUrl(originalUrl, userId, ip);
    await this.prisma.url.create({
      data: {original: originalUrl, shortCode: code, userId: userId, ip: ip,}});
    return `https://shorturl-api.onrender.com/${code}`;
  }

  async getOriginalUrl(code: string): Promise<string | null> {
    const record = await this.prisma.url.findUnique({where: { shortCode: code },});
    if (!record) {throw new NotFoundException('URL não encontrada');}
    return record.original;
  }
}