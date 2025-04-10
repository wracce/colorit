import { Module } from '@nestjs/common';
import { ColorizationController } from './colorization.controller';
import { ColorizationService } from './colorization.service';
import { GalleryModule } from '../gallery/gallery.module';
import { AvatarModule } from 'src/avatar/avatar.module';

@Module({
  imports: [GalleryModule, AvatarModule],
  controllers: [ColorizationController],
  providers: [ColorizationService],
})
export class ColorizationModule {}
