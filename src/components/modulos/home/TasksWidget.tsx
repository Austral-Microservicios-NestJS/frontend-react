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
    <Card className="h-full border-none shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[--austral-azul] rounded-md">
            <CheckSquare className="w-4 h-4" />
          </div>
          Tareas Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((tarea) => {
              const dueDate = dayjs(tarea.fechaVencimiento);
              const isOverdue = dueDate.isBefore(today, "day");

              return (
                <div
                  key={tarea.idTarea}
                  className="group flex flex-col p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-[--austral-azul] transition-colors">
                      {tarea.asunto}
                    </h4>
                    {isOverdue && (
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        tarea.prioridad === "ALTA"
                          ? "bg-red-50 text-red-700 border-red-100"
                          : tarea.prioridad === "MEDIA"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {tarea.prioridad}
                    </span>
                    <span
                      className={`text-xs flex items-center gap-1 ${
                        isOverdue ? "text-red-600 font-medium" : "text-gray-400"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {dueDate.format("D MMM")}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                ¡Todo al día! No hay tareas urgentes.
              </p>
            </div>
          )}

          <Link
            to="/dashboard/gestion-trabajo/tareas"
            className="block text-center text-xs font-medium text-gray-500 hover:text-[--austral-azul] hover:underline mt-2 pt-2 border-t border-gray-50"
          >
            Ver todas las tareas
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
