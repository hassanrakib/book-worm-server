import { z } from "zod";

const reviewBodySchema = z.object({
  book: z.string({
    error: (iss) =>
      iss.input === undefined
        ? "Book ID is required"
        : "Book ID must be a valid ID string",
  }),

  rating: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Rating is required"
          : "Rating must be a number",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Comment is required"
          : "Comment must be a string",
    })
    .trim()
    .min(1, "Comment cannot be empty"),
});

const updateReviewStatusSchema = z.object({
  status: z
    .enum(["pending", "approved"], {
      error: (iss) =>
        iss.input === undefined
          ? "Status is required"
          : "Status must be either 'pending' or 'approved'",
    })
    .default("pending"),
});

export const ReviewValidations = {
  createReviewSchema: z.object({
    body: reviewBodySchema,
  }),
  updateReviewStatusSchema: z.object({
    body: updateReviewStatusSchema.partial(),
  }),
};
