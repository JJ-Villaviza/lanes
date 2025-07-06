import { z } from "zod";
import { loginSchema, registerSchema } from "../validations/authentication";

export type InferLoginSchema = z.infer<typeof loginSchema>;
export type InferRegisterSchema = z.infer<typeof registerSchema>;
