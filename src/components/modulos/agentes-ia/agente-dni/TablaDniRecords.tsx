import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type DniRecord } from "@/types/agente-dni.interface";
import { Eye, Trash2, Pencil } from "lucide-react";

interface TablaDniRecordsProps {
  records: DniRecord[];
  onEdit: (recordId: string) => void;
  onDelete: (recordId: string) => void;
  onView: (record: DniRecord) => void;
}

export const TablaDniRecords = ({ records, onEdit, onDelete, onView }: TablaDniRecordsProps) => {
  const columns: ColumnDef<DniRecord>[] = [
    {
      accessorKey: "numeroDni",
      header: "DNI",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.numeroDni}
        </div>
      ),
    },
    {
      accessorKey: "nombres",
      header: "Nombres Completos",
      cell: ({ row }) => {
        const nombreCompleto = `${row.original.nombres} ${row.original.apellidoPaterno} ${row.original.apellidoMaterno}`;
        return (
          <div className="text-gray-700">
            {nombreCompleto}
          </div>
        );
      },
    },
    {
      accessorKey: "sexo",
      header: "Sexo",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.sexo === "M" ? "Masculino" : "Femenino"}
        </div>
      ),
    },
    {
      accessorKey: "estadoCivil",
      header: "Estado Civil",
      cell: ({ row }) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.original.estadoCivil}
        </span>
      ),
    },
    {
      accessorKey: "fechaNacimiento",
      header: "Fecha Nacimiento",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.fechaNacimiento 
            ? new Date(row.original.fechaNacimiento).toLocaleDateString("es-PE")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "fechaCreacion",
      header: "Fecha Registro",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {new Date(row.original.fechaCreacion).toLocaleDateString("es-PE")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onView(row.original)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Ver"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onEdit(row.original.id)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={records}
      columns={columns}
      searchPlaceholder="Buscar por DNI, nombre..."
      pageSize={5}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay registros guardados"
      tableId="tabla-dni-records"
    />
  );
};
