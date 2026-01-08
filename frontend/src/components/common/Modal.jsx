/**
 * Modal.jsx
 *
 * Description: Reusable modal/dialog component with backdrop,
 * close button, and customizable content.
 *
 * Props:
 *   - isOpen (boolean): Controls modal visibility
 *   - onClose (function): Called when modal should close
 *   - title (string): Modal title
 *   - children (ReactNode): Modal content
 *   - size (string): 'sm' | 'md' | 'lg' | 'xl'
 *   - showCloseButton (boolean): Show X button
 *
 * Usage:
 *   <Modal isOpen={isOpen} onClose={handleClose} title="Confirm">
 *     <p>Are you sure?</p>
 *   </Modal>
 */

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

/**
 * Modal component
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  footer,
  className = "",
}) {
  // Handle escape key
  const handleEscapeKey = useCallback(
    (event) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-4xl",
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={`
          relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 w-full
          transform transition-all animate-fadeIn
          ${sizeClasses[size] || sizeClasses.md}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-zinc-100"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg
                         hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 text-zinc-300">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-zinc-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "2xl", "full"]),
  showCloseButton: PropTypes.bool,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Modal;
