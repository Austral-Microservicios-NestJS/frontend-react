//Este componente es utilizado en los modales de registro
import { Save } from "lucide-react";

interface Props {
  onClose: () => void;
  isSubmitting: boolean;
  label?: string;
  loading?: string;
  variant?: "amber" | "green" | "red" | "orange" | "blue";
  children?: React.ReactNode;
}

export const SubmitButtons = ({
  onClose,
  isSubmitting,
  label = "Guardar",
  loading = "Guardando...",
  variant = "blue",
  children,
}: Props) => {
  const variantStyles = {
    amber: "bg-amber-800 hover:bg-amber-900",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    blue: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
      <div>
        {/* Para incluir botones de regresar en formularios multi-step*/}
        {children}
      </div>
      <div className="flex flex-row justify-end gap-4">
        <button
          type="button"
          className="bg-slate-200 text-slate-500 text-sm font-medium py-2 px-4 md:py-3 md:px-6 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${variantStyles[variant]} text-white py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Save size={18} />
            {isSubmitting ? loading : label}
          </span>
        </button>
      </div>
    </div>
  );
};
