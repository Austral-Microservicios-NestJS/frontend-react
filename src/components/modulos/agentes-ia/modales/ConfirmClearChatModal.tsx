import { ModalContainer } from "@/components/shared/ModalContainer";
import { ModalHeader } from "@/components/shared/ModalHeader";
import { ModalBody, ModalFooter } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface ConfirmClearChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmClearChatModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmClearChatModalProps) => {
  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="sm">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="px-6">
          <ModalHeader
            title="Limpiar conversación"
            onClose={onClose}
          />
        </div>
        
        <ModalBody className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 rounded-full shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                ¿Estás seguro?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Esta acción eliminará todo el historial de mensajes de esta conversación. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Sí, limpiar chat
          </Button>
        </ModalFooter>
      </div>
    </ModalContainer>
  );
};
