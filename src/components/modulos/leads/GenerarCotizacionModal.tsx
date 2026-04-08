import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, Check,
  Shield, Car, Heart, Users, Briefcase, FileText,
  Zap, Globe, Star, Umbrella, Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Aseguradoras ─────────────────────────────────────────────────────────────

const ASEGURADORAS = [
  { id: "rimac",       name: "Rímac",        sub: "Seguros",    Icon: Shield,    bg: "bg-blue-600",    ring: "ring-blue-300" },
  { id: "pacifico",    name: "Pacífico",      sub: "Seguros",    Icon: Globe,     bg: "bg-emerald-600", ring: "ring-emerald-300" },
  { id: "mapfre",      name: "Mapfre",        sub: "Perú",       Icon: Star,      bg: "bg-red-600",     ring: "ring-red-300" },
  { id: "la_positiva", name: "La Positiva",   sub: "Seguros",    Icon: Sun,       bg: "bg-amber-500",   ring: "ring-amber-300" },
  { id: "interseguro", name: "Interseguro",   sub: "Perú",       Icon: Zap,       bg: "bg-violet-600",  ring: "ring-violet-300" },
  { id: "secrex",      name: "Secrex",        sub: "Perú",       Icon: Umbrella,  bg: "bg-gray-700",    ring: "ring-gray-300" },
];

// ─── Tipos de seguro ──────────────────────────────────────────────────────────

