import { Grid, BotonEditar, BotonEliminar } from "@/components/shared";
import {
  type Gestion,
  GestionEstado,
  GestionPrioridad,
  GestionTipo,
} from "../gestion-comercial.types";
import {
  Calendar,
  Phone,
  Users,
  RefreshCw,
  ShieldAlert,
  HelpCircle,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flag,
  Wifi,
  MapPin,
  MonitorSmartphone,
} from "lucide-react";

interface Props {
  gestiones: Gestion[];
  onEdit?: (gestion: Gestion) => void;
  onDelete?: (gestion: Gestion) => void;
}

export const GestionesGrid = ({ gestiones, onEdit, onDelete }: Props) => {
  const getPrioridadStyle = (prioridad: GestionPrioridad) => {
    switch (prioridad) {
      case GestionPrioridad.ALTA:
        return "bg-red-100 text-red-700 border-red-200";
      case GestionPrioridad.MEDIA:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case GestionPrioridad.BAJA:
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getEstadoConfig = (estado: GestionEstado) => {
    switch (estado) {
      case GestionEstado.PENDIENTE:
        return {
          icon: <Clock className="w-4 h-4" />,
          style: "bg-blue-100 text-blue-700",
        };
      case GestionEstado.COMPLETADO:
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          style: "bg-green-100 text-green-700",
        };
      case GestionEstado.VENCIDO:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          style: "bg-orange-100 text-orange-700",
        };
      case GestionEstado.CANCELADO:
        return {
          icon: <XCircle className="w-4 h-4" />,
          style: "bg-gray-100 text-gray-600",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          style: "bg-gray-100 text-gray-600",
        };
    }
  };

  const getTipoIcon = (tipo: GestionTipo) => {
    switch (tipo) {
      case GestionTipo.LLAMADA:
        return <Phone className="w-4 h-4" />;
      case GestionTipo.REUNION:
        return <Users className="w-4 h-4" />;
      case GestionTipo.SEGUIMIENTO:
        return <RefreshCw className="w-4 h-4" />;
      case GestionTipo.RENOVACION:
        return <RefreshCw className="w-4 h-4" />;
      case GestionTipo.SINIESTRO:
        return <ShieldAlert className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case "Virtual":
        return <MonitorSmartphone className="w-3.5 h-3.5" />;
      case "Presencial":
        return <MapPin className="w-3.5 h-3.5" />;
      case "Telefónico":
        return <Wifi className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return null;
    return new Date(fecha).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isVencida = (gestion: Gestion) => {
    if (!gestion.fechaVencimiento) return false;
    return (
      new Date(gestion.fechaVencimiento) < new Date() &&
      gestion.estado !== GestionEstado.COMPLETADO &&
      gestion.estado !== GestionEstado.CANCELADO
    );
  };

  return (
    <Grid
      data={gestiones}
      columns={{ default: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
      renderItem={(gestion) => {
        const estadoConfig = getEstadoConfig(gestion.estado);
        const vencida = isVencida(gestion);

        return (
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-4 flex flex-col gap-3">
            {/* Header: tipo + botones */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
                  {getTipoIcon(gestion.tipo)}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {gestion.tipo}
                </span>
              </div>
              {(onEdit || onDelete) && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && <BotonEditar onClick={() => onEdit(gestion)} />}
                  {onDelete && (
                    <BotonEliminar onClick={() => onDelete(gestion)} />
                  )}
                </div>
              )}
            </div>

            {/* Descripción */}
            {gestion.descripcion && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {gestion.descripcion}
              </p>
            )}

            {/* Meet link */}
            {gestion.meetLink && (
              <a
                href={gestion.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline w-fit"
              >
                <Video className="w-3.5 h-3.5" />
                Unirse a la reunión
              </a>
            )}

            {/* Fechas */}
            <div className="flex flex-col gap-1">
              {gestion.fechaProgramada && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    Programada: {formatFecha(gestion.fechaProgramada)}
                  </span>
                </div>
              )}
              {gestion.fechaVencimiento && (
                <div
                  className={`flex items-center gap-1.5 text-xs ${vencida ? "text-red-600 font-semibold" : "text-gray-500"}`}
                >
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    Vence: {formatFecha(gestion.fechaVencimiento)}
                    {vencida && (
                      <span className="ml-1.5 bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-[10px]">
                        Vencida
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Footer: estado + prioridad + canal */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              {/* Estado */}
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoConfig.style}`}
              >
                {estadoConfig.icon}
                {gestion.estado}
              </span>

              {/* Prioridad */}
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadStyle(gestion.prioridad)}`}
              >
                <Flag className="w-3 h-3" />
                {gestion.prioridad}
              </span>

              {/* Canal */}
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {getCanalIcon(gestion.canal)}
                {gestion.canal}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
};
