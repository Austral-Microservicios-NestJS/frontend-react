import { useState, useEffect } from "react";
import { ModalContainer } from "@/components/shared/ModalContainer";
import { ModalHeader } from "@/components/shared/ModalHeader";
import { ModalBody, ModalFooter } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Sparkles } from "lucide-react";
import type { Cliente } from "@/types/cliente.interface";

interface ContextoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
}

export const ContextoClienteModal = ({
  isOpen,
  onClose,
  cliente,
}: ContextoClienteModalProps) => {
  const [contexto, setContexto] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when modal opens/changes client
  useEffect(() => {
    if (isOpen && cliente) {
      // Aquí podrías cargar el contexto existente si lo hubiera
      setContexto("");
    }
  }, [isOpen, cliente]);

  const handleSave = async () => {
    if (!contexto.trim()) return;

    setIsSaving(true);

    // Simulación de guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(
      "Guardando contexto para cliente",
      cliente?.idCliente,
      ":",
      contexto
    );

    setIsSaving(false);
    onClose();
  };

  if (!cliente) return null;

  const nombreCliente =
    cliente.tipoPersona === "NATURAL"
      ? `${cliente.nombres} ${cliente.apellidos}`
      : cliente.razonSocial;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
        <div className="px-6">
          <ModalHeader
            title="Contexto para IA"
            description={`Agrega información relevante sobre ${nombreCliente} para mejorar las respuestas de la IA.`}
            onClose={onClose}
          />
        </div>

        <ModalBody className="p-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Por qué agregar contexto?</p>
                <p className="text-blue-700/80">
                  La información que agregues aquí ayudará a la IA a entender
                  mejor las necesidades específicas de este cliente, su
                  historial y preferencias.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contexto">Detalles y Observaciones</Label>
              <Textarea
                id="contexto"
                placeholder="Ej: El cliente prefiere ser contactado por las tardes. Tiene interés en seguros de vida para su familia. Es muy detallista con las coberturas..."
                className="min-h-[150px] resize-none focus:ring-blue-500"
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!contexto.trim() || isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            {isSaving ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Contexto
              </>
            )}
          </Button>
        </ModalFooter>
      </div>
    </ModalContainer>
  );
};
