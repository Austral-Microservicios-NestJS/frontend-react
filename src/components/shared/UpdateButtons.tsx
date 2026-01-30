import { Save } from "lucide-react";

interface Props {
  onClose: () => void;
  isSubmitting: boolean;
  isDirty?: boolean;
  children?: React.ReactNode;
}

export const UpdateButtons = ({
  onClose,
  isSubmitting,
  isDirty = true,
  children,
}: Props) => {
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
          disabled={isSubmitting || !isDirty}
          className="bg-green-500 text-white text-sm font-medium py-2 px-4 md:py-3 md:px-6 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Save size={18} />
            {isSubmitting ? "Actualizando..." : "Actualizar"}
          </span>
        </button>
      </div>
    </div>
  );
};
