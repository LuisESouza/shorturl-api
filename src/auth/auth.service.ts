import { PrismaService } from "../db/prisma.service";
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async login(authDto: any) {
        try {
            const { email, password } = authDto;
            const user = await this.prisma.user.findUnique({ where: { email } });
            // Check if user exists and is active
            if (!user) {throw new HttpException('Email ou senha inválidos', HttpStatus.UNAUTHORIZED)}
            // Check if user is active
            if (user?.status_account === false) {throw new HttpException('Conta desativada', HttpStatus.UNAUTHORIZED)}
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {throw new HttpException('Email ou senha inválidos', HttpStatus.UNAUTHORIZED)}
            await this.prisma.user.update({where: { id: user.id }, data: { last_login: new Date() }});
            const token = this.jwtService.sign({ id: user.id });
            return { user: { name: user.name, email: user.email }, token };
        } catch (error) {
            throw new HttpException(
                error.message || 'Erro interno no servidor',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async register(authDto: any) {
        try {
            const { name, email, password } = authDto;
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (user) {throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST)}
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await this.prisma.user.create({data: { name, email, password: hashedPassword }});
            const token = this.jwtService.sign({ id: newUser.id });
            return { user: { name: newUser.name, email: newUser.email }, token };
        } catch (error) {
            throw new HttpException(
                error.message || 'Erro interno no servidor',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}