import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  description?: string;
}

export const ModalHeader = ({ title, onClose, description }: ModalHeaderProps) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-200">
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
        aria-label="Cerrar modal"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};