import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature(
      [
        {name: User.name, schema: UserSchema}
      ]
    )],
  controllers: [AuthController],
  providers: [UsersService],
})
export class AuthModule {}
