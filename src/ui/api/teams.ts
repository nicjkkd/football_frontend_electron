import { API_URL } from "../constants";
import axios from "axios";
import {
  CreateTeam,
  Team,
  TeamWithWebSocketEventId,
  UpdateTeam,
} from "./schemas";

export const getTeams = async (
  signal: AbortSignal | undefined
): Promise<Array<Team>> =>
  axios.get(`${API_URL}/teams`, { signal }).then((response) => response.data);

export const postTeam = async (
  newTeam: CreateTeam
): Promise<TeamWithWebSocketEventId> => {
  return axios.post(`${API_URL}/teams`, newTeam);
};

export const deleteTeam = async (
  teamId: string
): Promise<TeamWithWebSocketEventId> => {
  return axios.delete(`${API_URL}/teams/${teamId}`);
};

export const updateTeam = async (
  teamId: string,
  teamChanges: UpdateTeam
): Promise<TeamWithWebSocketEventId> => {
  return axios.patch(`${API_URL}/teams/${teamId}`, teamChanges);
};
