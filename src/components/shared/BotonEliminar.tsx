import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BotonEliminarProps {
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
}

export const BotonEliminar = ({
  onClick,
  size = "sm",
  className,
}: BotonEliminarProps) => {
  const sizeClasses = size === "sm" ? "p-1.5" : "p-2";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors",
        sizeClasses,
        className
      )}
      title="Eliminar"
    >
      <Trash2 className={iconSize} />
    </button>
  );
};
