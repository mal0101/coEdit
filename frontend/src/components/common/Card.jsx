/**
 * Card.jsx
 *
 * Description: Reusable card component for displaying content
 * in a contained box with optional header and footer.
 *
 * Props:
 *   - title (string): Card title
 *   - subtitle (string): Card subtitle
 *   - children (ReactNode): Card content
 *   - footer (ReactNode): Card footer content
 *   - hoverable (boolean): Add hover effect
 *   - clickable (boolean): Make card clickable
 *   - onClick (function): Click handler
 *
 * Usage:
 *   <Card title="My Document" hoverable>
 *     <p>Card content here</p>
 *   </Card>
 */

import PropTypes from "prop-types";

/**
 * Card component
 */
function Card({
  title,
  subtitle,
  children,
  footer,
  hoverable = false,
  clickable = false,
  onClick,
  className = "",
  padding = "normal",
}) {
  const baseClasses =
    "bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50";
  const hoverClasses =
    hoverable || clickable
      ? "hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
      : "";
  const clickableClasses = clickable ? "cursor-pointer" : "";

  const paddingClasses = {
    none: "",
    small: "p-3",
    normal: "p-4",
    large: "p-6",
  };

  // Use div instead of button to avoid nested button issues
  // Add role and keyboard accessibility for clickable cards
  const handleKeyDown = (e) => {
    if (clickable && onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div
          className={`border-b border-zinc-800/50 ${paddingClasses[padding]}`}
        >
          {title && (
            <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className={paddingClasses[padding]}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className={`border-t border-zinc-800/50 ${paddingClasses[padding]}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  padding: PropTypes.oneOf(["none", "small", "normal", "large"]),
};

export default Card;
