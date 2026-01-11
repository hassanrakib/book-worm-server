import express from "express";
import validateRequest from "../../middlewares/validate-request";
import { ReviewValidations } from "./review.validation";
import { ReviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get("/", auth(USER_ROLE.Admin), ReviewControllers.getReviews);

router.get(
  "/:bookId",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  ReviewControllers.getApprovedReviewsByBookId
);

router.post(
  "/",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  validateRequest(ReviewValidations.createReviewSchema),
  ReviewControllers.createReview
);

router.patch(
  "/:id/status",
  auth(USER_ROLE.Admin),
  validateRequest(ReviewValidations.updateReviewStatusSchema),
  ReviewControllers.updateReviewStatusById
);

router.delete(
  "/:id",
  auth(USER_ROLE.Admin),
  ReviewControllers.deleteReviewById
);

export const ReviewRoutes = router;
