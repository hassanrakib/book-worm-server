import AppError from "../../errors/app-error";
import { IRequestUser } from "../../interfaces";
import { Book } from "../book/book.model";
import { IReview, TReviewStatus } from "./review.interface";
import { Review } from "./review.model";
import httpStatus from "http-status";

const insertReviewIntoDB = async (
  user: IRequestUser,
  payload: Omit<IReview, "user">
) => {
  const { userId: reqUserId } = user;

  const book = await Book.findById(payload.book);

  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  return await Review.create({ ...payload, user: reqUserId });
};

const retrieveReviewsFromDB = async (filter: Record<string, unknown>) => {
  return await Review.find(filter);
};

const retrieveApprovedReviewsByBookId = async (bookId: string) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  const filter = { book: bookId, status: "approved" };
  return await Review.find(filter);
};

const updateReviewStatusById = async (
  reviewId: string,
  statusUpdate: { status: TReviewStatus }
) => {
  return await Review.findByIdAndUpdate(reviewId, statusUpdate);
};

const deleteReviewByIdFromDB = async (reviewId: string) => {
  return await Review.findByIdAndDelete(reviewId);
};

export const ReviewServices = {
  insertReviewIntoDB,
  retrieveReviewsFromDB,
  retrieveApprovedReviewsByBookId,
  updateReviewStatusById,
  deleteReviewByIdFromDB,
};
