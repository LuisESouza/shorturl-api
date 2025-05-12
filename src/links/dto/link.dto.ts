import { IsUrl, IsString, IsBoolean, IsOptional  } from 'class-validator';

export class LinkValidationDto {
    @IsOptional()
    @IsBoolean()
    status?: boolean
    
    @IsOptional()
    @IsString()
    code?: string;


    @IsOptional()
    @IsUrl({}, { message: 'URL Invalido'})
    url?: string
}
