import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  preventBackdropClose?: boolean;
  position?: "center" | "right" | "left";
  panelClassName?: string;
  containerClassName?: string;
}

export const ModalContainer = ({
  children,
  isOpen,
  onClose,
  onAfterClose,
  size = "md",
  preventBackdropClose = true,
  position = "center",
  panelClassName = "",
  containerClassName = "",
}: ModalContainerProps) => {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      return;
    }

    if (!shouldRender) return;

    setIsClosing(true);
    const timeout = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      if (onAfterClose) {
        onAfterClose();
      }
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [isOpen, onAfterClose, shouldRender]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  const positionClasses = {
    center: "items-center justify-center p-4",
    right: "items-stretch justify-end p-0",
    left: "items-stretch justify-start p-0",
  };

  const animationClasses = {
    center: {
      open: "animate-in fade-in zoom-in-95 slide-in-from-bottom-4",
      close: "animate-out fade-out zoom-out-95 slide-out-to-bottom-4",
    },
    right: {
      open: "animate-in fade-in slide-in-from-right-4",
      close: "animate-out fade-out slide-out-to-right-4",
    },
    left: {
      open: "animate-in fade-in slide-in-from-left-4",
      close: "animate-out fade-out slide-out-to-left-4",
    },
  };

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (position === "center" && (isOpen || isClosing)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isClosing, position]);

  // Manejar escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex ${positionClasses[position]} ${
        position !== "center" ? "pointer-events-none" : ""
      } ${containerClassName}`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${
          position === "center"
            ? "bg-black/30 backdrop-blur-xs"
            : "bg-transparent pointer-events-none"
        }`}
        onClick={preventBackdropClose ? undefined : onClose}
      />

      {/* Modal Panel */}
      <div
        className={`
          ${sizeClasses[size]} w-full bg-white shadow-2xl
          relative z-10 transition-all duration-300 ease-out
          ${position === "center" ? "rounded-xl" : "h-full rounded-none"}
          ${isClosing ? animationClasses[position].close : animationClasses[position].open}
          pointer-events-auto
          ${panelClassName}
        `}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
