/**
 * Dashboard para REFERENCIADOR
 * Vista mínima: solo sus leads referidos + banner informativo.
 * Sin tareas, sin clientes, sin pólizas.
 * El Referenciador aporta el lead — el sistema lo rastrea aquí.
 */
import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { Card } from "@/components/ui/card";
import { Handshake, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/** Banner de bienvenida y guía para el referenciador */
const BienvenidaReferenciadorWidget = () => (
  <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden relative flex flex-col p-5">
    <div className="flex items-center gap-3 mb-5">
      <div className="bg-white/20 p-2 rounded-lg">
        <Handshake className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-white text-base">Tu rol: Referenciador</h3>
        <p className="text-white/70 text-xs">Conseguidor de seguros para Austral</p>
      </div>
    </div>

    <div className="flex flex-col gap-3 flex-1">
      <div className="bg-white/10 rounded-xl px-4 py-3">
        <p className="text-sm text-white/90 leading-relaxed">
          Cada prospecto que registres queda vinculado a tu nombre. El equipo de Austral se encarga del cierre — tú solo refieres.
        </p>
      </div>
    </div>

    <div className="mt-4 flex flex-col gap-2">
      <Link
        to="/dashboard/gestion-trabajo/leads"
        className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-white/90 transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        Registrar nuevo lead
      </Link>
      <Link
        to="/dashboard/gestion-trabajo/leads"
        className="flex items-center justify-center gap-2 text-white/80 text-sm py-2 rounded-xl hover:text-white transition-colors group"
      >
        Ver mis referidos
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  </Card>
);

export const DashboardReferenciador = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
    {/* Bienvenida + Resumen de leads */}
    <div className="col-span-1 md:col-span-1 lg:col-span-5">
      <BienvenidaReferenciadorWidget />
    </div>

    <div className="col-span-1 md:col-span-1 lg:col-span-5">
      <LeadsSummaryWidget />
    </div>
  </div>
);
