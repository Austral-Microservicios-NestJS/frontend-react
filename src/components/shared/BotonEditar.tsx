import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface BotonEditarProps {
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
}

export const BotonEditar = ({
  onClick,
  size = "sm",
  className,
}: BotonEditarProps) => {
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
        "rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors",
        sizeClasses,
        className
      )}
      title="Editar"
    >
      <Pencil className={iconSize} />
    </button>
  );
};
