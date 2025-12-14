import { createLazyFileRoute } from "@tanstack/react-router";
import { getTeams } from "../api/teams";
import { useQuery } from "react-query";
import { FixedSizeList as List } from "react-window";
import CreateTeam from "../components/TeamPage/CreateTeam";
import TeamsRow from "../components/TeamPage/TeamsRow";
import { useReactQuerySubscription } from "../hooks/useReactQuerySubscription";
import { useTheme } from "../context/ThemeContext";
import Loader from "../components/Loader";

export const Route = createLazyFileRoute("/teams")({
  component: Teams,
});

function Teams() {
  const darkTheme = useTheme();

  const query = useQuery({
    queryKey: ["teams"],
    queryFn: ({ signal }) => getTeams(signal),
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
          Error fetching teams
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
      <CreateTeam />

      <div className="mx-auto max-w-6xl px-4 mt-8">
        <div
          className={`rounded-2xl overflow-hidden backdrop-blur-md border transition-all duration-300 ${
            darkTheme
              ? "bg-slate-900/60 border-linear-700/30 shadow-2xl shadow-linear-900/30"
              : "bg-white/70 border-linear-200/50 shadow-xl shadow-linear-500/10"
          }`}
        >
          <div
            className={`grid grid-cols-3 gap-4 px-6 py-4 border-b ${
              darkTheme
                ? "bg-slate-800/80 border-linear-700/40"
                : "bg-linear-50/80 border-linear-200/60"
            }`}
          >
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              Team Name
            </div>
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              City
            </div>
            <div
              className={`text-sm font-semibold ${darkTheme ? "text-linear-200" : "text-linear-800"}`}
            >
              Founded
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
              {TeamsRow}
            </List>
          </div>
        </div>
      </div>
    </>
  );
}
