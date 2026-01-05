import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTareas } from "@/hooks/useTareas";
import { CheckSquare, Clock, AlertCircle } from "lucide-react";
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
    <Card className="h-full border-none shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" />

      <CardHeader className="pb-2 pt-3 px-3 relative z-10">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2 ml-1">
          <CheckSquare className="w-5 h-5 text-orange-500" />
          Tareas Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-2 pb-2 relative z-10">
        <div className="space-y-2 h-[220px] overflow-y-auto pr-1 custom-scrollbar">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((tarea) => {
              const dueDate = dayjs(tarea.fechaVencimiento);
              const isOverdue = dueDate.isBefore(today, "day");

              return (
                <div
                  key={tarea.idTarea}
                  className="group flex flex-col p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-orange-200 relative overflow-hidden"
                >
                  {/* Priority Indicator Dot */}
                  <div className="absolute top-2.5 right-2.5 flex gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tarea.prioridad === "ALTA"
                          ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                          : tarea.prioridad === "MEDIA"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1 mb-1 pr-4">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                      {tarea.asunto}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-1 border-t border-gray-50">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        tarea.prioridad === "ALTA"
                          ? "bg-red-50 text-red-600"
                          : tarea.prioridad === "MEDIA"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {tarea.prioridad}
                    </span>
                    <span
                      className={`text-[10px] flex items-center gap-1 font-semibold ${
                        isOverdue
                          ? "text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full"
                          : "text-gray-400"
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
            <div className="flex flex-col items-center justify-center h-full text-center p-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <CheckSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-900">¡Todo al día!</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                No tienes tareas pendientes.
              </p>
            </div>
          )}

          <Link
            to="/dashboard/gestion-trabajo/tareas"
            className="block text-center text-[10px] font-bold text-gray-400 hover:text-orange-500 hover:bg-orange-50 py-1.5 rounded-lg transition-all mt-1"
          >
            Ver todas las tareas
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
