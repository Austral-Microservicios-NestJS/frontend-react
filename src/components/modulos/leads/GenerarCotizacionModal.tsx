import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, Check,
  Shield, Car, Heart, Users, Briefcase, FileText,
  Zap, Globe, Star, Umbrella, Sun, Eye, Send, ExternalLink, Loader2, Download, UploadCloud, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { quoteService } from "@/services/quote.service";

// ─── Aseguradoras ─────────────────────────────────────────────────────────────

const ASEGURADORAS = [
  { id: "rimac", name: "Rímac", sub: "Seguros", Icon: Shield, bg: "bg-blue-600", ring: "ring-blue-300" },
  { id: "pacifico", name: "Pacífico", sub: "Seguros", Icon: Globe, bg: "bg-emerald-600", ring: "ring-emerald-300" },
  { id: "mapfre", name: "Mapfre", sub: "Perú", Icon: Star, bg: "bg-red-600", ring: "ring-red-300" },
  { id: "la_positiva", name: "La Positiva", sub: "Seguros", Icon: Sun, bg: "bg-amber-500", ring: "ring-amber-300" },
  { id: "interseguro", name: "Interseguro", sub: "Perú", Icon: Zap, bg: "bg-violet-600", ring: "ring-violet-300" },
  { id: "qualitas", name: "Qualitas", sub: "Perú", Icon: Umbrella, bg: "bg-gray-700", ring: "ring-gray-300" },
];

// ─── Tipos de seguro ──────────────────────────────────────────────────────────

