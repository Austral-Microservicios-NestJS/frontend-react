import {
  Mail, Phone, Building2, DollarSign, Briefcase, Car, Heart, Shield,
  Users, Clock, Tag, Stethoscope, FileText, HardHat, Activity
} from "lucide-react";
import type { Lead, PrioridadLead, TipoSeguro } from "@/types/lead.interface";
import { prioridadLeadOptions, fuenteLeadOptions, tipoSeguroOptions } from "@/types/lead.interface";
import { ButtonIA } from "@/components/ui";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadCard = ({ lead, onEdit }: LeadCardProps) => {
  const getPriorityBadge = (prioridad: PrioridadLead) => {
    const priority = prioridadLeadOptions.find((p) => p.value === prioridad);
    const styles = {
      ALTA: "bg-red-100 text-red-700 border-red-200",
      MEDIA: "bg-yellow-100 text-yellow-700 border-yellow-200",
      BAJA: "bg-green-100 text-green-700 border-green-200",
    };
    return {
      label: priority?.label || prioridad,
      className: styles[prioridad] || styles.MEDIA,
    };
  };

  const getFuenteLabel = (fuente: string) => {
    const fuenteOption = fuenteLeadOptions.find((f) => f.value === fuente);
    return fuenteOption?.label || fuente;
  };

  const getTipoSeguroInfo = (tipo: TipoSeguro) => {
    const option = tipoSeguroOptions.find((t) => t.value === tipo);

    // Mapear iconos según tipo
    const iconMap = {
      AUTO: Car,
      SALUD: Stethoscope,
      VIDA: Heart,
      SCTR: HardHat,
      VIDA_LEY: FileText,
      EPS: Activity,
      SOAT: Shield,
      OTRO: FileText,
    };

    return {
      label: option?.label || tipo,
      Icon: iconMap[tipo] || FileText,
    };
  };

  const formatCurrency = (value?: string) => {
    if (!value) return null;
    const num = parseFloat(value);
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const { label: tipoSeguroLabel, Icon: TipoSeguroIcon } = getTipoSeguroInfo(lead.tipoSeguro);
  const priorityBadge = getPriorityBadge(lead.prioridad);

  // Renderizar detalle compacto según tipo de seguro
  const renderDetalleCompacto = () => {
    if (lead.detalleAuto) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
          <Car className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-xs truncate">
              {lead.detalleAuto.marca} {lead.detalleAuto.modelo}
            </p>
            <p className="text-xs text-gray-600">
              {lead.detalleAuto.placa} • {lead.detalleAuto.anio}
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleSalud) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-green-50/50 rounded-lg border border-green-100">
          <Heart className="w-4 h-4 text-green-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-xs">
              {lead.detalleSalud.tipoCobertura}
            </p>
            <p className="text-xs text-gray-600">
              {lead.detalleSalud.edad} años • {lead.detalleSalud.genero}
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleVida) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-pink-50/50 rounded-lg border border-pink-100">
          <Heart className="w-4 h-4 text-pink-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-xs">{lead.detalleVida.ocupacion}</p>
            <p className="text-xs text-gray-600">
              {formatCurrency(lead.detalleVida.sumaAsegurada)} asegurados
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleSCTR) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-orange-50/50 rounded-lg border border-orange-100">
          <Shield className="w-4 h-4 text-orange-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-xs truncate">
              {lead.detalleSCTR.razonSocial}
            </p>
            <p className="text-xs text-gray-600">
              {lead.detalleSCTR.numeroTrabajadores} trabajadores
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleVidaLey) {
      return (
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-purple-50/50 rounded-lg border border-purple-100">
          <Users className="w-4 h-4 text-purple-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-xs truncate">
              {lead.detalleVidaLey.razonSocial}
            </p>
            <p className="text-xs text-gray-600">
              {lead.detalleVidaLey.numeroEmpleadosPlanilla} empleados
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
    >
      {/* ButtonIA en esquina superior derecha - SIEMPRE VISIBLE */}
      <div className="absolute top-3 right-3 z-20">
        <ButtonIA
          onClick={() => {
            console.log("IA asistente para lead:", lead.idLead);
            // TODO: Implementar lógica de IA
          }}
        />
      </div>

      {/* Header minimalista */}
      <div className="px-4 pt-4 pb-3 pr-20">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-gray-900 text-base mb-1 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onEdit(lead)}
            >
              {lead.nombre}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-gray-50 rounded-lg text-gray-700">
                <TipoSeguroIcon className="w-3.5 h-3.5 text-gray-600" />
                <span>{tipoSeguroLabel}</span>
              </span>
              {lead.cargo && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                  <Briefcase className="w-3 h-3" />
                  <span className="truncate max-w-20">{lead.cargo}</span>
                </span>
              )}
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${priorityBadge.className} shrink-0`}>
            {priorityBadge.label}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 pb-3 space-y-3 border-b border-gray-100">
        {/* Empresa */}
        {lead.empresa && (
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm font-medium text-gray-700 truncate">{lead.empresa}</span>
          </div>
        )}

        {/* Detalle específico del seguro */}
        {renderDetalleCompacto()}

        {/* Información de contacto */}
        <div className="space-y-2">
          {lead.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600 truncate">{lead.email}</span>
            </div>
          )}
          {lead.telefono && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600">{lead.telefono}</span>
            </div>
          )}
        </div>

        {/* Valor estimado */}
        {lead.valorEstimado && (
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-medium text-gray-600">Valor Estimado</span>
            <span className="text-sm font-bold text-gray-900">
              {formatCurrency(lead.valorEstimado)}
            </span>
          </div>
        )}

        {/* Notas */}
        {lead.notas && (
          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {lead.notas}
            </p>
          </div>
        )}
      </div>

      {/* Footer con metadata y botón de cotizar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>{getFuenteLabel(lead.fuente)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(lead.fechaUltimoCambioEstado)}</span>
          </div>
        </div>

        {/* Botón de Cotizar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implementar lógica de cotización
            console.log("Cotizar lead:", lead.idLead);
          }}
          className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <DollarSign className="w-4 h-4" />
          <span>Cotizar</span>
        </button>
      </div>

    </div>
  );
};
