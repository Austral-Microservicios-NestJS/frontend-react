import { Table, BotonEditar } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Usuario } from "@/types/usuario.interface";
import { leadService } from "@/services/lead.service";
import { useMemo } from "react";

interface TablaUsuariosProps {
  usuarios: Usuario[];
  onEdit?: (usuario: Usuario) => void;
}

export const TablaUsuarios = ({ usuarios, onEdit }: TablaUsuariosProps) => {
  // Cargar todos los leads visibles (server-side ya filtra por rol).
  // Para BROKER/ADMIN se obtiene la lista completa de su scope; cruzamos por asignadoA.
  const { data: leads = [] } = leadService.useGetAll();
  const leadsPorAgente = useMemo(() => {
    const map: Record<string, { activos: number; emitidos: number }> = {};
    for (const l of (Array.isArray(leads) ? leads : [])) {
      const id = (l as any).asignadoA;
      if (!id) continue;
      if (!map[id]) map[id] = { activos: 0, emitidos: 0 };
      const estado = (l as any).estado;
      if (estado === "EMITIDO" || estado === "CERRADO") {
        map[id].emitidos++;
      } else if (estado !== "PERDIDO") {
        map[id].activos++;
      }
    }
    return map;
  }, [leads]);

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
        <div className="text-sm text-gray-600">{row.original.correo}</div>
      ),
    },
    {
      accessorKey: "rol.nombreRol",
      header: "Rol",
      cell: ({ row }) => (
        <span
          className="px-2 py-1 text-xs font-medium rounded-full text-white"
          style={{ backgroundColor: "var(--austral-azul)" }}
        >
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
          {row.original.persona?.tipoDocumento || "-"}:{" "}
          {row.original.persona?.numeroDocumento || "-"}
        </div>
      ),
    },
    {
      accessorKey: "persona.telefono",
      header: "Teléfono personal",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.persona?.telefono || "-"}
        </div>
      ),
    },
    {
      accessorKey: "persona.telefonoEmpresarial",
      header: "Tel empresarial",
      cell: ({ row }) => {
        const tel = row.original.persona?.telefonoEmpresarial;
        return tel ? (
          <div className="text-sm font-medium text-blue-700">{tel}</div>
        ) : (
          <span className="text-xs text-amber-600 italic">sin asignar</span>
        );
      },
    },
    {
      id: "carga",
      header: "Carga (activos / emitidos)",
      cell: ({ row }) => {
        const id = row.original.idUsuario;
        const stats = leadsPorAgente[id] || { activos: 0, emitidos: 0 };
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium" title="Leads en proceso">
              {stats.activos}
            </span>
            <span className="text-gray-300">/</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium" title="Pólizas emitidas/cerradas">
              {stats.emitidos}
            </span>
          </div>
        );
      },
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
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onEdit && <BotonEditar onClick={() => onEdit(row.original)} />}
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
