import { registerSchema } from "./authentication";

export const branchAddSchema = registerSchema.omit({
  businessName: true,
  email: true,
});

export const branchUpdateSchema = branchAddSchema
  .omit({ password: true })
  .partial();

export const branchPasswordUpdateSchema = registerSchema.pick({
  password: true,
});
