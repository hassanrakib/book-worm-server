export interface IAdminOverview {
  totalBooks: number;
  totalUsers: number;
  pendingReviewsCount: number;
}

export interface IUserOverview {
  totalBooksInShelves: number;
  totalBooksRead: number;
  totalPagesRead: number;
  averageRatingGiven: number;
}