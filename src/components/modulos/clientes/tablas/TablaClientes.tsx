import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Cliente } from "@/types/cliente.interface";

interface TablaClientesProps {
  clientes: Cliente[];
}

export const TablaClientes = ({ clientes }: TablaClientesProps) => {
  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: "tipoPersona",
      header: "Tipo",
      cell: ({ row }) => (
        <span
          className="px-2 py-1 text-xs font-medium rounded-full text-white"
          style={{ backgroundColor: "var(--austral-azul)" }}
        >
          {row.original.tipoPersona}
        </span>
      ),
    },
    {
      accessorKey: "razonSocial",
      header: "Razón Social / Nombre",
      cell: ({ row }) => {
        const cliente = row.original;
        const displayName =
          cliente.tipoPersona === "JURIDICO"
            ? cliente.razonSocial
            : `${cliente.nombres || ""} ${cliente.apellidos || ""}`.trim();

        return (
          <div className="font-medium text-gray-900">{displayName || "-"}</div>
        );
      },
    },
    {
      accessorKey: "numeroDocumento",
      header: "Documento",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.tipoDocumento}: {row.original.numeroDocumento}
        </div>
      ),
    },
    {
      accessorKey: "telefono1",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.telefono1 || "-"}
        </div>
      ),
    },
    {
      accessorKey: "whatsapp",
      header: "WhatsApp",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.whatsapp || "-"}
        </div>
      ),
    },
    {
      accessorKey: "emailNotificaciones",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.emailNotificaciones || "-"}
        </div>
      ),
    },
    // {
    //   accessorKey: "direccion",
    //   header: "Dirección",
    //   cell: ({ row }) => {
    //     const cliente = row.original;
    //     const ubicacion = [
    //       cliente.direccion,
    //       cliente.distrito,
    //       cliente.provincia,
    //       cliente.departamento
    //     ].filter(Boolean).join(", ");

    //     return (
    //       <div className="text-sm text-gray-600 max-w-xs truncate" title={ubicacion}>
    //         {ubicacion || "-"}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "cumpleanos",
    //   header: "Cumpleaños",
    //   cell: ({ row }) => (
    //     <div className="text-sm text-gray-600">
    //       {row.original.cumpleanos
    //         ? new Date(row.original.cumpleanos).toLocaleDateString("es-PE")
    //         : "-"}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "recibirNotificaciones",
      header: "Notificaciones",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.original.recibirNotificaciones
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.original.recibirNotificaciones ? "Sí" : "No"}
        </span>
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
    // {
    //   accessorKey: "fechaCreacion",
    //   header: "Fecha Creación",
    //   cell: ({ row }) => (
    //     <div className="text-sm text-gray-600">
    //       {new Date(row.original.fechaCreacion).toLocaleDateString("es-PE")}
    //     </div>
    //   ),
    // },
  ];

  return (
    <Table
      data={clientes}
      columns={columns}
      searchPlaceholder="Buscar por nombre, documento, email..."
      pageSize={10}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay clientes registrados"
      tableId="tabla-clientes"
    />
  );
};
