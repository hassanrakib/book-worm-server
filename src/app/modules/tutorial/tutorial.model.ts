import { model, Schema } from "mongoose";
import { ITutorial } from "./tutorial.interface";

const tutorialSchema = new Schema<ITutorial>(
  {
    title: {
      type: String,
      minlength: [1, "Title is required"],
      trim: true,
    },
    url: {
      type: String,
      minlength: [1, "URL is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tutorial = model<ITutorial>("Tutorial", tutorialSchema);
