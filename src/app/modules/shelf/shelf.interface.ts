import { Types } from "mongoose";
import { SHELF_TYPE } from "./shelf.constant";

export type TShelfType = (typeof SHELF_TYPE)[keyof typeof SHELF_TYPE];

export interface IShelf {
  user: Types.ObjectId; // user _id
  book: Types.ObjectId; // book _id
  shelf: TShelfType;
  pagesRead?: number;
}
