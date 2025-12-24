import { Plus } from "lucide-react";
import { useEffect } from "react";

interface BotonRegistroProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  shortcut?: "ctrl+enter" | "cmd+enter" | "ctrl+n" | "cmd+n";
  disabled?: boolean;
}

export const BotonRegistro = ({
  label,
  onClick,
  icon = <Plus className="w-4 h-4" />,
  shortcut = "ctrl+enter",
  disabled = false,
}: BotonRegistroProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      // Determinar qué combinación de teclas usar según el shortcut
      let shouldTrigger = false;

      if (shortcut === "ctrl+enter" || shortcut === "cmd+enter") {
        shouldTrigger = isCtrlOrCmd && event.key === "Enter";
      } else if (shortcut === "ctrl+n" || shortcut === "cmd+n") {
        shouldTrigger = isCtrlOrCmd && event.key === "n";
      }

      if (shouldTrigger) {
        event.preventDefault();
        onClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClick, shortcut, disabled]);

  // Obtener el texto del shortcut para mostrarlo
  const getShortcutText = () => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modifier = isMac ? "⌘" : "Ctrl";

    if (shortcut === "ctrl+enter" || shortcut === "cmd+enter") {
      return `${modifier} + Enter`;
    } else if (shortcut === "ctrl+n" || shortcut === "cmd+n") {
      return `${modifier} + N`;
    }
    return "";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={`${label} (${getShortcutText()})`}
      className={`
        flex items-center gap-2 px-4 py-2 bg-(--austral-azul) hover:bg-opacity-90 hover:cursor-pointer text-white text-sm 
        font-medium rounded-lg  transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        group
      `}
    >
      {icon}
      <span>{label}</span>
      <span className="hidden lg:inline-block ml-1 text-xs text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity">
        {getShortcutText()}
      </span>
    </button>
  );
};
