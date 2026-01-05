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
    <Card className="h-full border-none shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-[--austral-azul] rounded-md">
              <User className="w-4 h-4" />
            </div>
            Clientes Recientes
          </CardTitle>
          <Link
            to="/dashboard/gestion-trabajo/clientes"
            className="text-xs font-medium text-[--austral-azul] hover:text-[#002855] hover:underline flex items-center gap-1"
          >
            Ver todos
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {recentClients.length > 0 ? (
            recentClients.map((cliente) => (
              <div
                key={cliente.idCliente}
                className="flex items-center p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold text-xs shrink-0 group-hover:bg-blue-50 group-hover:text-[--austral-azul] transition-colors">
                  {cliente.nombres?.charAt(0) ||
                    cliente.razonSocial?.charAt(0) ||
                    "C"}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {cliente.tipoPersona === "NATURAL"
                      ? `${cliente.nombres} ${cliente.apellidos}`
                      : cliente.razonSocial}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {cliente.numeroDocumento}
                  </p>
                </div>
                <div className="text-xs text-gray-400 flex flex-col items-end">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {dayjs(cliente.fechaCreacion).format("DD MMM")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No hay clientes registrados aún.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
