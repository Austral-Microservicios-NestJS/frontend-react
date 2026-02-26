import { Card } from "@/components/ui/card";
import { useLeads } from "@/hooks/useLeads";
import { Users, ArrowRight, TrendingUp, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STATUS_CONFIG = [
  {
    key: "NUEVO" as const,
    label: "Nuevos",
    color: "#6366f1",
    light: "#eef2ff",
    textColor: "text-indigo-600",
  },
  {
    key: "EN_PROCESO" as const,
    label: "En proceso",
    color: "#3b82f6",
    light: "#eff6ff",
    textColor: "text-blue-600",
  },
  {
    key: "COTIZADO" as const,
    label: "Cotizados",
    color: "#f59e0b",
    light: "#fffbeb",
    textColor: "text-amber-600",
  },
  {
    key: "CERRADO" as const,
    label: "Cerrados",
    color: "#10b981",
    light: "#ecfdf5",
    textColor: "text-emerald-600",
  },
  {
    key: "PERDIDO" as const,
    label: "Perdidos",
    color: "#f43f5e",
    light: "#fff1f2",
    textColor: "text-rose-500",
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 text-xs">
        <p className="font-semibold text-gray-800">{d.label}</p>
        <p style={{ color: d.color }} className="font-bold text-base">
          {d.value}
        </p>
      </div>
    );
  }
  return null;
};

export const LeadsSummaryWidget = () => {
  const { leadsByEstado, isLoading } = useLeads();

  const data = STATUS_CONFIG.map((s) => ({
    ...s,
    value: leadsByEstado[s.key]?.length ?? 0,
  }));

  const totalLeads = data.reduce((acc, item) => acc + item.value, 0);
  const tasaConversion =
    totalLeads > 0
      ? ((leadsByEstado.CERRADO.length / totalLeads) * 100).toFixed(1)
      : "0.0";

  const hotLeads = leadsByEstado.NUEVO.length;

  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-gray-200">
        <div className="p-4 h-full flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-indigo-500 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all bg-white overflow-hidden relative flex flex-col">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#003d5c]" />

      <div className="px-4 pt-3 pb-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#003d5c] p-1.5 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">
              Resumen de Leads
            </h3>
          </div>
          <Link
            to="/dashboard/gestion-trabajo/leads"
            className="flex items-center gap-1 text-sm font-semibold text-[#003d5c] hover:text-[#003d5c]/70 transition-colors group/link"
          >
            Ver tablero
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>

        {/* Body: donut + stats */}
        <div className="flex items-center gap-4 flex-1 min-h-0">
          {/* Donut chart */}
          <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalLeads === 0 ? [{ value: 1, color: "#e5e7eb", label: "", light: "", textColor: "", key: "NUEVO" as const }] : data}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={totalLeads === 0 ? 0 : 3}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {(totalLeads === 0
                    ? [{ color: "#e5e7eb" }]
                    : data
                  ).map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                {totalLeads > 0 && <Tooltip content={<CustomTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-black text-gray-900 leading-none">
                {totalLeads}
              </p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                leads
              </p>
            </div>
          </div>

          {/* Stat rows */}
          <div className="flex flex-col gap-2.5 flex-1 min-w-0">
            {data.map((item) => {
              const pct = totalLeads > 0 ? (item.value / totalLeads) * 100 : 0;
              return (
                <div key={item.key} className="flex items-center gap-2 group">
                  {/* Dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {/* Label */}
                  <span className="text-sm text-gray-500 w-22 shrink-0">
                    {item.label}
                  </span>
                  {/* Bar */}
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  {/* Count */}
                  <span
                    className="text-sm font-bold w-5 text-right shrink-0"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-sm text-gray-400">Conversión</span>
            <span className="text-sm font-bold text-emerald-600">
              {tasaConversion}%
            </span>
          </div>
          {hotLeads > 0 && (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3" />
              <span className="text-xs font-semibold">
                {hotLeads} {hotLeads === 1 ? "nuevo" : "nuevos"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
