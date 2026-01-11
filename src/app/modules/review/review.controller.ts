import { IReview, TReviewStatus } from './review.interface';
import { ReviewServices } from './review.service';
import { makeController } from '../../utils/controller-factory';

const createReview = makeController<{}, IReview>({
  service: ({ body, user }) => ReviewServices.insertReviewIntoDB(user, body),
  successMessage: 'Review added successfully',
});

const getReviews = makeController<{}, {}, Record<string, unknown>>({
  service: ({ query }) => ReviewServices.retrieveReviewsFromDB(query),
  successMessage: 'Reviews retrieved successfully',
});

const getApprovedReviewsByBookId = makeController<{bookId: string}>({
  service: ({ params }) => ReviewServices.retrieveApprovedReviewsByBookId(params.bookId),
  successMessage: 'Reviews retrieved successfully',
});

const updateReviewStatusById = makeController<{ id: string }, { status: TReviewStatus}>({
  service: ({ params, body }) =>
    ReviewServices.updateReviewStatusById(params.id, body),
  successMessage: 'Review status updated successfully',
  notFound: {
    message: 'Review not found',
  },
});

const deleteReviewById = makeController<{ id: string }>({
  service: ({ params }) => ReviewServices.deleteReviewByIdFromDB(params.id),
  successMessage: 'Review deleted successfully',
  notFound: {
    message: 'Review not found',
  },
});

export const ReviewControllers = {
  createReview,
  getReviews,
  getApprovedReviewsByBookId,
  updateReviewStatusById,
  deleteReviewById,
};