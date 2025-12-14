import { createLazyFileRoute } from "@tanstack/react-router";
import { RotatingFootballSVG } from "../components/RotatingFootballSVG";
import { useTheme } from "../context/ThemeContext";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const darkTheme = useTheme();

  return (
    <div
      className={` w-full flex flex-col items-center justify-center bg-gradient-to-br ${
        darkTheme
          ? "from-blue-950 via-slate-900 to-blue-950"
          : "from-sky-50 via-blue-50 to-sky-100"
      }`}
    >
      <h1
        className={`text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r mb-14 ${
          darkTheme
            ? "from-sky-400 via-blue-400 to-sky-400"
            : "from-sky-500 via-blue-600 to-sky-500"
        }`}
        style={{
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: "1.2",
        }}
      >
        Football Manager
      </h1>

      <div className="relative">
        <div
          className={`absolute inset-0 blur-3xl rounded-full animate-pulse ${
            darkTheme ? "bg-sky-400/20" : "bg-sky-500/30"
          }`}
        ></div>

        <RotatingFootballSVG
          size={600}
          speed="slow"
          className="relative z-10 drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
