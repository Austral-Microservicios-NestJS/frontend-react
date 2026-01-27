import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeads } from "@/hooks/useLeads";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const LeadsSummaryWidget = () => {
  const { leadsByEstado, isLoading } = useLeads();

  const data = [
    { name: "Nuevos", value: leadsByEstado.NUEVO.length, color: "#3b82f6" }, // blue-500
    {
      name: "Contactados",
      value: leadsByEstado.CONTACTADO.length,
      color: "#f59e0b",
    }, // amber-500
    { name: "Cerrados", value: leadsByEstado.CERRADO.length, color: "#10b981" }, // emerald-500
    { name: "Perdidos", value: leadsByEstado.PERDIDO.length, color: "#f43f5e" }, // rose-500
  ];

  const totalLeads = data.reduce((acc, item) => acc + item.value, 0);
  const tasaConversion =
    totalLeads > 0
      ? ((leadsByEstado.CERRADO.length / totalLeads) * 100).toFixed(1)
      : "0.0";

  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-gray-200">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-bold text-gray-900">
            Mis Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex items-center justify-center h-[200px]">
          <div className="w-32 h-32 rounded-full border-4 border-gray-100 border-t-indigo-500 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all bg-white group relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -ml-12 -mb-12 opacity-50 pointer-events-none" />

      <div className="p-4 h-full flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#003d5c] p-1.5 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg ml-2">
              Resumen de Leads
            </h3>
          </div>
          <Link
            to="/dashboard/gestion-trabajo/leads"
            className="text-xs font-bold text-white bg-[#003d5c] px-3 py-1.5 rounded-md hover:opacity-90 shadow-sm hover:shadow transition-all flex items-center gap-1.5 group/link"
          >
            Ver tablero
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-1.5">Total</p>
            <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-1.5">
              Contactados
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {leadsByEstado.CONTACTADO.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-1.5">
              Cerrados
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {leadsByEstado.CERRADO.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-1.5">
              Conversión
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {tasaConversion}%
            </p>
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="h-[180px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 14, fontWeight: 600, fill: "#4b5563" }}
                width={90}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ fontSize: "12px", fontWeight: 600 }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
