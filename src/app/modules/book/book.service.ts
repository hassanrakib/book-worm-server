import mongoose from "mongoose";
import AppError from "../../errors/app-error";
import saveImageToCloud from "../../utils/cloudinary";
import { Category } from "../category/category.model";
import { IBook, IBookQuery } from "./book.interface";
import { Book } from "./book.model";
import httpStatus from "http-status";
import { Review } from "../review/review.model";
import { Shelf } from "../shelf/shelf.model";
import QueryBuilder, { QueryParams } from "../../builder/query-builder";

const insertBookIntoDB = async (
  payload: Omit<IBook, "coverImage">,
  coverImage: Express.Multer.File
) => {
  const category = await Category.findById(payload.category);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category is not found");
  }

  const coverImageUrl = await saveImageToCloud(coverImage);

  const result = (
    await Book.create({
      ...payload,
      coverImage: coverImageUrl,
    })
  ).toObject();

  return result;
};

const retrieveBooksFromDB = async (query: IBookQuery) => {
  const qb = new QueryBuilder(Book.find(), query).search(["title", "author"]);

  /**
   * ?category=id1,id2
   */
  if (query.category) {
    qb.modelQuery = qb.modelQuery.find({
      category: {
        $in: query.category.split(","),
      },
    });
  }

  /**
   * ?minRating=3&maxRating=5
   */
  if (query.minRating || query.maxRating) {
    qb.modelQuery = qb.modelQuery.find({
      avgRating: {
        ...(query.minRating && { $gte: Number(query.minRating) }),
        ...(query.maxRating && { $lte: Number(query.maxRating) }),
      },
    });
  }

  qb.sort().selectFields().paginate();

  const books = await qb.modelQuery.lean();

  const pagination = await qb.getPaginationInformation();

  return {
    result: books,
    meta: pagination,
  };
};

const updateBookByIdIntoDB = async (
  id: string,
  update: Partial<IBook>,
  coverImage: Express.Multer.File | undefined
) => {
  const bookUpdate = { ...update };

  const book = await Book.findById(id);

  if (!book) return book;

  if (update?.category) {
    const category = await Category.findById(update.category);

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category is not found");
    }
  }

  if (coverImage) {
    const coverImageUrl = await saveImageToCloud(coverImage);

    bookUpdate.coverImage = coverImageUrl;
  }

  const result = await Book.findByIdAndUpdate(id, bookUpdate, {
    new: true,
    runValidators: true,
  }).lean();

  return result;
};

const deleteBookByIdFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findByIdAndDelete(id, { session }).lean();

    if (!book) {
      throw new AppError(httpStatus.NOT_FOUND, "Book not found");
    }

    await Review.deleteMany({ book: id }, { session });
    await Shelf.deleteMany({ book: id }, { session });

    await session.commitTransaction();
    session.endSession();

    return book;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const BookServices = {
  insertBookIntoDB,
  retrieveBooksFromDB,
  updateBookByIdIntoDB,
  deleteBookByIdFromDB,
};
