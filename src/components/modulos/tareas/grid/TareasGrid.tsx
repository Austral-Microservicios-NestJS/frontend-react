import { Grid, BotonEditar, BotonEliminar } from "@/components/shared";
import type { Tarea } from "@/types/tarea.interface";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Flag,
} from "lucide-react";

interface Props {
  tareas: Tarea[];
  onEdit?: (tarea: Tarea) => void;
  onDelete?: (tarea: Tarea) => void;
}

export const TareasGrid = ({ tareas, onEdit, onDelete }: Props) => {
  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIA":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "BAJA":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case "COMPLETADA":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "bg-green-100 text-green-800",
          label: "Completada",
        };
      case "EN_PROGRESO":
        return {
          icon: <Loader2 className="w-5 h-5" />,
          color: "bg-blue-100 text-blue-800",
          label: "En Progreso",
        };
      case "PENDIENTE":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "bg-gray-100 text-gray-800",
          label: "Pendiente",
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: "bg-gray-100 text-gray-800",
          label: estado,
        };
    }
  };

  const getTipoTareaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      RECLAMO: "Reclamo",
      POLIZA: "Póliza",
      PAGO: "Pago",
      INSPECCION: "Inspección",
      OTRO: "Otro",
    };
    return labels[tipo] || tipo;
  };

  const isVencida = (fechaVencimiento: string) => {
    return new Date(fechaVencimiento) < new Date();
  };

  return (
    <Grid
      data={tareas}
      renderItem={(tarea) => {
        const estadoConfig = getEstadoConfig(tarea.estado);
        const vencida = isVencida(tarea.fechaVencimiento);

        return (
          <div className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200 relative">
            {/* Botones de acción - visibles en hover */}
            {(onEdit || onDelete) && (
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && <BotonEditar onClick={() => onEdit(tarea)} />}
                {onDelete && <BotonEliminar onClick={() => onDelete(tarea)} />}
              </div>
            )}

            {/* Header con tipo y prioridad */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-16">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {tarea.asunto}
                </h3>
                <span className="text-xs text-gray-500">
                  {getTipoTareaLabel(tarea.tipoTarea)}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(
                  tarea.prioridad
                )}`}
              >
                <Flag className="w-3 h-3" />
                {tarea.prioridad}
              </div>
            </div>

            {/* Descripción */}
            {tarea.descripcion && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {tarea.descripcion}
              </p>
            )}

            {/* Fecha de vencimiento */}
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span
                className={`text-sm ${
                  vencida && tarea.estado !== "COMPLETADA"
                    ? "text-red-600 font-semibold"
                    : "text-gray-600"
                }`}
              >
                Vence:{" "}
                {new Date(tarea.fechaVencimiento).toLocaleDateString("es-PE")}
                {vencida && tarea.estado !== "COMPLETADA" && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                    Vencida
                  </span>
                )}
              </span>
            </div>

            {/* Estado */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${estadoConfig.color}`}
              >
                {estadoConfig.icon}
                {estadoConfig.label}
              </div>

              <div className="text-xs text-gray-400">
                {new Date(tarea.fechaCreacion).toLocaleDateString("es-PE")}
              </div>
            </div>
          </div>
        );
      }}
      columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
      pageSize={20}
      pageSizeOptions={[10, 20, 50]}
    />
  );
};
