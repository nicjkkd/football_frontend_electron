import { Player, UpdateLeague, UpdatePlayer, UpdateTeam } from "./api/schemas";

export interface SelectOptionsType {
  value: string;
  label: string;
}

export type PlayerWithTeamName = Player & {
  playerTeamName: string | undefined;
};

export interface UpdatePlayerProps {
  playerId: string;
  playerChanges: UpdatePlayer;
}

export interface UpdateTeamProps {
  teamId: string;
  teamChanges: UpdateTeam;
}

export interface UpdateLeagueProps {
  leagueId: string;
  leagueChanges: UpdateLeague;
}

enum OperationTypes {
  invalidate = "invalidate",
  create = "create",
  delete = "delete",
  update = "update",
}
export type WebSocketEvent = {
  operation: OperationTypes;
  entity: Array<string>;
  id?: number;
  data?: Record<string, string>;
};
