import { IShelf } from "./shelf.interface";
import { ShelfServices } from "./shelf.service";
import { makeController } from "../../utils/controller-factory";

const addBookToShelf = makeController<{}, Pick<IShelf, "book">>({
  service: ({ user, body }) => ShelfServices.addBookToShelf(user, body),
  successMessage: "Book added to a shelf",
});

const getBooksOfShelvesByUser = makeController({
  service: ({ user }) => ShelfServices.getBooksOfShelvesByUser(user),
  successMessage: "Books of shelves retrieved successfully.",
});

const updateBookShelfById = makeController<{ id: string }, Partial<IShelf>>({
  service: ({ params, body, user }) =>
    ShelfServices.updateBookShelfById(params.id, user, body),
  successMessage: "Shelf updated successfully.",
  notFound: {
    message: "Book shelf not found",
  },
});

export const ShelfControllers = {
  addBookToShelf,
  getBooksOfShelvesByUser,
  updateBookShelfById,
};
