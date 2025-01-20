/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { request, Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './guards/auth.guards';


@Controller('auth')
export class AuthController {

    constructor( 
        @Inject() private userService: UsersService, 
        @Inject() private jwtService: JwtService
    ) { }

    @Post ("/register")
    async registrarNuevoUsuario( @Body() createUserDto : CreateUserDto) {
        createUserDto.password = await bcryptjs.hash( createUserDto.password, 10);
        return this.userService.create(createUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("/login")
    async iniciarSesion ( @Body() usuario:CreateUserDto) {

        //Buscar el User en la base de datos:
        const elUsuario = await this.userService.findByUserName(usuario.username);
        if (elUsuario == null) throw new HttpException("Acceso denegado", HttpStatus.NOT_FOUND);

        //Comparo las contraseñas:
        const passOk = await bcryptjs.compare( usuario.password, elUsuario.password);
        if (!passOk) throw new HttpException("Acceso no valido", HttpStatus.NOT_FOUND);

        //Todo OK = iniciar sesion (devolver Token de sesion)

        //Crear mi token
        const payload = { username: elUsuario.username, rol: elUsuario.rol }
        const miToken = await this.jwtService.signAsync(payload);

        //crear y devolver un token de refresco (duracion mas larga):
        const miRefreshToken = await this.jwtService.signAsync(payload, { expiresIn: "1h"});

        //Devolverlo
        return { access_token: miToken, refresh_token: miRefreshToken }
    }
    
    @UseGuards(AuthGuard)
    @Get("/validar")
    async validarToken( @Req() req: Request) {
        return req["user"];  
    }

    @Post("/refresh")
    async refresh(@Body() body) {
        // Leo el refresh token actual, del formulario enviado (post)
        const actual_refresh_token = body.refresh_token;
        if(!actual_refresh_token) throw new UnauthorizedException(); // si no hay error
        //validar el refresh token actual (si es nuestro... si no está caducado)

        try {

            const payload = this.jwtService.verifyAsync(actual_refresh_token);
            //tenemos los datos (que ya teniamos de antes) en el payload

            //generar nuevos access_token y refresh_token (usando el mismo payload)
            const miToken = await this.jwtService.signAsync(payload);
            const mi_refresh_token = await this.jwtService.signAsync(payload, { expiresIn: "1h"});

            return { access_token : miToken, refresh_token: mi_refresh_token};

        } catch {
            throw new UnauthorizedException();
        }
    }


}


