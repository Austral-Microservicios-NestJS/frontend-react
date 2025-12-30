import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Producto } from "@/types/producto.interface";
import { CheckCircle, XCircle } from "lucide-react";

interface TablaProductosProps {
  productos: Producto[];
}

export const TablaProductos = ({ productos }: TablaProductosProps) => {
  const columns: ColumnDef<Producto>[] = [
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
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.nombre}</div>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 max-w-md truncate" title={row.original.descripcion || ""}>
          {row.original.descripcion || "-"}
        </div>
      ),
    },
    {
      accessorKey: "esObligatorio",
      header: "Obligatorio",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.esObligatorio
              ? "bg-orange-100 text-orange-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.original.esObligatorio ? "Sí" : "No"}
        </span>
      ),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
            row.original.activo
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.activo ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {row.original.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      accessorKey: "disponible",
      header: "Disponible",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.disponible
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.original.disponible ? "Sí" : "No"}
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
  ];

  return (
    <Table
      data={productos}
      columns={columns}
      searchPlaceholder="Buscar por código, nombre..."
      pageSize={10}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay productos registrados"
      tableId="tabla-productos"
    />
  );
};
