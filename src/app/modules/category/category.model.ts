import { Schema, model, models } from 'mongoose';
import { ICategory } from './category.interface';

// 1. Define the Schema
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true, // Prevents duplicate category
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false,
  }
);

export const Category = model<ICategory>('Category', CategorySchema);