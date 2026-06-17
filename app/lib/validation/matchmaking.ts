import { z } from "zod";

export const MatchmakingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  details: z.string().min(15, "Details must be at least 15 characters long"),
  targetSector: z.string().min(1, "Target sector is required"),
});

export type MatchmakingInput = z.infer<typeof MatchmakingSchema>;
