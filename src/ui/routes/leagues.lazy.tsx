import { createLazyFileRoute } from "@tanstack/react-router";
import { getLeagues } from "../api/leagues";
import { useQuery } from "react-query";
import { FixedSizeList as List } from "react-window";
import CreateLeague from "../components/LeaguePage/CreateLeague";
import LeaguesRow from "../components/LeaguePage/LeaguesRow";
import { useReactQuerySubscription } from "../customHooks";

export const Route = createLazyFileRoute("/leagues")({
  component: Leagues,
});

function Leagues() {
  const query = useQuery({
    queryKey: ["leagues"],
    queryFn: ({ signal }) => getLeagues(signal),
    refetchOnMount: true,
  });

  useReactQuerySubscription();

  if (query.isError) {
    return <p>Error with fetching leagues</p>;
  }

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <CreateLeague />

      <div className="m-5">
        <div className="overflow-x-auto w-full">
          <table
            className="min-w-full table-auto border-collapse border border-gray-300"
            aria-label="Players Table"
          >
            <thead>
              <tr className="bg-gray-100 text-sm font-semibold text-gray-700">
                <th className="px-4 py-2 border-b">Leagues Name</th>
              </tr>
            </thead>
          </table>

          <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-4 ">
            <List
              className="w-full"
              height={500}
              width="100%"
              itemCount={query.data?.length || 0}
              itemData={query.data}
              itemSize={80}
            >
              {LeaguesRow}
            </List>
          </div>
        </div>
      </div>
    </>
  );
}
