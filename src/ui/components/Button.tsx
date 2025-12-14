import React from "react";
import Loader from "./Loader";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const variantStyles = {
  primary: `
      bg-linear-500/90 backdrop-blur-sm text-white border border-linear-400/30
      hover:bg-linear-400/90 hover:shadow-lg hover:shadow-linear-500/25
      dark:bg-linear-600/80 dark:border-linear-500/30 dark:hover:bg-linear-500/80
      disabled:bg-linear-300/80 disabled:text-linear-100 disabled:border-linear-200/30
    `,
  secondary: `
      bg-linear-50 dark:bg-surface-dark-tertiary text-linear-700 dark:text-linear-300 
      border border-linear-200 dark:border-linear-700
      hover:bg-linear-100 dark:hover:bg-linear-900/50 hover:border-linear-300 dark:hover:border-linear-600
      disabled:bg-linear-50 disabled:text-linear-400
    `,
  ghost: `
      bg-transparent text-linear-600 dark:text-linear-400
      hover:bg-linear-50 dark:hover:bg-linear-900/30
      disabled:text-linear-300
    `,
  danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-400 hover:to-red-500 hover:shadow-lg
      disabled:from-red-300 disabled:to-red-400 disabled:text-red-100
    `,
};

function Button({
  type = "button",
  className = "",
  disabled = false,
  isLoading = false,
  variant = "primary",
  children,
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`
        px-4 py-2.5 rounded-xl font-medium
        transition-all duration-200 ease-out
        hover:-translate-y-0.5 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100
        focus:outline-none focus:ring-2 focus:ring-linear-400/50 focus:ring-offset-2
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="flex items-center justify-center">
          <Loader styles="!w-5 !h-5" />
        </span>
      )}
      {!isLoading && children}
    </button>
  );
}

export default Button;
