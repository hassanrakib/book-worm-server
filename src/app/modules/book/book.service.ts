import mongoose, { Types } from "mongoose";
import AppError from "../../errors/app-error";
import saveImageToCloud from "../../utils/cloudinary";
import { Category } from "../category/category.model";
import { IBook, IBookQuery } from "./book.interface";
import { Book } from "./book.model";
import httpStatus from "http-status";
import { Review } from "../review/review.model";
import { Shelf } from "../shelf/shelf.model";
import QueryBuilder, { QueryParams } from "../../builder/query-builder";
import { IRequestUser } from "../../interfaces";

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
  ).populate("category");

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

  const books = await qb.modelQuery.populate("category").lean();

  return books;
};

const retreiveBookByIdFromDB = async (bookId: string) => {
  return await Book.findById(bookId).populate('category');
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
  }).populate('category').lean();

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

export const getRecommendedBooksForUser = async (user: IRequestUser) => {
  const { userId } = user;

  // 1️. Fetch read books
  const readShelves = await Shelf.find({
    user: userId,
    shelf: "read",
  }).populate("book");
  const readBookIds = readShelves.map((s) => s.book._id.toString());

  // 2️. Fallback for <3 read books
  if (readShelves.length < 3) {
    const popularBooks = await Book.find()
      .sort({ avgRating: -1, shelfCount: -1 })
      .limit(10);

    const randomBooks = await Book.aggregate([
      {
        $match: {
          _id: { $nin: readBookIds.map((id) => new Types.ObjectId(id)) },
        },
      },
      { $sample: { size: 6 } },
    ]);

    const map = new Map();
    [...popularBooks, ...randomBooks].forEach((b) =>
      map.set(b._id.toString(), b)
    );

    // Ensure at least 12 books for fallback
    const finalFallback = Array.from(map.values());
    if (finalFallback.length < 12) {
      const extraBooks = await Book.find({
        _id: {
          $nin: [
            ...readBookIds,
            ...finalFallback.map((b) => b._id.toString()),
          ].map((id) => new Types.ObjectId(id)),
        },
      })
        .sort({ avgRating: -1, shelfCount: -1 })
        .limit(12 - finalFallback.length);

      extraBooks.forEach((b) => map.set(b._id.toString(), b));
    }

    return Array.from(map.values()).slice(0, 12);
  }

  // 3️. Compute top categories
  const categoryCount: Record<string, number> = {};
  readShelves.forEach((shelf) => {
    const catId = (shelf.book as unknown as IBook).category.toString();
    categoryCount[catId] = (categoryCount[catId] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([catId]) => catId);

  // 4️. User's average rating
  const userReviews = await Review.find({ user: userId, status: "approved" });
  const avgUserRating =
    userReviews.reduce((sum, r) => sum + r.rating, 0) /
    (userReviews.length || 1);

  // 5️. Aggregate community-approved books in top categories
  const topBooksByCommunity = await Review.aggregate([
    { $match: { status: "approved" } },
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $match: {
        "book.category": {
          $in: topCategories.map((id) => new Types.ObjectId(id)),
        },
      },
    },
    {
      $match: {
        "book._id": { $nin: readBookIds.map((id) => new Types.ObjectId(id)) },
      },
    },
    {
      $group: {
        _id: "$book._id",
        book: { $first: "$book" },
        avgRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
    { $sort: { reviewCount: -1, avgRating: -1 } },
    { $limit: 20 },
  ]);

  // 6️. Filter by user's average rating
  const filteredBooks = topBooksByCommunity
    .map((r) => r.book)
    .filter((b) => b.avgRating >= avgUserRating)
    .slice(0, 15);

  // 7️. Add some randomness
  const randomBooks = await Book.aggregate([
    {
      $match: {
        category: { $in: topCategories.map((id) => new Types.ObjectId(id)) },
        _id: {
          $nin: [
            ...readBookIds,
            ...filteredBooks.map((b) => b._id.toString()),
          ].map((id) => new Types.ObjectId(id)),
        },
      },
    },
    { $sample: { size: 5 } },
  ]);

  // 8️. Merge and remove duplicates
  const recommendationMap = new Map<string, any>();
  [...filteredBooks, ...randomBooks].forEach((b) =>
    recommendationMap.set(b._id.toString(), b)
  );
  let finalBooks = Array.from(recommendationMap.values());

  // Ensure minimum 12 books
  if (finalBooks.length < 12) {
    const additionalBooks = await Book.find({
      _id: {
        $nin: [...readBookIds, ...finalBooks.map((b) => b._id.toString())].map(
          (id) => new Types.ObjectId(id)
        ),
      },
    })
      .sort({ avgRating: -1, shelfCount: -1 })
      .limit(12 - finalBooks.length);

    additionalBooks.forEach((b) => recommendationMap.set(b._id.toString(), b));
    finalBooks = Array.from(recommendationMap.values());
  }

  // 9️. Return 12–18 books
  return finalBooks.slice(0, 18);
};

export const BookServices = {
  insertBookIntoDB,
  retrieveBooksFromDB,
  retreiveBookByIdFromDB,
  updateBookByIdIntoDB,
  deleteBookByIdFromDB,
  getRecommendedBooksForUser,
};
