import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Cliente } from "@/types/cliente.interface";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { FileText, MoreHorizontal, Pencil, DollarSign } from "lucide-react";
import { ButtonIA } from "@/components/ui/ButtonIA";
import { useState } from "react";
import { ContextoIAModal } from "@/components/modulos/clientes/modales/ContextoIAModal";

interface TablaClientesProps {
  clientes: Cliente[];
  onEdit?: (cliente: Cliente) => void;
  serverPagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
  };
}

export const TablaClientes = ({ clientes, onEdit, serverPagination }: TablaClientesProps) => {
  const navigate = useNavigate();
  const [selectedClienteForIA, setSelectedClienteForIA] =
    useState<Cliente | null>(null);

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
              <div className="p-1 mb-1 border-b border-gray-100">
                <ButtonIA
                  className="w-full"
                  onClick={() => setSelectedClienteForIA(row.original)}
                >
                  Dale contexto a la IA
                </ButtonIA>
              </div>
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
              <PopoverClose asChild>
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/gestion-trabajo/clientes/${row.original.idCliente}/polizas`,
                    )
                  }
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Ver Pólizas
                </button>
              </PopoverClose>
              <PopoverClose asChild>
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/gestion-trabajo/clientes/${row.original.idCliente}/inversiones`,
                    )
                  }
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Ver Inversiones
                </button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <>
      <Table
        data={clientes}
        columns={columns}
        searchPlaceholder="Buscar por nombre, documento, email..."
        pageSize={30}
        showSearch={true}
        showPagination={true}
        showColumnToggle={true}
        emptyMessage="No hay clientes registrados"
        tableId="tabla-clientes"
        serverPagination={serverPagination}
      />

      {selectedClienteForIA && (
        <ContextoIAModal
          isOpen={!!selectedClienteForIA}
          onClose={() => setSelectedClienteForIA(null)}
          cliente={selectedClienteForIA}
        />
      )}
    </>
  );
};
