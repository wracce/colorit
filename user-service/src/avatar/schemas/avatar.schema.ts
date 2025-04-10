// src/avatar/schemas/avatar.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema({ timestamps: true })
export class Avatar {
  @Prop({ required: true })
  data: Buffer;

  @Prop()
  mimetype: string;

  @Prop()
  size: number;

  @Prop()
  userId: string; // связка с пользователем, если нужно
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);