import { Schema, model } from "mongoose";
import { IBook } from "./book.interface";

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },

    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Book category is required"],
    },

    description: {
      type: String,
      required: [true, "Book description is required"],
      trim: true,
    },

    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Book = model<IBook>("Book", bookSchema);
