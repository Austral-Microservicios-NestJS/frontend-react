import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Poliza } from "@/types/poliza.interface";
import { FileText, Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import { DetallePolizaModal } from "../modales/DetallePolizaModal";

interface TablaPolizasProps {
  polizas: Poliza[];
  onEdit?: (poliza: Poliza) => void;
}

export const TablaPolizas = ({ polizas, onEdit }: TablaPolizasProps) => {
  const [selectedPoliza, setSelectedPoliza] = useState<Poliza | null>(null);
  const columns: ColumnDef<Poliza>[] = [
    {
      accessorKey: "numeroPoliza",
      header: "Número de Póliza",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900">
            {row.original.numeroPoliza}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "nombreAsegurado",
      header: "Asegurado",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {row.original.nombreAsegurado}
        </div>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.original.estado;
        let colorClass = "bg-gray-100 text-gray-800";
        
        if (estado === "VIGENTE") colorClass = "bg-green-100 text-green-800";
        if (estado === "VENCIDA") colorClass = "bg-red-100 text-red-800";
        if (estado === "CANCELADA") colorClass = "bg-yellow-100 text-yellow-800";
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {estado}
          </span>
        );
      },
    },
    {
      accessorKey: "vigenciaInicio",
      header: "Fecha Inicio",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(row.original.vigenciaInicio).toLocaleDateString("es-PE")}
        </div>
      ),
    },
    {
      accessorKey: "vigenciaFin",
      header: "Fecha Fin",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(row.original.vigenciaFin).toLocaleDateString("es-PE")}
        </div>
      ),
    },
    {
      accessorKey: "moneda",
      header: "Moneda",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{row.original.moneda}</span>
      ),
    },
    {
      accessorKey: "comisionBroker",
      header: "Comisión Broker",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-gray-900">
            {row.original.comisionBroker} %
          </div>
        );
      },
    },
    {
      accessorKey: "comisionAgente",
      header: "Comisión Agente",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-gray-900">
            {row.original.comisionAgente} %
          </div>
        );
      },
    },
    {
      accessorKey: "tipoVigencia",
      header: "Tipo Vigencia",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.tipoVigencia}
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
              <PopoverClose asChild>
                <button
                  onClick={() => setSelectedPoliza(row.original)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Ver Detalles
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
      data={polizas}
      columns={columns}
      searchPlaceholder="Buscar por número de póliza, asegurado..."
      pageSize={10}
      showSearch={true}
      showPagination={true}
      showColumnToggle={true}
      emptyMessage="No hay pólizas registradas para este cliente"
      tableId="tabla-polizas-cliente"
    />

    {selectedPoliza && (
      <DetallePolizaModal
        isOpen={!!selectedPoliza}
        onClose={() => setSelectedPoliza(null)}
        poliza={selectedPoliza}
      />
    )}
    </>
  );
};

