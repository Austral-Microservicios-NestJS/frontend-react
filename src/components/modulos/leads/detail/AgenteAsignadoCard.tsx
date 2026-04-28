import { Mail, MessageCircle, Phone, UserCircle, Briefcase } from "lucide-react";
import { recordatorioApi } from "@/services/recordatorio.service";

interface AgenteAsignadoCardProps {
  asignadoA?: string | null;
}

/**
 * Muestra la información del agente que atiende al lead.
 * Visible para todos los roles con acceso al lead.
 * Incluye teléfono empresarial (único por agente) como canal principal de contacto.
 */
export function AgenteAsignadoCard({ asignadoA }: AgenteAsignadoCardProps) {
  const { data: agente, isLoading } = recordatorioApi.useInfoAgente(asignadoA || undefined);

  if (!asignadoA) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-3">
          <UserCircle className="h-6 w-6 text-amber-500" />
          <div>
            <p className="font-medium text-amber-900">Sin agente asignado</p>
            <p className="text-sm text-amber-700">
              Este lead aún no tiene un agente responsable. Asigna uno para dar seguimiento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-48 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!agente) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        Agente no disponible (ID: {asignadoA.slice(0, 8)}...)
      </div>
    );
  }

  const telefonoWhatsApp = (agente.telefonoEmpresarial || agente.telefono || "")
    .replace(/[^\d+]/g, "");

  return (
    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <UserCircle className="h-9 w-9" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900">
              {agente.nombreCompleto || agente.nombreUsuario}
            </h3>
            {agente.rol && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                <Briefcase className="h-3 w-3" />
                {agente.rol}
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-sm">
            {agente.telefonoEmpresarial && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <a
                  href={`tel:${agente.telefonoEmpresarial}`}
                  className="hover:text-blue-700 font-medium"
                >
                  {agente.telefonoEmpresarial}
                </a>
                <span className="text-xs text-gray-500">(empresarial)</span>
              </div>
            )}
            {agente.correo && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <a
                  href={`mailto:${agente.correo}`}
                  className="hover:text-blue-700 break-all"
                >
                  {agente.correo}
                </a>
              </div>
            )}
          </div>

          {telefonoWhatsApp && (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${telefonoWhatsApp.replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              {agente.telefonoEmpresarial && (
                <a
                  href={`tel:${agente.telefonoEmpresarial}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Llamar
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
