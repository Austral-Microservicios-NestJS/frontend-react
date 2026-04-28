import { UserCircle } from "lucide-react";
import { recordatorioApi } from "@/services/recordatorio.service";

interface AgenteBadgeProps {
  asignadoA?: string | null;
  className?: string;
  compact?: boolean;
}

/**
 * Badge compacto del agente a cargo. Pensado para listar en LeadCard
 * o en tablas donde admin/broker quiere ver de un vistazo quién atiende.
 */
export function AgenteBadge({ asignadoA, className = "", compact = false }: AgenteBadgeProps) {
  const { data: agente } = recordatorioApi.useInfoAgente(asignadoA || undefined);

  if (!asignadoA) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full ${className}`}>
        <UserCircle className="w-3 h-3" />
        Sin agente
      </span>
    );
  }

  const nombre = agente?.nombreCompleto || agente?.nombreUsuario || asignadoA.slice(0, 8);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full ${className}`}
        title={agente?.telefonoEmpresarial ? `📞 ${agente.telefonoEmpresarial}` : ""}
      >
        <UserCircle className="w-3 h-3" />
        {nombre}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-[11px] text-gray-600 ${className}`}>
      <UserCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      <span className="font-medium text-gray-800 truncate">{nombre}</span>
      {agente?.telefonoEmpresarial && (
        <span className="text-gray-500 truncate">· {agente.telefonoEmpresarial}</span>
      )}
    </div>
  );
}
