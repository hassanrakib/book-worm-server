import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { OverviewControllers } from "./overview.controller";

const router = express.Router();

router.get(
  "/admin",
  auth(USER_ROLE.Admin),
  OverviewControllers.getAdminDashboardOverview
);

router.get(
  "/user",
  auth(USER_ROLE.User),
  OverviewControllers.getUserDashboardOverview
);

export const OverviewRoutes = router;
