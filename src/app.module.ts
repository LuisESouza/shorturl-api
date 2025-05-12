import { ShortenerModule } from './shortener/shortener.module';
import { LinksModule } from './links/links.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ShortenerModule, UsersModule, LinksModule],
  providers: [],
})
export class AppModule {}
