import { memo } from "react";
import { PopoverGroup } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import { useTheme, useThemeUpdate } from "../context/ThemeContext";
import houseChimney from "../assets/house-chimney.png";

const Header = () => {
  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();

  return (
    <header
      className={`${
        darkTheme ? "bg-gray-700 text-white" : "bg-white text-gray-900"
      } transition-colors duration-200 ease-in-out`}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4 px-8"
      >
        <div className="flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img alt="Home" src={houseChimney} className="h-8 w-auto" />
          </Link>
        </div>

        <PopoverGroup className="flex gap-x-8">
          <Link
            to="/players"
            className={`text-sm font-semibold ${
              darkTheme ? "hover:text-indigo-400" : "hover:text-indigo-600"
            } transition-colors duration-200 ease-in-out`}
          >
            Players
          </Link>
          <Link
            to="/teams"
            className={`text-sm font-semibold ${
              darkTheme ? "hover:text-indigo-400" : "hover:text-indigo-600"
            } transition-colors duration-200 ease-in-out`}
          >
            Teams
          </Link>
          <Link
            to="/leagues"
            className={`text-sm font-semibold ${
              darkTheme ? "hover:text-indigo-400" : "hover:text-indigo-600"
            } transition-colors duration-200 ease-in-out`}
          >
            Leagues
          </Link>
        </PopoverGroup>

        <div className="ml-6">
          <button
            onClick={toggleTheme}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              darkTheme
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            aria-label="Toggle Theme"
          >
            {darkTheme ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default memo(Header);
