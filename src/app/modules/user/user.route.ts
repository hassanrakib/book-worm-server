import express from "express";
import { UserControllers } from "./user.controller";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validate-request";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/me", UserControllers.getMe);

router.get("/", auth(USER_ROLE.Admin), UserControllers.getUsers);

router.patch(
  "/:id/role",
  auth(USER_ROLE.Admin),
  validateRequest(UserValidations.updateUserRoleSchema),
  UserControllers.updateUserRoleById
);

export const UserRoutes = router;
