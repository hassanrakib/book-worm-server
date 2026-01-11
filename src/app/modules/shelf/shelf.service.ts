import AppError from "../../errors/app-error";
import { IRequestUser } from "../../interfaces";
import { Book } from "../book/book.model";
import { SHELF_TYPE } from "./shelf.constant";
import { IShelf, TShelfType } from "./shelf.interface";
import { Shelf } from "./shelf.model";
import httpStatus from "http-status";

const addBookToShelf = async (
  user: IRequestUser,
  payload: Pick<IShelf, "book">
) => {
  const { userId: reqUserId } = user;

  // check if book exists
  const book = await Book.findById(payload.book);

  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book is not found");
  }

  // check if book is already in any shelf or not
  const bookInShelf = await Shelf.findOne(payload.book);

  if (bookInShelf) {
    throw new AppError(httpStatus.BAD_REQUEST, "Book is already in a shelf");
  }

  return await Shelf.create({
    ...payload,
    user: reqUserId,
    shelf: "want_to_read",
  });
};

const getBooksOfShelvesByUser = async (user: IRequestUser) => {
  const { userId: reqUserId } = user;

  const result = await Shelf.find({ user: reqUserId }).lean();

  // Group the results by the shelf type
  const groupedShelves = result.reduce(
    (acc, current) => {
      const shelfType = current.shelf;

      // Initialize the array if it doesn't exist for this category
      if (!acc[shelfType]) {
        acc[shelfType] = [];
      }

      // Push the document into the specific shelf category
      acc[shelfType].push(current);

      return acc;
    },
    {
      want_to_read: [],
      currently_reading: [],
      read: [],
    } as Record<string, any[]>
  );

  return groupedShelves;
};

const updateBookShelfById = async (
  shelfId: string,
  shelfUpdate: { shelf?: TShelfType; pagesRead?: number }
) => {
  const update = { ...shelfUpdate };

  const shelf = await Shelf.findById(shelfId).populate("book").lean();

  if (!shelf) {
    throw new AppError(httpStatus.NOT_FOUND, "Book shelf is not found");
  }

  if (shelfUpdate.shelf === SHELF_TYPE.CurrentlyReading) {
    update.pagesRead = 0;
  }

  return await Shelf.findByIdAndUpdate(shelfId, update);
};

export const ShelfServices = {
  addBookToShelf,
  getBooksOfShelvesByUser,
  updateBookShelfById,
};
