import { generateShortCode } from '../common/utils/create-short-url';
import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class ShortenerService {
  constructor(private readonly prisma: PrismaService) {}


  async createShortUrl(originalUrl: string, userId?: string, ip?: string): Promise<string> {
      try {
        if (!userId && ip) {
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          const jaCriouHoje = await this.prisma.url.findFirst({
            where: { ip: ip, created_at: { gte: hoje } }
          });
          if (jaCriouHoje) {
            throw new Error('Usuários não autenticados só podem encurtar 1 link por dia.');
          }
        }
        if (userId) {
          const totalDoUsuario = await this.prisma.url.count({
            where: { userId: userId }
          });
          if (totalDoUsuario >= 25) {
            throw new Error('Você atingiu o limite de 25 links encurtados.');
          }
        }
        const code = generateShortCode();
        const exists = await this.prisma.url.findUnique({
          where: { shortCode: code }
        });
        if (exists) return this.createShortUrl(originalUrl, userId, ip);
        await this.prisma.url.create({
          data: {
            original: originalUrl,
            shortCode: code,
            userId: userId,
            ip: ip,
          },
        });
        return `https://shorturl-api.onrender.com/${code}`;
      } catch (error) {
        throw new HttpException(
          error.message || 'Erro interno no servidor',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  }


  async getOriginalUrl(code: string): Promise<string | null> {
    try{
    const record = await this.prisma.url.findUnique({where: { shortCode: code }});
    if (!record) {throw new NotFoundException('URL não encontrada')}
    if(!record.status_url){throw new NotFoundException('URL Desativada')}
    return record.original;
    }catch(error){
      throw new HttpException(
        error.message || 'Erro interno no servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}