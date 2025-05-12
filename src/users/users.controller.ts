import { Controller, Get, Post, Body, Param, NotFoundException, Redirect, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly UsersService: UsersService){}

    @Get('me')
    async getMe(@Req() request: Request) {
        const userId = request['user'].id;
        return await this.UsersService.getUserById(userId);
    }

    @Get('me/links')
    async getMyLinks(@Req() request: Request) {
        const userId = request['user'].id;
        return await this.UsersService.getUserLinks(userId);
    }
}