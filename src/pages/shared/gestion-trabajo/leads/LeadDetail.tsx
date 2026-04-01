import { useParams, useNavigate } from "react-router-dom";
import {
  Header,
  Modal,
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from "@/components/shared";
import { RegistrarCliente } from "@/components/modulos/clientes/modales/RegistrarCliente";
import { RegistrarPoliza } from "@/components/modulos/polizas/modales/RegistrarPoliza";
import { useSidebar } from "@/hooks/useSidebar";
import { leadService } from "@/services/lead.service";
import { polizaApi } from "@/services/poliza.service";
import { clienteService } from "@/services/cliente.service";
import { clienteDocumentoApi } from "@/services/cliente-documento.service";
import { useAuthStore } from "@/store/auth.store";
import { useClientes } from "@/hooks/useCliente";
import { usePolizas } from "@/hooks/usePolizas";
import {
  ArrowLeft,
  Copy,
  Car,
  Sparkles,
  Settings,
  FileText,
  RefreshCw,
  ShieldCheck,
  User,
  MapPin,
  Hash,
  UserPlus,
  Download,
  Save,
  FileCheck,
  CheckCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import days from "dayjs";
import { useEffect, useState } from "react";

// Componente Skeleton para loading
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const { addCliente } = useClientes();

  const { data: lead, isLoading } = leadService.useGetById(id || "");
  const { addPoliza } = usePolizas();
  const idClienteVinculado = (lead as any)?.idCliente || "";
  const { data: polizasCliente = [] } = polizaApi.useGetAllByCliente(idClienteVinculado);
  const { data: clienteVinculado } = clienteService.useGetById(idClienteVinculado);
  const { data: documentosCliente = [] } = clienteDocumentoApi.useGetByCliente(idClienteVinculado);

  const [detalleVidaLey, setDetalleVidaLey] = useState<any | null>(null);
  const [detalleAuto, setDetalleAuto] = useState<any | null>(null);
  const [detalleSalud, setDetalleSalud] = useState<any | null>(null);
  const [detalleSCTR, setDetalleSCTR] = useState<any | null>(null);
  const [detalleVida, setDetalleVida] = useState<any | null>(null);
  const [detalleSoat, setDetalleSoat] = useState<any | null>(null);
  const [leadState, setLeadState] = useState<any | null>(null);
  const [isConsultaModalOpen, setIsConsultaModalOpen] = useState(false);
  const [isRegistrarClienteOpen, setIsRegistrarClienteOpen] = useState(false);
  const [isRegistrarPolizaOpen, setIsRegistrarPolizaOpen] = useState(false);
  const [leadInitialValues, setLeadInitialValues] = useState<Partial<any> | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Consulta AI de placa - se activa si hay placa en detalleAuto o detalleSoat
  const placaRaw = detalleAuto?.placa || detalleSoat?.placa;
  const placaParaConsulta = placaRaw
    ? placaRaw.trim().replace(/[\s-]+/g, "").toUpperCase()
    : undefined;
  const {
    data: consultaPlacaData,
    isLoading: isLoadingPlaca,
    error: errorPlaca,
    refetch: refetchPlaca,
  } = leadService.useConsultarPlacaAI(placaParaConsulta);
  const {
    data: consultaCompleta,
  } = leadService.useConsultaVehicularCompleta(placaParaConsulta);
  const propietariosCount = consultaPlacaData?.propietarios?.length ?? 0;

  useEffect(() => {
    if (lead) {
      setLeadState({ ...lead });
      setDetalleVidaLey(
        lead.detalleVidaLey ? { ...lead.detalleVidaLey } : null,
      );
      setDetalleAuto(lead.detalleAuto ? { ...lead.detalleAuto } : null);
      setDetalleSalud(lead.detalleSalud ? { ...lead.detalleSalud } : null);
      setDetalleSCTR(lead.detalleSCTR ? { ...lead.detalleSCTR } : null);
      setDetalleVida(lead.detalleVida ? { ...lead.detalleVida } : null);
      setDetalleSoat(lead.detalleSoat ? { ...lead.detalleSoat } : null);
    } else {
      setLeadState(null);
      setDetalleVidaLey(null);
      setDetalleAuto(null);
      setDetalleSalud(null);
      setDetalleSCTR(null);
      setDetalleVida(null);
      setDetalleSoat(null);
    }
  }, [lead]);

  const handleGoBack = () => {
    navigate("/dashboard/gestion-trabajo/leads");
  };

  const handleRegistrarCliente = () => {
    if (!leadState || !user) return;

    const initialValues: Record<string, any> = {
      tipoPersona: "NATURAL",
      nombres: leadState.nombre || "",
      apellidos: leadState.apellidos || "",
      emailNotificaciones: leadState.email || "",
      telefono1: leadState.telefono || "",
      numeroDocumento: leadState.numeroDocumento || "",
    };

    setLeadInitialValues(initialValues);
    setIsRegistrarClienteOpen(true);
  };

  // Crea cliente y vincula su id al lead → pasa a COTIZADO
  const handleAddClienteAndLink = async (clienteData: any) => {
    const newCliente = await addCliente(clienteData);
    if (newCliente?.idCliente && id) {
      await leadService.update(id, { idCliente: newCliente.idCliente });
      await leadService.cambiarEstado(id, "COTIZADO", user?.nombreUsuario, "Cliente registrado y vinculado");
      setLeadState((s: any) => ({ ...s, idCliente: newCliente.idCliente, estado: "COTIZADO" }));
    }
  };

  // Registra póliza → pasa a EMITIDO
  const handleRegistrarPoliza = async (data: any) => {
    await addPoliza(data);
    if (id) {
      await leadService.cambiarEstado(id, "EMITIDO", user?.nombreUsuario, "Póliza registrada");
      setLeadState((s: any) => ({ ...s, estado: "EMITIDO" }));
    }
    setIsRegistrarPolizaOpen(false);
  };

  // Cerrar lead (final feliz)
  const handleCerrarLead = async () => {
    if (!id) return;
    await leadService.cambiarEstado(id, "CERRADO", user?.nombreUsuario, "Proceso completado exitosamente");
    setLeadState((s: any) => ({ ...s, estado: "CERRADO" }));
  };

  const handleSaveChanges = async () => {
    if (!leadState || !id) return;
    setIsSaving(true);
    try {
      await leadService.update(id, {
        nombre: leadState.nombre,
        email: leadState.email,
        telefono: leadState.telefono,
        empresa: leadState.empresa,
        cargo: leadState.cargo,
        fuente: leadState.fuente,
        estado: leadState.estado,
        prioridad: leadState.prioridad,
        tipoSeguro: leadState.tipoSeguro,
        valorEstimado: leadState.valorEstimado,
        comision: leadState.comision,
        idCliente: leadState.idCliente,
        notas: leadState.notas,
      });
      // Save detail sub-objects if present
      if (detalleAuto) {
        try { await leadService.updateDetalleAuto(id, detalleAuto); } catch { /* endpoint may not exist yet */ }
      }
      if (detalleSoat) {
        try { await leadService.updateDetalleSoat(id, detalleSoat); } catch { /* endpoint may not exist yet */ }
      }
      if (detalleSalud) {
        try { await leadService.updateDetalleSalud(id, detalleSalud); } catch { /* endpoint may not exist yet */ }
      }
      if (detalleSCTR) {
        try { await leadService.updateDetalleSCTR(id, detalleSCTR); } catch { /* endpoint may not exist yet */ }
      }
      if (detalleVida) {
        try { await leadService.updateDetalleVida(id, detalleVida); } catch { /* endpoint may not exist yet */ }
      }
      if (detalleVidaLey) {
        try { await leadService.updateDetalleVidaLey(id, detalleVidaLey); } catch { /* endpoint may not exist yet */ }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header
        title={
          leadState
            ? `Lead: ${leadState.nombre}`
            : lead
              ? `Lead: ${lead.nombre}`
              : "Lead"
        }
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
          <button
            onClick={handleRegistrarCliente}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: "var(--austral-azul)" }}
          >
            <UserPlus className="w-4 h-4" />
            {leadState?.idCliente ? "Cliente Vinculado ✓" : "Registrar Cliente"}
          </button>
          {leadState?.idCliente && leadState?.estado !== "CERRADO" && leadState?.estado !== "PERDIDO" && (
            <button
              onClick={() => setIsRegistrarPolizaOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700"
            >
              <FileCheck className="w-4 h-4" />
              Registrar Póliza
            </button>
          )}
          {leadState?.estado === "EMITIDO" && (
            <button
              onClick={handleCerrarLead}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Cerrar Lead
            </button>
          )}
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${saveSuccess ? "bg-emerald-600" : "bg-gray-700 hover:bg-gray-800"}`}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Guardando..." : saveSuccess ? "Guardado" : "Guardar cambios"}
          </button>
        </div>
      </Header>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : lead ? (
          <div className="space-y-4">
            {/* Layout principal: Info Lead + Consulta AI (si aplica) */}
            <div
              className={`grid gap-6 ${placaRaw ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}
            >
              {/* Columna Izquierda - Información del Lead */}
              <div
                className={`${placaRaw ? "lg:col-span-2" : ""} bg-white rounded-lg shadow-sm border border-gray-200 p-4`}
              >
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
                  Datos del Lead
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Nombre</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.nombre ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            nombre: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(leadState?.nombre ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar nombre"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Email</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.email ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            email: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(leadState?.email ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar email"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Número de documento</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.numeroDocumento ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            numeroDocumento: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            leadState?.numeroDocumento ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar número de documento"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Teléfono</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.telefono ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            telefono: e.target.value,
                          }))
                        }
                        placeholder="Teléfono (no colocar el prefijo)"
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            leadState?.telefono ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar teléfono"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {leadState?.empresa && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Empresa</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.empresa ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            empresa: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            leadState?.empresa ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar empresa"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  )}

                  {leadState?.cargo && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Cargo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.cargo ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            cargo: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(leadState?.cargo ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar cargo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Fuente</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.fuente ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            fuente: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(leadState?.fuente ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar fuente"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Estado</p>
                    <select
                      value={leadState?.estado ?? ""}
                      onChange={async (e) => {
                        const nuevoEstado = e.target.value;
                        setLeadState((s: any) => ({ ...s, estado: nuevoEstado }));
                        if (id) {
                          try {
                            await leadService.cambiarEstado(id, nuevoEstado, user?.nombreUsuario, "Cambio manual de estado");
                          } catch (err) {
                            console.error("Error al cambiar estado:", err);
                          }
                        }
                      }}
                      className={`w-full rounded-lg px-2.5 py-1.5 text-sm font-semibold border cursor-pointer transition-colors focus:outline-none ${
                        leadState?.estado === "NUEVO" ? "bg-indigo-50 text-indigo-700 border-indigo-300" :
                        leadState?.estado === "COTIZADO" ? "bg-violet-50 text-violet-700 border-violet-300" :
                        leadState?.estado === "EMITIDO" ? "bg-orange-50 text-orange-700 border-orange-300" :
                        leadState?.estado === "CERRADO" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                        leadState?.estado === "PERDIDO" ? "bg-rose-50 text-rose-700 border-rose-300" :
                        "bg-gray-50 text-gray-700 border-gray-300"
                      }`}
                    >
                      <option value="NUEVO">Nuevo</option>
                      <option value="COTIZADO">Cotizado</option>
                      <option value="EMITIDO">Emitido</option>
                      <option value="CERRADO">Cerrado</option>
                      <option value="PERDIDO">Perdido</option>
                    </select>
                  </div>

                  {leadState?.valorEstimado && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Valor estimado</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={leadState?.valorEstimado ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            valorEstimado: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            leadState?.valorEstimado ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar valor estimado"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Prioridad</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={leadState?.prioridad ?? ""}
                        onChange={(e) =>
                          setLeadState((s: any) => ({
                            ...s,
                            prioridad: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            leadState?.prioridad ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar prioridad"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>


                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Fecha creación</p>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={lead.fechaCreacion ? days(lead.fechaCreacion).format("DD/MM/YYYY HH:mm") : "-"}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 cursor-default"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            lead.fechaCreacion ? days(lead.fechaCreacion).format("DD/MM/YYYY HH:mm") : "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar fecha de creación"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Última modificación</p>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={lead.fechaModificacion ? days(lead.fechaModificacion).format("DD/MM/YYYY HH:mm") : "-"}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 cursor-default"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            lead.fechaModificacion ? days(lead.fechaModificacion).format("DD/MM/YYYY HH:mm") : "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar fecha de modificación"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Consulta AI Placa (AUTO o SOAT) */}
              {placaRaw && (
                <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Consulta de PLACA
                        </h3>
                        <p className="text-xs text-gray-500">
                          Datos del vehiculo
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => refetchPlaca()}
                      disabled={isLoadingPlaca}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Actualizar consulta"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${isLoadingPlaca ? "animate-spin" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Error State */}
                  {errorPlaca && !isLoadingPlaca && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-600 text-xs">
                        No se pudo obtener informacion. Intente nuevamente.
                      </p>
                    </div>
                  )}

                  {/* Vista previa */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Car className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs text-gray-500">Placa</span>
                      </div>
                      {isLoadingPlaca ? (
                        <Skeleton className="h-6 w-24" />
                      ) : (
                        <p className="text-lg font-bold text-gray-900">
                          {consultaPlacaData?.placa || placaRaw}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Settings className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-500">Marca</span>
                      </div>
                      {isLoadingPlaca ? (
                        <Skeleton className="h-5 w-16" />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {consultaPlacaData?.marca || detalleAuto?.marca || detalleSoat?.marca || "-"}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Car className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-500">Modelo</span>
                      </div>
                      {isLoadingPlaca ? (
                        <Skeleton className="h-5 w-20" />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {consultaPlacaData?.modelo || detalleAuto?.modelo || detalleSoat?.modelo || "-"}
                        </p>
                      )}
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs text-blue-600">Estado</span>
                      </div>
                      {isLoadingPlaca ? (
                        <Skeleton className="h-5 w-16" />
                      ) : (
                        <p className="text-sm font-semibold text-blue-900">
                          {consultaPlacaData?.estado || "-"}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs text-gray-500">SOAT</span>
                      </div>
                      {isLoadingPlaca ? (
                        <Skeleton className="h-5 w-16" />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {consultaPlacaData?.soat?.estado || "-"}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs text-gray-500">Propietarios</span>
                      </div>
                      {isLoadingPlaca ? (
                        <Skeleton className="h-5 w-10" />
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">
                          {propietariosCount}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Vista previa de datos.</p>
                    <button
                      type="button"
                      onClick={() => setIsConsultaModalOpen(true)}
                      disabled={isLoadingPlaca || !consultaPlacaData}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ver mas
                    </button>
                  </div>

                  <ModalContainer
                    isOpen={isConsultaModalOpen}
                    onClose={() => setIsConsultaModalOpen(false)}
                    size="xl"
                  >
                    <Modal>
                      <ModalHeader
                        title="Datos del vehiculo"
                        description={`Placa ${consultaPlacaData?.placa || placaRaw}`}
                        onClose={() => setIsConsultaModalOpen(false)}
                      />
                      <ModalBody className="space-y-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-slate-700 mb-3">
                            <Car className="w-4 h-4" />
                            <h4 className="text-sm font-semibold">Vehiculo</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                            <div>Marca: {consultaPlacaData?.marca || "-"}</div>
                            <div>Modelo: {consultaPlacaData?.modelo || "-"}</div>
                            <div>Anio: {consultaPlacaData?.anio || "-"}</div>
                            <div>Color: {consultaPlacaData?.color || "-"}</div>
                            <div>Clase: {consultaPlacaData?.clase || "-"}</div>
                            <div>Uso: {consultaPlacaData?.uso || "-"}</div>
                            <div>Sede: {consultaPlacaData?.sede || "-"}</div>
                            <div>Departamento: {consultaPlacaData?.departamentoSede || "-"}</div>
                            <div>Estado: {consultaPlacaData?.estado || "-"}</div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-slate-700 mb-3">
                            <Hash className="w-4 h-4" />
                            <h4 className="text-sm font-semibold">Identificacion</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                            <div>Serie: {consultaPlacaData?.nroSerie || "-"}</div>
                            <div>VIN: {consultaPlacaData?.nroVin || "-"}</div>
                            <div>Motor: {consultaPlacaData?.nroMotor || "-"}</div>
                            <div>Anotaciones: {consultaPlacaData?.anotaciones ?? "-"}</div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-emerald-700 mb-3">
                            <ShieldCheck className="w-4 h-4" />
                            <h4 className="text-sm font-semibold">SOAT</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-900/80">
                            <div>Estado: {consultaPlacaData?.soat?.estado || "-"}</div>
                            <div>Compania: {consultaPlacaData?.soat?.compania || "-"}</div>
                            <div>Poliza: {consultaPlacaData?.soat?.numeroPoliza || "-"}</div>
                            <div>Vigencia: {consultaPlacaData?.soat?.inicio || "-"} - {consultaPlacaData?.soat?.fin || "-"}</div>
                            <div>Clase vehiculo: {consultaPlacaData?.soat?.claseVehiculo || "-"}</div>
                            <div>Uso vehiculo: {consultaPlacaData?.soat?.usoVehiculo || "-"}</div>
                            <div>Tipo: {consultaPlacaData?.soat?.tipo || "-"}</div>
                            <div>Codigo SBS: {consultaPlacaData?.soat?.codigoSbsAseguradora || "-"}</div>
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-amber-700 mb-3">
                            <User className="w-4 h-4" />
                            <h4 className="text-sm font-semibold">Propietarios</h4>
                          </div>
                          {consultaPlacaData?.propietarios?.length ? (
                            <div className="space-y-3 text-sm text-slate-700">
                              {consultaPlacaData.propietarios.map((propietario, index) => (
                                <div
                                  key={`${propietario.nroDocumento || index}`}
                                  className="border border-amber-200/60 rounded-lg p-3 bg-white/70"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="font-semibold text-slate-900">
                                      {[propietario.nombres, propietario.apellidoPaterno, propietario.apellidoMaterno]
                                        .filter(Boolean)
                                        .join(" ") || "-"}
                                    </div>
                                    <div className="text-xs text-amber-600 font-semibold">
                                      Doc: {propietario.nroDocumento || "-"}
                                    </div>
                                  </div>
                                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <div>Direccion: {propietario.direccion || "-"}</div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-amber-600" />
                                      <span>
                                        {[propietario.departamento, propietario.provincia, propietario.distrito]
                                          .filter(Boolean)
                                          .join(" - ") || "-"}
                                      </span>
                                    </div>
                                    <div>Nacimiento: {propietario.nacimiento || "-"}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">Sin propietarios</div>
                          )}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <button
                          type="button"
                          onClick={() => setIsConsultaModalOpen(false)}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cerrar
                        </button>
                      </ModalFooter>
                    </Modal>
                  </ModalContainer>
                </div>
              )}
            </div>

            {/* Infraxion: Papeletas, Revisiones Técnicas, Siniestros */}
            {placaRaw && consultaCompleta && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Papeletas */}
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2 pb-1.5 border-b border-amber-100">
                    Papeletas ({consultaCompleta.papeletas?.length || 0})
                  </h3>
                  {consultaCompleta.papeletas?.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {consultaCompleta.papeletas.map((p: any, i: number) => (
                        <div key={i} className="text-xs border border-gray-100 rounded p-2 bg-gray-50">
                          <div className="flex justify-between">
                            <span className="font-semibold text-amber-700">{p.falta}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${p.estado === "Pendiente" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                              {p.estado}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-0.5">{p.fechaInfraccion} — S/ {p.monto}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Sin papeletas registradas</p>
                  )}
                </div>

                {/* Revisiones Técnicas */}
                <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2 pb-1.5 border-b border-blue-100">
                    Rev. Técnica ({consultaCompleta.revisionesTecnicas?.length || 0})
                  </h3>
                  {consultaCompleta.revisionesTecnicas?.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {consultaCompleta.revisionesTecnicas.map((r: any, i: number) => (
                        <div key={i} className="text-xs border border-gray-100 rounded p-2 bg-gray-50">
                          <div className="flex justify-between">
                            <span className="font-semibold text-blue-700">{r.resultado}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${r.estado === "VIGENTE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {r.estado || "—"}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-0.5">{r.fechaInicio} → {r.fechaVencimiento || "—"}</p>
                          <p className="text-gray-500 truncate">{r.entidad}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Sin revisiones técnicas</p>
                  )}
                </div>

                {/* Siniestros */}
                <div className="bg-white rounded-lg shadow-sm border border-rose-200 p-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2 pb-1.5 border-b border-rose-100">
                    Siniestros ({consultaCompleta.siniestros?.length || 0})
                  </h3>
                  {consultaCompleta.siniestros?.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {consultaCompleta.siniestros.map((s: any, i: number) => (
                        <div key={i} className="text-xs border border-gray-100 rounded p-2 bg-gray-50">
                          <div className="flex justify-between">
                            <span className="font-semibold text-rose-700">{s.aseguradora}</span>
                            <span className="text-gray-500">{s.clase}</span>
                          </div>
                          <p className="text-gray-600 mt-0.5">{s.inicio} → {s.fin}</p>
                          <p className="text-gray-500">{s.marca} {s.modelo} — {s.uso}</p>
                          {s.comentario && <p className="text-gray-400 italic mt-0.5">{s.comentario}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Sin siniestros registrados</p>
                  )}
                </div>
              </div>
            )}

            {/* Detalle Auto */}
            {detalleAuto && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Detalle Auto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Placa</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.placa ?? ""}
                        onChange={(e) =>
                          setDetalleAuto((d: any) => ({
                            ...d,
                            placa: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleAuto.placa ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar placa"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Marca</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.marca ?? ""}
                        onChange={(e) =>
                          setDetalleAuto((d: any) => ({
                            ...d,
                            marca: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleAuto.marca ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar marca"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Modelo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.modelo ?? ""}
                        onChange={(e) =>
                          setDetalleAuto((d: any) => ({
                            ...d,
                            modelo: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleAuto.modelo ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar modelo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Año</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleAuto.anio ?? ""}
                        onChange={(e) =>
                          setDetalleAuto((d: any) => ({
                            ...d,
                            anio: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(detalleAuto.anio ?? ""),
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar año"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Uso del vehículo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.usoVehiculo ?? ""}
                        onChange={(e) =>
                          setDetalleAuto((d: any) => ({
                            ...d,
                            usoVehiculo: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleAuto.usoVehiculo ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar uso del vehículo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Valor comercial</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleAuto.valorComercial ?? ""}
                        onChange={(e) =>
                          setDetalleAuto((d: any) => ({
                            ...d,
                            valorComercial: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleAuto.valorComercial ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar valor comercial"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Aseguradoras</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={detalleAuto.aseguradoras ?? ""}
                      onChange={(e) =>
                        setDetalleAuto((d: any) => ({
                          ...d,
                          aseguradoras: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          detalleAuto.aseguradoras ?? "",
                        )
                      }
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Copiar aseguradoras"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle SOAT */}
            {detalleSoat && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Detalle SOAT</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Placa</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSoat.placa ?? ""}
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            placa: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleSoat.placa ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar placa"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Marca</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSoat.marca ?? ""}
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            marca: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleSoat.marca ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar marca"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Modelo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSoat.modelo ?? ""}
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            modelo: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleSoat.modelo ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar modelo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Año</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSoat.anio ?? ""}
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            anio: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(String(detalleSoat.anio ?? ""))
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar año"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Uso del vehículo</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSoat.usoVehiculo ?? ""}
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            usoVehiculo: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleSoat.usoVehiculo ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar uso del vehículo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Zona</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSoat.zona ?? ""}
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            zona: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleSoat.zona ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar zona"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Valor comercial</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSoat.valorComercial ?? ""}
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            valorComercial: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(detalleSoat.valorComercial ?? "")
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar valor comercial"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Aseguradoras</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={
                          Array.isArray(detalleSoat.aseguradoras)
                            ? detalleSoat.aseguradoras.join(", ")
                            : detalleSoat.aseguradoras ?? ""
                        }
                        onChange={(e) =>
                          setDetalleSoat((d: any) => ({
                            ...d,
                            aseguradoras: e.target.value
                              ? e.target.value.split(",").map((s: string) => s.trim())
                              : [],
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                        placeholder="Rimac, Pacifico, ..."
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            Array.isArray(detalleSoat.aseguradoras)
                              ? detalleSoat.aseguradoras.join(", ")
                              : detalleSoat.aseguradoras ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar aseguradoras"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle Vida Ley */}
            {detalleVidaLey && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Detalle Vida Ley</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* RUC */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">RUC Empresa</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVidaLey.rucEmpresa ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, rucEmpresa: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button type="button" onClick={() => navigator.clipboard.writeText(detalleVidaLey.rucEmpresa ?? "")} className="p-1 text-gray-500 hover:text-gray-800" title="Copiar RUC"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Razón social */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Razón Social</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVidaLey.razonSocial ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, razonSocial: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button type="button" onClick={() => navigator.clipboard.writeText(detalleVidaLey.razonSocial ?? "")} className="p-1 text-gray-500 hover:text-gray-800" title="Copiar razón social"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Actividad económica */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Actividad Económica</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVidaLey.actividadEconomica ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, actividadEconomica: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button type="button" onClick={() => navigator.clipboard.writeText(detalleVidaLey.actividadEconomica ?? "")} className="p-1 text-gray-500 hover:text-gray-800" title="Copiar actividad económica"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Nº empleados en planilla */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Empleados en Planilla</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleVidaLey.numeroEmpleadosPlanilla ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, numeroEmpleadosPlanilla: e.target.value ? Number(e.target.value) : undefined }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button type="button" onClick={() => navigator.clipboard.writeText(String(detalleVidaLey.numeroEmpleadosPlanilla ?? ""))} className="p-1 text-gray-500 hover:text-gray-800" title="Copiar número de empleados"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Planilla mensual */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Planilla Mensual</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVidaLey.planillaMensual ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, planillaMensual: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                        placeholder="S/ 0.00"
                      />
                      <button type="button" onClick={() => navigator.clipboard.writeText(String(detalleVidaLey.planillaMensual ?? ""))} className="p-1 text-gray-500 hover:text-gray-800" title="Copiar planilla mensual"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* ¿Planilla al día? */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">¿Planilla al día?</p>
                    <div className="flex items-center gap-2">
                      <select
                        value={detalleVidaLey.tienePlanillaAlDia ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, tienePlanillaAlDia: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="sí">Sí</option>
                        <option value="no">No</option>
                      </select>
                      <button type="button" onClick={() => navigator.clipboard.writeText(detalleVidaLey.tienePlanillaAlDia ?? "")} className="p-1 text-gray-500 hover:text-gray-800" title="Copiar"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Es renovación */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">¿Es renovación?</p>
                    <div className="flex items-center gap-2">
                      <select
                        value={detalleVidaLey.esRenovacion ?? ""}
                        onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, esRenovacion: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="primera vez">Primera vez</option>
                        <option value="renovación">Renovación</option>
                      </select>
                      <button type="button" onClick={() => navigator.clipboard.writeText(detalleVidaLey.esRenovacion ?? "")} className="p-1 text-gray-500 hover:text-gray-800" title="Copiar"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle Salud */}
            {detalleSalud && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Detalle Salud</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Edad</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSalud.edad ?? ""}
                        onChange={(e) =>
                          setDetalleSalud((d: any) => ({
                            ...d,
                            edad: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(detalleSalud.edad ?? ""),
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar edad"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Género</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.genero ?? ""}
                        onChange={(e) =>
                          setDetalleSalud((d: any) => ({
                            ...d,
                            genero: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSalud.genero ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar género"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Tipo de cobertura</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.tipoCobertura ?? ""}
                        onChange={(e) =>
                          setDetalleSalud((d: any) => ({
                            ...d,
                            tipoCobertura: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSalud.tipoCobertura ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar tipo de cobertura"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Incluir familia</p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!detalleSalud.incluirFamilia}
                          onChange={(e) =>
                            setDetalleSalud((d: any) => ({
                              ...d,
                              incluirFamilia: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm">
                          {detalleSalud.incluirFamilia ? "Sí" : "No"}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSalud.incluirFamilia ? "Sí" : "No",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar incluir familia"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Número de dependientes
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSalud.numeroDependientes ?? ""}
                        onChange={(e) =>
                          setDetalleSalud((d: any) => ({
                            ...d,
                            numeroDependientes: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(detalleSalud.numeroDependientes ?? ""),
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar número de dependientes"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Tuvo seguro antes</p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!detalleSalud.tuvoSeguroAntes}
                          onChange={(e) =>
                            setDetalleSalud((d: any) => ({
                              ...d,
                              tuvoSeguroAntes: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm">
                          {detalleSalud.tuvoSeguroAntes ? "Sí" : "No"}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSalud.tuvoSeguroAntes ? "Sí" : "No",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar tuvo seguro antes"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Clínica de preferencia
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.clinicaPreferencia ?? ""}
                        onChange={(e) =>
                          setDetalleSalud((d: any) => ({
                            ...d,
                            clinicaPreferencia: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSalud.clinicaPreferencia ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar clínica de preferencia"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Cobertura geográfica
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.coberturaGeografica ?? ""}
                        onChange={(e) =>
                          setDetalleSalud((d: any) => ({
                            ...d,
                            coberturaGeografica: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSalud.coberturaGeografica ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar cobertura geográfica"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Presupuesto mensual</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSalud.presupuestoMensual ?? ""}
                        onChange={(e) =>
                          setDetalleSalud((d: any) => ({
                            ...d,
                            presupuestoMensual: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSalud.presupuestoMensual ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar presupuesto mensual"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Enfermedades preexistentes
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      value={
                        detalleSalud.enfermedadesPreexistentes
                          ? Array.isArray(
                              detalleSalud.enfermedadesPreexistentes,
                            )
                            ? detalleSalud.enfermedadesPreexistentes.join(", ")
                            : detalleSalud.enfermedadesPreexistentes
                          : ""
                      }
                      onChange={(e) =>
                        setDetalleSalud((d: any) => ({
                          ...d,
                          enfermedadesPreexistentes: e.target.value
                            ? e.target.value.split(/,\s*/)
                            : [],
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      placeholder="Separadas por coma"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          detalleSalud.enfermedadesPreexistentes
                            ? Array.isArray(
                                detalleSalud.enfermedadesPreexistentes,
                              )
                              ? detalleSalud.enfermedadesPreexistentes.join(
                                  ", ",
                                )
                              : detalleSalud.enfermedadesPreexistentes
                            : "",
                        )
                      }
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
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Detalle SCTR</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const data = [
                        ["Campo", "Valor"],
                        ["Razón Social",            detalleSCTR.razonSocial ?? ""],
                        ["RUC",                     detalleSCTR.rucEmpresa ?? ""],
                        ["Número de Trabajadores",  detalleSCTR.numeroTrabajadores ?? ""],
                        ["Planilla Mensual (S/)",    detalleSCTR.planillaMensual ?? ""],
                        ["Actividad / Giro",        detalleSCTR.actividadEconomica ?? ""],
                        ["Cobertura",               detalleSCTR.tipoRiesgo ?? ""],
                      ];
                      const ws = XLSX.utils.aoa_to_sheet(data);
                      ws["!cols"] = [{ wch: 28 }, { wch: 45 }];
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, "Ficha SCTR");
                      const nombre = (detalleSCTR.razonSocial || detalleSCTR.rucEmpresa || "cliente").replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
                      XLSX.writeFile(wb, `ficha_sctr_${nombre}.xlsx`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    title="Descargar ficha SCTR en Excel"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar Excel
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">RUC Empresa</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSCTR.rucEmpresa ?? ""}
                        onChange={(e) =>
                          setDetalleSCTR((d: any) => ({
                            ...d,
                            rucEmpresa: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSCTR.rucEmpresa ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar RUC empresa"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Razón social</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSCTR.razonSocial ?? ""}
                        onChange={(e) =>
                          setDetalleSCTR((d: any) => ({
                            ...d,
                            razonSocial: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSCTR.razonSocial ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar razón social"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">
                      Número de trabajadores
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSCTR.numeroTrabajadores ?? ""}
                        onChange={(e) =>
                          setDetalleSCTR((d: any) => ({
                            ...d,
                            numeroTrabajadores: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(detalleSCTR.numeroTrabajadores ?? ""),
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar número de trabajadores"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Planilla mensual (S/)</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleSCTR.planillaMensual ?? ""}
                        onChange={(e) =>
                          setDetalleSCTR((d: any) => ({
                            ...d,
                            planillaMensual: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                        placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(String(detalleSCTR.planillaMensual ?? ""))
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar planilla mensual"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Actividad económica</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleSCTR.actividadEconomica ?? ""}
                        onChange={(e) =>
                          setDetalleSCTR((d: any) => ({
                            ...d,
                            actividadEconomica: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSCTR.actividadEconomica ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar actividad económica"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Tipo de riesgo</p>
                    <div className="flex items-center gap-2">
                      <select
                        value={detalleSCTR.tipoRiesgo ?? ""}
                        onChange={(e) =>
                          setDetalleSCTR((d: any) => ({
                            ...d,
                            tipoRiesgo: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="BAJO">BAJO</option>
                        <option value="MEDIO">MEDIO</option>
                        <option value="ALTO">ALTO</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleSCTR.tipoRiesgo ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar tipo de riesgo"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabla de trabajadores SCTR */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Nómina de Trabajadores ({(detalleSCTR.trabajadores || []).length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const trabajadores = detalleSCTR.trabajadores || [];
                        trabajadores.push({ tipoDoc: "DNI", nroDoc: "", apellidoPaterno: "", apellidoMaterno: "", nombres: "", fechaNacimiento: "", sexo: "M", sueldo: 0 });
                        setDetalleSCTR((d: any) => ({ ...d, trabajadores: [...trabajadores] }));
                      }}
                      className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                    >
                      + Agregar trabajador
                    </button>
                  </div>
                  {(detalleSCTR.trabajadores || []).length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Tipo</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">N° Doc</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Ap. Paterno</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Ap. Materno</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Nombres</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">F. Nac.</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Sexo</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Sueldo</th>
                            <th className="px-2 py-1.5 w-8"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(detalleSCTR.trabajadores || []).map((t: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-1 py-1">
                                <select value={t.tipoDoc || "DNI"} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, tipoDoc: e.target.value }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-14 border rounded px-1 py-0.5 text-xs">
                                  <option value="DNI">DNI</option>
                                  <option value="CE">CE</option>
                                  <option value="PAS">PAS</option>
                                </select>
                              </td>
                              <td className="px-1 py-1"><input value={t.nroDoc || ""} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, nroDoc: e.target.value }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-20 border rounded px-1.5 py-0.5 text-xs" placeholder="N° Doc" /></td>
                              <td className="px-1 py-1"><input value={t.apellidoPaterno || ""} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, apellidoPaterno: e.target.value }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-24 border rounded px-1.5 py-0.5 text-xs" /></td>
                              <td className="px-1 py-1"><input value={t.apellidoMaterno || ""} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, apellidoMaterno: e.target.value }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-24 border rounded px-1.5 py-0.5 text-xs" /></td>
                              <td className="px-1 py-1"><input value={t.nombres || ""} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, nombres: e.target.value }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-28 border rounded px-1.5 py-0.5 text-xs" /></td>
                              <td className="px-1 py-1"><input type="date" value={t.fechaNacimiento || ""} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, fechaNacimiento: e.target.value }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-28 border rounded px-1.5 py-0.5 text-xs" /></td>
                              <td className="px-1 py-1">
                                <select value={t.sexo || "M"} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, sexo: e.target.value }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-10 border rounded px-1 py-0.5 text-xs">
                                  <option value="M">M</option>
                                  <option value="F">F</option>
                                </select>
                              </td>
                              <td className="px-1 py-1"><input type="number" step="0.01" value={t.sueldo || ""} onChange={(e) => { const trs = [...detalleSCTR.trabajadores]; trs[idx] = { ...t, sueldo: Number(e.target.value) }; setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="w-20 border rounded px-1.5 py-0.5 text-xs" placeholder="0.00" /></td>
                              <td className="px-1 py-1">
                                <button type="button" onClick={() => { const trs = [...detalleSCTR.trabajadores]; trs.splice(idx, 1); setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs })); }} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No hay trabajadores registrados. Haz clic en "Agregar trabajador" para comenzar.</p>
                  )}
                </div>
              </div>
            )}

            {/* Documentos del cliente — carta de nombramiento */}
            {leadState?.idCliente && documentosCliente.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Documentos del Cliente</h3>
                </div>
                <div className="space-y-2">
                  {documentosCliente.map((doc: any) => (
                    <div key={doc.idDocumento} className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {doc.tipoDocumento === "CARTA_NOMBRAMIENTO" ? "Carta de Nombramiento" : doc.tipoDocumento}
                          </p>
                          {doc.descripcion && <p className="text-xs text-gray-500">{doc.descripcion}</p>}
                        </div>
                      </div>
                      <a
                        href={doc.urlArchivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      >
                        <Download className="w-3 h-3" /> Descargar
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pólizas vinculadas — visible cuando el lead tiene cliente registrado */}
            {leadState?.idCliente && (
              <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-100">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Pólizas Emitidas</h3>
                  </div>
                </div>
                {polizasCliente.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No hay pólizas registradas para este cliente aún.</p>
                ) : (
                  <div className="space-y-3">
                    {polizasCliente.map((poliza: any) => (
                      <div key={poliza.id || poliza.idPoliza} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs font-semibold text-gray-500">N° Póliza</p>
                            <p className="font-medium text-gray-800">{poliza.numeroPoliza}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Estado</p>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${poliza.estado === 'VIGENTE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                              {poliza.estado}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Prima Total</p>
                            <p className="font-medium text-gray-800">
                              {poliza.primaTotal
                                ? `${poliza.moneda} ${parseFloat(poliza.primaTotal).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Comisión Agente</p>
                            <p className="font-medium text-violet-700">{poliza.comisionAgente}%</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Vigencia Inicio</p>
                            <p className="text-gray-700">{poliza.vigenciaInicio?.substring(0, 10)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Vigencia Fin</p>
                            <p className="text-gray-700">{poliza.vigenciaFin?.substring(0, 10)}</p>
                          </div>
                          {poliza.compania?.nombreComercial && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500">Compañía</p>
                              <p className="text-gray-700">{poliza.compania.nombreComercial}</p>
                            </div>
                          )}
                          {poliza.ramo?.nombre && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500">Ramo</p>
                              <p className="text-gray-700">{poliza.ramo.nombre}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Detalle Vida */}
            {detalleVida && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">Detalle Vida</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Edad</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={detalleVida.edad ?? ""}
                        onChange={(e) =>
                          setDetalleVida((d: any) => ({
                            ...d,
                            edad: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(detalleVida.edad ?? ""),
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar edad"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Ocupación</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVida.ocupacion ?? ""}
                        onChange={(e) =>
                          setDetalleVida((d: any) => ({
                            ...d,
                            ocupacion: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleVida.ocupacion ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar ocupación"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Suma asegurada</p>
                    <div className="flex items-center gap-2">
                      <input
                        value={detalleVida.sumaAsegurada ?? ""}
                        onChange={(e) =>
                          setDetalleVida((d: any) => ({
                            ...d,
                            sumaAsegurada: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleVida.sumaAsegurada ?? "",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar suma asegurada"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Fuma</p>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!detalleVida.fuma}
                          onChange={(e) =>
                            setDetalleVida((d: any) => ({
                              ...d,
                              fuma: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm">
                          {detalleVida.fuma ? "Sí" : "No"}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            detalleVida.fuma ? "Sí" : "No",
                          )
                        }
                        className="p-1 text-gray-500 hover:text-gray-800"
                        title="Copiar fuma"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Beneficiarios</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={
                        detalleVida.beneficiarios
                          ? typeof detalleVida.beneficiarios === "string"
                            ? detalleVida.beneficiarios
                            : JSON.stringify(detalleVida.beneficiarios)
                          : ""
                      }
                      onChange={(e) =>
                        setDetalleVida((d: any) => ({
                          ...d,
                          beneficiarios: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          detalleVida.beneficiarios
                            ? typeof detalleVida.beneficiarios === "string"
                              ? detalleVida.beneficiarios
                              : JSON.stringify(detalleVida.beneficiarios)
                            : "",
                        )
                      }
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

      {user && (
        <RegistrarCliente
          isOpen={isRegistrarClienteOpen}
          onClose={() => {
            setIsRegistrarClienteOpen(false);
            setLeadInitialValues(undefined);
          }}
          addCliente={handleAddClienteAndLink}
          user={user}
          initialValues={leadInitialValues}
          presentation="drawer"
          size="lg"
        />
      )}

      {user && (
        <RegistrarPoliza
          isOpen={isRegistrarPolizaOpen}
          onClose={() => setIsRegistrarPolizaOpen(false)}
          addPoliza={handleRegistrarPoliza}
          idCliente={idClienteVinculado}
          idUsuario={user.idUsuario}
          cliente={clienteVinculado}
        />
      )}
    </>
  );
}
