import { Table, BotonEditar } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Ramo } from "@/types/ramo.interface";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

interface TablaRamosProps {
  ramos: Ramo[];
  onEdit?: (ramo: Ramo) => void;
}

export const TablaRamos = ({ ramos, onEdit }: TablaRamosProps) => {
  const navigate = useNavigate();

  const columns: ColumnDef<Ramo>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.nombre}</div>
      ),
    },
    {
      accessorKey: "abreviatura",
      header: "Abreviatura",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.abreviatura || "-"}
        </div>
      ),
    },
    {
      accessorKey: "codigo",
      header: "Código",
      cell: ({ row }) => (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.original.codigo}
        </span>
      ),
    },
    {
      accessorKey: "grupo",
      header: "Grupo",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.grupo || "-"}
        </div>
      ),
    },

    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        <div
          className="text-sm text-gray-600 max-w-md truncate"
          title={row.original.descripcion || ""}
        >
          {row.original.descripcion || "-"}
        </div>
      ),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.activo
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      accessorKey: "fechaCreacion",
      header: "Fecha Creación",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.fechaCreacion
            ? new Date(row.original.fechaCreacion).toLocaleDateString("es-PE")
            : "-"}
        </div>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onEdit && <BotonEditar onClick={() => onEdit(row.original)} />}
          <button
            onClick={() =>
              navigate(
                `/dashboard/admin/maestros/ramos/${row.original.idRamo}/productos`
              )
            }
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--austral-azul)" }}
            title="Ver productos del ramo"
          >
            <Package className="w-4 h-4" />
            Productos
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={ramos}
      columns={columns}
      searchPlaceholder="Buscar por código, nombre..."
      pageSize={10}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay ramos registrados"
      tableId="tabla-ramos"
    />
  );
};
