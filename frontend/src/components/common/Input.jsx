import { forwardRef } from "react";
import PropTypes from "prop-types";

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon,
    iconPosition = "left",
    fullWidth = true,
    className = "",
    id,
    type = "text",
    ...props
  },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  const baseInputClasses = `
    w-full px-4 py-3 border rounded-xl bg-zinc-900/50 text-zinc-100
    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
    disabled:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-500
    placeholder:text-zinc-500 transition-all duration-300
  `;

  const errorClasses = error
    ? "border-red-500/50 focus:ring-red-500/50"
    : "border-zinc-700/50";

  const iconPaddingClasses = icon
    ? iconPosition === "left"
      ? "pl-10"
      : "pr-10"
    : "";

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            ${baseInputClasses}
            ${errorClasses}
            ${iconPaddingClasses}
            ${className}
          `
            .trim()
            .replace(/\s+/g, " ")}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
};

export default Input;
