import { Types } from "mongoose";

export interface IBook {
    title: string;
    author: string;
    category: Types.ObjectId;
    description: string;
    coverImage: string;
}