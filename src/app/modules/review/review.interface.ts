import { Types } from "mongoose";
import { REVIEW_STATUS } from "./review.constant";

export type TReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

export interface IReview {
  user: Types.ObjectId;     // user _id
  book: Types.ObjectId;     // book _id
  rating: number;   // 1–5
  comment: string;
  status: 'pending' | 'approved';
}
