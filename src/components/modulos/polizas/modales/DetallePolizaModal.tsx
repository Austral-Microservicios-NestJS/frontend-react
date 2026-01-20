import { ModalContainer } from "@/components/shared/ModalContainer";
import { Button } from "@/components/ui/button";
import type { Poliza } from "@/types/poliza.interface";
import { X, FileText, Calendar, DollarSign, User, Building, Package, Tag } from "lucide-react";

interface DetallePolizaModalProps {
  isOpen: boolean;
  onClose: () => void;
  poliza: Poliza;
}

export const DetallePolizaModal = ({
  isOpen,
  onClose,
  poliza,
}: DetallePolizaModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "No especificado";
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: poliza.moneda,
    }).format(value);
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start bg-white border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 tracking-wider uppercase">
                Detalle de Póliza
              </span>
            </div>
            <h2 className="text-xl ml-2 text-gray-900">
              Póliza {poliza.numeroPoliza}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Información General</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Póliza</label>
                  <p className="text-sm text-gray-900 mt-1">{poliza.numeroPoliza}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Asegurado</label>
                  <p className="text-sm text-gray-900 mt-1">{poliza.nombreAsegurado}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <p className="text-sm text-gray-900 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      poliza.estado === "VIGENTE" ? "bg-green-100 text-green-800" :
                      poliza.estado === "VENCIDA" ? "bg-red-100 text-red-800" :
                      poliza.estado === "CANCELADA" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {poliza.estado}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Moneda</label>
                  <p className="text-sm text-gray-900 mt-1">{poliza.moneda}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Vigencia</label>
                  <p className="text-sm text-gray-900 mt-1">{poliza.tipoVigencia}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-sm text-gray-900 mt-1">{poliza.descripcion || "Sin descripción"}</p>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Fechas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Vigencia Inicio</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(poliza.vigenciaInicio)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vigencia Fin</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(poliza.vigenciaFin)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Emisión</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(poliza.fechaEmision)}</p>
                </div>
              </div>
            </div>

            {/* Valores Monetarios */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Valores</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Suma Asegurada</label>
                  <p className="text-sm text-gray-900 mt-1">{formatCurrency(poliza.sumaAsegurada)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Prima Total</label>
                  <p className="text-sm text-gray-900 mt-1">{formatCurrency(poliza.primaTotal)}</p>
                </div>
              </div>
            </div>

            {/* Compañía */}
            {poliza.compania && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Compañía</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Razón Social</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.compania.razonSocial}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre Comercial</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.compania.nombreComercial}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">RUC</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.compania.ruc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.compania.telefono}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.compania.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.compania.direccion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Producto */}
            {poliza.producto && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Producto</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.producto.codigo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.producto.nombre}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Descripción</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.producto.descripcion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ramo */}
            {poliza.ramo && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Ramo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.ramo.codigo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.ramo.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Abreviatura</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.ramo.abreviatura}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Grupo</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.ramo.grupo}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Descripción</label>
                    <p className="text-sm text-gray-900 mt-1">{poliza.ramo.descripcion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Comisiones */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Comisiones</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Comisión Broker</label>
                  <p className="text-sm text-gray-900 mt-1">{poliza.comisionBroker}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Comisión Agente</label>
                  <p className="text-sm text-gray-900 mt-1">{poliza.comisionAgente}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 flex justify-end items-center gap-4 bg-white border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 hover:bg-transparent font-normal"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};