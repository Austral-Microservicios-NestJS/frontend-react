import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/shared";
import { Label } from "@/components/ui";
import type { Observacion } from "@/types/observacion.interface";
import dayjs from "dayjs";
import {
  Flag,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";

interface ModalDetalleObservacionProps {
  isOpen: boolean;
  onClose: () => void;
  observacion: Observacion | null;
}

export const ModalDetalleObservacion = ({
  isOpen,
  onClose,
  observacion,
}: ModalDetalleObservacionProps) => {
  if (!observacion) return null;

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "CRITICA":
        return "text-red-600 bg-red-50 border-red-200";
      case "ALTA":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "MEDIA":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "BAJA":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "RESUELTO":
      case "CERRADO":
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: "text-green-600 bg-green-50",
          label: estado === "RESUELTO" ? "Resuelto" : "Cerrado",
        };
      case "EN_REVISION":
        return {
          icon: <Eye className="w-4 h-4" />,
          color: "text-blue-600 bg-blue-50",
          label: "En Revisión",
        };
      case "PENDIENTE":
        return {
          icon: <Clock className="w-4 h-4" />,
          color: "text-orange-600 bg-orange-50",
          label: "Pendiente",
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: "text-gray-600 bg-gray-50",
          label: estado,
        };
    }
  };

  const estadoInfo = getEstadoInfo(observacion.estado);

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Detalle de Observación" onClose={onClose} />
        <ModalBody>
          <div className="space-y-6">
            {/* Header con Estado y Prioridad */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${estadoInfo.color}`}
              >
                {estadoInfo.icon}
                <span>{estadoInfo.label}</span>
              </div>

              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getPrioridadColor(observacion.prioridad)}`}
              >
                <Flag className="w-4 h-4" />
                <span>Prioridad {observacion.prioridad.toLowerCase()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {dayjs(observacion.fechaCreacion).format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
            </div>

            {/* Información Principal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {observacion.asunto}
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                  Descripción
                </Label>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {observacion.descripcion}
                </p>
              </div>
            </div>

            {/* Detalles Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <Label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">
                  Categoría
                </Label>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {observacion.categoria.toLowerCase()}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <Label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">
                  Canal
                </Label>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {observacion.canal.toLowerCase()}
                  </span>
                </div>
              </div>

              {observacion.fechaResolucion && (
                <div className="bg-white p-3 rounded-lg border border-gray-100 md:col-span-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">
                    Fecha de Resolución
                  </Label>
                  <span className="text-sm font-medium text-gray-900">
                    {dayjs(observacion.fechaResolucion).format(
                      "DD/MM/YYYY HH:mm",
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Imagen de Evidencia */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase tracking-wider block">
                Evidencia Adjunta
              </Label>
              {observacion.imagenUrl ? (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/observacion/image?path=${observacion.imagenUrl}`}
                    alt="Evidencia"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-sm">Sin imagen adjunta</span>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar
          </button>
        </ModalFooter>
      </Modal>
    </ModalContainer>
  );
};
