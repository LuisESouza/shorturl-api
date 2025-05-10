// auth.dto.ts

import { IsEmail, IsString } from 'class-validator'

export class AuthLoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class AuthRegisterDto {
  @IsString()
  name: string
  
  @IsEmail()
  email: string

  @IsString()
  password: string
}