import { ModalContainer } from "@/components/shared/ModalContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Cliente } from "@/types/cliente.interface";
import { useState } from "react";
import { Sparkles, X } from "lucide-react";

interface ContextoIAModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente;
}

export const ContextoIAModal = ({
  isOpen,
  onClose,
  cliente,
}: ContextoIAModalProps) => {
  const [contexto, setContexto] = useState("");

  const handleSubmit = () => {
    console.log("Enviando contexto a la IA:", contexto);
    // Aquí iría la lógica para enviar el contexto
    onClose();
  };

  const nombreCliente =
    cliente.tipoPersona === "NATURAL"
      ? `${cliente.nombres} ${cliente.apellidos}`
      : cliente.razonSocial;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header Minimalista */}
        <div className="px-8 pt-8 pb-2 flex justify-between items-start bg-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-50 rounded-lg">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 tracking-wider uppercase">
                Memoria de IA
              </span>
            </div>
            <h2 className="text-xl ml-2 text-gray-900">
              Dale mas contexto a la IA sobre{" "}
              <span className="font-semibold">{nombreCliente}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 flex-1 overflow-y-auto">
          <Textarea
            placeholder="Escribe detalles clave que la IA debe recordar sobre este cliente (ej. preferencias, situación familiar, estilo de comunicación)..."
            className="w-full min-h-[300px] resize-none border-0 bg-gray-50/50 rounded-xl p- text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-50 transition-all text-lg leading-relaxed"
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 flex justify-end items-center gap-4 bg-white">
          <span className="text-xs text-gray-400 mr-auto hidden sm:block">
            La IA usará esta información en futuras interacciones.
          </span>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 hover:bg-transparent font-normal"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#003d5c] text-white hover:bg-[#002a40] rounded-md px-4 py-3 shadow-lg shadow-gray-200 transition-all hover:shadow-xl "
          >
            Guardar Contexto
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};
