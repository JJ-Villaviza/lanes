import { registerSchema } from "./authentication";

export const branchUpdateSchema = registerSchema
  .omit({ password: true })
  .partial();

export const branchPasswordUpdateSchema = registerSchema.pick({
  password: true,
});
