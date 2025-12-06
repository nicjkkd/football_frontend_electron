import React from "react";
import Loader from "./Loader";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

function Button({
  type = "button",
  className = "",
  disabled = false,
  isLoading = false,
  children,
  ...props
}: Props) {
  return (
    <button type={type} className={className} disabled={disabled} {...props}>
      {isLoading && <Loader styles="flex items-center justify-center" />}
      {!isLoading && children}
    </button>
  );
}

export default Button;
