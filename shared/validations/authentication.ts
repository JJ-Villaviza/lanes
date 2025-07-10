import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, { message: "Name has maximum of 30 characters long" }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, { message: "Username has maximum of 30 characters long" }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(30, { message: "Password has maximum of 30 characters long" }),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
