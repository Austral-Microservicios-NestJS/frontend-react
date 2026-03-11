/**
 * Dashboard para BROKER NATURAL (persona natural corredora)
 * Vista: Tareas + Leads + Stats + Austral AI
 * Sin Mapa, sin Radar Comercial en MVP (puede activarse si el broker lo necesita)
 */
import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { StatsRowWidget } from "@/components/modulos/home/StatsRowWidget";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";
import { MapWidget } from "@/components/modulos/home/MapWidget";

export const DashboardBrokerNatural = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
    {/* Fila 1: Tareas + Leads + Mapa */}
    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <TasksWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <LeadsSummaryWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-2 flex flex-col gap-4 lg:h-full">
      <div className="min-h-0" style={{ flex: "7 1 0%" }}>
        <MapWidget />
      </div>
      <div className="min-h-0" style={{ flex: "3 1 2%" }}>
        <AustralAIPromo />
      </div>
    </div>

    {/* Fila 2: Stats */}
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <StatsRowWidget />
    </div>
  </div>
);
