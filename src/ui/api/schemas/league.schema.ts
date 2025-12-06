import { League, Team } from "../generated/zod";
import { z } from "zod";

export const UpdateLeagueSchema = z.object({
  id: z.string().optional(),
  leagueName: z
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" })
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type UpdateLeague = z.infer<typeof UpdateLeagueSchema>;

export const CreateLeagueSchema = z.object({
  leagueName: z
    .string()
    .min(2, { message: "Field must contain more than 2 characters" })
    .max(100, { message: "Field must contain less than 100 characters" }),
  teamIdToAdd: z
    .array(
      z
        .string()
        .min(2, { message: "Each team ID must be at least 2 characters long" })
    )
    .optional(),
});

export type CreateLeague = z.infer<typeof CreateLeagueSchema>;

export const FinalCreateLeagueSchema = z.object({
  teamsIdToAdd: z.array(z.string()).optional(),
  league: CreateLeagueSchema,
});

export type FinalCreateLeague = z.infer<typeof FinalCreateLeagueSchema>;

export type { League };

export type ServerCreateLeagueResponseWithQueryParamsAndWebSocketEventId =
  Team[] & League & { eventId: string };

export type LeagueWithWebSocketEventId = League & { eventId: string };
