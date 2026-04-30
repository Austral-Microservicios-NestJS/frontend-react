import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BotonEliminarProps {
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
  title?: string;
  disabled?: boolean;
}

export const BotonEliminar = ({
  onClick,
  size = "sm",
  className,
  title = "Eliminar",
  disabled = false,
}: BotonEliminarProps) => {
  const sizeClasses = size === "sm" ? "p-1.5" : "p-2";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={cn(
        "rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses,
        className
      )}
      title={title}
    >
      <Trash2 className={iconSize} />
    </button>
  );
};
