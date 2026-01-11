import { isStrongPassword } from "validator";
import { z } from "zod";

const categoryBodySchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Category name is required"
          : "Category name is not valid",
    })
    .trim(),
});

export const CategoryValidations = {
  createCategorySchema: z.object({
    body: categoryBodySchema,
  }),
  updateCategorySchema: z.object({
    body: categoryBodySchema.partial(),
  }),
};
