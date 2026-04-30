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
import { sctrExportService } from "@/services/sctr-export.service";
import { useAuthStore } from "@/store/auth.store";
import { useClientes } from "@/hooks/useCliente";
import { usePolizas } from "@/hooks/usePolizas";
import {
  ArrowLeft, Copy, Car, Sparkles, Settings, FileText, RefreshCw,
  ShieldCheck, User, MapPin, Hash, UserPlus, Download, Save,
  FileCheck, CheckCircle, ChevronDown, ClipboardList,
} from "lucide-react";
import { GenerarCotizacionModal } from "@/components/modulos/leads/GenerarCotizacionModal";
import { AgenteAsignadoCard } from "@/components/modulos/leads/detail/AgenteAsignadoCard";
import { HistorialRecordatorios } from "@/components/modulos/leads/detail/HistorialRecordatorios";
import * as XLSX from "xlsx";
import days from "dayjs";
import { useEffect, useState } from "react";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold text-gray-500 mb-1">{children}</p>
);

const CopyBtn = ({ value }: { value: string }) => (
  <button
    type="button"
    onClick={() => navigator.clipboard.writeText(value)}
    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors shrink-0"
    title="Copiar"
  >
    <Copy className="w-3.5 h-3.5" />
  </button>
);

const EditableField = ({
  value, onChange, placeholder, type = "text", readOnly = false,
}: {
  value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; readOnly?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors ${readOnly ? "cursor-default" : ""}`}
    />
    <CopyBtn value={value} />
  </div>
);

// Sección colapsable con borde de color
const CollapsibleSection = ({
  label, icon, iconBg, iconColor, borderColor, open, onToggle, action, children,
}: {
  label: string; icon: React.ReactNode; iconBg: string; iconColor: string;
  borderColor: string; open: boolean; onToggle: () => void; action?: React.ReactNode; children: React.ReactNode;
}) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${borderColor} overflow-hidden`}>
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-3 bg-gray-50/70 border-b border-gray-100 hover:bg-gray-100/60 transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{label}</h2>
      </div>
      <div className="flex items-center gap-3">
        {action && <span onClick={(e) => e.stopPropagation()}>{action}</span>}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>
    </button>
    {open && <div className="p-5">{children}</div>}
  </div>
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
  const [isCotizacionOpen, setIsCotizacionOpen] = useState(false);
  const [leadInitialValues, setLeadInitialValues] = useState<Partial<any> | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Tab activo del panel vehicular AI
  const [vehicularTab, setVehicularTab] = useState<"placa" | "papeletas" | "revisiones" | "siniestros">("placa");

  // Estado de secciones colapsables
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["auto", "soat", "vidaLey", "salud", "sctr", "vida"]));
  const toggleSection = (key: string) =>
    setOpenSections((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const placaRaw = detalleAuto?.placa || detalleSoat?.placa;
  const placaParaConsulta = placaRaw ? placaRaw.trim().replace(/[\s-]+/g, "").toUpperCase() : undefined;
  const { data: consultaPlacaData, isLoading: isLoadingPlaca, error: errorPlaca, refetch: refetchPlaca } =
    leadService.useConsultarPlacaAI(placaParaConsulta);
  const { data: consultaCompleta } = leadService.useConsultaVehicularCompleta(placaParaConsulta);
  const propietariosCount = consultaPlacaData?.propietarios?.length ?? 0;

  useEffect(() => {
    if (lead) {
      setLeadState({ ...lead });
      setDetalleVidaLey(lead.detalleVidaLey ? { ...lead.detalleVidaLey } : null);
      setDetalleAuto(lead.detalleAuto ? { ...lead.detalleAuto } : null);
      setDetalleSalud(lead.detalleSalud ? { ...lead.detalleSalud } : null);
      setDetalleSCTR(lead.detalleSCTR ? { ...lead.detalleSCTR } : null);
      setDetalleVida(lead.detalleVida ? { ...lead.detalleVida } : null);
      setDetalleSoat(lead.detalleSoat ? { ...lead.detalleSoat } : null);
    } else {
      setLeadState(null); setDetalleVidaLey(null); setDetalleAuto(null);
      setDetalleSalud(null); setDetalleSCTR(null); setDetalleVida(null); setDetalleSoat(null);
    }
  }, [lead]);

  const handleGoBack = () => navigate("/dashboard/gestion-trabajo/leads");

  const handleRegistrarCliente = () => {
    if (!leadState || !user) return;
    setLeadInitialValues({
      tipoPersona: "NATURAL",
      nombres: leadState.nombre || "",
      apellidos: leadState.apellidos || "",
      emailNotificaciones: leadState.email || "",
      telefono1: leadState.telefono || "",
      numeroDocumento: leadState.numeroDocumento || "",
    });
    setIsRegistrarClienteOpen(true);
  };

  const handleAddClienteAndLink = async (clienteData: any) => {
    const newCliente = await addCliente(clienteData);
    if (newCliente?.idCliente && id) {
      await leadService.update(id, { idCliente: newCliente.idCliente });
      await leadService.cambiarEstado(id, "COTIZADO", user?.nombreUsuario, "Cliente registrado y vinculado");
      setLeadState((s: any) => ({ ...s, idCliente: newCliente.idCliente, estado: "COTIZADO" }));
    }
  };

  const handleRegistrarPoliza = async (data: any) => {
    await addPoliza(data);
    if (id) {
      await leadService.cambiarEstado(id, "EMITIDO", user?.nombreUsuario, "Póliza registrada");
      setLeadState((s: any) => ({ ...s, estado: "EMITIDO" }));
    }
    setIsRegistrarPolizaOpen(false);
  };

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
        nombre: leadState.nombre, email: leadState.email, telefono: leadState.telefono,
        empresa: leadState.empresa, cargo: leadState.cargo, fuente: leadState.fuente,
        estado: leadState.estado, prioridad: leadState.prioridad, tipoSeguro: leadState.tipoSeguro,
        valorEstimado: leadState.valorEstimado, comision: leadState.comision,
        idCliente: leadState.idCliente, notas: leadState.notas,
      });
      if (detalleAuto) { try { await leadService.updateDetalleAuto(id, detalleAuto); } catch (e) { console.error("Error detalle auto:", e); } }
      if (detalleSoat) { try { await leadService.updateDetalleSoat(id, detalleSoat); } catch (e) { console.error("Error detalle soat:", e); } }
      if (detalleSalud) { try { await leadService.updateDetalleSalud(id, detalleSalud); } catch (e) { console.error("Error detalle salud:", e); } }
      if (detalleSCTR) { try { await leadService.updateDetalleSCTR(id, detalleSCTR); } catch (e) { console.error("Error detalle SCTR:", e); } }
      if (detalleVida) { try { await leadService.updateDetalleVida(id, detalleVida); } catch (e) { console.error("Error detalle vida:", e); } }
      if (detalleVidaLey) { try { await leadService.updateDetalleVidaLey(id, detalleVidaLey); } catch (e) { console.error("Error detalle vida ley:", e); } }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  const estadoClass = (e: string) => {
    if (e === "NUEVO") return "bg-indigo-50 text-indigo-700 border-indigo-300";
    if (e === "COTIZADO") return "bg-violet-50 text-violet-700 border-violet-300";
    if (e === "EMITIDO") return "bg-orange-50 text-orange-700 border-orange-300";
    if (e === "CERRADO") return "bg-emerald-50 text-emerald-700 border-emerald-300";
    if (e === "PERDIDO") return "bg-rose-50 text-rose-700 border-rose-300";
    return "bg-gray-50 text-gray-700 border-gray-300";
  };

  // Tabs vehiculares
  const vehicularTabs = [
    { key: "placa", label: "Vehículo" },
    { key: "papeletas", label: `Papeletas (${consultaCompleta?.papeletas?.length ?? 0})` },
    { key: "revisiones", label: `Rev. Técnica (${consultaCompleta?.revisionesTecnicas?.length ?? 0})` },
    { key: "siniestros", label: `Siniestros (${consultaCompleta?.siniestros?.length ?? 0})` },
  ] as const;

  return (
    <>
      {/* ── Header ── */}
      <Header
        title={leadState ? `Lead: ${leadState.nombre}` : lead ? `Lead: ${lead.nombre}` : "Lead"}
        description="Detalle completo del lead"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleGoBack} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <button
            onClick={() => setIsCotizacionOpen(true)}
            disabled={!leadState?.idCliente}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
              leadState?.idCliente 
                ? "bg-[#003d5c] hover:bg-[#002d44]" 
                : "bg-gray-400 cursor-not-allowed opacity-70"
            }`}
            title={!leadState?.idCliente ? "Debe vincular un cliente antes de generar una cotización" : ""}
          >
            <ClipboardList className="w-4 h-4" /> Generar Comparativo
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
            <button onClick={() => setIsRegistrarPolizaOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors">
              <FileCheck className="w-4 h-4" /> Registrar Póliza
            </button>
          )}
          {leadState?.estado === "EMITIDO" && (
            <button onClick={handleCerrarLead} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" /> Cerrar Lead
            </button>
          )}
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${saveSuccess ? "bg-emerald-600" : "bg-gray-700 hover:bg-gray-800"}`}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Guardando..." : saveSuccess ? "Guardado ✓" : "Guardar cambios"}
          </button>
        </div>
      </Header>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : lead ? (
          <div className="space-y-4 max-w-screen-2xl mx-auto">

            {/* ══════════════════════════════════════════════
                FILA 1 — Prospecto (izq 2/3) + Estado (der 1/3)
            ══════════════════════════════════════════════ */}
            {/* Card unificada: Prospecto + Estado CRM */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                {/* ── Datos del Prospecto ── */}
                <div className="flex-1 min-w-0">
                  <div className="px-5 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#003d5c]/10 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-[#003d5c]" />
                    </div>
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Datos del Prospecto</h2>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Nombre completo</FieldLabel>
                      <EditableField value={leadState?.nombre ?? ""} onChange={(v) => setLeadState((s: any) => ({ ...s, nombre: v }))} />
                    </div>
                    <div>
                      <FieldLabel>Número de documento</FieldLabel>
                      <EditableField value={leadState?.numeroDocumento ?? ""} onChange={(v) => setLeadState((s: any) => ({ ...s, numeroDocumento: v }))} />
                    </div>
                    <div>
                      <FieldLabel>Email</FieldLabel>
                      <EditableField value={leadState?.email ?? ""} onChange={(v) => setLeadState((s: any) => ({ ...s, email: v }))} />
                    </div>
                    <div>
                      <FieldLabel>Teléfono</FieldLabel>
                      <EditableField value={leadState?.telefono ?? ""} onChange={(v) => setLeadState((s: any) => ({ ...s, telefono: v }))} placeholder="Sin prefijo" />
                    </div>
                    {leadState?.empresa && (
                      <div>
                        <FieldLabel>Empresa</FieldLabel>
                        <EditableField value={leadState.empresa} onChange={(v) => setLeadState((s: any) => ({ ...s, empresa: v }))} />
                      </div>
                    )}
                    {leadState?.cargo && (
                      <div>
                        <FieldLabel>Cargo</FieldLabel>
                        <EditableField value={leadState.cargo} onChange={(v) => setLeadState((s: any) => ({ ...s, cargo: v }))} />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Estado CRM ── */}
                <div className="lg:w-96 shrink-0">
                  <div className="px-5 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Estado CRM</h2>
                    {leadState?.tipoSeguro && (
                      <span className="ml-auto text-[11px] font-bold text-white bg-[#003d5c] px-2.5 py-0.5 rounded-full">
                        {leadState.tipoSeguro}
                      </span>
                    )}
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Estado</FieldLabel>
                      <select
                        value={leadState?.estado ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setLeadState((s: any) => ({ ...s, estado: v }));
                          if (id) { leadService.cambiarEstado(id, v, user?.nombreUsuario, "Cambio manual").catch(() => {}); }
                        }}
                        className={`w-full rounded-lg px-2.5 py-1.5 text-sm font-semibold border cursor-pointer transition-colors focus:outline-none ${estadoClass(leadState?.estado ?? "")}`}
                      >
                        <option value="NUEVO">Nuevo</option>
                        <option value="COTIZADO">Cotizado</option>
                        <option value="EMITIDO">Emitido</option>
                        <option value="CERRADO">Cerrado</option>
                        <option value="PERDIDO">Perdido</option>
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Prioridad</FieldLabel>
                      <EditableField value={leadState?.prioridad ?? ""} onChange={(v) => setLeadState((s: any) => ({ ...s, prioridad: v }))} />
                    </div>
                    <div>
                      <FieldLabel>Fuente</FieldLabel>
                      <EditableField value={leadState?.fuente ?? ""} onChange={(v) => setLeadState((s: any) => ({ ...s, fuente: v }))} />
                    </div>
                    {leadState?.valorEstimado ? (
                      <div>
                        <FieldLabel>Valor estimado</FieldLabel>
                        <EditableField value={leadState.valorEstimado} onChange={(v) => setLeadState((s: any) => ({ ...s, valorEstimado: v }))} />
                      </div>
                    ) : <div />}
                    {leadState?.comision && (
                      <div>
                        <FieldLabel>Comisión</FieldLabel>
                        <EditableField value={leadState.comision} onChange={(v) => setLeadState((s: any) => ({ ...s, comision: v }))} />
                      </div>
                    )}
                    <div className="col-span-2 pt-3 border-t border-gray-100 flex justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Creado</p>
                        <p className="text-xs text-gray-600 mt-0.5">{lead.fechaCreacion ? days(lead.fechaCreacion).format("DD/MM/YYYY HH:mm") : "—"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Modificado</p>
                        <p className="text-xs text-gray-600 mt-0.5">{lead.fechaModificacion ? days(lead.fechaModificacion).format("DD/MM/YYYY HH:mm") : "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ══════════════════════════════════════════════
                FILA 1.5 — Agente a cargo + Historial recordatorios (SBS)
            ══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AgenteAsignadoCard asignadoA={leadState?.asignadoA} />
              {id && (
                <HistorialRecordatorios idLead={id} estadoLead={leadState?.estado || "NUEVO"} />
              )}
            </div>

            {/* ══════════════════════════════════════════════
                FILA 2 — Panel AI Vehicular con TABS (si hay placa)
            ══════════════════════════════════════════════ */}
            {placaRaw && (
              <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                {/* Cabecera del panel */}
                <div className="px-5 py-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Consulta AI — Placa</span>
                      <span className="ml-2 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">{placaRaw}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => refetchPlaca()}
                    disabled={isLoadingPlaca}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Actualizar"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingPlaca ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
                  {vehicularTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setVehicularTab(tab.key)}
                      className={`px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                        vehicularTab === tab.key
                          ? "border-blue-500 text-blue-700 bg-blue-50/40"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Contenido del tab activo */}
                <div className="p-5">

                  {/* Tab: Vehículo */}
                  {vehicularTab === "placa" && (
                    <>
                      {errorPlaca && !isLoadingPlaca && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-red-600 text-xs">No se pudo obtener información. Intenta de nuevo.</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                          { label: "Placa", icon: <Car className="w-3.5 h-3.5 text-blue-600" />, value: consultaPlacaData?.placa || placaRaw, bold: true, wide: true },
                          { label: "Marca", icon: <Settings className="w-3.5 h-3.5 text-gray-500" />, value: consultaPlacaData?.marca || detalleAuto?.marca || detalleSoat?.marca },
                          { label: "Modelo", icon: <Car className="w-3.5 h-3.5 text-gray-500" />, value: consultaPlacaData?.modelo || detalleAuto?.modelo || detalleSoat?.modelo },
                          { label: "Estado", icon: <FileText className="w-3.5 h-3.5 text-blue-600" />, value: consultaPlacaData?.estado, color: "text-blue-700" },
                          { label: "SOAT", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />, value: consultaPlacaData?.soat?.estado },
                          { label: "Propietarios", icon: <User className="w-3.5 h-3.5 text-amber-600" />, value: String(propietariosCount) },
                        ].map((item, i) => (
                          <div key={i} className={`bg-gray-50 border border-gray-100 rounded-xl p-3 ${item.wide ? "col-span-2 sm:col-span-1" : ""}`}>
                            <div className="flex items-center gap-1.5 mb-1.5">{item.icon}<span className="text-[11px] text-gray-400">{item.label}</span></div>
                            {isLoadingPlaca
                              ? <Skeleton className="h-5 w-20" />
                              : <p className={`text-sm font-semibold ${item.color ?? "text-gray-900"} ${item.bold ? "text-base" : ""}`}>{item.value || "—"}</p>
                            }
                          </div>
                        ))}
                      </div>
                      {/* Info extra en grid */}
                      {consultaPlacaData && !isLoadingPlaca && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600">
                          {[
                            ["Año", consultaPlacaData.anio],
                            ["Color", consultaPlacaData.color],
                            ["Clase", consultaPlacaData.clase],
                            ["Uso", consultaPlacaData.uso],
                            ["Sede", consultaPlacaData.sede],
                            ["Departamento", consultaPlacaData.departamentoSede],
                            ["Serie", consultaPlacaData.nroSerie],
                            ["VIN", consultaPlacaData.nroVin],
                          ].filter(([, v]) => v).map(([label, val]) => (
                            <div key={String(label)} className="bg-gray-50 rounded-lg px-3 py-2">
                              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                              <p className="font-medium text-gray-700 mt-0.5">{val || "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsConsultaModalOpen(true)}
                          disabled={isLoadingPlaca || !consultaPlacaData}
                          className="px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          Ver datos completos
                        </button>
                      </div>
                    </>
                  )}

                  {/* Tab: Papeletas */}
                  {vehicularTab === "papeletas" && (
                    <>
                      {!consultaCompleta?.papeletas?.length ? (
                        <div className="py-12 text-center">
                          <CheckCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 font-medium">Sin papeletas registradas</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {consultaCompleta.papeletas.map((p: any, i: number) => (
                            <div key={i} className="border border-amber-100 rounded-xl p-3 bg-amber-50/40">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold text-amber-800 leading-tight">{p.falta}</span>
                                <span className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${p.estado === "Pendiente" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{p.estado}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{p.fechaInfraccion} · S/ {p.monto}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Tab: Revisiones Técnicas */}
                  {vehicularTab === "revisiones" && (
                    <>
                      {!consultaCompleta?.revisionesTecnicas?.length ? (
                        <div className="py-12 text-center">
                          <CheckCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 font-medium">Sin revisiones técnicas</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {consultaCompleta.revisionesTecnicas.map((r: any, i: number) => (
                            <div key={i} className="border border-blue-100 rounded-xl p-3 bg-blue-50/30">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold text-blue-800">{r.resultado}</span>
                                <span className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${r.estado === "VIGENTE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{r.estado || "—"}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{r.fechaInicio} → {r.fechaVencimiento || "—"}</p>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{r.entidad}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Tab: Siniestros */}
                  {vehicularTab === "siniestros" && (
                    <>
                      {!consultaCompleta?.siniestros?.length ? (
                        <div className="py-12 text-center">
                          <CheckCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 font-medium">Sin siniestros registrados</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {consultaCompleta.siniestros.map((s: any, i: number) => (
                            <div key={i} className="border border-rose-100 rounded-xl p-3 bg-rose-50/30">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold text-rose-800">{s.aseguradora}</span>
                                <span className="text-xs text-gray-400 ml-2 shrink-0">{s.clase}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{s.inicio} → {s.fin}</p>
                              <p className="text-xs text-gray-400">{s.marca} {s.modelo} · {s.uso}</p>
                              {s.comentario && <p className="text-xs text-gray-400 italic mt-0.5">{s.comentario}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════
                FILA 3 — Detalles del seguro (acordeones)
            ══════════════════════════════════════════════ */}

            {detalleAuto && (
              <CollapsibleSection
                label="Detalle Auto" open={openSections.has("auto")} onToggle={() => toggleSection("auto")}
                icon={<Car className="w-3.5 h-3.5" />} iconBg="bg-sky-100" iconColor="text-sky-600" borderColor="border-l-sky-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><FieldLabel>Placa</FieldLabel><EditableField value={detalleAuto.placa ?? ""} onChange={(v) => setDetalleAuto((d: any) => ({ ...d, placa: v }))} /></div>
                  <div><FieldLabel>Marca</FieldLabel><EditableField value={detalleAuto.marca ?? ""} onChange={(v) => setDetalleAuto((d: any) => ({ ...d, marca: v }))} /></div>
                  <div><FieldLabel>Modelo</FieldLabel><EditableField value={detalleAuto.modelo ?? ""} onChange={(v) => setDetalleAuto((d: any) => ({ ...d, modelo: v }))} /></div>
                  <div>
                    <FieldLabel>Año</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleAuto.anio ?? ""} onChange={(e) => setDetalleAuto((d: any) => ({ ...d, anio: e.target.value ? Number(e.target.value) : undefined }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleAuto.anio ?? "")} />
                    </div>
                  </div>
                  <div><FieldLabel>Uso del vehículo</FieldLabel><EditableField value={detalleAuto.usoVehiculo ?? ""} onChange={(v) => setDetalleAuto((d: any) => ({ ...d, usoVehiculo: v }))} /></div>
                  <div><FieldLabel>Valor comercial</FieldLabel><EditableField value={detalleAuto.valorComercial ?? ""} onChange={(v) => setDetalleAuto((d: any) => ({ ...d, valorComercial: v }))} /></div>
                </div>
                <div className="mt-4"><FieldLabel>Aseguradoras</FieldLabel><EditableField value={detalleAuto.aseguradoras ?? ""} onChange={(v) => setDetalleAuto((d: any) => ({ ...d, aseguradoras: v }))} /></div>
              </CollapsibleSection>
            )}

            {detalleSoat && (
              <CollapsibleSection
                label="Detalle SOAT" open={openSections.has("soat")} onToggle={() => toggleSection("soat")}
                icon={<ShieldCheck className="w-3.5 h-3.5" />} iconBg="bg-teal-100" iconColor="text-teal-600" borderColor="border-l-teal-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><FieldLabel>Placa</FieldLabel><EditableField value={detalleSoat.placa ?? ""} onChange={(v) => setDetalleSoat((d: any) => ({ ...d, placa: v }))} /></div>
                  <div><FieldLabel>Marca</FieldLabel><EditableField value={detalleSoat.marca ?? ""} onChange={(v) => setDetalleSoat((d: any) => ({ ...d, marca: v }))} /></div>
                  <div><FieldLabel>Modelo</FieldLabel><EditableField value={detalleSoat.modelo ?? ""} onChange={(v) => setDetalleSoat((d: any) => ({ ...d, modelo: v }))} /></div>
                  <div>
                    <FieldLabel>Año</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleSoat.anio ?? ""} onChange={(e) => setDetalleSoat((d: any) => ({ ...d, anio: e.target.value ? Number(e.target.value) : undefined }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleSoat.anio ?? "")} />
                    </div>
                  </div>
                  <div><FieldLabel>Uso del vehículo</FieldLabel><EditableField value={detalleSoat.usoVehiculo ?? ""} onChange={(v) => setDetalleSoat((d: any) => ({ ...d, usoVehiculo: v }))} /></div>
                  <div><FieldLabel>Zona</FieldLabel><EditableField value={detalleSoat.zona ?? ""} onChange={(v) => setDetalleSoat((d: any) => ({ ...d, zona: v }))} /></div>
                  <div><FieldLabel>Valor comercial</FieldLabel><EditableField value={detalleSoat.valorComercial ?? ""} onChange={(v) => setDetalleSoat((d: any) => ({ ...d, valorComercial: v }))} /></div>
                  <div className="md:col-span-2">
                    <FieldLabel>Aseguradoras</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input
                        value={Array.isArray(detalleSoat.aseguradoras) ? detalleSoat.aseguradoras.join(", ") : detalleSoat.aseguradoras ?? ""}
                        onChange={(e) => setDetalleSoat((d: any) => ({ ...d, aseguradoras: e.target.value ? e.target.value.split(",").map((s: string) => s.trim()) : [] }))}
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                        placeholder="Rimac, Pacifico, ..."
                      />
                      <CopyBtn value={Array.isArray(detalleSoat.aseguradoras) ? detalleSoat.aseguradoras.join(", ") : detalleSoat.aseguradoras ?? ""} />
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {detalleVidaLey && (
              <CollapsibleSection
                label="Detalle Vida Ley" open={openSections.has("vidaLey")} onToggle={() => toggleSection("vidaLey")}
                icon={<FileCheck className="w-3.5 h-3.5" />} iconBg="bg-violet-100" iconColor="text-violet-600" borderColor="border-l-violet-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><FieldLabel>RUC Empresa</FieldLabel><EditableField value={detalleVidaLey.rucEmpresa ?? ""} onChange={(v) => setDetalleVidaLey((d: any) => ({ ...d, rucEmpresa: v }))} /></div>
                  <div><FieldLabel>Razón Social</FieldLabel><EditableField value={detalleVidaLey.razonSocial ?? ""} onChange={(v) => setDetalleVidaLey((d: any) => ({ ...d, razonSocial: v }))} /></div>
                  <div><FieldLabel>Actividad Económica</FieldLabel><EditableField value={detalleVidaLey.actividadEconomica ?? ""} onChange={(v) => setDetalleVidaLey((d: any) => ({ ...d, actividadEconomica: v }))} /></div>
                  <div>
                    <FieldLabel>Empleados en Planilla</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleVidaLey.numeroEmpleadosPlanilla ?? ""} onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, numeroEmpleadosPlanilla: e.target.value ? Number(e.target.value) : undefined }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleVidaLey.numeroEmpleadosPlanilla ?? "")} />
                    </div>
                  </div>
                  <div><FieldLabel>Planilla Mensual</FieldLabel><EditableField value={detalleVidaLey.planillaMensual ?? ""} onChange={(v) => setDetalleVidaLey((d: any) => ({ ...d, planillaMensual: v }))} placeholder="S/ 0.00" /></div>
                  <div>
                    <FieldLabel>¿Planilla al día?</FieldLabel>
                    <div className="flex items-center gap-2">
                      <select value={detalleVidaLey.tienePlanillaAlDia ?? ""} onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, tienePlanillaAlDia: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors">
                        <option value="">Seleccionar...</option><option value="sí">Sí</option><option value="no">No</option>
                      </select>
                      <CopyBtn value={detalleVidaLey.tienePlanillaAlDia ?? ""} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>¿Es renovación?</FieldLabel>
                    <div className="flex items-center gap-2">
                      <select value={detalleVidaLey.esRenovacion ?? ""} onChange={(e) => setDetalleVidaLey((d: any) => ({ ...d, esRenovacion: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors">
                        <option value="">Seleccionar...</option><option value="primera vez">Primera vez</option><option value="renovación">Renovación</option>
                      </select>
                      <CopyBtn value={detalleVidaLey.esRenovacion ?? ""} />
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {detalleSalud && (
              <CollapsibleSection
                label="Detalle Salud" open={openSections.has("salud")} onToggle={() => toggleSection("salud")}
                icon={<User className="w-3.5 h-3.5" />} iconBg="bg-emerald-100" iconColor="text-emerald-600" borderColor="border-l-emerald-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel>Edad</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleSalud.edad ?? ""} onChange={(e) => setDetalleSalud((d: any) => ({ ...d, edad: e.target.value ? Number(e.target.value) : undefined }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleSalud.edad ?? "")} />
                    </div>
                  </div>
                  <div><FieldLabel>Género</FieldLabel><EditableField value={detalleSalud.genero ?? ""} onChange={(v) => setDetalleSalud((d: any) => ({ ...d, genero: v }))} /></div>
                  <div><FieldLabel>Tipo de cobertura</FieldLabel><EditableField value={detalleSalud.tipoCobertura ?? ""} onChange={(v) => setDetalleSalud((d: any) => ({ ...d, tipoCobertura: v }))} /></div>
                  <div>
                    <FieldLabel>Incluir familia</FieldLabel>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!detalleSalud.incluirFamilia} onChange={(e) => setDetalleSalud((d: any) => ({ ...d, incluirFamilia: e.target.checked }))} className="rounded" />
                        <span className="text-sm text-gray-700">{detalleSalud.incluirFamilia ? "Sí" : "No"}</span>
                      </label>
                      <CopyBtn value={detalleSalud.incluirFamilia ? "Sí" : "No"} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Número de dependientes</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleSalud.numeroDependientes ?? ""} onChange={(e) => setDetalleSalud((d: any) => ({ ...d, numeroDependientes: e.target.value ? Number(e.target.value) : undefined }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleSalud.numeroDependientes ?? "")} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Tuvo seguro antes</FieldLabel>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!detalleSalud.tuvoSeguroAntes} onChange={(e) => setDetalleSalud((d: any) => ({ ...d, tuvoSeguroAntes: e.target.checked }))} className="rounded" />
                        <span className="text-sm text-gray-700">{detalleSalud.tuvoSeguroAntes ? "Sí" : "No"}</span>
                      </label>
                      <CopyBtn value={detalleSalud.tuvoSeguroAntes ? "Sí" : "No"} />
                    </div>
                  </div>
                  <div><FieldLabel>Clínica de preferencia</FieldLabel><EditableField value={detalleSalud.clinicaPreferencia ?? ""} onChange={(v) => setDetalleSalud((d: any) => ({ ...d, clinicaPreferencia: v }))} /></div>
                  <div><FieldLabel>Cobertura geográfica</FieldLabel><EditableField value={detalleSalud.coberturaGeografica ?? ""} onChange={(v) => setDetalleSalud((d: any) => ({ ...d, coberturaGeografica: v }))} /></div>
                  <div><FieldLabel>Presupuesto mensual</FieldLabel><EditableField value={detalleSalud.presupuestoMensual ?? ""} onChange={(v) => setDetalleSalud((d: any) => ({ ...d, presupuestoMensual: v }))} /></div>
                </div>
                <div className="mt-4">
                  <FieldLabel>Enfermedades preexistentes</FieldLabel>
                  <div className="flex items-center gap-2">
                    <input
                      value={detalleSalud.enfermedadesPreexistentes ? (Array.isArray(detalleSalud.enfermedadesPreexistentes) ? detalleSalud.enfermedadesPreexistentes.join(", ") : detalleSalud.enfermedadesPreexistentes) : ""}
                      onChange={(e) => setDetalleSalud((d: any) => ({ ...d, enfermedadesPreexistentes: e.target.value ? e.target.value.split(/,\s*/) : [] }))}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                      placeholder="Separadas por coma"
                    />
                    <CopyBtn value={detalleSalud.enfermedadesPreexistentes ? (Array.isArray(detalleSalud.enfermedadesPreexistentes) ? detalleSalud.enfermedadesPreexistentes.join(", ") : detalleSalud.enfermedadesPreexistentes) : ""} />
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {detalleSCTR && (
              <CollapsibleSection
                label="Detalle SCTR" open={openSections.has("sctr")} onToggle={() => toggleSection("sctr")}
                icon={<FileText className="w-3.5 h-3.5" />} iconBg="bg-orange-100" iconColor="text-orange-600" borderColor="border-l-orange-500"
                action={
                  <div className="flex items-center gap-2">
                    {/* Importar Excel */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5 rotate-180" /> Importar Excel
                      <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const wb = XLSX.read(evt.target?.result, { type: "binary" });
                          const ws = wb.Sheets[wb.SheetNames[0]];
                          const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
                          // Detectar header (buscar fila que tenga "documento" o "paterno")
                          let startRow = 0;
                          for (let i = 0; i < Math.min(rows.length, 5); i++) {
                            const row = (rows[i] || []).map((c: any) => String(c).toLowerCase());
                            if (row.some((c: string) => c.includes("documento") || c.includes("paterno") || c.includes("nombre"))) {
                              startRow = i + 1;
                              break;
                            }
                          }
                          if (startRow === 0) startRow = 1; // skip header row
                          const trabajadores = rows.slice(startRow).filter((r) => r.length >= 3 && r[1]).map((r) => ({
                            tipoDoc: String(r[0] || "DNI").toUpperCase().includes("CE") ? "CE" : "DNI",
                            nroDoc: String(r[1] || "").trim(),
                            apellidoPaterno: String(r[2] || "").trim(),
                            apellidoMaterno: String(r[3] || "").trim(),
                            nombres: String(r[4] || "").trim(),
                            fechaNacimiento: String(r[5] || "").trim(),
                            sexo: String(r[6] || "M").toUpperCase().startsWith("F") ? "F" : "M",
                            sueldo: parseFloat(String(r[7] || "0").replace(",", ".")) || 0,
                          }));
                          if (trabajadores.length > 0) {
                            setDetalleSCTR((d: any) => ({ ...d, trabajadores: [...(d.trabajadores || []), ...trabajadores], numeroTrabajadores: (d.trabajadores?.length || 0) + trabajadores.length }));
                          }
                        };
                        reader.readAsBinaryString(file);
                        e.target.value = "";
                      }} />
                    </label>
                    {/* Exportar Excel estilizado por aseguradora */}
                    <select
                      onChange={async (e) => {
                        const fmt = e.target.value;
                        if (!fmt) return;
                        e.target.value = "";
                        try {
                          await sctrExportService.exportar(fmt, detalleSCTR);
                        } catch (err) {
                          console.error("Error exportando SCTR:", err);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer appearance-none border-0"
                      defaultValue=""
                      style={{ backgroundImage: "none" }}
                    >
                      <option value="" disabled>Exportar Trama...</option>
                      <option value="rimac">Rimac</option>
                      <option value="mapfre">Mapfre</option>
                      <option value="pacifico">Pacifico</option>
                      <option value="positiva">La Positiva</option>
                      <option value="sanitas">Sanitas / Crecer</option>
                      <option value="estandar">Formato Estandar</option>
                    </select>
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><FieldLabel>RUC Empresa</FieldLabel><EditableField value={detalleSCTR.rucEmpresa ?? ""} onChange={(v) => setDetalleSCTR((d: any) => ({ ...d, rucEmpresa: v }))} /></div>
                  <div><FieldLabel>Razón social</FieldLabel><EditableField value={detalleSCTR.razonSocial ?? ""} onChange={(v) => setDetalleSCTR((d: any) => ({ ...d, razonSocial: v }))} /></div>
                  <div>
                    <FieldLabel>Número de trabajadores</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleSCTR.numeroTrabajadores ?? ""} onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, numeroTrabajadores: e.target.value ? Number(e.target.value) : undefined }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleSCTR.numeroTrabajadores ?? "")} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Planilla mensual (S/)</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleSCTR.planillaMensual ?? ""} onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, planillaMensual: e.target.value ? Number(e.target.value) : undefined }))} placeholder="0.00" className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleSCTR.planillaMensual ?? "")} />
                    </div>
                  </div>
                  <div><FieldLabel>Actividad económica</FieldLabel><EditableField value={detalleSCTR.actividadEconomica ?? ""} onChange={(v) => setDetalleSCTR((d: any) => ({ ...d, actividadEconomica: v }))} /></div>
                  <div>
                    <FieldLabel>Tipo de riesgo</FieldLabel>
                    <div className="flex items-center gap-2">
                      <select value={detalleSCTR.tipoRiesgo ?? ""} onChange={(e) => setDetalleSCTR((d: any) => ({ ...d, tipoRiesgo: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors">
                        <option value="">Seleccionar...</option><option value="BAJO">BAJO</option><option value="MEDIO">MEDIO</option><option value="ALTO">ALTO</option>
                      </select>
                      <CopyBtn value={detalleSCTR.tipoRiesgo ?? ""} />
                    </div>
                  </div>
                </div>
                {/* Nómina de Trabajadores */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Nomina de Trabajadores ({(detalleSCTR.trabajadores || []).length})
                      </h4>
                      {(detalleSCTR.trabajadores || []).length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Planilla total: S/ {(detalleSCTR.trabajadores || []).reduce((s: number, t: any) => s + (Number(t.sueldo) || 0), 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                    <button type="button" onClick={() => {
                      const trs = [...(detalleSCTR.trabajadores || [])];
                      trs.push({ tipoDoc: "DNI", nroDoc: "", apellidoPaterno: "", apellidoMaterno: "", nombres: "", fechaNacimiento: "", sexo: "M", sueldo: 0 });
                      setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs, numeroTrabajadores: trs.length }));
                    }} className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                      + Agregar trabajador
                    </button>
                  </div>
                  {(detalleSCTR.trabajadores || []).length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-2 py-2 text-left font-bold text-gray-700 w-8">#</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">Tipo</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">N. Documento</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">Apellido Paterno</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">Apellido Materno</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">Nombres</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">Fecha Nac.</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">Sexo</th>
                            <th className="px-2 py-2 text-left font-bold text-gray-700">Sueldo Bruto</th>
                            <th className="px-2 py-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(detalleSCTR.trabajadores || []).map((t: any, idx: number) => {
                            const updateField = (field: string, value: any) => {
                              const trs = [...detalleSCTR.trabajadores];
                              trs[idx] = { ...t, [field]: value };
                              setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs }));
                            };
                            const removeRow = () => {
                              const trs = [...detalleSCTR.trabajadores];
                              trs.splice(idx, 1);
                              setDetalleSCTR((d: any) => ({ ...d, trabajadores: trs, numeroTrabajadores: trs.length }));
                            };
                            return (
                              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-2 py-1.5 text-gray-400 font-mono">{idx + 1}</td>
                                <td className="px-1 py-1">
                                  <select value={t.tipoDoc || "DNI"} onChange={(e) => updateField("tipoDoc", e.target.value)} className="w-16 border border-gray-200 rounded px-1 py-1 text-xs focus:border-blue-400 focus:outline-none">
                                    <option value="DNI">DNI</option><option value="CE">CE</option><option value="PAS">PAS</option>
                                  </select>
                                </td>
                                <td className="px-1 py-1"><input value={t.nroDoc || ""} onChange={(e) => updateField("nroDoc", e.target.value)} className="w-24 border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" placeholder="N. Doc" /></td>
                                <td className="px-1 py-1"><input value={t.apellidoPaterno || ""} onChange={(e) => updateField("apellidoPaterno", e.target.value)} className="w-28 border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" /></td>
                                <td className="px-1 py-1"><input value={t.apellidoMaterno || ""} onChange={(e) => updateField("apellidoMaterno", e.target.value)} className="w-28 border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" /></td>
                                <td className="px-1 py-1"><input value={t.nombres || ""} onChange={(e) => updateField("nombres", e.target.value)} className="w-32 border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" /></td>
                                <td className="px-1 py-1"><input type="date" value={t.fechaNacimiento || ""} onChange={(e) => updateField("fechaNacimiento", e.target.value)} className="w-32 border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" /></td>
                                <td className="px-1 py-1">
                                  <select value={t.sexo || "M"} onChange={(e) => updateField("sexo", e.target.value)} className="w-12 border border-gray-200 rounded px-1 py-1 text-xs focus:border-blue-400 focus:outline-none">
                                    <option value="M">M</option><option value="F">F</option>
                                  </select>
                                </td>
                                <td className="px-1 py-1"><input type="number" step="0.01" value={t.sueldo || ""} onChange={(e) => updateField("sueldo", Number(e.target.value))} className="w-24 border border-gray-200 rounded px-2 py-1 text-xs focus:border-blue-400 focus:outline-none text-right" placeholder="0.00" /></td>
                                <td className="px-1 py-1"><button type="button" onClick={removeRow} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar">✕</button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                        {(detalleSCTR.trabajadores || []).length > 0 && (
                          <tfoot className="bg-gray-100 font-semibold">
                            <tr>
                              <td colSpan={8} className="px-2 py-2 text-right text-xs text-gray-700">Total Planilla:</td>
                              <td className="px-2 py-2 text-xs text-right text-gray-900">
                                S/ {(detalleSCTR.trabajadores || []).reduce((s: number, t: any) => s + (Number(t.sueldo) || 0), 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No hay trabajadores registrados</p>
                      <p className="text-xs text-gray-400 mt-1">Haz clic en "+ Agregar trabajador" o usa "Importar Excel"</p>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* Seguimiento SBS del cliente */}
            {leadState?.idCliente && clienteVinculado && (
              <div className="bg-white rounded-lg shadow-sm border border-emerald-200 p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Seguimiento SBS</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase">Token Unico</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <code className="text-sm font-mono text-emerald-800 truncate">{clienteVinculado.tokenSBS || "Pendiente"}</code>
                      {clienteVinculado.tokenSBS && (
                        <button type="button" onClick={() => navigator.clipboard.writeText(clienteVinculado.tokenSBS || "")} className="p-0.5 text-emerald-500 hover:text-emerald-700 shrink-0" title="Copiar"><Copy className="w-3 h-3" /></button>
                      )}
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase">Cliente</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">
                      {clienteVinculado.tipoPersona === "JURIDICO" ? clienteVinculado.razonSocial : `${clienteVinculado.nombres || ""} ${clienteVinculado.apellidos || ""}`.trim()}
                    </p>
                  </div>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase">{clienteVinculado.tipoDocumento}</p>
                    <p className="text-sm font-mono text-gray-800 mt-0.5">{clienteVinculado.numeroDocumento}</p>
                  </div>
                </div>
              </div>
            )}

            {detalleVida && (
              <CollapsibleSection
                label="Detalle Vida" open={openSections.has("vida")} onToggle={() => toggleSection("vida")}
                icon={<User className="w-3.5 h-3.5" />} iconBg="bg-rose-100" iconColor="text-rose-600" borderColor="border-l-rose-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel>Edad</FieldLabel>
                    <div className="flex items-center gap-2">
                      <input type="number" value={detalleVida.edad ?? ""} onChange={(e) => setDetalleVida((d: any) => ({ ...d, edad: e.target.value ? Number(e.target.value) : undefined }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                      <CopyBtn value={String(detalleVida.edad ?? "")} />
                    </div>
                  </div>
                  <div><FieldLabel>Ocupación</FieldLabel><EditableField value={detalleVida.ocupacion ?? ""} onChange={(v) => setDetalleVida((d: any) => ({ ...d, ocupacion: v }))} /></div>
                  <div><FieldLabel>Suma asegurada</FieldLabel><EditableField value={detalleVida.sumaAsegurada ?? ""} onChange={(v) => setDetalleVida((d: any) => ({ ...d, sumaAsegurada: v }))} /></div>
                  <div>
                    <FieldLabel>Fuma</FieldLabel>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!detalleVida.fuma} onChange={(e) => setDetalleVida((d: any) => ({ ...d, fuma: e.target.checked }))} className="rounded" />
                        <span className="text-sm text-gray-700">{detalleVida.fuma ? "Sí" : "No"}</span>
                      </label>
                      <CopyBtn value={detalleVida.fuma ? "Sí" : "No"} />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <FieldLabel>Beneficiarios</FieldLabel>
                  <div className="flex items-center gap-2">
                    <input value={detalleVida.beneficiarios ? (typeof detalleVida.beneficiarios === "string" ? detalleVida.beneficiarios : JSON.stringify(detalleVida.beneficiarios)) : ""} onChange={(e) => setDetalleVida((d: any) => ({ ...d, beneficiarios: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors" />
                    <CopyBtn value={detalleVida.beneficiarios ? (typeof detalleVida.beneficiarios === "string" ? detalleVida.beneficiarios : JSON.stringify(detalleVida.beneficiarios)) : ""} />
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* ══════════════════════════════════════════════
                FILA 4 — Notas (izq) + Documentos & Pólizas (der)
            ══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Notas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="px-5 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Notas y Observaciones</h2>
                </div>
                <div className="p-4 flex-1">
                  <textarea
                    value={leadState?.notas ?? ""}
                    onChange={(e) => setLeadState((s: any) => ({ ...s, notas: e.target.value }))}
                    rows={9}
                    placeholder="Agrega observaciones, recordatorios o notas sobre este lead..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-[#003d5c]/40 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Documentos + Pólizas */}
              <div className="flex flex-col gap-4">

                {leadState?.idCliente && documentosCliente.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                    <div className="px-5 py-3 bg-blue-50/50 border-b border-blue-100 flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Documentos del Cliente</h2>
                    </div>
                    <div className="p-4 space-y-2">
                      {documentosCliente.map((doc: any) => (
                        <div key={doc.idDocumento} className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{doc.tipoDocumento === "CARTA_NOMBRAMIENTO" ? "Carta de Nombramiento" : doc.tipoDocumento}</p>
                              {doc.descripcion && <p className="text-xs text-gray-500 truncate">{doc.descripcion}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {doc.urlArchivo?.endsWith('.pdf') && (
                              <a href={doc.urlArchivo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                <FileText className="w-3 h-3" /> Vista previa
                              </a>
                            )}
                            <a href={doc.urlArchivo} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                              <Download className="w-3 h-3" /> Descargar
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pólizas emitidas */}
                {leadState?.idCliente ? (
                  <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden flex-1">
                    <div className="px-5 py-3 bg-orange-50/50 border-b border-orange-100 flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Pólizas Emitidas</h2>
                      <span className="ml-auto text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">{polizasCliente.length}</span>
                    </div>
                    <div className="p-4">
                      {polizasCliente.length === 0 ? (
                        <div className="py-8 text-center">
                          <ShieldCheck className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 italic">No hay pólizas registradas aún.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {polizasCliente.map((poliza: any) => (
                            <div key={poliza.id || poliza.idPoliza} className="border border-gray-100 rounded-xl p-3 bg-gray-50 hover:bg-white transition-colors">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">N° Póliza</p>
                                  <p className="font-semibold text-gray-800 mt-0.5">{poliza.numeroPoliza}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Estado</p>
                                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${poliza.estado === 'VIGENTE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{poliza.estado}</span>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Prima Total</p>
                                  <p className="font-medium text-gray-800 mt-0.5">{poliza.primaTotal ? `${poliza.moneda} ${parseFloat(poliza.primaTotal).toLocaleString("es-PE", { minimumFractionDigits: 2 })}` : "—"}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Comisión</p>
                                  <p className="font-semibold text-violet-700 mt-0.5">{poliza.comisionAgente}%</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Inicio</p>
                                  <p className="text-gray-600 mt-0.5">{poliza.vigenciaInicio?.substring(0, 10)}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Vencimiento</p>
                                  <p className="text-gray-600 mt-0.5">{poliza.vigenciaFin?.substring(0, 10)}</p>
                                </div>
                                {poliza.compania?.nombreComercial && (
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Compañía</p>
                                    <p className="text-gray-600 mt-0.5">{poliza.compania.nombreComercial}</p>
                                  </div>
                                )}
                                {poliza.ramo?.nombre && (
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Ramo</p>
                                    <p className="text-gray-600 mt-0.5">{poliza.ramo.nombre}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-10 flex flex-col items-center justify-center text-center flex-1">
                    <UserPlus className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-500">Sin cliente vinculado</p>
                    <p className="text-xs text-gray-400 mt-1">Registra un cliente para ver sus pólizas y documentos</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Lead no encontrado</p>
          </div>
        )}
      </div>

      {/* ── Modal consulta placa ── */}
      <ModalContainer isOpen={isConsultaModalOpen} onClose={() => setIsConsultaModalOpen(false)} size="xl">
        <Modal>
          <ModalHeader title="Datos del vehículo" description={`Placa ${consultaPlacaData?.placa || placaRaw}`} onClose={() => setIsConsultaModalOpen(false)} />
          <ModalBody className="space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-700 mb-3"><Car className="w-4 h-4" /><h4 className="text-sm font-semibold">Vehículo</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                {[["Marca", consultaPlacaData?.marca], ["Modelo", consultaPlacaData?.modelo], ["Año", consultaPlacaData?.anio], ["Color", consultaPlacaData?.color], ["Clase", consultaPlacaData?.clase], ["Uso", consultaPlacaData?.uso], ["Sede", consultaPlacaData?.sede], ["Departamento", consultaPlacaData?.departamentoSede], ["Estado", consultaPlacaData?.estado]].map(([l, v]) => (
                  <div key={String(l)}>{l}: <span className="font-medium">{v || "-"}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-700 mb-3"><Hash className="w-4 h-4" /><h4 className="text-sm font-semibold">Identificación</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                {[["Serie", consultaPlacaData?.nroSerie], ["VIN", consultaPlacaData?.nroVin], ["Motor", consultaPlacaData?.nroMotor], ["Anotaciones", consultaPlacaData?.anotaciones]].map(([l, v]) => (
                  <div key={String(l)}>{l}: <span className="font-medium">{v ?? "-"}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700 mb-3"><ShieldCheck className="w-4 h-4" /><h4 className="text-sm font-semibold">SOAT</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-900/80">
                {[["Estado", consultaPlacaData?.soat?.estado], ["Compañía", consultaPlacaData?.soat?.compania], ["Póliza", consultaPlacaData?.soat?.numeroPoliza], ["Vigencia", `${consultaPlacaData?.soat?.inicio || "-"} - ${consultaPlacaData?.soat?.fin || "-"}`], ["Clase vehículo", consultaPlacaData?.soat?.claseVehiculo], ["Uso vehículo", consultaPlacaData?.soat?.usoVehiculo], ["Tipo", consultaPlacaData?.soat?.tipo], ["Código SBS", consultaPlacaData?.soat?.codigoSbsAseguradora]].map(([l, v]) => (
                  <div key={String(l)}>{l}: <span className="font-medium">{v || "-"}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-700 mb-3"><User className="w-4 h-4" /><h4 className="text-sm font-semibold">Propietarios</h4></div>
              {consultaPlacaData?.propietarios?.length ? (
                <div className="space-y-3">
                  {consultaPlacaData.propietarios.map((p: any, i: number) => (
                    <div key={`${p.nroDocumento || i}`} className="border border-amber-200/60 rounded-xl p-3 bg-white/70">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-900">{[p.nombres, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(" ") || "-"}</span>
                        <span className="text-xs text-amber-600 font-semibold shrink-0">Doc: {p.nroDocumento || "-"}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>Dirección: {p.direccion || "-"}</div>
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-600" /><span>{[p.departamento, p.provincia, p.distrito].filter(Boolean).join(" - ") || "-"}</span></div>
                        <div>Nacimiento: {p.nacimiento || "-"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">Sin propietarios</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <button type="button" onClick={() => setIsConsultaModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cerrar</button>
          </ModalFooter>
        </Modal>
      </ModalContainer>

      {user && (
        <RegistrarCliente
          isOpen={isRegistrarClienteOpen}
          onClose={() => { setIsRegistrarClienteOpen(false); setLeadInitialValues(undefined); }}
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

      <GenerarCotizacionModal
        open={isCotizacionOpen}
        onClose={() => setIsCotizacionOpen(false)}
        lead={leadState}
        cliente={clienteVinculado}
        detalles={{
          auto: detalleAuto,
          soat: detalleSoat,
          salud: detalleSalud,
          sctr: detalleSCTR,
          vida: detalleVida,
          vidaLey: detalleVidaLey,
        }}
      />
    </>
  );
}
