import { createLazyFileRoute } from "@tanstack/react-router";
import { getLeagues } from "../api/leagues";
import { useQuery } from "react-query";
import { FixedSizeList as List } from "react-window";
import CreateLeague from "../components/LeaguePage/CreateLeague";
import LeaguesRow from "../components/LeaguePage/LeaguesRow";
import { useReactQuerySubscription } from "../customHooks";
import { useTheme } from "../context/ThemeContext";
import Loader from "../components/Loader";

export const Route = createLazyFileRoute("/leagues")({
  component: Leagues,
});

function Leagues() {
  const darkTheme = useTheme();

  const query = useQuery({
    queryKey: ["leagues"],
    queryFn: ({ signal }) => getLeagues(signal),
    refetchOnMount: true,
  });

  useReactQuerySubscription();

  if (query.isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className={`px-4 py-3 rounded-xl ${
            darkTheme
              ? "bg-red-900/30 border border-red-800 text-red-300"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          Error fetching leagues
        </div>
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader styles="w-12 h-12" />
      </div>
    );
  }

  return (
    <>
      <CreateLeague />

      <div className="mx-auto max-w-4xl px-4 mt-8">
        <div
          className={`rounded-2xl overflow-hidden backdrop-blur-md border transition-all duration-300 ${
            darkTheme
              ? "bg-slate-900/60 border-linear-700/30 shadow-2xl shadow-linear-900/30"
              : "bg-white/70 border-linear-200/50 shadow-xl shadow-linear-500/10"
          }`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkTheme
                ? "bg-slate-800/80 border-linear-700/40"
                : "bg-linear-50/80 border-linear-200/60"
            }`}
          >
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              League Name
            </div>
          </div>

          <div className={`${darkTheme ? "bg-slate-900/40" : "bg-white/50"}`}>
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
