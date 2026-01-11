import { z } from "zod";

const bookBodySchema = z.object({
  title: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Book title is required"
          : "Book title must be a string",
    })
    .trim(),

  author: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Author name is required"
          : "Author name must be a string",
    })
    .trim(),

  category: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Book category is required"
          : "Book category must be a valid ID string",
    })
    .trim(),

  description: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Book description is required"
          : "Book description must be a string",
    })
    .trim(),
});

export const BookValidations = {
  createBookSchema: z.object({
    body: bookBodySchema,
  }),
  updateBookSchema: z.object({
    body: bookBodySchema.partial(),
  }),
};