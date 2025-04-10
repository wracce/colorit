// src/gallery/schemas/gallery.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  originalId: string;

  @Prop({ required: true })
  colorizedId: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true })
  colorizedUrl: string;

  @Prop({ required: true })
  dimensions: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  processingTime: number;

  @Prop({ default: 0 })
  rating: number;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
