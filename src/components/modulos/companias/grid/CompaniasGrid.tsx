import { Grid } from "@/components/shared";
import type { Compania } from "@/types/compania.interface";
import { Building2, Mail, Phone, Globe, MapPin } from "lucide-react";

interface Props {
  companias: Compania[];
}

export const CompaniasGrid = ({ companias }: Props) => {
  return (
    <Grid
      data={companias}
      renderItem={(compania) => (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
          {/* Header con logo */}
          <div className="flex items-start gap-4 mb-4">
            {compania.logoUrl ? (
              <img
                src={compania.logoUrl}
                alt={compania.nombreComercial}
                className="w-16 h-16 object-contain rounded-lg border"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: "var(--austral-azul)" }}
              >
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {compania.nombreComercial}
              </h3>
              <p className="text-sm text-gray-600">{compania.razonSocial}</p>
            </div>
          </div>

          {/* RUC Badge */}
          <div className="mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              RUC: {compania.ruc}
            </span>
          </div>

          {/* Información de contacto */}
          <div className="space-y-2 text-sm">
            {compania.direccion && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{compania.direccion}</span>
              </div>
            )}

            {compania.telefono && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{compania.telefono}</span>
              </div>
            )}

            {compania.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{compania.email}</span>
              </div>
            )}

            {compania.web && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4 shrink-0" />
                <a
                  href={compania.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {compania.web}
                </a>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                compania.activo
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {compania.activo ? "Activa" : "Inactiva"}
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
