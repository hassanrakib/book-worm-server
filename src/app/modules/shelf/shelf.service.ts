import AppError from "../../errors/app-error";
import { IRequestUser } from "../../interfaces";
import { IBook } from "../book/book.interface";
import { Book } from "../book/book.model";
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
  const shelf = await Shelf.findById(shelfId).populate("book").lean();

  if (!shelf) {
    throw new AppError(httpStatus.NOT_FOUND, "Book shelf is not found");
  }

  const update: { shelf?: TShelfType; pagesRead?: number } = {};

  const isShelfChanging = Boolean(shelfUpdate.shelf);

  /**
   * Shelf type update
   */
  if (shelfUpdate.shelf) {
    update.shelf = shelfUpdate.shelf;

    if (shelfUpdate.shelf === "currently_reading") {
      update.pagesRead = 0;
    } else {
      update.pagesRead = undefined;
    }
  }

  /**
   * Pages read update
   */
  if (
    typeof shelfUpdate.pagesRead === "number" &&
    !isShelfChanging // prevent conflict
  ) {
    if (shelf.shelf !== "currently_reading") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Pages read can only be updated for currently reading books"
      );
    }

    if (shelfUpdate.pagesRead < 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Pages read cannot be negative"
      );
    }

    const totalPages = (shelf.book as any)?.totalPages;

    if (totalPages && shelfUpdate.pagesRead >= totalPages) {
      update.pagesRead = undefined;
      update.shelf = "read";
    } else {
      update.pagesRead = shelfUpdate.pagesRead;
    }
  }

  return await Shelf.findByIdAndUpdate(shelfId, update, {
    new: true,
    runValidators: true,
  });
};

export const ShelfServices = {
  addBookToShelf,
  getBooksOfShelvesByUser,
  updateBookShelfById,
};