const TIPOS_SEGURO = [
  { id: "AUTO",     label: "Vehicular", Icon: Car,       bg: "bg-blue-50",    iconColor: "text-blue-600",    border: "border-blue-200",    activeBg: "bg-blue-600" },
  { id: "SOAT",     label: "SOAT",      Icon: Shield,    bg: "bg-amber-50",   iconColor: "text-amber-600",   border: "border-amber-200",   activeBg: "bg-amber-500" },
  { id: "SALUD",    label: "Salud",     Icon: Heart,     bg: "bg-rose-50",    iconColor: "text-rose-600",    border: "border-rose-200",    activeBg: "bg-rose-600" },
  { id: "VIDA",     label: "Vida",      Icon: Users,     bg: "bg-violet-50",  iconColor: "text-violet-600",  border: "border-violet-200",  activeBg: "bg-violet-600" },
  { id: "VIDA_LEY", label: "Vida Ley",  Icon: Briefcase, bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-200", activeBg: "bg-emerald-600" },
  { id: "SCTR",     label: "SCTR",      Icon: FileText,  bg: "bg-indigo-50",  iconColor: "text-indigo-600",  border: "border-indigo-200",  activeBg: "bg-indigo-600" },
];

// ─── Campos por tipo ──────────────────────────────────────────────────────────

const getFields = (tipo: string, lead: any, detalles: Record<string, any>) => {
  const nombre = [lead?.nombre, lead?.apellidos].filter(Boolean).join(" ");
  const d = detalles[tipo] || {};
  switch (tipo) {
    case "AUTO": return [
      { key: "nombreAsegurado", label: "Nombre del asegurado", value: nombre,                           type: "text",   span: 2 },
      { key: "dni",             label: "DNI / RUC",             value: lead?.numeroDocumento || "",      type: "text",   span: 1 },
      { key: "email",           label: "Correo electrónico",    value: lead?.email || "",               type: "email",  span: 1 },
      { key: "telefono",        label: "Teléfono",              value: lead?.telefono || "",            type: "text",   span: 1 },
      { key: "placa",           label: "Placa",                 value: d.placa || "",                   type: "text",   span: 1 },
      { key: "marca",           label: "Marca",                 value: d.marca || "",                   type: "text",   span: 1 },
      { key: "modelo",          label: "Modelo",                value: d.modelo || "",                  type: "text",   span: 1 },
      { key: "anio",            label: "Año",                   value: d.anio ? String(d.anio) : "",    type: "text",   span: 1 },
      { key: "uso",             label: "Uso del vehículo",      value: d.uso || "PARTICULAR",           type: "text",   span: 1 },
      { key: "valorVehiculo",   label: "Valor del vehículo (S/)",value: d.valorVehiculo ? String(d.valorVehiculo) : "", type: "number", span: 1 },
      { key: "sumaAsegurada",   label: "Suma asegurada (S/)",   value: d.sumaAsegurada ? String(d.sumaAsegurada) : "", type: "number", span: 1 },
    ];
    case "SOAT": return [
      { key: "nombreAsegurado", label: "Nombre del asegurado", value: nombre,                           type: "text",   span: 2 },
      { key: "dni",             label: "DNI / RUC",             value: lead?.numeroDocumento || "",      type: "text",   span: 1 },
      { key: "placa",           label: "Placa",                 value: d.placa || "",                   type: "text",   span: 1 },
      { key: "tipoVehiculo",    label: "Tipo de vehículo",      value: d.tipoVehiculo || "",            type: "text",   span: 1 },
      { key: "marca",           label: "Marca",                 value: d.marca || "",                   type: "text",   span: 1 },
      { key: "anio",            label: "Año de fabricación",    value: d.anio ? String(d.anio) : "",    type: "text",   span: 1 },
      { key: "nroAsientos",     label: "N° de asientos",        value: d.nroAsientos ? String(d.nroAsientos) : "", type: "number", span: 1 },
    ];
    case "SALUD": return [
      { key: "nombreAsegurado", label: "Nombre del asegurado", value: nombre,                           type: "text",   span: 2 },
      { key: "dni",             label: "DNI",                   value: lead?.numeroDocumento || "",      type: "text",   span: 1 },
      { key: "email",           label: "Correo electrónico",    value: lead?.email || "",               type: "email",  span: 1 },
      { key: "telefono",        label: "Teléfono",              value: lead?.telefono || "",            type: "text",   span: 1 },
      { key: "fechaNacimiento", label: "Fecha de nacimiento",   value: d.fechaNacimiento || "",         type: "date",   span: 1 },
      { key: "edad",            label: "Edad",                  value: d.edad ? String(d.edad) : "",    type: "number", span: 1 },
      { key: "planSalud",       label: "Plan de salud",         value: d.planSalud || "",               type: "text",   span: 1 },
      { key: "sumaAsegurada",   label: "Suma asegurada (S/)",   value: d.sumaAsegurada ? String(d.sumaAsegurada) : "", type: "number", span: 1 },
      { key: "nroAsegurados",   label: "N° de asegurados",      value: "1",                             type: "number", span: 1 },
    ];
    case "VIDA": return [
      { key: "nombreAsegurado", label: "Nombre del asegurado", value: nombre,                           type: "text",   span: 2 },
      { key: "dni",             label: "DNI",                   value: lead?.numeroDocumento || "",      type: "text",   span: 1 },
      { key: "email",           label: "Correo electrónico",    value: lead?.email || "",               type: "email",  span: 1 },
      { key: "edad",            label: "Edad",                  value: d.edad ? String(d.edad) : "",    type: "number", span: 1 },
      { key: "ocupacion",       label: "Ocupación",             value: d.ocupacion || "",               type: "text",   span: 1 },
      { key: "sumaAsegurada",   label: "Suma asegurada (S/)",   value: d.sumaAsegurada ? String(d.sumaAsegurada) : "", type: "number", span: 1 },
      { key: "beneficiarios",   label: "Beneficiarios",         value: d.beneficiarios || "",           type: "text",   span: 2 },
    ];
    case "VIDA_LEY": return [
      { key: "razonSocial",     label: "Razón social / empresa",value: lead?.empresa || "",              type: "text",   span: 2 },
      { key: "ruc",             label: "RUC",                   value: lead?.numeroDocumento || "",      type: "text",   span: 1 },
      { key: "email",           label: "Correo de contacto",    value: lead?.email || "",               type: "email",  span: 1 },
      { key: "nroTrabajadores", label: "N° de trabajadores",    value: d.nroTrabajadores ? String(d.nroTrabajadores) : "", type: "number", span: 1 },
      { key: "actividadEconomica", label: "Actividad económica",value: d.actividadEconomica || "",      type: "text",   span: 2 },
      { key: "remuneracionPromedio", label: "Remuneración promedio (S/)", value: d.remuneracionPromedio ? String(d.remuneracionPromedio) : "", type: "number", span: 1 },
    ];
    case "SCTR": return [
      { key: "razonSocial",     label: "Razón social / empresa",value: lead?.empresa || "",              type: "text",   span: 2 },
      { key: "ruc",             label: "RUC",                   value: lead?.numeroDocumento || "",      type: "text",   span: 1 },
      { key: "email",           label: "Correo de contacto",    value: lead?.email || "",               type: "email",  span: 1 },
      { key: "nroTrabajadores", label: "N° de trabajadores",    value: d.nroTrabajadores ? String(d.nroTrabajadores) : "", type: "number", span: 1 },
      { key: "actividadEconomica", label: "Actividad económica",value: d.actividadEconomica || "",      type: "text",   span: 2 },
      { key: "nivelRiesgo",     label: "Nivel de riesgo",       value: d.nivelRiesgo || "MEDIO",        type: "text",   span: 1 },
      { key: "sumaAsegurada",   label: "Suma asegurada (S/)",   value: d.sumaAsegurada ? String(d.sumaAsegurada) : "", type: "number", span: 1 },
    ];
    default: return [];
  }
};

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = ["Aseguradora", "Tipo de seguro", "Confirmar datos"];

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
  detalles?: { auto?: any; soat?: any; salud?: any; sctr?: any; vida?: any; vidaLey?: any };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const GenerarCotizacionModal = ({ open, onClose, lead, detalles = {} }: Props) => {
  const [step, setStep]               = useState(0);
  const [dir, setDir]                 = useState(1);
  const [aseguradora, setAseguradora] = useState<string | null>(null);
  const [tipoSeguro, setTipoSeguro]   = useState<string | null>(null);
  const [formValues, setFormValues]   = useState<Record<string, string>>({});
  const [confirmed, setConfirmed]     = useState(false);

  const detallesMap: Record<string, any> = {
    AUTO: detalles.auto, SOAT: detalles.soat, SALUD: detalles.salud,
    SCTR: detalles.sctr, VIDA: detalles.vida, VIDA_LEY: detalles.vidaLey,
  };

  const fields = tipoSeguro ? getFields(tipoSeguro, lead, detallesMap) : [];

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const handleTipoSelect = (tipo: string) => {
    setTipoSeguro(tipo);
    const fs = getFields(tipo, lead, detallesMap);
    const init: Record<string, string> = {};
    fs.forEach((f) => { init[f.key] = f.value; });
    setFormValues(init);
  };

  const handleClose = () => {
    setTimeout(() => {
      setStep(0); setDir(1); setAseguradora(null);
      setTipoSeguro(null); setFormValues({}); setConfirmed(false);
    }, 300);
    onClose();
  };

  const aseguradoraObj = ASEGURADORAS.find((a) => a.id === aseguradora);
  const tipoObj        = TIPOS_SEGURO.find((t) => t.id === tipoSeguro);

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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "88vh" }}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0,   scale: 0.95, y: 16  }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-none">Generar Cotización</h2>
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
                      i < step   ? "bg-emerald-100 text-emerald-700" :
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
                      <div className={cn("flex-1 h-px mx-1 transition-colors duration-300", i < step ? "bg-emerald-200" : "bg-gray-200")} />
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
                  {step === 0 && (
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
                    </div>
                  )}

                  {/* ── Paso 2: Tipo de seguro ── */}
                  {step === 1 && (
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
                  {step === 2 && !confirmed && (
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

                      <div className="grid grid-cols-2 gap-3">
                        {fields.map((f) => (
                          <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
                            <input
                              type={f.type}
                              value={formValues[f.key] ?? ""}
                              onChange={(e) => setFormValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-[#003d5c]/50 focus:ring-2 focus:ring-[#003d5c]/10 transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Confirmado ── */}
                  {step === 2 && confirmed && (
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">¡Cotización lista!</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                          Datos confirmados para{" "}
                          <span className="font-semibold text-gray-700">{aseguradoraObj?.name}</span>
                          {" "}·{" "}
                          <span className="font-semibold text-gray-700">{tipoObj?.label}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-3 px-6">
                          La integración con el backend para enviar la solicitud estará disponible próximamente.
                        </p>
                      </motion.div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between shrink-0">
              <button
                onClick={step === 0 ? handleClose : () => goTo(step - 1)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {step === 0 ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {step === 0 ? "Cancelar" : "Atrás"}
              </button>

              {step === 0 && (
                <button
                  onClick={() => goTo(1)}
                  disabled={!aseguradora}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#003d5c] rounded-xl hover:bg-[#002d44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 1 && (
                <button
                  onClick={() => goTo(2)}
                  disabled={!tipoSeguro}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#003d5c] rounded-xl hover:bg-[#002d44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && !confirmed && (
                <button
                  onClick={() => setConfirmed(true)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" /> Confirmar cotización
                </button>
              )}

              {step === 2 && confirmed && (
                <button
                  onClick={handleClose}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#003d5c] rounded-xl hover:bg-[#002d44] transition-colors shadow-sm"
                >
                  Cerrar <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
