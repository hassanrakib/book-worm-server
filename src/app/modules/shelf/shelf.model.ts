import { Schema, model } from "mongoose";
import { IShelf } from "./shelf.interface";

const shelfSchema = new Schema<IShelf>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    shelf: {
      type: String,
      enum: ["want_to_read", "currently_reading", "read"],
      required: true,
    },

    pagesRead: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

export const Shelf = model<IShelf>("Shelf", shelfSchema);
