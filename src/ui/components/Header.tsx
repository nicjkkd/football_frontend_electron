import { memo } from "react";
import { PopoverGroup } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import { AiFillHome } from "react-icons/ai";
import { useTheme, useThemeUpdate } from "../context/ThemeContext";

const Header = () => {
  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ease-out ${
        darkTheme
          ? "bg-slate-900/90 border-linear-800/50 shadow-lg shadow-linear-900/20"
          : "bg-white/80 border-linear-200/60 shadow-sm shadow-linear-500/5"
      }`}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4 px-8"
      >
        <div className="flex-1">
          <Link
            to="/"
            className="group -m-1.5 p-1.5 flex items-center gap-2 hover-lift"
          >
            <div className="relative">
              <AiFillHome
                size={34}
                className={darkTheme ? "text-sky-400" : "text-sky-600"}
              />
              <div className="absolute inset-0 bg-linear-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </div>

        <PopoverGroup className="flex gap-x-1">
          {[
            { to: "/players", label: "Players" },
            { to: "/teams", label: "Teams" },
            { to: "/leagues", label: "Leagues" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-out
                ${
                  darkTheme
                    ? "text-linear-100 hover:text-white hover:bg-linear-600/20"
                    : "text-linear-700 hover:text-linear-900 hover:bg-linear-50"
                }
                group
              `}
            >
              {link.label}
              <span
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full transition-all duration-200 ease-out group-hover:w-6
                  ${darkTheme ? "bg-linear-400" : "bg-linear-500"}
                `}
              />
            </Link>
          ))}
        </PopoverGroup>

        <div className="ml-6">
          <button
            onClick={toggleTheme}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover-lift active-press
              ${
                darkTheme
                  ? "bg-surface-dark-tertiary text-linear-300 hover:bg-linear-900/50 border border-linear-700/50"
                  : "bg-linear-50 text-linear-700 hover:bg-linear-100 border border-linear-200"
              }
            `}
            aria-label="Toggle Theme"
          >
            <span className="relative w-4 h-4">
              <svg
                className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${darkTheme ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${darkTheme ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </span>
            <span className="hidden sm:inline">
              {darkTheme ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default memo(Header);
