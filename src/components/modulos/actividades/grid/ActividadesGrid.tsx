import { Grid } from "@/components/shared";
import type { Actividad } from "@/types/actividad.interface";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Users,
  FileText,
} from "lucide-react";
import dayjs from "dayjs";

interface Props {
  actividades: Actividad[];
}

export const ActividadesGrid = ({ actividades }: Props) => {
  const getTipoActividadConfig = (tipo: string) => {
    switch (tipo) {
      case "REUNION":
        return {
          icon: <Users className="w-5 h-5" />,
          color: "bg-blue-100 text-blue-800",
          label: "Reunión",
        };
      case "LLAMADA":
        return {
          icon: <Phone className="w-5 h-5" />,
          color: "bg-green-100 text-green-800",
          label: "Llamada",
        };
      case "EMAIL":
        return {
          icon: <Mail className="w-5 h-5" />,
          color: "bg-purple-100 text-purple-800",
          label: "Email",
        };
      case "OTRO":
        return {
          icon: <FileText className="w-5 h-5" />,
          color: "bg-gray-100 text-gray-800",
          label: "Otro",
        };
      default:
        return {
          icon: <FileText className="w-5 h-5" />,
          color: "bg-gray-100 text-gray-800",
          label: tipo,
        };
    }
  };

  const isProxima = (fechaActividad: Date) => {
    const fecha = new Date(fechaActividad);
    const hoy = new Date();
    const diferenciaDias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diferenciaDias >= 0 && diferenciaDias <= 3;
  };

  const isPasada = (fechaActividad: Date) => {
    return new Date(fechaActividad) < new Date();
  };

  return (
    <Grid
      data={actividades}
      renderItem={(actividad) => {
        const tipoConfig = getTipoActividadConfig(actividad.tipoActividad);
        const proxima = isProxima(actividad.fechaActividad);
        const pasada = isPasada(actividad.fechaActividad);

        return (
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200">
            {/* Header con tipo de actividad */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {actividad.titulo}
                </h3>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${tipoConfig.color}`}>
                {tipoConfig.icon}
                {tipoConfig.label}
              </div>
            </div>

            {/* Descripción */}
            {actividad.descripcion && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {actividad.descripcion}
              </p>
            )}

            {/* Fecha y hora de la actividad */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className={`text-sm ${
                  proxima && !pasada
                    ? "text-orange-600 font-semibold"
                    : pasada
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}>
                  {dayjs(actividad.fechaActividad).format("DD/MM/YYYY")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date(actividad.fechaActividad).toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Footer con indicadores */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                {proxima && !pasada && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    Próxima
                  </span>
                )}
                {pasada && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    Realizada
                  </span>
                )}
                {!proxima && !pasada && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Programada
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                Creada: {dayjs(actividad.fechaCreacion).format("DD/MM/YYYY")}
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

