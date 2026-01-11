import express from "express";
import { UserControllers } from "./user.controller";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validate-request";
import { UserValidations } from "./user.validation";

const router = express.Router();

router.get("/me", UserControllers.getMe);

router.get("/", UserControllers.getUsers);

router.patch(
  "/:id/role",
  validateRequest(UserValidations.updateUserRoleSchema),
  UserControllers.updateUserRoleById
);

export const UserRoutes = router;
