import { z } from "zod";

export const companySchema = z.object({
  businessName: z
    .string()
    .min(3, "Business name must be at least 3 characters long")
    .max(30, { message: "Business name  has maximum of 30 characters long" }),
  email: z.string().email("Invalid email address"),
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
});

export const updateCompanySchema = companySchema.partial();
