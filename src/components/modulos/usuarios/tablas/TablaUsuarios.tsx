import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Usuario } from "@/types/usuario.interface";

interface TablaUsuariosProps {
  usuarios: Usuario[];
}

export const TablaUsuarios = ({ usuarios }: TablaUsuariosProps) => {
  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: "nombreUsuario",
      header: "Usuario",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.nombreUsuario}
        </div>
      ),
    },
    {
      accessorKey: "persona.nombres",
      header: "Nombres",
      cell: ({ row }) => (
        <div className="text-gray-700">
          {row.original.persona?.nombres || "-"}
        </div>
      ),
    },
    {
      accessorKey: "persona.apellidos",
      header: "Apellidos",
      cell: ({ row }) => (
        <div className="text-gray-700">
          {row.original.persona?.apellidos || "-"}
        </div>
      ),
    },
    {
      accessorKey: "correo",
      header: "Correo",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.correo}
        </div>
      ),
    },
    {
      accessorKey: "rol.nombreRol",
      header: "Rol",
      cell: ({ row }) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full text-white"
          style={{ backgroundColor: 'var(--austral-azul)' }}>
          {row.original.rol?.nombreRol || "-"}
        </span>
      ),
    },
    {
      accessorKey: "porcentajeComision",
      header: "Comisión (%)",
      cell: ({ row }) => {
        const comision = (row.original as any).porcentajeComision;
        return comision !== undefined && comision !== null ? (
          <div className="text-sm font-medium text-gray-900">
            {Number(comision).toFixed(2)}%
          </div>
        ) : (
          <div className="text-sm text-gray-400">-</div>
        );
      },
    },
    {
      accessorKey: "persona.numeroDocumento",
      header: "Documento",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.persona?.tipoDocumento || "-"}: {row.original.persona?.numeroDocumento || "-"}
        </div>
      ),
    },
    {
      accessorKey: "persona.telefono",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.persona?.telefono || "-"}
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
          {new Date(row.original.fechaCreacion).toLocaleDateString("es-PE")}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={usuarios}
      columns={columns}
      searchPlaceholder="Buscar por usuario, nombre, correo..."
      pageSize={10}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay usuarios registrados"
      tableId="tabla-usuarios"
    />
  );
};
