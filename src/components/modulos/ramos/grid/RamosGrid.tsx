import { Grid } from "@/components/shared";
import type { Ramo } from "@/types/ramo.interface";
import { ShieldCheck, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  ramos: Ramo[];
}

export const RamosGrid = ({ ramos }: Props) => {
  const navigate = useNavigate();

  return (
    <Grid
      data={ramos}
      renderItem={(ramo) => (
        <div
          key={ramo.idRamo}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
          {/* Header con icono */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {ramo.nombre}
              </h3>
              <p className="text-sm text-gray-600">{ramo.descripcion || 'Sin descripción'}</p>
            </div>
          </div>

          {/* Código Badge */}
          <div className="mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Código: {ramo.codigo}
            </span>
          </div>

          {/* Estado */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                ramo.activo
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {ramo.activo ? "Activo" : "Inactivo"}
            </span>
            
            <button
              onClick={() => navigate(`/dashboard/admin/maestros/ramos/${ramo.idRamo}/productos`)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--austral-azul)" }}
              title="Ver productos del ramo"
            >
              <Package className="w-4 h-4" />
              Productos
            </button>
          </div>
        </div>
      )}
      columns={{ default: 1, sm: 2, md: 2, lg: 3 }}
      pageSize={12}
      pageSizeOptions={[6, 12, 24]}
    />
  );
};
