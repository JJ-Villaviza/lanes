import { z } from "zod";

export const IdSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});
