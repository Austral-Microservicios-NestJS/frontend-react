/**
 * Dashboard para ADMINISTRADOR y EJECUTIVO_CUENTA
 * Vista completa: tareas, leads, mapa, AI insights, stats, acciones rápidas.
 */
import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { AIInsightsWidget } from "@/components/modulos/home/AIInsightsWidget";
import { MapWidget } from "@/components/modulos/home/MapWidget";
import { StatsRowWidget } from "@/components/modulos/home/StatsRowWidget";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";

export const DashboardAdminEjecutivo = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
    {/* Fila 1 — Tareas + Leads + Mapa (span 2 filas) + AustralAI (bajo mapa) */}
    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <TasksWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <LeadsSummaryWidget />
    </div>

    {/* Columna derecha: Mapa alto + Austral AI bajo */}
    <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 flex flex-col gap-4 lg:h-full">
      <div className="min-h-0" style={{ flex: "7 1 0%" }}>
        <MapWidget />
      </div>
      <div className="min-h-0" style={{ flex: "3 1 2%" }}>
        <AustralAIPromo />
      </div>
    </div>

    {/* Fila 2 — Radar Comercial + Stats */}
    <div className="col-span-1 md:col-span-1 lg:col-span-6">
      <AIInsightsWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-2">
      <StatsRowWidget />
    </div>
  </div>
);
