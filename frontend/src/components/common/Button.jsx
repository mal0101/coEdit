import PropTypes from "prop-types";
import Spinner from "./Spinner";

function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  children,
  className = "",
  type = "button",
  ...props
}) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl cursor-pointer
    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary:
      "bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-cyan-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40",
    secondary:
      "bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 focus:ring-zinc-500",
    danger:
      "bg-red-600/90 text-white hover:bg-red-500 focus:ring-red-500 shadow-lg shadow-red-500/20",
    ghost:
      "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus:ring-zinc-500",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500 shadow-lg shadow-emerald-500/20",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const isDisabled = disabled || loading;

  return (
    <button type={type} className={classes} disabled={isDisabled} {...props}>
      {loading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "ghost",
    "success",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  fullWidth: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;
