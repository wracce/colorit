// src/gallery/gallery.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { Model } from 'mongoose';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
  ) {}

  async create(data: Partial<Gallery>): Promise<GalleryDocument> {
    return this.galleryModel.create(data);
  }

  async findAll(): Promise<GalleryDocument[]> {
    return this.galleryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<GalleryDocument | null> {
    return this.galleryModel.findById(id).exec();
  }

  async findOne(id: string): Promise<GalleryDocument | null> {
    return this.galleryModel.findById(id).exec();
  }
}
