import { forwardRef, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Menu Dropdown component (trigger + items)
 */
function MenuDropdown({ trigger, items = [], align = "left" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger element */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 w-48 rounded-xl shadow-xl bg-zinc-900 border border-zinc-800/50 backdrop-blur-sm
            ${align === "right" ? "right-0" : "left-0"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1" role="menu">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="border-t border-zinc-800/50 my-1"
                  />
                );
              }

              return (
                <button
                  key={item.label || index}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${
                      item.danger
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100"
                    }
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                    }
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  role="menuitem"
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

MenuDropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.node,
      danger: PropTypes.bool,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
    })
  ),
  align: PropTypes.oneOf(["left", "right"]),
};

/**
 * Select Dropdown component (form element)
 */
const SelectDropdown = forwardRef(function SelectDropdown(
  {
    options = [],
    value,
    onChange,
    label,
    placeholder = "Select an option",
    error,
    disabled = false,
    className = "",
    id,
  },
  ref
) {
  const selectId =
    id || `dropdown-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-zinc-300 mb-1.5"
        >
          {label}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-3 py-2.5 border rounded-xl bg-zinc-900/50 text-zinc-100
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
          disabled:bg-zinc-800/50 disabled:cursor-not-allowed disabled:text-zinc-500
          transition-all duration-200
          ${error ? "border-red-500/50" : "border-zinc-800/50"}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
});

SelectDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

/**
 * Unified Dropdown component that detects which mode to use
 */
const Dropdown = forwardRef(function Dropdown(props, ref) {
  // If trigger prop is provided, use Menu mode
  if (props.trigger) {
    return <MenuDropdown {...props} />;
  }

  // Otherwise, use Select mode
  return <SelectDropdown {...props} ref={ref} />;
});

Dropdown.propTypes = {
  // Menu mode props
  trigger: PropTypes.node,
  items: PropTypes.array,
  align: PropTypes.oneOf(["left", "right"]),

  // Select mode props
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Dropdown;
