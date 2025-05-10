import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { PrismaService } from '../db/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PrismaService, ShortenerService],
  controllers: [ShortenerController],
  exports: [ShortenerService],
})
export class ShortenerModule {}
