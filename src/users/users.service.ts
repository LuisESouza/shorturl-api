import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';



@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      const { password, ...newUser } = user;
      return newUser;
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro interno no servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserLinks(userId: string) {
    try{
      const links = await this.prisma.url.findMany({
        where: { userId },
      });
      return links;
    }catch(error){
      throw new HttpException(
        error.message || 'Erro interno no servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}