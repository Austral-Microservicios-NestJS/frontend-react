import { Card } from "@/components/ui/card";
import { useTareas } from "@/hooks/useTareas";
import { CheckSquare, Clock, ArrowRight, AlertCircle } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import "dayjs/locale/es";

dayjs.locale("es");

const PRIORITY_CONFIG = {
  ALTA: { color: "#f43f5e", label: "Alta" },
  MEDIA: { color: "#f59e0b", label: "Media" },
  BAJA: { color: "#10b981", label: "Baja" },
};

export const TasksWidget = () => {
  const { tareas, isLoading } = useTareas();

  const today = dayjs();
  const nextWeek = today.add(7, "day");

  const pendingTasks = tareas
    .filter((t) => t.estado !== "COMPLETADA")
    .filter((t) => dayjs(t.fechaVencimiento).isBefore(nextWeek))
    .sort((a, b) => dayjs(a.fechaVencimiento).diff(dayjs(b.fechaVencimiento)))
    .slice(0, 3);

  const overdueCount = pendingTasks.filter((t) =>
    dayjs(t.fechaVencimiento).isBefore(today, "day"),
  ).length;

  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-gray-200">
        <div className="px-4 pt-3 pb-4 h-full flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14.5 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all bg-white overflow-hidden relative flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#003d5c]" />

      <div className="px-4 pt-3 pb-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#003d5c] p-1.5 rounded-lg">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">
              Tareas Pendientes
            </h3>
          </div>
          <Link
            to="/dashboard/gestion-trabajo/tareas"
            className="flex items-center gap-1 text-sm font-semibold text-[#003d5c] hover:text-[#003d5c]/70 transition-colors group/link"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>

        {/* Task list — siempre 3 slots para altura constante */}
        <div className="flex flex-col gap-2 flex-1">
          {Array.from({ length: 3 }).map((_, i) => {
            const tarea = pendingTasks[i];

            if (!tarea) {
              // Slot vacío invisible — mantiene la altura
              return (
                <div
                  key={`empty-${i}`}
                  className="flex items-stretch gap-3 rounded-xl border border-transparent overflow-hidden invisible"
                  aria-hidden
                >
                  <div className="w-1 shrink-0" />
                  <div className="flex-1 min-w-0 py-2.5 pr-3">
                    <p className="text-sm font-semibold">&nbsp;</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs px-1.5 py-0.5 rounded-full">&nbsp;</span>
                    </div>
                  </div>
                </div>
              );
            }

            const dueDate = dayjs(tarea.fechaVencimiento);
            const isOverdue = dueDate.isBefore(today, "day");
            const isToday = dueDate.isSame(today, "day");
            const cfg =
              PRIORITY_CONFIG[tarea.prioridad as keyof typeof PRIORITY_CONFIG] ??
              PRIORITY_CONFIG.BAJA;

            return (
              <div
                key={tarea.idTarea}
                className="flex items-stretch gap-3 bg-gray-50/80 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 overflow-hidden"
              >
                {/* Left priority bar */}
                <div
                  className="w-1 shrink-0 rounded-l-xl"
                  style={{ backgroundColor: cfg.color }}
                />
                {/* Content */}
                <div className="flex-1 min-w-0 py-2.5 pr-3">
                  <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                    {tarea.asunto}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${cfg.color}18`,
                        color: cfg.color,
                      }}
                    >
                      {cfg.label}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        isOverdue
                          ? "text-rose-600"
                          : isToday
                            ? "text-amber-600"
                            : "text-gray-400"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {isOverdue ? "Vencida" : isToday ? "Hoy" : dueDate.format("D MMM")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-[#003d5c]" />
            <span className="text-sm text-gray-400">Próximas</span>
            <span className="text-sm font-bold text-[#003d5c]">
              {pendingTasks.length}
            </span>
          </div>
          {overdueCount > 0 && (
            <div className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              <span className="text-xs font-semibold">
                {overdueCount} {overdueCount === 1 ? "vencida" : "vencidas"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
