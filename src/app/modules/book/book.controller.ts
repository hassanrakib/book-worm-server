import { IBook, IBookQuery } from "./book.interface";
import { BookServices } from "./book.service";
import { makeController } from "../../utils/controller-factory";

const createBook = makeController<
  {},
  Omit<IBook, "coverImage">,
  {},
  Express.Multer.File
>({
  useFile: { required: "Cover image is required." },
  service: ({ body, file }) => BookServices.insertBookIntoDB(body, file),
  successMessage: "Book added successfully.",
});

const getBooks = makeController<{}, {}, IBookQuery>({
  service: ({ query }) => BookServices.retrieveBooksFromDB(query),
  successMessage: "Books data retrieved successfully.",
});

const updateBookById = makeController<
  { id: string },
  Partial<IBook>,
  {},
  Express.Multer.File | undefined
>({
  useFile: {},
  service: ({ params, body, file }) =>
    BookServices.updateBookByIdIntoDB(params.id, body, file),
  successMessage: "Book updated successfully.",
  notFound: {
    message: "Book not found",
  },
});

const deleteBookById = makeController<{ id: string }>({
  service: ({ params }) => BookServices.deleteBookByIdFromDB(params.id),
  successMessage: "Book deleted successfully.",
  notFound: {
    message: "Book not found",
  },
});

const getRecommendedBooksForUser = makeController({
  service: ({ user }) => BookServices.getRecommendedBooksForUser(user),
  successMessage: "Recommended books retrieved",
});

export const BookControllers = {
  createBook,
  getBooks,
  updateBookById,
  deleteBookById,
  getRecommendedBooksForUser,
};
