import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Car, Stethoscope, HardHat, FileText, Activity, Shield, Wrench, Building2, Layers, Globe, Scale, Receipt, Briefcase, Users } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalFooter,
} from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, CreateLead } from "@/types/lead.interface";
import {
  EstadoLead,
  PrioridadLead,
  FuenteLead,
  TipoSeguro,
  estadoLeadOptions,
  prioridadLeadOptions,
  fuenteLeadOptions,
  tipoSeguroOptions,
} from "@/types/lead.interface";
import { leadService } from "@/services/lead.service";

interface RegistrarLeadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLead) => Promise<Lead | void>;
  leadToEdit?: Lead | null;
}

// Types that have specific sub-forms
const TIPOS_CON_DETALLE_AUTO = [TipoSeguro.VEHICULAR];
const TIPOS_CON_DETALLE_SOAT = [TipoSeguro.SOAT];
const TIPOS_CON_DETALLE_SALUD = [TipoSeguro.EPS, TipoSeguro.SALUD];
const TIPOS_CON_DETALLE_SCTR = [TipoSeguro.SCTR_PENSION, TipoSeguro.SCTR_SALUD];
const TIPOS_CON_DETALLE_VIDA_LEY = [TipoSeguro.VIDA_LEY];

export const RegistrarLead = ({
  isOpen,
  onClose,
  onSubmit,
  leadToEdit,
}: RegistrarLeadProps) => {
  const [otroSeguro, setOtroSeguro] = useState("");
  const [detalleForm, setDetalleForm] = useState<Record<string, any>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateLead>({
    defaultValues: {
      estado: EstadoLead.NUEVO,
      prioridad: PrioridadLead.MEDIA,
      fuente: FuenteLead.FORMULARIO_WEB,
      tipoSeguro: TipoSeguro.VEHICULAR,
    },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (leadToEdit) {
      setValue("nombre", leadToEdit.nombre);
      setValue("email", leadToEdit.email || "");
      setValue("telefono", leadToEdit.telefono || "");
      setValue("empresa", leadToEdit.empresa || "");
      setValue("cargo", leadToEdit.cargo || "");
      setValue("fuente", leadToEdit.fuente);
      setValue("estado", leadToEdit.estado);
      setValue("prioridad", leadToEdit.prioridad);
      setValue("tipoSeguro", leadToEdit.tipoSeguro);
      setValue("valorEstimado", leadToEdit.valorEstimado || "");
      // Extract otroSeguro from notas if present
      const notasVal = leadToEdit.notas || "";
      const match = notasVal.match(/^\[Tipo: (.+?)\]\n?/);
      if (match) {
        setOtroSeguro(match[1]);
        setValue("notas", notasVal.replace(/^\[Tipo: .+?\]\n?/, ""));
      } else {
        setOtroSeguro("");
        setValue("notas", notasVal);
      }
      // Load existing detail data into detalleForm
      const existingDetalle: Record<string, any> = {};
      if (leadToEdit.detalleAuto) Object.assign(existingDetalle, leadToEdit.detalleAuto);
      else if (leadToEdit.detalleSoat) Object.assign(existingDetalle, leadToEdit.detalleSoat);
      else if (leadToEdit.detalleSalud) Object.assign(existingDetalle, leadToEdit.detalleSalud);
      else if (leadToEdit.detalleSCTR) Object.assign(existingDetalle, leadToEdit.detalleSCTR);
      else if (leadToEdit.detalleVida) Object.assign(existingDetalle, leadToEdit.detalleVida);
      else if (leadToEdit.detalleVidaLey) Object.assign(existingDetalle, leadToEdit.detalleVidaLey);
      setDetalleForm(existingDetalle);
    } else {
      setOtroSeguro("");
      setDetalleForm({});
      reset({
        estado: EstadoLead.NUEVO,
        prioridad: PrioridadLead.MEDIA,
        fuente: FuenteLead.FORMULARIO_WEB,
        tipoSeguro: TipoSeguro.VEHICULAR,
      });
    }
  }, [leadToEdit, setValue, reset]);

  const handleFormSubmit = async (data: CreateLead) => {
    try {
      if (data.tipoSeguro === TipoSeguro.OTRO && otroSeguro.trim()) {
        data.notas = `[Tipo: ${otroSeguro.trim()}]\n${data.notas || ""}`.trimEnd();
      }

      // Use resolvedTipo to attach the right sub-object (handles "Otro" that matches a known type)
      const effectiveTipo = resolvedTipo;
      const hasDetalle = Object.keys(detalleForm).length > 0;
      if (hasDetalle) {
        if (TIPOS_CON_DETALLE_AUTO.includes(effectiveTipo)) {
          data.detalleAuto = detalleForm;
        } else if (TIPOS_CON_DETALLE_SOAT.includes(effectiveTipo)) {
          data.detalleSoat = detalleForm;
        } else if (TIPOS_CON_DETALLE_SALUD.includes(effectiveTipo)) {
          data.detalleSalud = detalleForm;
        } else if (TIPOS_CON_DETALLE_SCTR.includes(effectiveTipo)) {
          data.detalleSCTR = detalleForm;
        } else if (TIPOS_CON_DETALLE_VIDA_LEY.includes(effectiveTipo)) {
          data.detalleVidaLey = detalleForm;
        }
      }

      const result = await onSubmit(data);

      // If backend doesn't accept sub-objects inline, try separate PATCH calls
      if (result?.idLead && hasDetalle && !leadToEdit) {
        const id = result.idLead;
        try {
          if (TIPOS_CON_DETALLE_AUTO.includes(effectiveTipo)) {
            await leadService.updateDetalleAuto(id, detalleForm);
          } else if (TIPOS_CON_DETALLE_SOAT.includes(effectiveTipo)) {
            await leadService.updateDetalleSoat(id, detalleForm);
          } else if (TIPOS_CON_DETALLE_SALUD.includes(effectiveTipo)) {
            await leadService.updateDetalleSalud(id, detalleForm);
          } else if (TIPOS_CON_DETALLE_SCTR.includes(effectiveTipo)) {
            await leadService.updateDetalleSCTR(id, detalleForm);
          } else if (TIPOS_CON_DETALLE_VIDA_LEY.includes(effectiveTipo)) {
            await leadService.updateDetalleVidaLey(id, detalleForm);
          }
        } catch {
          // Silently ignore if detail endpoint doesn't exist yet
          console.warn("Detail endpoint not available yet — sub-form data included in main payload only");
        }
      }

      reset();
      setOtroSeguro("");
      setDetalleForm({});
      onClose();
    } catch (error) {
      console.error("Error al guardar lead:", error);
    }
  };

  const handleClose = () => {
    reset();
    setOtroSeguro("");
    setDetalleForm({});
    onClose();
  };

  const handleTipoSeguroChange = (value: string) => {
    setValue("tipoSeguro", value as TipoSeguro);
    setDetalleForm({});
  };

  const setDetalle = (field: string, value: any) => {
    setDetalleForm(prev => ({ ...prev, [field]: value }));
  };

  const estado = watch("estado");
  const prioridad = watch("prioridad");
  const fuente = watch("fuente");
  const tipoSeguro = watch("tipoSeguro");

  const getTipoSeguroIcon = (tipo: string) => {
    const iconMap: Record<string, any> = {
      VEHICULAR:             Car,
      SOAT:                  Shield,
      EPS:                   Activity,
      SALUD:                 Stethoscope,
      SCTR_PENSION:          HardHat,
      SCTR_SALUD:            HardHat,
      VIDA_LEY:              Users,
      SEGURO_VIAJE:          Globe,
      MULTIRRIESGO:          Layers,
      TREC:                  Wrench,
      CAR:                   Building2,
      EAR:                   Building2,
      TRES_D:                Receipt,
      FOLA:                  Briefcase,
      RESPONSABILIDAD_CIVIL: Scale,
      CARTA_FIANZA:          Receipt,
      CAUCION:               Receipt,
      OTRO:                  FileText,
      AUTO: Car, SCTR: HardHat, ACCIDENTE: Activity, TREA: Wrench,
    };
    return iconMap[tipo] || FileText;
  };

  // ==================== SUB-FORMS ====================

  // When "Otro" is selected, check if the typed text matches a known type
  // so we can show the appropriate sub-form
  const resolvedTipo: TipoSeguro = (() => {
    if (tipoSeguro !== TipoSeguro.OTRO || !otroSeguro.trim()) return tipoSeguro as TipoSeguro;
    const q = otroSeguro.trim().toLowerCase().replace(/\s+/g, "");
    // Match against option labels and enum values
    const match = tipoSeguroOptions.find(opt =>
      opt.label.toLowerCase().replace(/\s+/g, "") === q ||
      opt.value.toLowerCase().replace(/_/g, "") === q.replace(/_/g, "")
    );
    return (match?.value as TipoSeguro) ?? (tipoSeguro as TipoSeguro);
  })();

  const renderSubForm = () => {
    if (TIPOS_CON_DETALLE_AUTO.includes(resolvedTipo)) {
      return (
        <div className="space-y-3 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5" /> Datos del vehículo
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Placa</Label>
              <Input placeholder="ABC-123" value={detalleForm.placa || ""} onChange={e => setDetalle("placa", e.target.value.toUpperCase())} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Año</Label>
              <Input type="number" placeholder="2020" value={detalleForm.anio || ""} onChange={e => setDetalle("anio", e.target.value ? Number(e.target.value) : "")} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Marca</Label>
              <Input placeholder="Toyota" value={detalleForm.marca || ""} onChange={e => setDetalle("marca", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Modelo</Label>
              <Input placeholder="Corolla" value={detalleForm.modelo || ""} onChange={e => setDetalle("modelo", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Uso del vehículo</Label>
              <select
                value={detalleForm.usoVehiculo || ""}
                onChange={e => setDetalle("usoVehiculo", e.target.value)}
                className="w-full h-9 border border-input rounded-md px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar...</option>
                <option value="PARTICULAR">Particular</option>
                <option value="COMERCIAL">Comercial</option>
                <option value="TAXI">Taxi</option>
                <option value="CARGA">Carga</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Valor comercial (S/)</Label>
              <Input placeholder="15000" value={detalleForm.valorComercial || ""} onChange={e => setDetalle("valorComercial", e.target.value)} className="text-sm" />
            </div>
          </div>
        </div>
      );
    }

    if (TIPOS_CON_DETALLE_SOAT.includes(resolvedTipo)) {
      return (
        <div className="space-y-3 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Datos del vehículo (SOAT)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Placa</Label>
              <Input placeholder="ABC-123" value={detalleForm.placa || ""} onChange={e => setDetalle("placa", e.target.value.toUpperCase())} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Año</Label>
              <Input type="number" placeholder="2020" value={detalleForm.anio || ""} onChange={e => setDetalle("anio", e.target.value ? Number(e.target.value) : "")} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Marca</Label>
              <Input placeholder="Toyota" value={detalleForm.marca || ""} onChange={e => setDetalle("marca", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Modelo</Label>
              <Input placeholder="Corolla" value={detalleForm.modelo || ""} onChange={e => setDetalle("modelo", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Uso del vehículo</Label>
              <select
                value={detalleForm.usoVehiculo || ""}
                onChange={e => setDetalle("usoVehiculo", e.target.value)}
                className="w-full h-9 border border-input rounded-md px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar...</option>
                <option value="PARTICULAR">Particular</option>
                <option value="COMERCIAL">Comercial</option>
                <option value="TAXI">Taxi</option>
                <option value="CARGA">Carga</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Zona</Label>
              <Input placeholder="Lima" value={detalleForm.zona || ""} onChange={e => setDetalle("zona", e.target.value)} className="text-sm" />
            </div>
          </div>
        </div>
      );
    }

    if (TIPOS_CON_DETALLE_SALUD.includes(resolvedTipo)) {
      return (
        <div className="space-y-3 p-4 bg-green-50/60 rounded-xl border border-green-100">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5" /> Datos de salud
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Edad</Label>
              <Input type="number" placeholder="35" value={detalleForm.edad || ""} onChange={e => setDetalle("edad", e.target.value ? Number(e.target.value) : "")} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Género</Label>
              <select
                value={detalleForm.genero || ""}
                onChange={e => setDetalle("genero", e.target.value)}
                className="w-full h-9 border border-input rounded-md px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar...</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Tipo de cobertura</Label>
              <select
                value={detalleForm.tipoCobertura || ""}
                onChange={e => setDetalle("tipoCobertura", e.target.value)}
                className="w-full h-9 border border-input rounded-md px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar...</option>
                <option value="BASICO">Básico</option>
                <option value="INTERMEDIO">Intermedio</option>
                <option value="COMPLETO">Completo</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">N.° dependientes</Label>
              <Input type="number" placeholder="0" value={detalleForm.numeroDependientes ?? ""} onChange={e => setDetalle("numeroDependientes", e.target.value ? Number(e.target.value) : 0)} className="text-sm" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Clínica de preferencia</Label>
              <Input placeholder="Clínica San Pablo, Salud..." value={detalleForm.clinicaPreferencia || ""} onChange={e => setDetalle("clinicaPreferencia", e.target.value)} className="text-sm" />
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!detalleForm.incluirFamilia} onChange={e => setDetalle("incluirFamilia", e.target.checked)} className="rounded" />
                Incluir familia
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!detalleForm.tuvoSeguroAntes} onChange={e => setDetalle("tuvoSeguroAntes", e.target.checked)} className="rounded" />
                Tuvo seguro antes
              </label>
            </div>
          </div>
        </div>
      );
    }

    if (TIPOS_CON_DETALLE_SCTR.includes(resolvedTipo)) {
      return (
        <div className="space-y-3 p-4 bg-orange-50/60 rounded-xl border border-orange-100">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide flex items-center gap-1.5">
            <HardHat className="w-3.5 h-3.5" /> Datos SCTR
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">RUC empresa</Label>
              <Input placeholder="20123456789" maxLength={11} value={detalleForm.rucEmpresa || ""} onChange={e => setDetalle("rucEmpresa", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Razón social</Label>
              <Input placeholder="Empresa S.A.C." value={detalleForm.razonSocial || ""} onChange={e => setDetalle("razonSocial", e.target.value)} className="text-sm" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Actividad económica / Trabajo a realizar</Label>
              <Input placeholder="Construcción civil, minería..." value={detalleForm.actividadEconomica || ""} onChange={e => setDetalle("actividadEconomica", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">N.° de trabajadores</Label>
              <Input type="number" placeholder="50" value={detalleForm.numeroTrabajadores || ""} onChange={e => setDetalle("numeroTrabajadores", e.target.value ? Number(e.target.value) : "")} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Planilla mensual (S/)</Label>
              <Input type="number" placeholder="50000" value={detalleForm.planillaMensual || ""} onChange={e => setDetalle("planillaMensual", e.target.value ? Number(e.target.value) : "")} className="text-sm" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Tipo de riesgo</Label>
              <select
                value={detalleForm.tipoRiesgo || ""}
                onChange={e => setDetalle("tipoRiesgo", e.target.value)}
                className="w-full h-9 border border-input rounded-md px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar...</option>
                <option value="BAJO">Bajo</option>
                <option value="MEDIO">Medio</option>
                <option value="ALTO">Alto</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-orange-600 italic">⚠️ La cotización es referencial y está sujeta a datos reales, incluyendo la edad de los trabajadores.</p>
        </div>
      );
    }

    if (TIPOS_CON_DETALLE_VIDA_LEY.includes(resolvedTipo)) {
      return (
        <div className="space-y-3 p-4 bg-purple-50/60 rounded-xl border border-purple-100">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Datos Vida Ley
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">RUC empresa</Label>
              <Input placeholder="20123456789" maxLength={11} value={detalleForm.rucEmpresa || ""} onChange={e => setDetalle("rucEmpresa", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Razón social</Label>
              <Input placeholder="Empresa S.A.C." value={detalleForm.razonSocial || ""} onChange={e => setDetalle("razonSocial", e.target.value)} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">N.° empleados en planilla</Label>
              <Input type="number" placeholder="20" value={detalleForm.numeroEmpleadosPlanilla || ""} onChange={e => setDetalle("numeroEmpleadosPlanilla", e.target.value ? Number(e.target.value) : "")} className="text-sm" />
            </div>
            <div>
              <Label className="text-xs">Planilla mensual (S/)</Label>
              <Input placeholder="30000" value={detalleForm.planillaMensual || ""} onChange={e => setDetalle("planillaMensual", e.target.value)} className="text-sm" />
            </div>
          </div>
          <p className="text-xs text-purple-600 italic">⚠️ La cotización es referencial y está sujeta a datos reales, incluyendo la edad de los trabajadores.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={handleClose} size="lg">
      <Modal>
        <ModalHeader
          title={leadToEdit ? "Editar Lead" : "Registrar Lead"}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nombre">
                    Nombre Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    {...register("nombre", { required: "El nombre es requerido" })}
                    placeholder="Juan Pérez García"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="juan@example.com" />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" {...register("telefono")} placeholder="987654321" />
                </div>

                <div>
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input id="empresa" {...register("empresa")} placeholder="Nombre de la empresa" />
                </div>

                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" {...register("cargo")} placeholder="Gerente General" />
                </div>
              </div>
            </div>

            {/* Clasificación del Lead */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Clasificación del Lead</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoSeguro">
                    Tipo de Seguro <span className="text-red-500">*</span>
                  </Label>
                  <Select value={tipoSeguro} onValueChange={handleTipoSeguroChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de seguro" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoSeguroOptions.map((option) => {
                        const Icon = getTipoSeguroIcon(option.value);
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {tipoSeguro === TipoSeguro.OTRO && (
                  <div className="md:col-span-1">
                    <Label htmlFor="otroSeguro">Especifica el tipo de seguro</Label>
                    <Input
                      id="otroSeguro"
                      placeholder="Especifica el tipo de seguro"
                      value={otroSeguro}
                      onChange={(e) => setOtroSeguro(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="fuente">
                    Fuente <span className="text-red-500">*</span>
                  </Label>
                  <Select value={fuente} onValueChange={(value) => setValue("fuente", value as FuenteLead)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuenteLeadOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estado">
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Select value={estado} onValueChange={(value) => setValue("estado", value as EstadoLead)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadoLeadOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prioridad">
                    Prioridad <span className="text-red-500">*</span>
                  </Label>
                  <Select value={prioridad} onValueChange={(value) => setValue("prioridad", value as PrioridadLead)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      {prioridadLeadOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sub-form dinámico por tipo de seguro */}
            {renderSubForm()}

            {/* Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valorEstimado">Prima estimada (S/)</Label>
                  <Input
                    id="valorEstimado"
                    type="text"
                    {...register("valorEstimado")}
                    placeholder="1500.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    {...register("notas")}
                    placeholder="Información adicional sobre el lead..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : leadToEdit ? "Actualizar" : "Registrar"}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
