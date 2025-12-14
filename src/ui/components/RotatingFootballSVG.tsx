import { IoFootballOutline } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

interface RotatingFootballSVGProps {
  size: number;
  speed: "slow" | "normal" | "fast";
  className?: string;
}

const animationClasses = {
  slow: "animate-spin-slow",
  normal: "animate-spin",
  fast: "animate-spin-fast",
};

export const RotatingFootballSVG = ({
  size,
  speed,
  className = "",
}: RotatingFootballSVGProps) => {
  const darkTheme = useTheme();
  const animationClass = animationClasses[speed];

  return (
    <IoFootballOutline
      size={size}
      className={`${animationClass} ${className} ${darkTheme ? "text-sky-400" : "text-sky-600"}`}
    />
  );
};
