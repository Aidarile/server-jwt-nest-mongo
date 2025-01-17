/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';


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

        //Devolverlo
        return { access_token: miToken }

        //Si no... devolver ERROR

    }
}


