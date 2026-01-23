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

  const [detalle, setDetalle] = useState<any | null>(null);
  const [leadState, setLeadState] = useState<any | null>(null);

  useEffect(() => {
    if (lead && lead.detalleVidaLey) {
      setDetalle({ ...lead.detalleVidaLey });
    } else {
      setDetalle(null);
    }
    if (lead) setLeadState({ ...lead });
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

            {/* Detalles específicos del lead (ej. detalleVidaLey) */}
            {detalle && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">Detalle Vida Ley</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">RUC</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalle.rucEmpresa ?? ""}
                        onChange={(e) => setDetalle((d: any) => ({ ...d, rucEmpresa: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalle.rucEmpresa ?? "")}
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
                        value={detalle.razonSocial ?? ""}
                        onChange={(e) => setDetalle((d: any) => ({ ...d, razonSocial: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalle.razonSocial ?? "")}
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
                        value={detalle.numeroEmpleadosPlanilla ?? ""}
                        onChange={(e) => setDetalle((d: any) => ({ ...d, numeroEmpleadosPlanilla: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalle.numeroEmpleadosPlanilla ?? ""))}
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
                        value={detalle.planillaMensual ?? ""}
                        onChange={(e) => setDetalle((d: any) => ({ ...d, planillaMensual: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalle.planillaMensual ?? ""))}
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
                          checked={!!detalle.disponible}
                          onChange={(e) => setDetalle((d: any) => ({ ...d, disponible: e.target.checked }))}
                        />
                        <span className="text-sm">{detalle.disponible ? "Sí" : "No"}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(detalle.disponible ?? ""))}
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
                        value={detalle.idDetalleVidaLey ?? ""}
                        onChange={(e) => setDetalle((d: any) => ({ ...d, idDetalleVidaLey: e.target.value }))}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(detalle.idDetalleVidaLey ?? "")}
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
          </div>
        ) : (
          <div className="text-center text-gray-500">Lead no encontrado</div>
        )}
      </div>
    </>
  );
}
