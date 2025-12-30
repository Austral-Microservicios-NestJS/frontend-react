import { Grid } from "@/components/shared";
import type { Compania } from "@/types/compania.interface";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Props {
  companias: Compania[];
}

export const CompaniasGridEx = ({ companias }: Props) => {
  return (
    <Grid
      data={companias}
      renderItem={(compania) => (
        <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[--austral-azul] to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Logo Section */}
            <div className="shrink-0 relative">
              {compania.logoUrl ? (
                <div className="w-20 h-20 rounded-lg border border-gray-100 p-2 bg-white flex items-center justify-center">
                  <img
                    src={compania.logoUrl}
                    alt={compania.nombreComercial}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-lg flex items-center justify-center text-white shadow-inner"
                  style={{ backgroundColor: "var(--austral-azul)" }}
                >
                  <Building2 className="w-10 h-10 opacity-90" />
                </div>
              )}
              <div
                className={`absolute -bottom-2 -right-2 rounded-full p-1 border-2 border-white ${
                  compania.activo
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {compania.activo ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-[--austral-azul] transition-colors">
                    {compania.nombreComercial}
                  </h3>
                </div>

                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {compania.razonSocial}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    RUC: {compania.ruc}
                  </span>
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                {compania.direccion && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{compania.direccion}</span>
                  </div>
                )}

                {compania.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{compania.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {compania.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{compania.telefono}</span>
                    </div>
                  )}

                  {compania.web && (
                    <a
                      href={compania.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[--austral-azul] hover:underline font-medium ml-auto md:ml-0"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Web
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      columns={{ default: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      pageSize={8}
      pageSizeOptions={[8, 16, 24]}
    />
  );
};
