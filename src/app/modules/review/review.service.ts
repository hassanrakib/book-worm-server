import mongoose from "mongoose";
import AppError from "../../errors/app-error";
import { IRequestUser } from "../../interfaces";
import { Book } from "../book/book.model";
import { IReview, TReviewStatus } from "./review.interface";
import { Review } from "./review.model";
import httpStatus from "http-status";

const insertReviewIntoDB = async (
  user: IRequestUser,
  payload: Omit<IReview, "user" | "status">
) => {
  const { userId: reqUserId } = user;

  const book = await Book.findById(payload.book);

  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }

  return await Review.create({
    ...payload,
    user: reqUserId,
    status: "pending",
  });
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
  const review = await Review.findById(reviewId).lean();

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  // Only act when status is changing to approved
  const isApproving =
    statusUpdate.status === "approved" && review.status !== "approved";

  // Update review status
  const updatedReview = await Review.findByIdAndUpdate(reviewId, statusUpdate, {
    new: true,
    runValidators: true,
  });

  try {
    if (isApproving) {
      const bookId = review.book;

      // Recalculate avg rating from approved reviews
      const stats = await Review.aggregate([
        {
          $match: {
            book: new mongoose.Types.ObjectId(bookId),
            status: "approved",
          },
        },
        {
          $group: {
            _id: "$book",
            avgRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);

      await Book.findByIdAndUpdate(bookId, {
        avgRating: stats[0]?.avgRating || 0,
        reviewCount: stats[0]?.reviewCount || 0,
      });
    }
  } catch (error) {
    console.log("update book avgRating error: ", error);
  }

  return updatedReview;
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
