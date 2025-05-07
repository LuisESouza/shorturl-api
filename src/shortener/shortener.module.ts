import { PrismaService } from '../db/prisma.service';
import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

@Module({
  providers: [PrismaService, ShortenerService],
  controllers: [ShortenerController],
  exports: [ShortenerService], 
})
export class ShortenerModule {}
