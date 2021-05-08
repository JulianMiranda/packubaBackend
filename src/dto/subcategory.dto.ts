import { IsString, IsNumber, IsArray } from 'class-validator';
import { Document } from 'mongoose';
import { Image } from './image.dto';

export class Subcategory extends Document {
  @IsString()
  name: string;

  @IsArray()
  images: Array<Partial<Image>>;

  @IsArray()
  deleteImages: string[];
  @IsString()
  category: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;
}
