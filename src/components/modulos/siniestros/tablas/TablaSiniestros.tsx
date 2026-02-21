import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import {
  type Siniestro,
  EstadoSiniestro,
  tipoSiniestroOptions,
  estadoSiniestroOptions,
} from "@/modules/siniestro/siniestro.types";

interface TablaSiniestrosProps {
  siniestros: Siniestro[];
  onEdit?: (siniestro: Siniestro) => void;
  onDelete?: (siniestro: Siniestro) => void;
}

const estadoBadgeClass: Record<EstadoSiniestro, string> = {
  [EstadoSiniestro.REPORTADO]: "bg-blue-100 text-blue-800",
  [EstadoSiniestro.EN_PROCESO]: "bg-amber-100 text-amber-800",
  [EstadoSiniestro.APROBADO]: "bg-green-100 text-green-800",
  [EstadoSiniestro.RECHAZADO]: "bg-red-100 text-red-800",
  [EstadoSiniestro.PAGADO]: "bg-emerald-100 text-emerald-800",
  [EstadoSiniestro.CERRADO]: "bg-gray-100 text-gray-700",
};

const getTipoLabel = (tipo: string) =>
  tipoSiniestroOptions.find((o) => o.value === tipo)?.label ?? tipo;

const getEstadoLabel = (estado: string) =>
  estadoSiniestroOptions.find((o) => o.value === estado)?.label ?? estado;

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return dayjs(dateString).format("DD/MM/YYYY");
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount?: number, currency?: string) => {
  if (amount == null) return "-";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency ?? "PEN",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const TablaSiniestros = ({
  siniestros,
  onEdit,
  onDelete,
}: TablaSiniestrosProps) => {
  const columns: ColumnDef<Siniestro>[] = [
    {
      accessorKey: "numeroSiniestro",
      header: "N° Siniestro",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 text-sm">
          {row.original.numeroSiniestro}
        </span>
      ),
    },
    {
      accessorKey: "tipoSiniestro",
      header: "Tipo",
      cell: ({ row }) => (
        <span
          className="px-2 py-1 text-xs font-medium rounded-full text-white"
          style={{ backgroundColor: "var(--austral-azul)" }}
        >
          {getTipoLabel(row.original.tipoSiniestro)}
        </span>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${estadoBadgeClass[row.original.estado] ?? "bg-gray-100 text-gray-700"}`}
        >
          {getEstadoLabel(row.original.estado)}
        </span>
      ),
    },
    {
      accessorKey: "fechaOcurrencia",
      header: "Fecha Ocurrencia",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.fechaOcurrencia)}
        </span>
      ),
    },
    {
      accessorKey: "fechaReporte",
      header: "Fecha Reporte",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.fechaReporte)}
        </span>
      ),
    },
    {
      accessorKey: "montoReclamado",
      header: "Monto Reclamado",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(row.original.montoReclamado, row.original.moneda)}
        </span>
      ),
    },
    {
      accessorKey: "montoAprobado",
      header: "Monto Aprobado",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {formatCurrency(row.original.montoAprobado, row.original.moneda)}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Acciones"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1" align="end">
            <div className="flex flex-col">
              {onEdit && (
                <PopoverClose asChild>
                  <button
                    onClick={() => onEdit(row.original)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                </PopoverClose>
              )}
              {onDelete && (
                <PopoverClose asChild>
                  <button
                    onClick={() => onDelete(row.original)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </PopoverClose>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <Table
      data={siniestros}
      columns={columns}
      searchPlaceholder="Buscar por número, tipo, estado..."
      pageSize={10}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay siniestros registrados para esta póliza"
      tableId="tabla-siniestros-poliza"
    />
  );
};
