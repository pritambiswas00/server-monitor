import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

class LoginDto {
    @ApiProperty({ type: String })
    @IsEmail({}, { message: 'Please provide a valid email' })
    @IsString()
    email: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        const result = await this.authService.login(dto.email)();
        return pipe(
            result,
            E.getOrElseW((err) => { throw err; })
        );
    }
}
