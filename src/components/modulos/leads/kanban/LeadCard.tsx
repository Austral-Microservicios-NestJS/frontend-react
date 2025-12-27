import {
  Mail, Phone, Building2, DollarSign, Briefcase, Car, Heart, Shield,
  Users, Clock, Tag, Stethoscope, FileText, HardHat, Activity
} from "lucide-react";
import type { Lead, PrioridadLead, TipoSeguro } from "@/types/lead.interface";
import { prioridadLeadOptions, fuenteLeadOptions, tipoSeguroOptions } from "@/types/lead.interface";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadCard = ({ lead, onEdit, onDelete }: LeadCardProps) => {
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
        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded-lg border border-blue-200">
          <Car className="w-4 h-4 text-blue-600" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-blue-900 truncate">
              {lead.detalleAuto.marca} {lead.detalleAuto.modelo}
            </p>
            <p className="text-blue-700">
              {lead.detalleAuto.placa} • {lead.detalleAuto.anio}
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleSalud) {
      return (
        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-green-50 to-green-100 px-3 py-2 rounded-lg border border-green-200">
          <Heart className="w-4 h-4 text-green-600" />
          <div className="flex-1">
            <p className="font-semibold text-green-900">
              {lead.detalleSalud.tipoCobertura}
            </p>
            <p className="text-green-700">
              {lead.detalleSalud.edad} años • {lead.detalleSalud.genero}
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleVida) {
      return (
        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-pink-50 to-pink-100 px-3 py-2 rounded-lg border border-pink-200">
          <Heart className="w-4 h-4 text-pink-600" />
          <div className="flex-1">
            <p className="font-semibold text-pink-900">{lead.detalleVida.ocupacion}</p>
            <p className="text-pink-700">
              {formatCurrency(lead.detalleVida.sumaAsegurada)} asegurados
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleSCTR) {
      return (
        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-2 rounded-lg border border-orange-200">
          <Shield className="w-4 h-4 text-orange-600" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-orange-900 truncate">
              {lead.detalleSCTR.razonSocial}
            </p>
            <p className="text-orange-700">
              {lead.detalleSCTR.numeroTrabajadores} trabajadores
            </p>
          </div>
        </div>
      );
    }

    if (lead.detalleVidaLey) {
      return (
        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-2 rounded-lg border border-purple-200">
          <Users className="w-4 h-4 text-purple-600" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-purple-900 truncate">
              {lead.detalleVidaLey.razonSocial}
            </p>
            <p className="text-purple-700">
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
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
      onClick={() => onEdit(lead)}
    >
      {/* Header con gradiente y tipo de seguro */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1 flex-1">
            {lead.nombre}
          </h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${priorityBadge.className}`}>
            {priorityBadge.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm">
            <TipoSeguroIcon className="w-3.5 h-3.5" />
            <span>{tipoSeguroLabel}</span>
          </span>

          {lead.cargo && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-white px-2 py-1 rounded-full border border-gray-200">
              <Briefcase className="w-3 h-3" />
              <span className="truncate max-w-[80px]">{lead.cargo}</span>
            </span>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4 space-y-3">
        {/* Empresa */}
        {lead.empresa && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
              <Building2 className="w-4 h-4 text-gray-600" />
            </div>
            <span className="font-medium text-gray-900 truncate">{lead.empresa}</span>
          </div>
        )}

        {/* Detalle específico del seguro */}
        {renderDetalleCompacto()}

        {/* Información de contacto */}
        <div className="space-y-2">
          {lead.email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.telefono && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{lead.telefono}</span>
            </div>
          )}
        </div>

        {/* Valor estimado destacado */}
        {lead.valorEstimado && (
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Valor Estimado</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-900">
                  {formatCurrency(lead.valorEstimado)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notas */}
        {lead.notas && (
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {lead.notas}
            </p>
          </div>
        )}
      </div>

      {/* Footer con metadata */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Tag className="w-3.5 h-3.5" />
            <span className="font-medium">{getFuenteLabel(lead.fuente)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(lead.fechaUltimoCambioEstado)}</span>
          </div>
        </div>
      </div>

      {/* Botón eliminar mejorado */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`¿Eliminar el lead de ${lead.nombre}?`)) {
            onDelete(lead.idLead);
          }
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-md border border-red-200"
        title="Eliminar lead"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
