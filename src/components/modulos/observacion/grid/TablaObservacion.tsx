import { Table, BotonEditar, BotonEliminar } from "@/components/shared";
import type { Observacion } from "@/types/observacion.interface";
import { Eye, Flag, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import dayjs from "dayjs";

interface TablaObservacionProps {
  observaciones: Observacion[];
  onEdit: (observacion: Observacion) => void;
  onDelete: (id: number) => void;
  onView: (observacion: Observacion) => void;
}

export const TablaObservacion = ({
  observaciones,
  onEdit,
  onDelete,
  onView,
}: TablaObservacionProps) => {
  const getPrioridadInfo = (prioridad: string) => {
    switch (prioridad) {
      case "CRITICA":
        return {
          color: "text-red-600 bg-red-50 border-red-200",
          label: "Crítica",
        };
      case "ALTA":
        return {
          color: "text-orange-600 bg-orange-50 border-orange-200",
          label: "Alta",
        };
      case "MEDIA":
        return {
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          label: "Media",
        };
      case "BAJA":
        return {
          color: "text-green-600 bg-green-50 border-green-200",
          label: "Baja",
        };
      default:
        return {
          color: "text-gray-600 bg-gray-50 border-gray-200",
          label: prioridad,
        };
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

  const columns = [
    {
      header: "Asunto",
      accessorKey: "asunto",
      cell: (info: any) => (
        <span className="font-medium text-gray-900">{info.getValue()}</span>
      ),
    },
    {
      header: "Categoría",
      accessorKey: "categoria",
      cell: (info: any) => (
        <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {info.getValue()?.toLowerCase()}
        </span>
      ),
    },
    {
      header: "Prioridad",
      accessorKey: "prioridad",
      cell: (info: any) => {
        const { color, label } = getPrioridadInfo(info.getValue());
        return (
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
          >
            <Flag className="w-3 h-3" />
            {label}
          </div>
        );
      },
    },
    {
      header: "Canal",
      accessorKey: "canal",
      cell: (info: any) => (
        <span className="text-sm text-gray-600 capitalize">
          {info.getValue()?.toLowerCase()}
        </span>
      ),
    },
    {
      header: "Estado",
      accessorKey: "estado",
      cell: (info: any) => {
        const { icon, color, label } = getEstadoInfo(info.getValue());
        return (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
          >
            {icon}
            {label}
          </div>
        );
      },
    },
    {
      header: "Fecha",
      accessorKey: "fechaCreacion",
      cell: (info: any) => (
        <span className="text-sm text-gray-500">
          {dayjs(info.getValue()).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      header: "Acciones",
      id: "actions",
      cell: (info: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(info.row.original)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <BotonEditar onClick={() => onEdit(info.row.original)} />
          <BotonEliminar
            onClick={() => onDelete(info.row.original.idObservacion)}
          />
        </div>
      ),
    },
  ];

  return <Table data={observaciones} columns={columns} />;
};
