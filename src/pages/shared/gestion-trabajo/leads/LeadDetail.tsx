import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { leadService } from "@/services/lead.service";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft, Copy } from "lucide-react";
import days from "dayjs";
import { useEffect, useState } from "react";

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  useAuthStore();

  const { data: lead, isLoading } = leadService.useGetById(id || "");

  const [detalleVidaLey, setDetalleVidaLey] = useState<any | null>(null);
  const [detalleAuto, setDetalleAuto] = useState<any | null>(null);
  const [detalleSalud, setDetalleSalud] = useState<any | null>(null);
  const [detalleSCTR, setDetalleSCTR] = useState<any | null>(null);
  const [detalleVida, setDetalleVida] = useState<any | null>(null);
  const [leadState, setLeadState] = useState<any | null>(null);

  useEffect(() => {
    if (lead) {
      setLeadState({ ...lead });
      setDetalleVidaLey(lead.detalleVidaLey ? { ...lead.detalleVidaLey } : null);
      setDetalleAuto(lead.detalleAuto ? { ...lead.detalleAuto } : null);
      setDetalleSalud(lead.detalleSalud ? { ...lead.detalleSalud } : null);
      setDetalleSCTR(lead.detalleSCTR ? { ...lead.detalleSCTR } : null);
      setDetalleVida(lead.detalleVida ? { ...lead.detalleVida } : null);
    } else {
      setLeadState(null);
      setDetalleVidaLey(null);
      setDetalleAuto(null);
      setDetalleSalud(null);
      setDetalleSCTR(null);
      setDetalleVida(null);
    }
  }, [lead]);

  const handleGoBack = () => {
    navigate("/dashboard/gestion-trabajo/leads");
  };

  return (
    <>
      <Header
        title={leadState ? `Lead: ${leadState.nombre}` : lead ? `Lead: ${lead.nombre}` : "Lead"}
        description="Detalle completo del lead"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </Header>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : lead ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.nombre ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, nombre: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.nombre ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar nombre"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.email ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, email: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.email ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Número de documento</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.numeroDocumento ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, numeroDocumento: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.numeroDocumento ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar número de documento"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.telefono ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, telefono: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.telefono ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar teléfono"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.empresa ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, empresa: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.empresa ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar empresa"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Cargo</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.cargo ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, cargo: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.cargo ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar cargo"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Fuente</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.fuente ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, fuente: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.fuente ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar fuente"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.estado ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, estado: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.estado ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar estado"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Valor estimado</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={leadState?.valorEstimado ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, valorEstimado: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.valorEstimado ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar valor estimado"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Prioridad</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={leadState?.prioridad ?? ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, prioridad: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(leadState?.prioridad ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar prioridad"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Notas</p>
                <div className="flex items-start gap-2">
                  <textarea
                    value={leadState?.notas ?? ""}
                    onChange={(e) => setLeadState((s: any) => ({ ...s, notas: e.target.value }))}
                    className="w-full border rounded px-2 py-1 text-sm min-h-[80px]"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(leadState?.notas ?? "")}
                    className="p-1 text-gray-500 hover:text-gray-800"
                    title="Copiar notas"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Etiquetas</p>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      value={leadState?.etiquetas ? leadState.etiquetas.join(", ") : ""}
                      onChange={(e) => setLeadState((s: any) => ({ ...s, etiquetas: e.target.value ? e.target.value.split(/,\s*/) : [] }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText((leadState?.etiquetas || []).join(", "))}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar etiquetas"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Fechas</p>
                  <div className="mt-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div>Creación: {lead.fechaCreacion ? days(lead.fechaCreacion).format("DD/MM/YYYY HH:mm") : "-"}</div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(lead.fechaCreacion ? days(lead.fechaCreacion).format("DD/MM/YYYY HH:mm") : "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar fecha de creación"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>Última modificación: {lead.fechaModificacion ? days(lead.fechaModificacion).format("DD/MM/YYYY HH:mm") : "-"}</div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(lead.fechaModificacion ? days(lead.fechaModificacion).format("DD/MM/YYYY HH:mm") : "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar fecha de modificación"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalle Auto */}
            {detalleAuto && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">Detalle Auto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Placa</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.placa ?? ""}
                        onChange={(e) => setDetalleAuto((d: any) => ({ ...d, placa: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleAuto.placa ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar placa"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.marca ?? ""}
                        onChange={(e) => setDetalleAuto((d: any) => ({ ...d, marca: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleAuto.marca ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar marca"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Modelo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.modelo ?? ""}
                        onChange={(e) => setDetalleAuto((d: any) => ({ ...d, modelo: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleAuto.modelo ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar modelo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Año</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleAuto.anio ?? ""}
                        onChange={(e) => setDetalleAuto((d: any) => ({ ...d, anio: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleAuto.anio ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar año"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Uso del vehículo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.usoVehiculo ?? ""}
                        onChange={(e) => setDetalleAuto((d: any) => ({ ...d, usoVehiculo: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleAuto.usoVehiculo ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar uso del vehículo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Valor comercial</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.valorComercial ?? ""}
                        onChange={(e) => setDetalleAuto((d: any) => ({ ...d, valorComercial: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleAuto.valorComercial ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar valor comercial"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Aseguradoras</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={detalleAuto.aseguradoras ?? ""}
                      onChange={(e) => setDetalleAuto((d: any) => ({ ...d, aseguradoras: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(detalleAuto.aseguradoras ?? "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar aseguradoras"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle Vida Ley */}
            {detalleVidaLey && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">Detalle Vida Ley</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">RUC</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVidaLey.rucEmpresa ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, rucEmpresa: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleVidaLey.rucEmpresa ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar RUC"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Razón social</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVidaLey.razonSocial ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, razonSocial: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleVidaLey.razonSocial ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar razón social"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Empleados en planilla</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleVidaLey.numeroEmpleadosPlanilla ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, numeroEmpleadosPlanilla: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleVidaLey.numeroEmpleadosPlanilla ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar número de empleados"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Planilla mensual</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={detalleVidaLey.planillaMensual ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, planillaMensual: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleVidaLey.planillaMensual ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar planilla mensual"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Disponible</p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!detalleVidaLey.disponible}
                          onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, disponible: e.target.checked }))}
                        />
                        <span className="text-sm">{detalleVidaLey.disponible ? "Sí" : "No"}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleVidaLey.disponible ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar disponible"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">ID detalle</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVidaLey.idDetalleVidaLey ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, idDetalleVidaLey: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleVidaLey.idDetalleVidaLey ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar id detalle"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle Salud */}
            {detalleSalud && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">Detalle Salud</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSalud.edad ?? ""}
                        onChange={(e) => setDetalleSalud((d: any) => ({ ...d, edad: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleSalud.edad ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar edad"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Género</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.genero ?? ""}
                        onChange={(e) => setDetalleSalud((d: any) => ({ ...d, genero: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSalud.genero ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar género"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tipo de cobertura</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.tipoCobertura ?? ""}
                        onChange={(e) => setDetalleSalud((d: any) => ({ ...d, tipoCobertura: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSalud.tipoCobertura ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar tipo de cobertura"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Incluir familia</p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!detalleSalud.incluirFamilia}
                          onChange={(e) => setDetalleSalud((d: any) => ({ ...d, incluirFamilia: e.target.checked }))}
                        />
                        <span className="text-sm">{detalleSalud.incluirFamilia ? "Sí" : "No"}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSalud.incluirFamilia ? "Sí" : "No")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar incluir familia"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Número de dependientes</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSalud.numeroDependientes ?? ""}
                        onChange={(e) => setDetalleSalud((d: any) => ({ ...d, numeroDependientes: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleSalud.numeroDependientes ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar número de dependientes"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tuvo seguro antes</p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!detalleSalud.tuvoSeguroAntes}
                          onChange={(e) => setDetalleSalud((d: any) => ({ ...d, tuvoSeguroAntes: e.target.checked }))}
                        />
                        <span className="text-sm">{detalleSalud.tuvoSeguroAntes ? "Sí" : "No"}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSalud.tuvoSeguroAntes ? "Sí" : "No")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar tuvo seguro antes"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Clínica de preferencia</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.clinicaPreferencia ?? ""}
                        onChange={(e) => setDetalleSalud((d: any) => ({ ...d, clinicaPreferencia: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSalud.clinicaPreferencia ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar clínica de preferencia"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Cobertura geográfica</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.coberturaGeografica ?? ""}
                        onChange={(e) => setDetalleSalud((d: any) => ({ ...d, coberturaGeografica: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSalud.coberturaGeografica ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar cobertura geográfica"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Presupuesto mensual</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.presupuestoMensual ?? ""}
                        onChange={(e) => setDetalleSalud((d: any) => ({ ...d, presupuestoMensual: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSalud.presupuestoMensual ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar presupuesto mensual"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Enfermedades preexistentes</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={detalleSalud.enfermedadesPreexistentes ? (Array.isArray(detalleSalud.enfermedadesPreexistentes) ? detalleSalud.enfermedadesPreexistentes.join(", ") : detalleSalud.enfermedadesPreexistentes) : ""}
                      onChange={(e) => setDetalleSalud((d: any) => ({ ...d, enfermedadesPreexistentes: e.target.value ? e.target.value.split(/,\s*/) : [] }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="Separadas por coma"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(detalleSalud.enfermedadesPreexistentes ? (Array.isArray(detalleSalud.enfermedadesPreexistentes) ? detalleSalud.enfermedadesPreexistentes.join(", ") : detalleSalud.enfermedadesPreexistentes) : "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar enfermedades preexistentes"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle SCTR */}
            {detalleSCTR && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">Detalle SCTR</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">RUC Empresa</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSCTR.rucEmpresa ?? ""}
                        onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, rucEmpresa: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSCTR.rucEmpresa ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar RUC empresa"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Razón social</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSCTR.razonSocial ?? ""}
                        onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, razonSocial: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSCTR.razonSocial ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar razón social"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Número de trabajadores</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSCTR.numeroTrabajadores ?? ""}
                        onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, numeroTrabajadores: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleSCTR.numeroTrabajadores ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar número de trabajadores"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Actividad económica</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSCTR.actividadEconomica ?? ""}
                        onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, actividadEconomica: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSCTR.actividadEconomica ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar actividad económica"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tipo de riesgo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSCTR.tipoRiesgo ?? ""}
                        onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, tipoRiesgo: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleSCTR.tipoRiesgo ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar tipo de riesgo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle Vida */}
            {detalleVida && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">Detalle Vida</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Edad</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleVida.edad ?? ""}
                        onChange={(e) => setDetalleVida((d: any) => ({ ...d, edad: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalleVida.edad ?? ""))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar edad"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Ocupación</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVida.ocupacion ?? ""}
                        onChange={(e) => setDetalleVida((d: any) => ({ ...d, ocupacion: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleVida.ocupacion ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar ocupación"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Suma asegurada</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVida.sumaAsegurada ?? ""}
                        onChange={(e) => setDetalleVida((d: any) => ({ ...d, sumaAsegurada: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleVida.sumaAsegurada ?? "")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar suma asegurada"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Fuma</p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!detalleVida.fuma}
                          onChange={(e) => setDetalleVida((d: any) => ({ ...d, fuma: e.target.checked }))}
                        />
                        <span className="text-sm">{detalleVida.fuma ? "Sí" : "No"}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalleVida.fuma ? "Sí" : "No")}
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar fuma"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Beneficiarios</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={detalleVida.beneficiarios ? (typeof detalleVida.beneficiarios === 'string' ? detalleVida.beneficiarios : JSON.stringify(detalleVida.beneficiarios)) : ""}
                      onChange={(e) => setDetalleVida((d: any) => ({ ...d, beneficiarios: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(detalleVida.beneficiarios ? (typeof detalleVida.beneficiarios === 'string' ? detalleVida.beneficiarios : JSON.stringify(detalleVida.beneficiarios)) : "")}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar beneficiarios"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">Lead no encontrado</div>
        )}
      </div>
    </>
  );
}
