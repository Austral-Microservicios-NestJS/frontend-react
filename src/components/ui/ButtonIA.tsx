import { Sparkles } from "lucide-react";

interface ButtonIAProps {
  onClick?: () => void;
  className?: string;
}

export const ButtonIA = ({ onClick, className = "" }: ButtonIAProps) => {
  return (
    <div className={`relative group/ai ${className}`}>
      {/* Fondo Aurora - siempre visible */}
      <span
        aria-hidden
        className="absolute inset-0 aurora-bg pointer-events-none opacity-90 rounded-md"
      />

      {/* Botón principal */}
      <button
        className="relative h-8 px-3 rounded-md bg-transparent text-white hover:bg-white/10 hover:text-white border-0 flex items-center gap-1.5 font-semibold text-xs transition-transform active:scale-95"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
          console.log("Asistente IA activado");
        }}
      >
        <Sparkles className="h-3.5 w-3.5 mr-1" />
        IA
      </button>
    </div>
  );
};
