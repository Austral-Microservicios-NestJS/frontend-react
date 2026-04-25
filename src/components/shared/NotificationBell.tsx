import { useState, useRef, useEffect, type ReactNode } from "react";
import { Bell, CheckCheck, AlertCircle, FileText, Settings, X } from "lucide-react";
import { Link } from "react-router-dom";
import { notificacionApi, type Notificacion } from "@/services/notificacion.service";

const tipoIcon: Record<string, ReactNode> = {
  LEAD_ESTANCADO: <AlertCircle className="w-4 h-4 text-orange-500" />,
  RECORDATORIO_CLIENTE: <Bell className="w-4 h-4 text-blue-500" />,
  NUEVA_ASIGNACION: <FileText className="w-4 h-4 text-green-500" />,
  SISTEMA: <Settings className="w-4 h-4 text-gray-500" />,
};

function tiempoRelativo(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: count = 0 } = notificacionApi.useContador();
  const { data: notifs = [], isLoading } = notificacionApi.useListar(false);
  const marcarLeida = notificacionApi.useMarcarLeida();
  const marcarTodas = notificacionApi.useMarcarTodasLeidas();

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const handleClick = async (n: Notificacion) => {
    if (!n.leida) {
      try { await marcarLeida.mutateAsync(n.idNotificacion); } catch {}
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-white" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white bg-red-500 border-2 border-[#003d5c]">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-bold text-gray-900">Notificaciones</h3>
              {count > 0 && (
                <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                  {count} nuevas
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {count > 0 && (
                <button
                  onClick={() => marcarTodas.mutate()}
                  disabled={marcarTodas.isPending}
                  title="Marcar todas como leídas"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 disabled:opacity-50"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="max-h-[420px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-sm text-gray-500">Cargando...</div>
            ) : notifs.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No tienes notificaciones</p>
                <p className="text-xs text-gray-400 mt-1">
                  Cuando un lead se estanque o haya algo importante, aparecerá aquí
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifs.map((n) => {
                  const inner = (
                    <div
                      className={`p-3 flex gap-3 hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        !n.leida ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => handleClick(n)}
                    >
                      <div className="mt-0.5 shrink-0">
                        {tipoIcon[n.tipo] || <Bell className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${!n.leida ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                            {n.titulo}
                          </p>
                          {!n.leida && (
                            <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.mensaje}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{tiempoRelativo(n.fechaCreacion)}</p>
                      </div>
                    </div>
                  );
                  return (
                    <li key={n.idNotificacion}>
                      {n.urlDestino ? (
                        <Link to={n.urlDestino}>{inner}</Link>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
