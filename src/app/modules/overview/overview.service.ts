import { Types } from "mongoose";
import { IRequestUser } from "../../interfaces";
import { Book } from "../book/book.model";
import { Review } from "../review/review.model";
import { Shelf } from "../shelf/shelf.model";
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

export const getUserDashboardOverview = async (user: IRequestUser) => {
  const userObjectId = new Types.ObjectId(user.userId);

  const [shelfStats, reviewStats, totalBooksInShelves] = await Promise.all([
    // 1. Aggregate stats from Shelf: Total Read count and Sum of pages
    Shelf.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          totalRead: {
            $sum: { $cond: [{ $eq: ["$shelf", "read"] }, 1, 0] },
          },
          sumPages: { $sum: { $ifNull: ["$pagesRead", 0] } },
        },
      },
    ]),

    // 2. Aggregate stats from Review: Count and Average Rating
    Review.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]),

    // 3. Simple count for all books in any shelf
    Shelf.countDocuments({ user: user.userId }),
  ]);

  // Extract values from aggregation results (or default to 0 if no data found)
  const shelfData = shelfStats[0] || { totalRead: 0, sumPages: 0 };
  const reviewData = reviewStats[0] || { count: 0, avgRating: 0 };

  return {
    totalBooksInShelves,
    totalBooksRead: shelfData.totalRead,
    totalPagesRead: shelfData.sumPages,
    totalReviewsGiven: reviewData.count,
    averageRatingGiven: Number(reviewData.avgRating.toFixed(1)),
  };
};

export const OverviewServices = {
  getAdminDashboardOverview,
  getUserDashboardOverview,
};