const TIPOS_SEGURO = [
  { id: "VEHICULAR", label: "Vehicular", Icon: Car, bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-200", activeBg: "bg-blue-600" },
  { id: "SOAT", label: "SOAT", Icon: Shield, bg: "bg-amber-50", iconColor: "text-amber-600", border: "border-amber-200", activeBg: "bg-amber-500" },
  { id: "SALUD", label: "Salud", Icon: Heart, bg: "bg-rose-50", iconColor: "text-rose-600", border: "border-rose-200", activeBg: "bg-rose-600" },
  { id: "VIDA", label: "Vida", Icon: Users, bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-200", activeBg: "bg-violet-600" },
  { id: "VIDA_LEY", label: "Vida Ley", Icon: Briefcase, bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-200", activeBg: "bg-emerald-600" },
  { id: "SCTR", label: "SCTR", Icon: FileText, bg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-200", activeBg: "bg-indigo-600" },
];

// ─── Campos por tipo ──────────────────────────────────────────────────────────

const getFields = (tipo: string, lead: any, detalles: Record<string, any>, cliente?: any) => {
  const nombre = cliente
    ? [cliente.nombres, cliente.apellidos].filter(Boolean).join(" ") || cliente.razonSocial
    : [lead?.nombre, lead?.apellidos].filter(Boolean).join(" ");

  const d = detalles[tipo] || {};

  const commonHeader = [
    { key: "nombreAsegurado", label: "Nombre del asegurado", value: nombre, type: "text", span: 2 },
    { key: "dni", label: "DNI / RUC", value: cliente?.numeroDocumento || lead?.numeroDocumento || "", type: "text", span: 1 },
    { key: "email", label: "Correo electrónico", value: cliente?.emailNotificaciones || lead?.email || "", type: "email", span: 1 },
    { key: "telefono", label: "Teléfono", value: cliente?.telefono1 || lead?.telefono || "", type: "text", span: 1 },
  ];

  const addressFields = [
    { key: "direccion", label: "Dirección", value: cliente?.direccion || lead?.direccion || "", type: "text", span: 2 },
  ];
  switch (tipo) {
    case "VEHICULAR":
    case "AUTO": // Soporte para datos legacy
      return [
        ...commonHeader,
        ...addressFields,
        { key: "placa", label: "Placa", value: d.placa || "", type: "text", span: 1 },
        { key: "marca", label: "Marca", value: d.marca || "", type: "text", span: 1 },
        { key: "modelo", label: "Modelo", value: d.modelo || "", type: "text", span: 1 },
        { key: "anio", label: "Año", value: d.anio ? String(d.anio) : "", type: "text", span: 1 },
        { key: "claseVehiculo", label: "Clase", value: d.claseVehiculo || "", type: "text", span: 1 },
        { key: "version", label: "Versión", value: d.version || "", type: "text", span: 1 },
        { key: "usoVehiculo", label: "Uso del vehículo", value: d.usoVehiculo || "PARTICULAR", type: "text", span: 1 },
        { key: "valorComercial", label: "Valor comercial (S/)", value: d.valorComercial || lead?.valorEstimado ? String(d.valorComercial || lead?.valorEstimado) : "", type: "number", span: 1 },
        { key: "zona", label: "Zona", value: d.zona || "LIMA", type: "text", span: 1 },
        { key: "categoriaRiesgo", label: "Categoría Riesgo", value: d.categoriaRiesgo || "BAJO", type: "text", span: 1 },
        { key: "primaComercial", label: "Prima Comercial ($)", value: "", type: "number", span: 1 },
        { key: "igv", label: "IGV (18%) ($)", value: "", type: "number", span: 1 },
        { key: "primaTotal", label: "Prima Total ($)", value: "", type: "number", span: 2 },
      ];
    case "SOAT": return [
      ...commonHeader,
      ...addressFields,
      { key: "placa", label: "Placa", value: d.placa || "", type: "text", span: 1 },
      { key: "marca", label: "Marca", value: d.marca || "", type: "text", span: 1 },
      { key: "modelo", label: "Modelo", value: d.modelo || "", type: "text", span: 1 },
      { key: "anio", label: "Año de fabricación", value: d.anio ? String(d.anio) : "", type: "text", span: 1 },
      { key: "valorVehiculo", label: "Valor del vehículo ($)", value: d.valorComercial || lead?.valorEstimado ? String(d.valorComercial || lead?.valorEstimado) : "", type: "number", span: 1 },
      { key: "usoVehiculo", label: "Uso del vehículo", value: d.usoVehiculo || d.uso || "PARTICULAR", type: "text", span: 1 },
    ];
    case "SALUD": return [
      ...commonHeader,
      ...addressFields,
      { key: "fechaNacimiento", label: "Fecha de nacimiento", value: d.fechaNacimiento || "", type: "date", span: 1 },
      { key: "edad", label: "Edad", value: d.edad ? String(d.edad) : "", type: "number", span: 1 },
      { key: "planSalud", label: "Plan de salud", value: d.tipoCobertura || d.planSalud || "", type: "text", span: 1 },
      { key: "sumaAsegurada", label: "Presupuesto mensual (S/)", value: d.presupuestoMensual || lead?.valorEstimado ? String(d.presupuestoMensual || lead?.valorEstimado) : "", type: "number", span: 1 },
      { key: "nroAsegurados", label: "N° de asegurados", value: "1", type: "number", span: 1 },
    ];
    case "VIDA": return [
      ...commonHeader,
      ...addressFields,
      { key: "edad", label: "Edad", value: d.edad ? String(d.edad) : "", type: "number", span: 1 },
      { key: "ocupacion", label: "Ocupación", value: d.ocupacion || "", type: "text", span: 1 },
      { key: "sumaAsegurada", label: "Suma asegurada (S/)", value: d.sumaAsegurada || lead?.valorEstimado ? String(d.sumaAsegurada || lead?.valorEstimado) : "", type: "number", span: 1 },
      { key: "beneficiarios", label: "Beneficiarios", value: d.beneficiarios || "", type: "text", span: 2 },
    ];
    case "VIDA_LEY": return [
      ...commonHeader,
      { key: "ruc", label: "RUC", value: d.rucEmpresa || lead?.numeroDocumento || "", type: "text", span: 1 },
      { key: "razonSocial", label: "Razón social / empresa", value: d.razonSocial || lead?.empresa || "", type: "text", span: 2 },
      { key: "nroTrabajadores", label: "N° de trabajadores", value: d.numeroEmpleadosPlanilla || d.nroTrabajadores ? String(d.numeroEmpleadosPlanilla || d.nroTrabajadores) : "", type: "number", span: 1 },
      { key: "actividadEconomica", label: "Actividad económica", value: d.actividadEconomica || "", type: "text", span: 2 },
      { key: "planillaMensual", label: "Planilla mensual (S/)", value: d.planillaMensual ? String(d.planillaMensual) : "", type: "number", span: 1 },
    ];
    case "SCTR":
    case "SCTR_SALUD":
    case "SCTR_PENSION":
      return [
        ...commonHeader,
        { key: "ruc", label: "RUC", value: d.rucEmpresa || lead?.numeroDocumento || "", type: "text", span: 1 },
        { key: "razonSocial", label: "Razón social / empresa", value: d.razonSocial || lead?.empresa || "", type: "text", span: 2 },
        { key: "nroTrabajadores", label: "N° de trabajadores", value: d.numeroTrabajadores || d.nroTrabajadores ? String(d.numeroTrabajadores || d.nroTrabajadores) : "", type: "number", span: 1 },
        { key: "actividadEconomica", label: "Actividad económica", value: d.actividadEconomica || "", type: "text", span: 2 },
        { key: "nivelRiesgo", label: "Nivel de riesgo", value: d.tipoRiesgo || d.nivelRiesgo || "MEDIO", type: "text", span: 1 },
        { key: "sumaAsegurada", label: "Prima estimada (S/)", value: lead?.valorEstimado ? String(lead?.valorEstimado) : "", type: "number", span: 1 },
      ];
    default: return [];
  }
};

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = ["Subir PDF", "Visualizar", "Enviar"];

// ─── Variantes de animación ───────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  lead: any;
  cliente?: any;
  detalles?: { auto?: any; soat?: any; salud?: any; sctr?: any; vida?: any; vidaLey?: any };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const GenerarCotizacionModal = ({ open, onClose, lead, cliente, detalles = {} }: Props) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [aseguradora, setAseguradora] = useState<string | null>("comparativo");
  const [tipoSeguro, setTipoSeguro] = useState<string | null>("VEHICULAR");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const [isComparativo, setIsComparativo] = useState(true);
  const [comparativoFiles, setComparativoFiles] = useState<File[]>([]);
  const [extractedDataArray, setExtractedDataArray] = useState<any[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  // Eliminado skipTipoSeguro por falta de uso

  // Sincronizar tipo de seguro si viene del Lead
  useEffect(() => {
    if (open && lead?.tipoSeguro) {
      handleTipoSelect(lead.tipoSeguro);
    }
  }, [open, lead?.tipoSeguro]);

  const detallesMap: Record<string, any> = {
    VEHICULAR: detalles.auto, AUTO: detalles.auto, SOAT: detalles.soat, SALUD: detalles.salud,
    SCTR: detalles.sctr, VIDA: detalles.vida, VIDA_LEY: detalles.vidaLey,
  };

  const fields = tipoSeguro ? getFields(tipoSeguro, lead, detallesMap, cliente) : [];

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const handleTipoSelect = (tipo: string) => {
    setTipoSeguro(tipo);
    const fs = getFields(tipo, lead, detallesMap, cliente);
    const init: Record<string, string> = {};
    fs.forEach((f) => { init[f.key] = f.value; });
    setFormValues(init);
  };

  const getFieldValidationError = (key: string, value: string) => {
    // Campos opcionales
    if (["claseVehiculo", "version", "igv", "primaTotal"].includes(key)) return null;

    if (!value || value.toString().trim() === "") return "Este campo es requerido";

    const val = value.toString().trim();

    if (key === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(val)) return "Formato de correo inválido";
    }

    if (key === "dni") {
      if (!/^\d+$/.test(val)) return "Solo se permiten números";
      if (val.length !== 8) return "Debe tener 8 dígitos";
    }

    if (key === "ruc") {
      if (!/^\d+$/.test(val)) return "Solo se permiten números";
      if (val.length !== 11) return "Debe tener 11 dígitos";
    }

    if (key === "telefono") {
      if (!/^\d+$/.test(val)) return "Solo se permiten números";
      if (val.length !== 9) return "Debe tener 9 dígitos";
    }

    return null;
  };

  const isFormValid = () => {
    return fields.every(f => !getFieldValidationError(f.key, formValues[f.key]));
  };

  const currentStepLabel = STEPS[step];

  const handleGenerate = async () => {
    if (!lead?.idLead) {
      alert("Error: No se han cargado los datos del lead correctamente.");
      return;
    }
    setIsGenerating(true);
    try {
      // 1. Crear cotización inicial
      const companyName = isComparativo ? "Comparativo" : (aseguradora || "Genérica");
      const q = await quoteService.create(lead.idLead, companyName);
      // 2. Completar cotización (genera el PDF con los datos validados del modal)
      // Ahora enviamos formValues para que el backend persista los cambios antes de generar el PDF
      const completed = await quoteService.completeQuote(q.id, formValues);
      setPdfUrl(completed.pdfUrl || null);
      setQuoteId(completed.id);

      // Encontrar el índice de "Visualizar" en STEPS para navegar correctamente
      const visualizarIndex = STEPS.indexOf("Visualizar");
      if (visualizarIndex !== -1) goTo(visualizarIndex);
    } catch (error: any) {
      console.error("Error al generar cotización:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!quoteId) return;
    setIsSending(true);
    try {
      await quoteService.enviarEmail({
        destinatario: formValues.email || lead?.email || "",
        nombreCliente: formValues.nombreAsegurado || lead?.nombre || "",
        pdfBase64: pdfUrl?.includes('base64,') ? pdfUrl.split('base64,')[1] : undefined,
        cotizacion: {
          numeroPoliza: quoteId.substring(0, 8).toUpperCase(),
          cliente: {
            nombres: lead?.nombre || "Cliente",
            email: lead?.email || "",
            telefono: lead?.telefono || "",
            tipoDocumento: "DNI",
            numeroDocumento: lead?.numeroDocumento || "",
            direccion: "Lima, Perú",
          },
          seguro: {
            tipo: tipoSeguro || "Vehicular",
            cobertura: "Todo Riesgo",
            vigenciaInicio: new Date().toISOString(),
            vigenciaFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            prima: 1200.00,
            moneda: "USD",
          },
          fechaEmision: new Date().toISOString(),
        },
      });
      setConfirmed(true);
    } catch (error) {
      console.error("Error enviando email:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Cotizacion_${lead?.nombre || "Seguro"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setTimeout(() => {
      setStep(0); setDir(1); setAseguradora("comparativo"); setIsComparativo(true); setComparativoFiles([]);
      setTipoSeguro("VEHICULAR"); setFormValues({}); setConfirmed(false);
      setPdfUrl(null); setQuoteId(null); setIsGenerating(false); setIsSending(false);
      setExtractedDataArray([]);
    }, 300);
    onClose();
  };

  const aseguradoraObj = ASEGURADORAS.find((a) => a.id === aseguradora);
  const tipoObj = TIPOS_SEGURO.find((t) => t.id === tipoSeguro);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden"
            style={{ maxHeight: "88vh" }}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-none">Generar Comparativo</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{lead?.nombre} {lead?.apellidos || ""}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Stepper ── */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/70 shrink-0">
              <div className="flex items-center gap-1">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300",
                      i < step ? "bg-emerald-100 text-emerald-700" :
                        i === step ? "bg-[#003d5c] text-white shadow-sm" :
                          "bg-gray-100 text-gray-400"
                    )}>
                      {i < step
                        ? <Check className="w-3 h-3 shrink-0" />
                        : <span className="w-3 h-3 flex items-center justify-center text-[10px]">{i + 1}</span>
                      }
                      <span>{s}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn("flex-1 h-px mx-1 transition-colors duration-300",
                        i < step ? "bg-emerald-200" : "bg-gray-200"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Body animado ── */}
            <div className="flex-1 overflow-y-auto relative" style={{ minHeight: 0 }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={`${step}-${confirmed}`}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="px-6 py-5"
                >

                  {/* ── Paso 1: Aseguradora ── */}
                  {currentStepLabel === "Aseguradora" && (
                    <div>
                      <p className="text-sm text-gray-500 mb-4">Selecciona la aseguradora para esta cotización.</p>
                      <div className="grid grid-cols-3 gap-3">
                        {ASEGURADORAS.map((a) => {
                          const Icon = a.Icon;
                          const isSelected = aseguradora === a.id;
                          return (
                            <button
                              key={a.id}
                              onClick={() => setAseguradora(a.id)}
                              className={cn(
                                "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 group",
                                isSelected
                                  ? "border-[#003d5c] bg-[#003d5c]/4 shadow-sm"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/80"
                              )}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#003d5c] flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-all duration-200",
                                a.bg,
                                isSelected ? `ring-4 ${a.ring}` : ""
                              )}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="text-center">
                                <p className={cn("text-sm font-bold leading-none", isSelected ? "text-[#003d5c]" : "text-gray-800")}>
                                  {a.name}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{a.sub}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-5 border-t border-gray-100 pt-5">
                        <p className="text-sm text-gray-500 mb-3">O utiliza nuestra herramienta de análisis automático</p>
                        <button
                          onClick={() => { setAseguradora("comparativo"); setIsComparativo(true); handleTipoSelect("VEHICULAR"); }}
                          className={cn(
                            "relative flex w-full items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 group bg-slate-50 border-slate-200 hover:border-slate-300",
                            aseguradora === "comparativo" ? "border-[#003d5c] ring-2 ring-[#003d5c]/20 bg-[#003d5c]/5" : ""
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 transition-colors",
                            aseguradora === "comparativo" ? "bg-[#003d5c]" : "bg-slate-400 group-hover:bg-slate-500"
                          )}>
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <p className={cn(
                              "text-sm font-bold leading-none mb-1",
                              aseguradora === "comparativo" ? "text-[#003d5c]" : "text-gray-800"
                            )}>
                              Comparativo Inteligente
                            </p>
                            <p className="text-[11px] text-gray-500">Extraeremos los datos automáticamente subiendo el PDF origen</p>
                          </div>
                          {aseguradora === "comparativo" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-[#003d5c] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Paso 2: Subir PDF (Comparativo) ── */}
                  {currentStepLabel === "Subir PDF" && isComparativo && (
                    <div className="flex flex-col items-center justify-center py-4">
                        <>
                          <p className="text-sm text-gray-500 mb-6 text-center">
                            Sube la cotización original de la otra aseguradora para extraer sus datos automáticamente y generar el comparativo.
                          </p>
                          
                          <div className="w-full relative">
                            <input
                              type="file"
                              id="file-upload"
                              accept="application/pdf"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) {
                                  const selectedFiles = Array.from(e.target.files).slice(0, 6);
                                  setComparativoFiles(selectedFiles);
                                }
                              }}
                            />
                            <label
                              htmlFor="file-upload"
                              className={cn(
                                "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200",
                                comparativoFiles.length > 0 
                                  ? "border-[#003d5c] bg-[#003d5c]/5" 
                                  : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#003d5c]/50"
                              )}
                            >
                              {comparativoFiles.length > 0 ? (
                                <div className="text-center">
                                  <div className="flex justify-center -space-x-2 mb-2">
                                    {comparativoFiles.map((_, idx) => (
                                      <div key={idx} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                        <FileText className="w-4 h-4 text-[#003d5c]" />
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-sm font-semibold text-[#003d5c]">{comparativoFiles.length} documento(s) seleccionado(s)</p>
                                  <p className="text-xs text-[#003d5c]/70 mt-1">Listo para análisis en paralelo</p>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-[#003d5c] transition-colors" />
                                  <p className="text-sm font-semibold text-gray-600">Sube hasta 6 archivos PDF</p>
                                  <p className="text-xs text-gray-400 mt-1">Haz clic para buscar</p>
                                </div>
                              )}
                            </label>
                          </div>
                          
                          {comparativoFiles.length > 0 && !isGenerating && (
                            <button 
                              onClick={() => { setComparativoFiles([]); }} 
                              className="mt-4 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                            >
                              Limpiar archivos
                            </button>
                          )}
                        </>
                    </div>
                  )}

                  {/* ── Paso 2: Tipo de seguro ── */}
                  {currentStepLabel === "Tipo de seguro" && !isComparativo && (
                    <div>
                      {aseguradoraObj && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0", aseguradoraObj.bg)}>
                            <aseguradoraObj.Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{aseguradoraObj.name} {aseguradoraObj.sub}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mb-4">Selecciona el tipo de seguro a cotizar.</p>
                      <div className="grid grid-cols-3 gap-3">
                        {TIPOS_SEGURO.map((t) => {
                          const isSelected = tipoSeguro === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => handleTipoSelect(t.id)}
                              className={cn(
                                "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
                                isSelected
                                  ? `border-[#003d5c] bg-[#003d5c]/4 shadow-sm`
                                  : `border-gray-200 hover:${t.border} hover:${t.bg}`
                              )}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#003d5c] flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                                isSelected ? `${t.activeBg} text-white shadow-sm` : `${t.bg} ${t.iconColor}`
                              )}>
                                <t.Icon className="w-6 h-6" />
                              </div>
                              <span className={cn("text-sm font-bold", isSelected ? "text-[#003d5c]" : "text-gray-700")}>
                                {t.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Paso 3: Datos ── */}
                  {currentStepLabel === "Confirmar datos" && !confirmed && (
                    <div>
                      {/* Resumen selección */}
                      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl border border-gray-100 bg-gray-50">
                        {aseguradoraObj && (
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0", aseguradoraObj.bg)}>
                            <aseguradoraObj.Icon className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">Cotización para</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {aseguradoraObj?.name} · {tipoObj?.label}
                          </p>
                        </div>
                        {tipoObj && (
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", tipoObj.bg, tipoObj.iconColor)}>
                            <tipoObj.Icon className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mb-4">Revisa y ajusta los datos pre-llenados del lead.</p>

                      {!isFormValid() && (
                        <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-700 text-xs font-medium animate-pulse">
                          <Check className="w-3 h-3 rotate-45" /> Por favor, completa todos los campos para generar la cotización.
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        {fields.map((f) => {
                          const error = getFieldValidationError(f.key, formValues[f.key]);
                          const isNumeric = ["dni", "ruc", "telefono", "anio", "valorVehiculo", "sumAsegurada", "nroTrabajadores"].includes(f.key);

                          return (
                            <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-semibold text-gray-500">{f.label}</label>
                                {formValues[f.key] && error && (
                                  <span className="text-[10px] text-red-500 font-medium animate-in fade-in slide-in-from-right-1">{error}</span>
                                )}
                              </div>
                              <input
                                type={f.type}
                                value={formValues[f.key] ?? ""}
                                maxLength={f.key === "dni" ? 8 : f.key === "ruc" ? 11 : f.key === "telefono" ? 9 : undefined}
                                onChange={(e) => {
                                  let val = e.target.value;
                                  if (isNumeric) val = val.replace(/\D/g, ""); // Solo números
                                  
                                  setFormValues((prev) => {
                                    const next = { ...prev, [f.key]: val };
                                    
                                    // Cálculo automático de primas
                                    if (f.key === "primaComercial") {
                                      const primaNum = parseFloat(val);
                                      if (!isNaN(primaNum)) {
                                        const calIgv = (primaNum * 0.18).toFixed(2);
                                        const calTotal = (primaNum * 1.18).toFixed(2);
                                        next.igv = calIgv;
                                        next.primaTotal = calTotal;
                                      } else {
                                        next.igv = "";
                                        next.primaTotal = "";
                                      }
                                    }
                                    
                                    return next;
                                  });
                                }}
                                className={cn(
                                  "w-full border rounded-xl px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2",
                                  formValues[f.key] && error
                                    ? "border-red-200 bg-red-50/30 focus:border-red-400 focus:ring-red-100"
                                    : "border-gray-200 bg-gray-50 focus:bg-white focus:border-[#003d5c]/50 focus:ring-[#003d5c]/10"
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Paso 4: Visualizar PDF ── */}
                  {currentStepLabel === "Visualizar" && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">Vista previa de la cotización generada.</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Descargar PDF
                          </button>
                          <button
                            onClick={() => pdfUrl && window.open(pdfUrl, "_blank")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#003d5c] bg-[#003d5c]/5 rounded-lg hover:bg-[#003d5c]/10 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Expandir
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-inner mx-auto" style={{ width: "632.8px", height: "340.4px" }}>
                        {pdfUrl ? (
                          <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
                            className="w-full h-full border-none"
                            style={{ display: "block" }}
                            title="Vista previa de cotización"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Eye className="w-12 h-12 mb-2 opacity-20" />
                            <p className="text-sm">No se pudo cargar la vista previa</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Paso 5: Enviar ── */}
                  {currentStepLabel === "Enviar" && !confirmed && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <Send className="w-8 h-8 text-[#003d5c]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Enviar Cotización</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
                        La cotización se enviará al correo electrónico <span className="font-semibold text-gray-800">{formValues.email || lead?.email || "—"}</span>.
                      </p>

                      <div className="w-full max-w-sm p-4 rounded-2xl border border-gray-100 bg-gray-50 text-left">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Resumen de envío</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Aseguradora:</span>
                            <span className="font-medium text-gray-800">{aseguradoraObj?.name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tipo de Seguro:</span>
                            <span className="font-medium text-gray-800">{tipoObj?.label}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Destinatario:</span>
                            <span className="font-medium text-gray-800 truncate max-w-[180px]">{formValues.nombreAsegurado || lead?.nombre || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Éxito Final ── */}
                  {confirmed && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5"
                      >
                        <Check className="w-10 h-10 text-emerald-600" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Cotización Enviada!</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                          El documento ha sido enviado exitosamente a{" "}
                          <span className="font-semibold text-gray-700">{formValues.email || lead?.email || "—"}</span>.
                        </p>
                        <button
                          onClick={handleClose}
                          className="mt-8 px-6 py-2.5 bg-[#003d5c] text-white rounded-xl font-semibold hover:bg-[#002d44] transition-colors shadow-sm"
                        >
                          Cerrar Modal
                        </button>
                      </motion.div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            {!confirmed && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between shrink-0">
                <button
                  onClick={step === 0 ? handleClose : () => {
                    goTo(step - 1);
                  }}
                  disabled={isGenerating || isSending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {step === 0 ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  {step === 0 ? "Cancelar" : "Atrás"}
                </button>

                {currentStepLabel === "Aseguradora" && (
                  <button
                    onClick={() => goTo(step + 1)}
                    disabled={!aseguradora}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#003d5c] rounded-xl hover:bg-[#002d44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {currentStepLabel === "Subir PDF" && isComparativo && (
                  <button
                    onClick={async () => {
                      if (comparativoFiles.length === 0) return;
                      setIsGenerating(true);
                      try {
                        const res = await quoteService.uploadPdfs(comparativoFiles);
                        if (res && res.success && res.data && res.data.length > 0) {
                          // res.data ahora es un array de extracciones
                          const allExtractions = res.data;
                          setExtractedDataArray(allExtractions);

                          // Para el PDF del visualizador, por ahora usamos la primera extracción 
                          // o preparamos un objeto que contenga el array para el template HBS.
                          const primaryExtraction = allExtractions[0]; 
                          
                          const newFormValues = { 
                            ...formValues,
                            ...primaryExtraction,
                            primaTotal: primaryExtraction.prima_total_anual,
                            // Inyectamos el array completo para que el template HBS pueda armar la tabla comparativa
                            comparativoExtractions: allExtractions
                          };
                          setFormValues(newFormValues);
                          
                          // 2. Generar Cotización automáticamente
                          const q = await quoteService.create(lead.idLead, "Comparativo");
                          const completed = await quoteService.completeQuote(q.id, newFormValues);
                          
                          setPdfUrl(completed.pdfUrl || null);
                          setQuoteId(completed.id);
                          
                          // 3. Ir a Visualizar
                          goTo(1);
                        } else {
                          throw new Error("No se pudo extraer información de los archivos.");
                        }
                      } catch (error) {
                        alert("Error al procesar archivos mediante IA. Verifique los límites de OpenAI.");
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    disabled={comparativoFiles.length === 0 || isGenerating}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm rounded-xl"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isGenerating ? "Analizando lote..." : `Analizar ${comparativoFiles.length} pDFs y Generar Cuadro`}
                  </button>
                )}

                {currentStepLabel === "Tipo de seguro" && (
                  <button
                    onClick={() => goTo(step + 1)}
                    disabled={!tipoSeguro}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#003d5c] rounded-xl hover:bg-[#002d44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {currentStepLabel === "Confirmar datos" && (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !isFormValid()}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {isGenerating ? "Generando..." : "Confirmar y Generar PDF"}
                  </button>
                )}

                {currentStepLabel === "Visualizar" && (
                  <button
                    onClick={() => goTo(step + 1)}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#003d5c] rounded-xl hover:bg-[#002d44] transition-colors shadow-sm"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {currentStepLabel === "Enviar" && (
                  <button
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSending ? "Enviando..." : "Enviar Cotización"}
                  </button>
                )}
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
