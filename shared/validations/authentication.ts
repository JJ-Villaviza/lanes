import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, { message: "Name must be at least 30 characters long" }),
  businessName: z
    .string()
    .min(3, "Business name must be at least 3 characters long")
    .max(30, { message: "Business name must be at least 30 characters long" }),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, { message: "Username must be at least 30 characters long" }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(30, { message: "Password must be at least 30 characters long" }),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
