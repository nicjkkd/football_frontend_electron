export * from "./player.schema";
export * from "./team.schema";
export * from "./league.schema";

export interface ErrorZodResponse {
  response?: {
    data?: {
      msg?: string;
    };
  };
}
