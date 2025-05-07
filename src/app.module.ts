import { Module } from '@nestjs/common';
import { ShortenerModule } from './shortener/shortener.module';

@Module({
  imports: [ShortenerModule],
  providers: [],
})
export class AppModule {}
