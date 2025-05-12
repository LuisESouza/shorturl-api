import { Controller, Delete, Body, Param, Req, UseGuards, Put } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LinkValidationDto } from './dto/link.dto';
import { LinksService } from './links.service';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('link')
export class LinksController {

    constructor(private readonly linksService: LinksService) {}
    
    @Delete(':id')
    async deleteLink(@Param('id') id: string, @Req() request: Request) {
        const userId = request['user'].id;
        const res = await this.linksService.deleteLink(id, userId)
        return { res };
    }

    @Put(':id')
    async updateLink(@Param('id') id: string, @Body() dto: LinkValidationDto, @Req() request: Request){
        const userId = request['user'].id;
        const res = await this.linksService.updateLink(id, userId, dto.url, dto.code, dto.status);
        return { res };
    }
}