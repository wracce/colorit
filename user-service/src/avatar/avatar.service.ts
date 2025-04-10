// src/avatar/avatar.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Avatar, AvatarDocument } from './schemas/avatar.schema';
import { Model } from 'mongoose';

@Injectable()
export class AvatarService {
  constructor(@InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>) {}

  async saveAvatar(file: Express.Multer.File, userId?: string): Promise<AvatarDocument> {
    return this.avatarModel.create({
      data: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
      userId,
    });
  }

  async getAvatar(id: string): Promise<Avatar | null> {
    return this.avatarModel.findById(id);
  }
}
