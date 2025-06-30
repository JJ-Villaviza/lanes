import { z } from "zod";
import { registerSchema } from "./authentication";

export const CompanySchema = registerSchema
  .pick({
    businessName: true,
    email: true,
  })
  .extend({
    description: z
      .string()
      .min(5, { message: "Description must be at least 5 characters long" })
      .max(50, { message: "Description has maximum of 50 characters long" }),
    mission: z
      .string()
      .min(5, { message: "Mission must be at least 5 characters long" })
      .max(50, { message: "Mission has maximum of 50 characters long" }),
    vision: z
      .string()
      .min(5, { message: "Vision must be at least 5 characters long" })
      .max(50, { message: "Vision has maximum of 50 characters long" }),
  })
  .partial();
