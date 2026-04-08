import { useClientes } from "@/hooks/useCliente";
import { usePolizas } from "@/hooks/usePolizas";
import { useLeads } from "@/hooks/useLeads";
import { Users, Shield, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const StatsRowWidget = () => {
  const { clientes, clientesActivos, isLoading: loadingClientes } = useClientes();
  const { polizas, isLoading: loadingPolizas } = usePolizas();
  const { leads } = useLeads();
  const navigate = useNavigate();

  const polizasVigentes = polizas.filter((p) => p.estado === "VIGENTE").length;

  const hoy = dayjs();
  const en30dias = hoy.add(30, "day");
  const porVencer = polizas.filter((p) => {
    const fin = dayjs(p.vigenciaFin);
    return fin.isAfter(hoy) && fin.isBefore(en30dias) && p.estado === "VIGENTE";
  }).length;

  const leadsActivos = leads.filter(
    (l) => l.estado === "NUEVO" || l.estado === "CONTACTADO" || l.estado === "COTIZADO" || l.estado === "EMITIDO",
  ).length;

  const stats = [
    {
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      arrowColor: "text-blue-500",
      label: "Mis Clientes",
      value: loadingClientes ? "—" : clientes.length,
      sub: loadingClientes ? "" : `${clientesActivos.length} activos`,
      path: "/dashboard/gestion-trabajo/clientes",
    },
    {
      icon: Shield,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      arrowColor: "text-emerald-500",
      label: "Mis Pólizas",
      value: loadingPolizas ? "—" : polizas.length,
      sub: loadingPolizas ? "" : `${polizasVigentes} vigentes`,
      path: "/dashboard/gestion-trabajo/polizas",
    },
    {
      icon: porVencer > 0 ? AlertTriangle : TrendingUp,
      iconBg: porVencer > 0 ? "bg-amber-50" : "bg-indigo-50",
      iconColor: porVencer > 0 ? "text-amber-500" : "text-indigo-600",
      arrowColor: porVencer > 0 ? "text-amber-500" : "text-indigo-500",
      label: "Por Vencer",
      value: loadingPolizas ? "—" : porVencer,
      sub: loadingPolizas ? "" : `${leadsActivos} leads activos`,
      path: "/dashboard/gestion-trabajo/polizas",
    },
  ];

  return (
    <div className="flex flex-col gap-3 h-full">
      {stats.map((s) => (
        <button
          key={s.label}
          onClick={() => navigate(s.path)}
          className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-4 hover:shadow-md transition-shadow text-left group"
        >
          {/* Ícono */}
          <div className={`${s.iconBg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
            <s.icon className={`w-5 h-5 ${s.iconColor}`} />
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 leading-tight">{s.value}</p>
            {s.sub && <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>}
          </div>

          {/* Flecha */}
          <ArrowUpRight className={`w-4 h-4 ${s.arrowColor} shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`} />
        </button>
      ))}
    </div>
  );
};
