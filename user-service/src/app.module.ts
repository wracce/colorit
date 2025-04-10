import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { ColorizationModule } from './colorization/colorization.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [    
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/nest-auth'),
    UsersModule,
    AuthModule,
    AvatarModule,
    ColorizationModule,
    GalleryModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
