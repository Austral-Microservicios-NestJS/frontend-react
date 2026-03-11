/**
 * Dashboard para PUNTO_VENTA
 * Vista: Stats de su punto (clientes + pólizas) + Tareas.
 * Sin leads, sin mapa, sin Radar Comercial.
 * Simple y enfocado en la operación diaria del local.
 */
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { StatsRowWidget } from "@/components/modulos/home/StatsRowWidget";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/** Card informativa del punto de venta */
const InfoPuntoVentaWidget = () => (
  <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 bg-white overflow-hidden relative flex flex-col p-5">
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" />

    <div className="flex items-center gap-2 mb-5">
      <div className="bg-emerald-50 p-1.5 rounded-lg">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
      </div>
      <h3 className="font-semibold text-gray-900 text-base">Mi Punto de Venta</h3>
    </div>

    <div className="flex flex-col gap-3 flex-1">
      <Link
        to="/dashboard/gestion-trabajo/clientes"
        className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-[#003d5c]" />
          <span className="text-sm font-medium text-gray-700">Ver mis clientes</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#003d5c] transition-colors" />
      </Link>

      <Link
        to="/dashboard/gestion-trabajo/polizas"
        className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-gray-700">Ver mis pólizas</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
      </Link>
    </div>

    <p className="mt-4 text-xs text-gray-400 text-center pt-3 border-t border-gray-100">
      Solo ves los registros asignados a tu punto de venta
    </p>
  </Card>
);

export const DashboardPuntoVenta = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
    {/* Fila 1: Info del punto + Tareas + Stats */}
    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <InfoPuntoVentaWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <TasksWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-4">
      <StatsRowWidget />
    </div>

    {/* Fila 2: Austral AI */}
    <div className="col-span-1 md:col-span-2 lg:col-span-6">
      <AustralAIPromo />
    </div>
  </div>
);
