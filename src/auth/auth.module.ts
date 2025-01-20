import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guards';

@Module({
  imports: 
  [
    MongooseModule.forFeature(
      [
        {name: User.name, schema: UserSchema}
      ]
    ),
  JwtModule.register( {
    global: true,
    secret: process.env.JWT_SECRET, 
    signOptions: { expiresIn: "60s"}
  } )
],
  controllers: [AuthController],
  providers: [UsersService, AuthGuard],
  exports: [AuthGuard]
})
export class AuthModule {}
