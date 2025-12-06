import axios from "axios";
import { API_URL } from "../constants";
import {
  CreatePlayer,
  Player,
  PlayerWithWebSocketEventId,
  UpdatePlayer,
} from "./schemas";

export const getPlayers = async (
  signal: AbortSignal | undefined
): Promise<Array<Player>> =>
  axios.get(`${API_URL}/players`, { signal }).then((response) => response.data);

export const postPlayer = async (
  newPlayer: CreatePlayer
): Promise<PlayerWithWebSocketEventId> => {
  return axios.post(`${API_URL}/players`, newPlayer);
};

export const deletePlayer = async (
  playerId: string
): Promise<PlayerWithWebSocketEventId> => {
  return axios.delete(`${API_URL}/players/${playerId}`);
};

export const updatePlayer = async (
  playerId: string,
  playerChanges: UpdatePlayer
): Promise<PlayerWithWebSocketEventId> => {
  return axios.patch(`${API_URL}/players/${playerId}`, playerChanges);
};
