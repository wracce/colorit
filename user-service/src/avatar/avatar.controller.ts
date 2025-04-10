// src/avatar/avatar.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Param,
    Res,
    Req,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AvatarService } from './avatar.service';
  import { Response } from 'express';
  
  @Controller('avatar')
  export class AvatarController {
    constructor(private avatarService: AvatarService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
      const avatar = await this.avatarService.saveAvatar(file, req.user?.userId);
      return { id: avatar._id };
    }
  
    @Get(':id')
    async getAvatar(@Param('id') id: string, @Res() res: Response) {
      const avatar = await this.avatarService.getAvatar(id);
      if (!avatar) {
        return res.status(404).send('Not found');
      }
      res.set('Content-Type', avatar.mimetype);
      res.send(avatar.data);
    }
  }
  