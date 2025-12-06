import { API_URL } from "../constants";
import {
  FinalCreateLeague,
  League,
  LeagueWithWebSocketEventId,
  UpdateLeague,
} from "./schemas";
import axios from "axios";

export const getLeagues = async (
  signal: AbortSignal | undefined
): Promise<Array<League>> =>
  axios.get(`${API_URL}/leagues`, { signal }).then((response) => response.data);

export const postLeague = async (
  newLeague: FinalCreateLeague
): Promise<LeagueWithWebSocketEventId> => {
  return axios.post(`${API_URL}/leagues`, newLeague);
};

export const deleteLeague = async (
  leagueId: string
): Promise<LeagueWithWebSocketEventId> => {
  return axios.delete(`${API_URL}/leagues/${leagueId}`);
};

export const updateLeague = async (
  leagueId: string,
  leagueChanges: UpdateLeague
): Promise<LeagueWithWebSocketEventId> => {
  return axios.patch(`${API_URL}/leagues/${leagueId}`, leagueChanges);
};
