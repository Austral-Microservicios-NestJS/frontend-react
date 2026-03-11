/**
 * Dashboard para PROMOTOR_VENTA (Vendedor)
 * Vista centrada en leads propios y tareas.
 * Sin mapa, sin políticas, sin Radar Comercial.
 * Acceso rápido a crear lead — su acción principal.
 */
import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";
import { Card } from "@/components/ui/card";
import { Target, TrendingUp, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

/** Banner motivacional con acceso rápido a leads */
const LeadsCTAWidget = () => (
  <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 bg-gradient-to-br from-[#003d5c] to-[#00527a] text-white overflow-hidden relative flex flex-col p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-white/20 p-2 rounded-lg">
        <Target className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-white text-base">Tu enfoque hoy</h3>
        <p className="text-white/70 text-xs">Captación y seguimiento de leads</p>
      </div>
    </div>

    <div className="flex flex-col gap-2 flex-1">
      <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
        <TrendingUp className="w-4 h-4 text-white/80 shrink-0" />
        <p className="text-sm text-white/90">
          Registra cada prospecto aunque sea básico — los detalles se completan después.
        </p>
      </div>
    </div>

    <Link
      to="/dashboard/gestion-trabajo/leads"
      className="mt-4 flex items-center justify-center gap-2 bg-white text-[#003d5c] font-semibold text-sm py-2.5 rounded-xl hover:bg-white/90 transition-colors"
    >
      <PlusCircle className="w-4 h-4" />
      Ir a mis leads
    </Link>
  </Card>
);

export const DashboardVendedor = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
    {/* Fila 1: CTA + Leads + Tareas */}
    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <LeadsCTAWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <LeadsSummaryWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <TasksWidget />
    </div>

    {/* Fila 2: Austral AI */}
    <div className="col-span-1 md:col-span-2 lg:col-span-6">
      <AustralAIPromo />
    </div>
  </div>
);
