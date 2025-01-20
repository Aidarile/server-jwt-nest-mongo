import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guards';


@Module({

  imports: [MongooseModule.forFeature(
    [
      {name: User.name, schema: UserSchema}
    ]
  )],


  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [UsersService]
})
export class UsersModule {}
