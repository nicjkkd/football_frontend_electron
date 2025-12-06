import { z } from "zod";

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const PositionSchema = z.enum([
  "BENCH",
  "GK",
  "SW",
  "LB",
  "LCB",
  "CB",
  "RCB",
  "RB",
  "LWB",
  "LDM",
  "CDM",
  "RDM",
  "RWB",
  "LM",
  "LCM",
  "CM",
  "RCM",
  "RM",
  "LW",
  "LAM",
  "CAM",
  "RAM",
  "RW",
  "LS",
  "CS",
  "RS",
]);

export type PositionType = z.infer<typeof PositionSchema>;

/////////////////////////////////////////
// PLAYER SCHEMA
/////////////////////////////////////////

export const PlayerSchema = z.object({
  position: PositionSchema.nullable(),
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateBirth: z.coerce.date().nullable(),
  playerNumber: z.number().int().nullable(),
  teamId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Player = z.infer<typeof PlayerSchema>;

/////////////////////////////////////////
// TEAM SCHEMA
/////////////////////////////////////////

export const TeamSchema = z.object({
  id: z.string(),
  teamName: z.string(),
  city: z.string(),
  since: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Team = z.infer<typeof TeamSchema>;

/////////////////////////////////////////
// LEAGUE SCHEMA
/////////////////////////////////////////

export const LeagueSchema = z.object({
  id: z.string(),
  leagueName: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type League = z.infer<typeof LeagueSchema>;

/////////////////////////////////////////
// EXTENDED TYPES (with relations)
/////////////////////////////////////////

export const TeamWithPlayersSchema = TeamSchema.extend({
  players: z.array(PlayerSchema).optional(),
});

export type TeamWithPlayers = z.infer<typeof TeamWithPlayersSchema>;

export const TeamWithLeaguesSchema = TeamSchema.extend({
  leagues: z.array(LeagueSchema).optional(),
});

export type TeamWithLeagues = z.infer<typeof TeamWithLeaguesSchema>;

export const LeagueWithTeamsSchema = LeagueSchema.extend({
  teams: z.array(TeamSchema).optional(),
});

export type LeagueWithTeams = z.infer<typeof LeagueWithTeamsSchema>;

export const PlayerWithTeamSchema = PlayerSchema.extend({
  Team: TeamSchema.nullable().optional(),
});

export type PlayerWithTeam = z.infer<typeof PlayerWithTeamSchema>;
