import { Types } from "mongoose";
import { QueryParams } from "../../builder/query-builder";

export interface IBook {
  title: string;
  author: string;
  category: Types.ObjectId;
  description: string;
  coverImage: string;
  totalPages: number;
  avgRating: number;
  shelfCount: number;
}

export interface IBookQuery extends QueryParams {
  category?: string;
  minRating?: string;
  maxRating?: string;
}
