import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

const SubcategorySchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'Category',
    },
    price: Number,
    weight: Number,
    currency: { type: String, default: 'USD' },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    status: { type: Boolean, default: true, index: true },
  },
  { ...schemaOptions },
);
SubcategorySchema.index({ name: 'text' });

export default SubcategorySchema;
