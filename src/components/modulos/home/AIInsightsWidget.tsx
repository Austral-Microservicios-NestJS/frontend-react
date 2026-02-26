import { Card } from "@/components/ui/card";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import type { Insight } from "@/services/dashboard.service";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ButtonIA } from "@/components/ui/ButtonIA";
import { useAuthStore } from "@/store/auth.store";

const getInsightIcon = (tipo: Insight["tipo"]) => {
  switch (tipo) {
    case "alerta":
      return <AlertTriangle className="w-3.5 h-3.5" />;
    case "oportunidad":
      return <TrendingUp className="w-3.5 h-3.5" />;
    case "sugerencia":
      return <Lightbulb className="w-3.5 h-3.5" />;
    default:
      return <Sparkles className="w-3.5 h-3.5" />;
  }
};

const getInsightStyle = (
  tipo: Insight["tipo"],
  prioridad: Insight["prioridad"],
) => {
  if (tipo === "alerta") {
    return prioridad === "alta"
      ? "text-red-600 bg-red-50"
      : "text-orange-600 bg-orange-50";
  }
  if (tipo === "oportunidad") {
    return "text-emerald-600 bg-emerald-50";
  }
  return "text-blue-600 bg-blue-50";
};

export const AIInsightsWidget = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isBroker = user?.rol?.nombreRol?.toUpperCase() === "BROKER";
  const { data, isLoading, error, refetch } = dashboardService.useGetInsights({
    incluirNoticias: true,
    incluirContextos: true,
    limite: 5,
    ...(isBroker
      ? { userId: user?.idUsuario, userRole: user?.rol?.nombreRol }
      : {}),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const params = {
      incluirNoticias: true,
      incluirContextos: true,
      limite: 5,
      ...(isBroker
        ? { userId: user?.idUsuario, userRole: user?.rol?.nombreRol }
        : {}),
    };
    await dashboardService.refreshInsights(params);
    await refetch();
    setIsRefreshing(false);
  };

  // Estado de carga
  if (isLoading) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <span className="absolute inset-0 aurora-bg rounded-lg opacity-90" />
              <div className="relative p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm ml-2">
                Radar Comercial
              </h3>
              <p className="text-[10px] text-gray-400 ml-2">
                Powered by Austral AI
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            <p className="text-xs text-gray-500">Analizando noticias...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <span className="absolute inset-0 aurora-bg rounded-lg opacity-90" />
              <div className="relative p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm ml-2">
                Radar Comercial
              </h3>
              <p className="text-[10px] text-gray-400 ml-2">
                Powered by Austral AI
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <p className="text-xs text-gray-500">Error al cargar</p>
            <button
              onClick={handleRefresh}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Card>
    );
  }

  const insights = data?.insights || [];

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        {/* Header con Aurora Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute inset-0 aurora-bg rounded-lg opacity-90" />
              <div className="relative p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm ml-2">
                Radar Comercial
              </h3>
              <p className="text-[10px] text-gray-400 ml-2">
                Powered by Austral AI
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-gray-400 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Lista compacta */}
        <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <Sparkles className="w-5 h-5 text-gray-300 mb-2" />
              <p className="text-xs text-gray-500">Sin insights</p>
            </div>
          ) : (
            insights.slice(0, 3).map((insight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div
                  className={`p-1.5 rounded-md ${getInsightStyle(insight.tipo, insight.prioridad)}`}
                >
                  {getInsightIcon(insight.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {insight.titulo}
                  </p>
                  {insight.clienteAfectado && (
                    <p className="text-[10px] text-gray-500 truncate">
                      {insight.clienteAfectado.nombre}
                    </p>
                  )}
                </div>
                {insight.prioridad === "alta" && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer con ButtonIA */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link to="/dashboard/agentes-ia/insights">
            <ButtonIA className="w-full">Ver análisis completo</ButtonIA>
          </Link>
        </div>
      </div>
    </Card>
  );
};
