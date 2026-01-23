import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type ClienteInversion } from "@/types/cliente-inversion.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";

interface TablaInversionesProps {
  inversiones: ClienteInversion[];
  onEdit?: (inversion: ClienteInversion) => void;
  onDelete?: (inversion: ClienteInversion) => void;
}

export const TablaInversiones = ({
  inversiones,
  onEdit,
  onDelete,
}: TablaInversionesProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).format("DD/MM/YYYY");
    } catch {
      return dateString;
    }
  };

  const columns: ColumnDef<ClienteInversion>[] = [
    {
      accessorKey: "fechaGasto",
      header: "Fecha",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900 font-medium">
          {formatDate(row.original.fechaGasto)}
        </div>
      ),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <span
          className="px-2 py-1 text-xs font-medium rounded-full text-white"
          style={{ backgroundColor: "var(--austral-azul)" }}
        >
          {row.original.tipo}
        </span>
      ),
    },
    {
      accessorKey: "monto",
      header: "Monto",
      cell: ({ row }) => (
        <div className="text-sm font-semibold text-gray-900">
          {formatCurrency(row.original.monto, row.original.moneda)}
        </div>
      ),
    },
    {
      accessorKey: "moneda",
      header: "Moneda",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.moneda === "PEN"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.original.moneda}
        </span>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {row.original.descripcion || "-"}
        </div>
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
      data={inversiones}
      columns={columns}
      searchPlaceholder="Buscar por tipo, descripción..."
      pageSize={10}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay inversiones registradas"
      tableId="tabla-inversiones"
    />
  );
};
