import express from "express";
import validateRequest from "../../middlewares/validate-request";
import fileUpload from "../../middlewares/file-upload";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { TutorialControllers } from "./tutorial.controller";
import { tutorialValidationSchema } from "./tutorial.validation";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  TutorialControllers.getTutorials
);

router.post(
  "/",
  auth(USER_ROLE.Admin),
  validateRequest(tutorialValidationSchema),
  TutorialControllers.addTutorialVideo
);

export const TutorialRoutes = router;
