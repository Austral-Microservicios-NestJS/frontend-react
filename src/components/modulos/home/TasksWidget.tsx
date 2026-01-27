import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTareas } from "@/hooks/useTareas";
import { CheckSquare, Clock } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import "dayjs/locale/es";

dayjs.locale("es");

export const TasksWidget = () => {
  const { tareas, isLoading } = useTareas();

  // Filter tasks: Pending/In Progress + Due date logic
  const today = dayjs();
  const nextWeek = today.add(7, "day");

  const pendingTasks = tareas
    .filter((t) => t.estado !== "COMPLETADA")
    .filter((t) => {
      const dueDate = dayjs(t.fechaVencimiento);
      // Include if overdue or due within next 7 days
      return dueDate.isBefore(nextWeek);
    })
    .sort((a, b) => {
      // Sort by due date (earliest first)
      return dayjs(a.fechaVencimiento).diff(dayjs(b.fechaVencimiento));
    })
    .slice(0, 5); // Show top 5

  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-900">
            Tareas Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-50 rounded-md animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all bg-white relative overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#003d5c] p-1.5 rounded-lg">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg ml-2">
              Tareas Pendientes
            </h3>
          </div>
        </div>
        {/* Lista de Tareas */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((tarea) => {
                const dueDate = dayjs(tarea.fechaVencimiento);
                const isOverdue = dueDate.isBefore(today, "day");

                return (
                  <div
                    key={tarea.idTarea}
                    className="group flex flex-col p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all border border-[#003d5c]/10 hover:border-[#003d5c]/30 relative overflow-hidden hover:-translate-y-0.5"
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Priority Indicator Dot */}
                    <div className="absolute top-3 right-3 flex gap-1 z-10">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tarea.prioridad === "ALTA"
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"
                            : tarea.prioridad === "MEDIA"
                              ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                              : "bg-emerald-500"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1 mb-2 pr-4 relative z-10">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#003d5c] transition-colors leading-snug">
                        {tarea.asunto}
                      </h4>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#003d5c]/10 relative z-10">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                          tarea.prioridad === "ALTA"
                            ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600"
                            : tarea.prioridad === "MEDIA"
                              ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-600"
                              : "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600"
                        }`}
                      >
                        {tarea.prioridad}
                      </span>
                      <span
                        className={`text-[10px] flex items-center gap-1 font-semibold ${
                          isOverdue
                            ? "text-red-600 bg-red-100 px-2 py-1 rounded-full"
                            : "text-gray-500"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {isOverdue ? "Vencida" : dueDate.format("D MMM")}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 via-emerald-200 to-teal-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <CheckSquare className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-gray-900">¡Todo al día!</p>
                <p className="text-xs text-gray-500 mt-1">
                  No tienes tareas pendientes.
                </p>
              </div>
            )}

            <Link
              to="/dashboard/gestion-trabajo/tareas"
              className="block text-center text-xs font-bold text-[#003d5c] hover:text-[#003d5c]/80 hover:bg-blue-50 py-2 rounded-lg transition-all mt-2"
            >
              Ver todas las tareas →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
