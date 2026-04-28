import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  MessageSquare,
  Send,
  User,
  UserCircle,
} from "lucide-react";
import { recordatorioApi, type LeadRecordatorio } from "@/services/recordatorio.service";
import { useAuthStore } from "@/store/auth.store";
import { Roles } from "@/utils/roles";

interface HistorialRecordatoriosProps {
  idLead: string;
  estadoLead: string;
}

const ROLES_ENVIAR_MANUAL: string[] = [
  Roles.ADMINISTRADOR,
  Roles.EJECUTIVO_CUENTA,
  Roles.BROKER,
  Roles.PROMOTOR_VENTA,
  Roles.PUNTO_VENTA,
];

/**
 * Historial auditable de recordatorios enviados al cliente y al agente.
 * Cumple Resolución SBS N° 01029-2026: evidencia documental de cada comunicación.
 *
 * Incluye botón para envío manual (solo si el lead no está en EMITIDO/CERRADO).
 */
export function HistorialRecordatorios({ idLead, estadoLead }: HistorialRecordatoriosProps) {
  const [abierto, setAbierto] = useState(false);
  const { user } = useAuthStore();
  const rol = user?.rol?.nombreRol;
  const esAdmin = rol === Roles.ADMINISTRADOR;
  const puedeEnviarManual =
    ROLES_ENVIAR_MANUAL.includes(rol || "") &&
    estadoLead !== "EMITIDO" &&
    estadoLead !== "CERRADO" &&
    estadoLead !== "PERDIDO";

  const { data: historial = [], isLoading } = recordatorioApi.useHistorial(idLead);
  const enviarManual = recordatorioApi.useEnviarManual();

  const handleEnviarManual = async () => {
    try {
      const res: any = await enviarManual.mutateAsync(idLead);
      toast.success(res?.detalle || "Recordatorio enviado");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Error al enviar recordatorio");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          {abierto ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">
            Historial de recordatorios
          </h3>
          {historial.length > 0 && (
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {historial.length}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">SBS auditable</span>
      </button>

      {abierto && (
        <div className="border-t border-gray-200 p-4">
          {puedeEnviarManual && (
            <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 p-3">
              <div className="text-sm text-blue-900">
                ¿Necesitas avanzar este lead? Envía un recordatorio ahora al cliente y al agente.
              </div>
              <button
                onClick={handleEnviarManual}
                disabled={enviarManual.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {enviarManual.isPending ? "Enviando..." : "Enviar recordatorio"}
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="text-sm text-gray-500">Cargando historial...</div>
          ) : historial.length === 0 ? (
            <div className="rounded-md bg-gray-50 p-4 text-center text-sm text-gray-500">
              Aún no se han enviado recordatorios para este lead.
            </div>
          ) : (
            <ul className="space-y-3">
              {historial.map((rec) => (
                <RecordatorioItem key={rec.idRecordatorio} recordatorio={rec} esAdmin={esAdmin} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Detecta si el error es de configuración (responsabilidad admin/devops)
// vs un error real (rebote de email, número inválido, etc.)
function esErrorConfig(msg?: string): boolean {
  if (!msg) return false;
  const m = msg.toLowerCase();
  return (
    m.includes("api key") ||
    m.includes("api_key") ||
    m.includes("token no configurada") ||
    m.includes("not configured") ||
    m.includes("manychat_api_token") ||
    m.includes("resend_api_key")
  );
}

function RecordatorioItem({ recordatorio, esAdmin }: { recordatorio: LeadRecordatorio; esAdmin: boolean }) {
  const fecha = new Date(recordatorio.enviadoEn).toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const iconoDestinatario =
    recordatorio.tipoDestinatario === "CLIENTE" ? (
      <User className="h-4 w-4 text-green-600" />
    ) : (
      <UserCircle className="h-4 w-4 text-blue-600" />
    );

  const iconoCanal =
    recordatorio.canal === "EMAIL" ? (
      <Mail className="h-3.5 w-3.5" />
    ) : (
      <MessageSquare className="h-3.5 w-3.5" />
    );

  const errConfig = !recordatorio.exitoso && esErrorConfig(recordatorio.errorMensaje);
  const iconoEstado = recordatorio.exitoso ? (
    <CheckCircle className="h-4 w-4 text-green-600" />
  ) : errConfig ? (
    <AlertCircle className="h-4 w-4 text-gray-400" />
  ) : (
    <AlertCircle className="h-4 w-4 text-red-500" />
  );

  const disparadorTxt: Record<string, string> = {
    CRON_AUTOMATICO: "Automático",
    MANUAL_AGENTE: "Manual (agente)",
    MANUAL_ADMIN: "Manual (admin)",
  };

  return (
    <li className="rounded-md border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-1.5">
          {iconoDestinatario}
          {iconoCanal}
          {iconoEstado}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
            <span className="font-medium text-gray-900">
              {recordatorio.tipoDestinatario === "CLIENTE" ? "Cliente" : "Agente"}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-600">{recordatorio.canal}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{fecha}</span>
            <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
              {disparadorTxt[recordatorio.disparador] || recordatorio.disparador}
            </span>
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Destinatario:</span> {recordatorio.destinatarioContacto}
          </div>
          {recordatorio.asunto && (
            <div className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Asunto:</span> {recordatorio.asunto}
            </div>
          )}
          <div className="text-xs text-gray-600 mb-1">
            Estado al enviar: <b>{recordatorio.estadoLeadAlEnviar}</b> · {recordatorio.diasEnEstado} días en el estado
          </div>
          {!recordatorio.exitoso && recordatorio.errorMensaje && (
            errConfig ? (
              esAdmin ? (
                <div className="mt-1 rounded bg-amber-50 p-2 text-xs text-amber-700 border border-amber-100">
                  <b>⚙️ Configuración pendiente:</b> {recordatorio.errorMensaje}
                  <div className="text-[10px] text-amber-600 mt-0.5">
                    Configura la API key correspondiente en el VM para que se envíe.
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-[11px] text-gray-500 italic">
                  Envío externo pendiente — el equipo técnico fue notificado.
                </div>
              )
            ) : (
              <div className="mt-1 rounded bg-red-50 p-2 text-xs text-red-700">
                <b>Error:</b> {recordatorio.errorMensaje}
              </div>
            )
          )}
        </div>
      </div>
    </li>
  );
}
