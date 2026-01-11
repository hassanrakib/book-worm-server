import AppError from "../../errors/app-error";
import saveImageToCloud from "../../utils/cloudinary";
import { Category } from "../category/category.model";
import { IBook } from "./book.interface";
import { Book } from "./book.model";
import httpStatus from "http-status";

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

const retrieveBooksFromDB = async () => {
  return await Book.find().lean();
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
  return await Book.findByIdAndDelete(id).lean();
};

export const BookServices = {
  insertBookIntoDB,
  retrieveBooksFromDB,
  updateBookByIdIntoDB,
  deleteBookByIdFromDB,
};
