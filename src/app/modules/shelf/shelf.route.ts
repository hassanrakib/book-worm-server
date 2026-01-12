import express from "express";
import validateRequest from "../../middlewares/validate-request";
import { ShelfValidations } from "./shelf.validation";
import { ShelfControllers } from "./shelf.controller";
import fileUpload from "../../middlewares/file-upload";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  ShelfControllers.getBooksOfShelvesByUser
);

router.post(
  "/",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  validateRequest(ShelfValidations.createShelfSchema),
  ShelfControllers.addBookToShelf
);

router.patch(
  "/:id",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  validateRequest(ShelfValidations.updateShelfSchema),
  ShelfControllers.updateBookShelfById
);

export const ShelfRoutes = router;
