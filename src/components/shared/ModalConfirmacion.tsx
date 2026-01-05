import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/shared";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ModalConfirmacion = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isLoading = false,
}: ModalConfirmacionProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="sm">
      <Modal>
        <ModalHeader title={title} onClose={onClose} />

        <ModalBody>
          <p className="text-gray-600">{message}</p>
        </ModalBody>

        <div className="flex flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {isLoading ? "Eliminando..." : confirmText}
          </button>
        </div>
      </Modal>
    </ModalContainer>
  );
};
