import express from "express";
import validateRequest from "../../middlewares/validate-request";
import { BookValidations } from "./book.validation";
import { BookControllers } from "./book.controller";
import fileUpload from "../../middlewares/file-upload";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  BookControllers.getBooks
);

router.get(
  "/recommended",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  BookControllers.getRecommendedBooksForUser
);

router.get(
  "/:id",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  BookControllers.getBookById
);

router.post(
  "/",
  auth(USER_ROLE.Admin),
  fileUpload(),
  validateRequest(BookValidations.createBookSchema),
  BookControllers.createBook
);

router.patch(
  "/:id",
  auth(USER_ROLE.Admin),
  fileUpload(),
  validateRequest(BookValidations.updateBookSchema),
  BookControllers.updateBookById
);

router.delete("/:id", auth(USER_ROLE.Admin), BookControllers.deleteBookById);

export const BookRoutes = router;
