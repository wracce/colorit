import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from './schemas/avatar.schema';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }])],
  providers: [AvatarService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}
