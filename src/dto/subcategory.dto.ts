import { IsObject, IsString, IsNumber } from 'class-validator';
import { Document } from 'mongoose';
import { Image } from './image.dto';

export class Subcategory extends Document {
  @IsString()
  name: string;

  @IsObject()
  image: Partial<Image>;

  @IsString()
  category: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;
}
