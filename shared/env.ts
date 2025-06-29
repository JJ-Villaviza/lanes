import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_NAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_PORT: z.coerce.number(),
  NODE_ENV: z.string().default("development"),
  SESSION_TOKEN: z.string().default("__session"),
});

export const env = EnvSchema.parse(process.env);
