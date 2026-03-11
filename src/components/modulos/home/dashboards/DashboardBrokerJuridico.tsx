/**
 * Dashboard para BROKER (Broker Jurídico)
 * Vista: Mi Red + Leads de la red + Tareas + Stats + Austral AI
 * MVP: conteos de red son estáticos (—). Futuro: endpoint /usuarios/mi-red
 */
import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { StatsRowWidget } from "@/components/modulos/home/StatsRowWidget";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";
import { AIInsightsWidget } from "@/components/modulos/home/AIInsightsWidget";
import { RedBrokerWidget } from "@/components/modulos/home/RedBrokerWidget";

export const DashboardBrokerJuridico = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
    {/* Fila 1: Mi Red + Tareas + Leads */}
    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <RedBrokerWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <TasksWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <LeadsSummaryWidget />
    </div>

    {/* Fila 2: Radar Comercial + Stats + Austral AI */}
    <div className="col-span-1 md:col-span-1 lg:col-span-6">
      <AIInsightsWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-2">
      <StatsRowWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <AustralAIPromo />
    </div>
  </div>
);
