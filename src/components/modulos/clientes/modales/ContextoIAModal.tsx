import { ModalContainer } from "@/components/shared/ModalContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Cliente } from "@/types/cliente.interface";
import { useState } from "react";
import { Sparkles, X, Loader2, Clock } from "lucide-react";
import { clienteService } from "@/services/cliente.service";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";

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
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { mutate: agregarContexto, isPending } =
    clienteService.useAgregarContexto();

  // Obtener contextos existentes del cliente
  const { data: contextosExistentes, isLoading: isLoadingContextos } =
    clienteService.useGetContextos(cliente.idCliente);

  const handleSubmit = () => {
    if (!contexto.trim()) {
      toast.error("Por favor escribe el contexto");
      return;
    }

    agregarContexto(
      {
        idCliente: cliente.idCliente,
        tipoContexto: "general",
        contenido: contexto.trim(),
        creadoPor: user?.idUsuario || "",
      },
      {
        onSuccess: async () => {
          toast.success("Contexto guardado correctamente");

          // Invalidar cache de contextos del cliente
          queryClient.invalidateQueries({
            queryKey: ["clientes", "contextos", cliente.idCliente],
          });

          // 🔥 Invalidar cache de insights automáticamente
          try {
            await dashboardService.invalidateCache();
            await new Promise((r) => setTimeout(r, 2000));
          } catch (error) {
            console.error("Error al invalidar cache:", error);
          }

          setContexto("");
          onClose();
        },
        onError: (error) => {
          console.error("Error al guardar contexto:", error);
          toast.error("Error al guardar el contexto");
        },
      },
    );
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
          {/* Mostrar contextos existentes */}
          {isLoadingContextos ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">
                Cargando contextos...
              </span>
            </div>
          ) : contextosExistentes && contextosExistentes.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Contextos anteriores ({contextosExistentes.length})
              </h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {contextosExistentes.map((ctx) => (
                  <div
                    key={ctx.idContexto}
                    className="bg-purple-50/50 border border-purple-100 rounded-lg p-4 hover:bg-purple-50 transition-colors"
                  >
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {ctx.contenido}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(ctx.fechaCreacion), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 my-6" />
            </div>
          ) : null}

          {/* Área de nuevo contexto */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Agregar nuevo contexto
            </h3>
            <Textarea
              placeholder="Escribe detalles clave que la IA debe recordar sobre este cliente (ej. preferencias, situación familiar, estilo de comunicación)..."
              className="w-full min-h-[200px] resize-none border-0 bg-gray-50/50 rounded-xl p-4 text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-50 transition-all text-lg leading-relaxed"
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              autoFocus
            />
          </div>
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
            disabled={isPending || !contexto.trim()}
            className="bg-[#003d5c] text-white hover:bg-[#002a40] rounded-md px-4 py-3 shadow-lg shadow-gray-200 transition-all hover:shadow-xl disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Contexto"
            )}
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};
