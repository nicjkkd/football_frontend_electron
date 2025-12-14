import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "react-query";
import { getPlayers } from "../api/players";
import { FixedSizeList as List } from "react-window";
import CreatePlayer from "../components/PlayerPage/CreatePlayer";
import { getTeams } from "../api/teams";
import { useMemo } from "react";
import { Team } from "../api/schemas";
import PlayersRow from "../components/PlayerPage/PlayersRow";
import { useReactQuerySubscription } from "../hooks/useReactQuerySubscription";
import { useTheme } from "../context/ThemeContext";
import Loader from "../components/Loader";

export const Route = createLazyFileRoute("/players")({
  component: Players,
});

function Players() {
  const darkTheme = useTheme();

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: ({ signal }) => getPlayers(signal),
    refetchOnMount: false,
  });

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: ({ signal }) => getTeams(signal),
    refetchOnMount: false,
  });

  useReactQuerySubscription();

  const teamMapById = useMemo<Record<string, Team | undefined>>(() => {
    const teamMap: Record<string, Team | undefined> = {};
    teamsQuery.data?.forEach((team) => {
      teamMap[team.id] = team;
    });
    return teamMap;
  }, [teamsQuery.data]);

  const playersDataWithTeamName = useMemo(() => {
    const playersArrayWithTeamName = playersQuery.data?.map((player) => {
      const teamId = player.teamId || "";
      return {
        ...player,
        playerTeamName: teamMapById[teamId]?.teamName,
      };
    });
    return playersArrayWithTeamName;
  }, [teamsQuery.data, playersQuery.data]);

  if (playersQuery.isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className={`px-4 py-3 rounded-xl ${
            darkTheme
              ? "bg-red-900/30 border border-red-800 text-red-300"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          Error fetching players
        </div>
      </div>
    );
  }

  if (playersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader styles="w-12 h-12" />
      </div>
    );
  }

  return (
    <>
      <CreatePlayer />

      <div className="mx-auto max-w-7xl px-4 mt-8">
        <div
          className={`rounded-2xl overflow-hidden backdrop-blur-md border transition-all duration-300 ${
            darkTheme
              ? "bg-slate-900/60 border-linear-700/30 shadow-2xl shadow-linear-900/30"
              : "bg-white/70 border-linear-200/50 shadow-xl shadow-linear-500/10"
          }`}
        >
          <div
            className={`grid grid-cols-6 gap-4 px-6 py-4 border-b ${
              darkTheme
                ? "bg-slate-800/80 border-linear-700/40"
                : "bg-linear-50/80 border-linear-200/60"
            }`}
          >
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              First Name
            </div>
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              Last Name
            </div>
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              Birth Date
            </div>
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              Position
            </div>
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              Player Number
            </div>
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              Team
            </div>
          </div>

          <div className={`${darkTheme ? "bg-slate-900/40" : "bg-white/50"}`}>
            <List
              className="w-full"
              height={500}
              width="100%"
              itemCount={playersDataWithTeamName?.length || 0}
              itemData={playersDataWithTeamName}
              itemSize={80}
            >
              {PlayersRow}
            </List>
          </div>
        </div>
      </div>
    </>
  );
}
