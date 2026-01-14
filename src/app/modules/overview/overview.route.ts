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

export const OverviewRoutes = router;
