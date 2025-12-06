import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "react-query";
import { getPlayers } from "../api/players";
import { FixedSizeList as List } from "react-window";
import CreatePlayer from "../components/PlayerPage/CreatePlayer";
import { getTeams } from "../api/teams";
import { useMemo } from "react";
import { Team } from "../api/schemas";
import PlayersRow from "../components/PlayerPage/PlayersRow";
import { useReactQuerySubscription } from "../customHooks";

export const Route = createLazyFileRoute("/players")({
  component: Players,
});

function Players() {
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
    return <p>Error with fetching players</p>;
  }

  if (playersQuery.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CreatePlayer />

      <div className="m-5">
        <div className="overflow-x-auto w-full">
          <table
            className="min-w-full table-auto border-collapse border border-gray-300"
            aria-label="Players Table"
          >
            <thead>
              <tr className="bg-gray-100 text-sm font-semibold text-gray-700">
                <th className="px-4 py-2 border-b">First Name</th>
                <th className="px-4 py-2 border-b">Last Name</th>
                <th className="px-4 py-2 border-b">Date of Birth</th>
                <th className="px-4 py-2 border-b">Position</th>
                <th className="px-4 py-2 border-b">Player Number</th>
                <th className="px-4 py-2 border-b">Player Team</th>
              </tr>
            </thead>
          </table>

          <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-4 ">
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
