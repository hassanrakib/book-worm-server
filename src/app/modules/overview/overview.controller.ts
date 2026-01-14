import { makeController } from "../../utils/controller-factory";
import { OverviewServices } from "./overview.service";

const getAdminDashboardOverview = makeController({
  service: () => OverviewServices.getAdminDashboardOverview(),
  successMessage: 'Admin dashboard overview retrieved',
});

const getUserDashboardOverview = makeController({
  service: () => OverviewServices.getUserDashboardOverview(),
  successMessage: 'User dashboard overview retrieved',
});

export const OverviewControllers = {
  getAdminDashboardOverview,
  getUserDashboardOverview,
};