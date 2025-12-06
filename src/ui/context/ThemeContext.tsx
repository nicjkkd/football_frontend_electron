import { createContext, useContext, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<boolean>(false);
const ThemeUpdateContext = createContext<() => void>(() => {
  console.warn(
    "toggleTheme function is not provided. Make sure to wrap your component with ThemeProvider."
  );
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const useThemeUpdate = () => {
  return useContext(ThemeUpdateContext);
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => {
    setDarkTheme((prevDarkThemeState) => !prevDarkThemeState);
  };

  return (
    <ThemeContext.Provider value={darkTheme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};
