import { isStrongPassword } from "validator";
import { z } from "zod";
import { USER_ROLE } from "./user.constant";

const userRoles = Object.values(USER_ROLE) as [string, ...string[]];

const userBodySchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Name is required" : "Name is not valid",
    })
    .trim(),
  email: z
    .email({
      error: (iss) =>
        iss.input === undefined ? "Email is required" : "Email is not valid",
    })
    .trim()
    .toLowerCase(),
  password: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .min(8, "Password must be at least 8 characters long")
    .refine((password: string) => isStrongPassword(password), {
      message: "Password must be strong",
    }),
});

const updateUserRoleSchema = z.object({
  role: z.enum(userRoles, {
    error: (iss) =>
      iss.input === undefined ? "User role is required" : "Invalid user role",
  }),
});

export const UserValidations = {
  createUserSchema: z.object({
    body: userBodySchema,
  }),
  updateUserRoleSchema: z.object({
    body: updateUserRoleSchema,
  })
};
