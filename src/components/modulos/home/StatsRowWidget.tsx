import { Card } from "@/components/ui/card";
import { useClientes } from "@/hooks/useCliente";
import { usePolizas } from "@/hooks/usePolizas";
import { useLeads } from "@/hooks/useLeads";
import { Users, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import dayjs from "dayjs";

export const StatsRowWidget = () => {
  const { clientes, clientesActivos, isLoading: loadingClientes } = useClientes();
  const { polizas, isLoading: loadingPolizas } = usePolizas();
  const { leads } = useLeads();

  const polizasVigentes = polizas.filter((p) => p.estado === "VIGENTE").length;

  const hoy = dayjs();
  const en30dias = hoy.add(30, "day");
  const porVencer = polizas.filter((p) => {
    const fin = dayjs(p.vigenciaFin);
    return fin.isAfter(hoy) && fin.isBefore(en30dias) && p.estado === "VIGENTE";
  }).length;

  const leadsActivos = leads.filter(
    (l) => l.estado === "NUEVO" || l.estado === "EN_PROCESO" || l.estado === "COTIZADO",
  ).length;

  const stats = [
    {
      icon: Users,
      iconBg: "bg-[#003d5c]",
      label: "Mis Clientes",
      value: loadingClientes ? "—" : clientes.length,
      badge: loadingClientes ? null : `${clientesActivos.length} activos`,
      badgeColor: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: Shield,
      iconBg: "bg-[#003d5c]",
      label: "Mis Pólizas",
      value: loadingPolizas ? "—" : polizas.length,
      badge: loadingPolizas ? null : `${polizasVigentes} vigentes`,
      badgeColor: "bg-blue-50 text-blue-700",
    },
    {
      icon: porVencer > 0 ? AlertTriangle : TrendingUp,
      iconBg: porVencer > 0 ? "bg-amber-400" : "bg-[#003d5c]",
      label: "Por Vencer",
      value: loadingPolizas ? "—" : porVencer,
      badge: loadingPolizas ? null : `${leadsActivos} leads activos`,
      badgeColor: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="flex-1 border-none shadow-sm ring-1 ring-[#003d5c]/10 bg-white overflow-hidden relative"
        >
          <div className="px-4 py-3 flex items-center gap-4 h-full">
            {/* Icon */}
            <div className={`${s.iconBg} p-2 rounded-lg shrink-0`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            {/* Number */}
            <span className="text-3xl font-black text-gray-900 leading-none shrink-0">
              {s.value}
            </span>
            {/* Text */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-gray-500 leading-tight">
                {s.label}
              </span>
              {s.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 w-fit ${s.badgeColor}`}>
                  {s.badge}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
