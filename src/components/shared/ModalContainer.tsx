import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  preventBackdropClose?: boolean;
}

export const ModalContainer = ({
  children,
  isOpen,
  onClose,
  onAfterClose,
  size = "md",
  preventBackdropClose = true,
}: ModalContainerProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      if (onAfterClose) {
        onAfterClose();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onAfterClose]);

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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={preventBackdropClose ? undefined : onClose}
      />

      {/* Modal Panel */}
      <div
        className={`
          ${sizeClasses[size]} w-full bg-white rounded-xl shadow-2xl
          relative z-10 transition-all duration-300 ease-out
          animate-in fade-in zoom-in-95 slide-in-from-bottom-4
        `}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};