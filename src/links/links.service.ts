import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class LinksService {
    constructor(private readonly prisma: PrismaService) {}

    async deleteLink (id: string, userId: string) {
        try{
            const link = await this.prisma.url.findUnique({where: {id}})
            if(!link){throw new HttpException('Link não encontrado', HttpStatus.BAD_REQUEST);}
            if(link.userId !== userId){ throw new HttpException('Você não tem permissão para deletar este Link', HttpStatus.FORBIDDEN)}
            await this.prisma.url.delete({where: {id}})
            return {message: 'Link deletado com sucesso'}
        }catch(error){
            throw new HttpException(
                error.message || 'Erro interno no servidor',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateLink(id: string, userId: string, url?: string, code?: string, status?: boolean) {
        try {
            const link = await this.prisma.url.findUnique({ where: { id } });

            if (!link) {
            throw new HttpException('Link não encontrado', HttpStatus.BAD_REQUEST);
            }

            if (link.userId !== userId) {
            throw new HttpException('Você não tem permissão para editar este Link', HttpStatus.FORBIDDEN);
            }

            if (code) {
            const existingCode = await this.prisma.url.findFirst({
                where: {
                shortCode: code,
                NOT: { id },
                },
            });

            if (existingCode) {
                throw new HttpException('Este código já está em uso por outro link', HttpStatus.CONFLICT);
            }
            }

            const updatedLink = await this.prisma.url.update({
            where: { id },
            data: {
                original: url,
                shortCode: code,
                status_url: status,
            },
            });

            return {
            message: "Link alterado com sucesso!",
            posts: {
                original: updatedLink.original,
                shortCode: updatedLink.shortCode,
                status_url: updatedLink.status_url,
            },
            };

        } catch (error) {
            throw new HttpException(
            error.message || 'Erro interno no servidor',
            error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}