import express from "express";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../middlewares/validate-request";
import { AuthValidations } from "./auth.validation";
import { UserValidations } from "../user/user.validation";
import fileUpload from "../../middlewares/file-upload";

const router = express.Router();

router.post(
  "/register",
  fileUpload(),
  validateRequest(UserValidations.createUserSchema),
  AuthControllers.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.login
);

export const AuthRoutes = router;
