import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> {
  // Custom props
  label?: string;
  error?: string;
  helperText?: string;

  // Class name overrides
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;

  // Optional props that we want to explicitly type
  required?: boolean;
  disabled?: boolean;
}

type InputRef = HTMLInputElement;

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      // Destructure props with defaults
      label,
      error,
      id,
      name,
      type = "text",
      placeholder,
      disabled = false,
      required = false,
      className = "",
      labelClassName = "",
      inputClassName = "",
      errorClassName = "",
      ...props
    },
    ref
  ) => {
    const placeholderClasses = error
      ? "placeholder:text-red-400 dark:placeholder:text-red-500"
      : "placeholder:text-linear-400 dark:placeholder:text-linear-500";

    const baseInputClasses = `
      w-full px-4 py-3 
      bg-white/80 dark:bg-surface-dark-tertiary/80
      backdrop-blur-sm
      border rounded-xl
      text-linear-900 dark:text-linear-100
      ${placeholderClasses}
      shadow-sm
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-1
    `;

    // Dynamic input classes based on state
    const stateClasses = error
      ? "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-400/30 dark:focus:ring-red-500/30"
      : "border-linear-200 dark:border-linear-700 focus:border-linear-400 dark:focus:border-linear-500 focus:ring-linear-400/30 dark:focus:ring-linear-500/30 hover:border-linear-300 dark:hover:border-linear-600 hover:shadow-linear";

    // Disabled classes
    const disabledClasses = disabled
      ? "bg-linear-50 dark:bg-surface-dark-primary cursor-not-allowed text-linear-400 dark:text-linear-600 opacity-60"
      : "";

    return (
      <div className={`w-full space-y-2 ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium text-linear-700 dark:text-linear-300 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`${baseInputClasses} ${stateClasses} ${disabledClasses} ${inputClassName}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        {error && (
          <div
            id={`${id}-error`}
            role="alert"
            className={`flex items-center gap-1.5 animate-slide-down ${errorClassName}`}
          >
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-red-500 font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
