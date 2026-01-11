import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .email({
        error: (iss) =>
          iss.input === undefined ? "Email is required" : "Email is not valid",
      })
      .trim(),

    password: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(1, "Password cannot be empty"),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
};
