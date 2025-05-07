import { IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl({}, { message: 'URL inválida' })
  url: string;
}