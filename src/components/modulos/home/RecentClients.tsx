import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientes } from "@/hooks/useCliente";
import { User, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import "dayjs/locale/es";

// Set locale globally
dayjs.locale("es");

export const RecentClients = () => {
  const { clientes, isLoading } = useClientes();

  // Get last 3 clients sorted by creation date
  const recentClients = [...clientes]
    .sort((a, b) => {
      return dayjs(b.fechaCreacion).diff(dayjs(a.fechaCreacion));
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-900">
            Clientes Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-50 rounded-md animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all bg-white">
      <CardHeader className="pb-2 pt-3 px-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <div className="p-1 bg-blue-50 text-[--austral-azul] rounded-lg">
              <User className="w-3.5 h-3.5" />
            </div>
            Clientes Recientes
          </CardTitle>
          <Link
            to="/dashboard/gestion-trabajo/clientes"
            className="text-[10px] font-bold text-[--austral-azul] bg-blue-50 px-2 py-0.5 rounded-full hover:bg-[--austral-azul] hover:text-white transition-all flex items-center gap-1"
          >
            Ver todos
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-1 gap-1.5">
          {recentClients.length > 0 ? (
            recentClients.map((cliente) => (
              <div
                key={cliente.idCliente}
                className="flex items-center p-2 bg-gray-50/50 rounded-lg hover:bg-white hover:shadow-sm hover:scale-[1.01] transition-all border border-transparent hover:border-gray-100 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white text-[--austral-azul] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ring-1 ring-gray-100 group-hover:ring-[--austral-azul] transition-all">
                  {cliente.nombres?.charAt(0) ||
                    cliente.razonSocial?.charAt(0) ||
                    "C"}
                </div>
                <div className="ml-2 flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[--austral-azul] transition-colors">
                    {cliente.tipoPersona === "NATURAL"
                      ? `${cliente.nombres} ${cliente.apellidos}`
                      : cliente.razonSocial}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500 bg-white px-1 py-0 rounded border border-gray-100">
                      {cliente.numeroDocumento}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 flex flex-col items-end pl-2">
                  <span className="flex items-center gap-1 font-medium bg-white px-1 py-0 rounded shadow-sm">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {dayjs(cliente.fechaCreacion).format("DD MMM")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <User className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-[10px] font-medium text-gray-500">
                No hay clientes registrados aún.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
