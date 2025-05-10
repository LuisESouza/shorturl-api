import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto, AuthRegisterDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() authDto: AuthRegisterDto) {
        return this.authService.register(authDto);
    }

    @Post('login')
    async login(@Body() authDto: AuthLoginDto){ 
        return this.authService.login(authDto);
    }
}