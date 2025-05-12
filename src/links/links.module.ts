import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../db/prisma.service';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';


@Module({
  imports: [AuthModule],
  providers: [PrismaService, LinksService],
  controllers: [LinksController],
  exports: [LinksService],
})

export class LinksModule {}