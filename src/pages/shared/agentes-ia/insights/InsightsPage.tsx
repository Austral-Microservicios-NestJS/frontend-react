import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  Loader2,
  Clock,
  User,
  Newspaper,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboard.service";
import type { Insight } from "@/services/dashboard.service";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/auth.store";

const getInsightIcon = (tipo: Insight["tipo"], size = "w-5 h-5") => {
  switch (tipo) {
    case "alerta":
      return <AlertTriangle className={size} />;
    case "oportunidad":
      return <TrendingUp className={size} />;
    case "sugerencia":
    case "recomendacion":
      return <Lightbulb className={size} />;
    default:
      return <Sparkles className={size} />;
  }
};

const getInsightColors = (
  tipo: Insight["tipo"],
  prioridad: Insight["prioridad"],
) => {
  if (tipo === "alerta") {
    return prioridad === "alta"
      ? {
          gradient: "from-red-500 to-rose-600",
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: "text-red-500",
          ring: "ring-red-500/20",
        }
      : {
          gradient: "from-orange-500 to-amber-600",
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          icon: "text-orange-500",
          ring: "ring-orange-500/20",
        };
  }
  if (tipo === "oportunidad") {
    return {
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: "text-emerald-500",
      ring: "ring-emerald-500/20",
    };
  }
  return {
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "text-blue-500",
    ring: "ring-blue-500/20",
  };
};

type TabType = "todos" | "alertas" | "oportunidades" | "recomendaciones";

export default function InsightsPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("todos");
  const user = useAuthStore((state) => state.user);
  const isBroker = user?.rol?.nombreRol?.toUpperCase() === "BROKER";

  const { data, isLoading, error, refetch } = dashboardService.useGetInsights({
    incluirNoticias: true,
    incluirContextos: true,
    limite: 20,
    ...(isBroker
      ? { userId: user?.idUsuario, userRole: user?.rol?.nombreRol }
      : {}),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidar cache y obtener insights frescos
      const params = {
        incluirNoticias: true,
        incluirContextos: true,
        limite: 20,
        ...(isBroker
          ? { userId: user?.idUsuario, userRole: user?.rol?.nombreRol }
          : {}),
      };
      await dashboardService.refreshInsights(params);
      await refetch();
    } catch (error) {
      console.error("Error al actualizar insights:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const insights = data?.insights || [];

  // Separar por tipo
  const alertas = insights.filter((i) => i.tipo === "alerta");
  const oportunidades = insights.filter((i) => i.tipo === "oportunidad");
  const recomendaciones = insights.filter(
    (i) => i.tipo === "recomendacion" || i.tipo === "sugerencia",
  );

  // Filtrar según tab activo
  const filteredInsights =
    activeTab === "todos"
      ? insights
      : activeTab === "alertas"
        ? alertas
        : activeTab === "oportunidades"
          ? oportunidades
          : recomendaciones;

  const tabs = [
    {
      id: "todos" as TabType,
      label: "Todos",
      count: insights.length,
      color: "purple",
    },
    {
      id: "alertas" as TabType,
      label: "Alertas",
      count: alertas.length,
      color: "red",
    },
    {
      id: "oportunidades" as TabType,
      label: "Oportunidades",
      count: oportunidades.length,
      color: "emerald",
    },
    {
      id: "recomendaciones" as TabType,
      label: "Recomendaciones",
      count: recomendaciones.length,
      color: "blue",
    },
  ];

  return (
    <>
      <Header
        title="Radar Comercial"
        description="Powered by Austral AI"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </Header>

      {/* Estado de carga */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative inline-flex">
              <span className="absolute inset-0 aurora-bg rounded-full opacity-60 animate-pulse" />
              <div className="relative p-4 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Analizando datos con IA...
            </p>
          </div>
        </div>
      )}

      {/* Estado de error */}
      {error && !isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">
              Error al cargar insights
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {!isLoading && !error && (
        <div className="p-4 space-y-4">
          {/* Tabs de filtro */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#003d5c] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Grid de Insights */}
          {filteredInsights.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredInsights.map((insight, index) => (
                <InsightCard key={insight.id || index} insight={insight} />
              ))}
            </div>
          ) : (
            <Card className="p-12 border-none shadow-sm ring-1 ring-gray-200">
              <div className="text-center">
                <div className="relative inline-flex mb-4">
                  <span className="absolute inset-0 aurora-bg rounded-full opacity-40" />
                  <div className="relative p-4 rounded-full">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Sin insights en esta categoría
                </h3>
                <p className="text-sm text-gray-500">
                  Prueba con otra categoría o actualiza los datos
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

// Componente de tarjeta de insight mejorado
const InsightCard = ({ insight }: { insight: Insight }) => {
  const colors = getInsightColors(insight.tipo, insight.prioridad);

  return (
    <Card
      className={`group relative overflow-hidden border-none shadow-sm ring-1 ${colors.ring} hover:shadow-xl transition-all duration-300`}
    >
      {/* Gradient accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl ${colors.bg} ${colors.icon}`}>
            {getInsightIcon(insight.tipo, "w-6 h-6")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}
              >
                {insight.tipo}
              </span>
              {insight.prioridad === "alta" && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Urgente
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">
              {insight.titulo}
            </h3>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {insight.descripcion}
        </p>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {insight.clienteAfectado && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">
                {insight.clienteAfectado.nombre}
              </span>
            </div>
          )}
          {insight.urgencia && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 rounded-lg text-xs text-orange-700">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{insight.urgencia}</span>
            </div>
          )}
        </div>

        {/* Acción recomendada */}
        {insight.accion && (
          <div className={`p-3 rounded-xl ${colors.bg} mb-4`}>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-0.5">
                  Acción sugerida
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {insight.accion}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer con link a noticia */}
        {insight.noticiaRelacionada && (
          <a
            href={insight.noticiaRelacionada.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group/link"
          >
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Fuente</p>
                <p className="text-sm font-medium text-gray-700">
                  {insight.noticiaRelacionada.fuente}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-purple-600 text-xs font-medium">
              Ver más
              <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
            </div>
          </a>
        )}
      </div>
    </Card>
  );
};
