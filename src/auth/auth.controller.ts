/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';


@Controller('auth')
export class AuthController {

    constructor( @Inject() private userService: UsersService) { }

    @Post ("/register")
    async registrarNuevoUsuario( @Body() createUserDto : CreateUserDto) {
        createUserDto.password = await bcryptjs.hash( createUserDto.password, 10);
        return this.userService.create(createUserDto);
    }
}
