import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
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
    // Base input classes
    const baseInputClasses =
      "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

    // Dynamic input classes based on state
    const stateClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    // Disabled classes
    const disabledClasses = disabled
      ? "bg-gray-100 cursor-not-allowed text-gray-500 opacity-50"
      : "";

    return (
      <div className={`w-full space-y-2 ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
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

        {/* Error message */}
        {error && (
          <div
            id={`${id}-error`}
            role="alert"
            className={`flex items-center space-x-1 ${errorClassName}`}
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
            <span className="text-sm text-red-500">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
