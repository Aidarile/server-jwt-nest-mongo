import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, MongooseModule.forRoot("mongodb+srv://aidagm:1234@mongoose.0kw2i.mongodb.net"), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
