import { Grid } from "@/components/shared";
import type { Producto } from "@/types/producto.interface";
import { Package, Building2, Layers, CheckCircle, XCircle } from "lucide-react";

interface Props {
  productos: Producto[];
}

export const ProductosGrid = ({ productos }: Props) => {
  return (
    <Grid
      data={productos}
      renderItem={(producto) => (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
          {/* Header con icono */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              <Package className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {producto.nombre}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {producto.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>

          {/* Código Badge */}
          <div className="mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Código: {producto.codigo}
            </span>
          </div>

          {/* Información adicional */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Compañía ID: {producto.idCompania}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Ramo ID: {producto.idRamo}</span>
            </div>
          </div>

          {/* Badges de estado */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                producto.activo
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {producto.activo ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              {producto.activo ? "Activo" : "Inactivo"}
            </span>

            {producto.esObligatorio && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                Obligatorio
              </span>
            )}

            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                producto.disponible
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {producto.disponible ? "Disponible" : "No disponible"}
            </span>
          </div>
        </div>
      )}
      columns={{ default: 1, sm: 2, md: 2, lg: 3 }}
      pageSize={12}
      pageSizeOptions={[6, 12, 24]}
    />
  );
};
