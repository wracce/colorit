import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as sharp from 'sharp';
import * as crypto from 'crypto';

import { Gallery, GalleryDocument } from '../gallery/schemas/gallery.schema';
import { GalleryService } from '../gallery/gallery.service';
import { AvatarService } from '../avatar/avatar.service';
import * as FormData from 'form-data';


@Injectable()
export class ColorizationService {
  private readonly logger = new Logger(ColorizationService.name);
  private queue: (() => Promise<void>)[] = [];
  private concurrency = 1;
  private current = 0;

  constructor(
    private readonly galleryService: GalleryService,
    private readonly avatarService: AvatarService,
  ) {}

  async enqueue(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.processFile(file);
          resolve(result);
        } catch (e) {
          reject(e);
        } finally {
          this.current--;
          this.runNext();
        }
      });

      this.runNext();
    });
  }

  private runNext() {
    if (this.current >= this.concurrency) return;
    const next = this.queue.shift();
    if (next) {
      this.current++;
      next();
    }
  }

  private async processFile(file: Express.Multer.File) {
    const buffer = file.buffer;
    const start = Date.now();
  
    const image = sharp(buffer);
    const metadata = await image.metadata();
  
    if (!metadata.format || !['jpeg', 'png', 'jpg'].includes(metadata.format)) {
      throw new BadRequestException('Поддерживаются только изображения jpeg, jpg или png');
    }
  
    if (buffer.length > 5 * 1024 * 1024) {
      throw new BadRequestException('Файл слишком большой (>5MB)');
    }
  
    if (
      typeof metadata.width !== 'number' ||
      typeof metadata.height !== 'number' ||
      metadata.width > 2048 ||
      metadata.height > 2048
    ) {
      throw new BadRequestException('Изображение слишком большое. Максимум: 2048x2048 px');
    }
  
    // ⚡ Отправка через form-data
    const form = new FormData();
    form.append('file', buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  
    const response = await axios.post('http://nginx:80/api/colorization/v1/colorize', form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer',
    });
  
    const outputBuffer = Buffer.from(response.data);
    const duration = (Date.now() - start) / 1000;
  
    const originalAvatar = await this.avatarService.saveAvatar(file);
    const colorizedAvatar = await this.avatarService.saveAvatar({
      ...file,
      buffer: outputBuffer,
      size: outputBuffer.length,
    });
  
    const gallery = await this.galleryService.create({
      title: crypto.randomBytes(4).toString('hex'),
      originalId: originalAvatar.id.toString(),
      colorizedId: colorizedAvatar.id.toString(),
      originalUrl: `/avatar/${originalAvatar.id}`,
      colorizedUrl: `/avatar/${colorizedAvatar.id}`,
      fileSize: buffer.length,
      processingTime: duration,
      dimensions: `${metadata.width}x${metadata.height}`,
      rating: 0,
    });
  
    return {
      id: gallery._id,
      title: gallery.title,
      originalUrl: `/avatar/${originalAvatar._id}`,
      colorizedUrl: `/avatar/${colorizedAvatar._id}`,
      dimensions: gallery.dimensions,
      fileSize: gallery.fileSize,
      processingTime: gallery.processingTime,
    };
  }
}
