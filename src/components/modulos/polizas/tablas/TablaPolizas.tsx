import { Table } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";
import { type Poliza } from "@/types/poliza.interface";
import { FileText, Calendar } from "lucide-react";

interface TablaPolizasProps {
  polizas: Poliza[];
}

export const TablaPolizas = ({ polizas }: TablaPolizasProps) => {
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
  ];

  return (
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
  );
};

