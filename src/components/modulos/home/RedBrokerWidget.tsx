import { Card } from "@/components/ui/card";
import { Users, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * MVP — Datos estáticos por ahora.
 * Futuro: llamada a /usuarios/mi-red?idBroker=xxx para obtener conteos reales.
 */
export const RedBrokerWidget = () => {
  const items = [
    {
      label: "Brokers Naturales",
      count: "—",
      color: "#003d5c",
      bg: "#eef4f7",
      icon: Users,
    },
    {
      label: "Vendedores",
      count: "—",
      color: "#6366f1",
      bg: "#eef2ff",
      icon: TrendingUp,
    },
    {
      label: "Puntos de Venta",
      count: "—",
      color: "#10b981",
      bg: "#ecfdf5",
      icon: MapPin,
    },
  ];

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all bg-white overflow-hidden relative flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#003d5c]" />

      <div className="px-4 pt-3 pb-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#003d5c] p-1.5 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Mi Red</h3>
          </div>
          <Link
            to="/dashboard/broker/agentes"
            className="flex items-center gap-1 text-sm font-semibold text-[#003d5c] hover:text-[#003d5c]/70 transition-colors group/link"
          >
            Gestionar
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-3 flex-1">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: item.bg }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}18` }}
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </div>
              <span
                className="text-lg font-black"
                style={{ color: item.color }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Conteo en tiempo real — próxima versión
          </p>
        </div>
      </div>
    </Card>
  );
};
