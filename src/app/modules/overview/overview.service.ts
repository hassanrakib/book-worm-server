import { Book } from "../book/book.model";
import { Review } from "../review/review.model";
import { User } from "../user/user.model";

const getAdminDashboardOverview = async () => {
  const [totalBooks, totalUsers, pendingReviewsCount] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments(),
    Review.countDocuments({ status: "pending" }),
  ]);

  return {
    totalBooks,
    totalUsers,
    pendingReviewsCount,
  };
};

export const OverviewServices = {
  getAdminDashboardOverview,
};
