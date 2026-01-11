import { z } from "zod";

const shelfBodySchema = z.object({
  book: z.string({
    error: (iss) =>
      iss.input === undefined
        ? "Book ID is required"
        : "Book ID must be a valid ID string",
  }),
});

const updateShelfSchema = z.object({
  shelf: z.enum(["want_to_read", "currently_reading", "read"], {
    error: (iss) =>
      iss.input === undefined
        ? "Shelf type is required"
        : "Shelf must be 'want_to_read', 'currently_reading', or 'read'",
  }),
  pagesRead: z
    .number({
      error: (iss) =>
        iss.input !== undefined ? "Pages read must be a number" : "",
    })
    .min(0, "Pages read cannot be negative")
    .optional()
});

export const ShelfValidations = {
  createShelfSchema: z.object({
    body: shelfBodySchema,
  }),
  updateShelfSchema: z.object({
    body: updateShelfSchema.partial(),
  }),
};
