import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  FormGroupDivisor,
  LocationInput,
  PhoneInput,
  SubmitButtons,
  AppSelect,
  AppDatePickerField,
} from "@/components/shared";
import { Input, Label, Checkbox } from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  tipoPersonaOptions,
  tipoDocumentoOptions,
  TipoDocumentoArchivo,
} from "@/types/cliente.interface";
import type { Cliente } from "@/types/cliente.interface";
import type { User } from "@/store/auth.store";
import { clienteService } from "@/services/cliente.service";
import { storageService } from "@/services/storage.service";
import { AlertCircle, Upload, FileText, X, ShieldCheck } from "lucide-react";

interface RegistrarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  addCliente: (data: any) => Promise<any>;
  user: User;
  initialValues?: Partial<any>;
  presentation?: "center" | "drawer";
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const RegistrarCliente = ({
  isOpen,
  onClose,
  addCliente,
  user,
  initialValues,
  presentation = "center",
  size = "xl",
}: RegistrarClienteProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      tipoPersona: "",
      razonSocial: "",
      nombres: "",
      apellidos: "",
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
      latitud: 0,
      longitud: 0,
      telefono1: "",
      telefono2: "",
      whatsapp: "",
      emailNotificaciones: "",
      recibirNotificaciones: false,
      cumpleanos: "",
      tipoDocumento: "",
      numeroDocumento: "",
      asignadoA: user.idUsuario,
      registradoPor: user.idUsuario,
    },
  });

  const tipoPersona = watch("tipoPersona");
  const tipoDocumento = watch("tipoDocumento");

  const [clienteExistente, setClienteExistente] = useState<Cliente | null>(null);
  const [checkingDoc, setCheckingDoc] = useState(false);
  const [validatingDoc, setValidatingDoc] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [cartaFile, setCartaFile] = useState<File | null>(null);
  const [uploadingCarta, setUploadingCarta] = useState(false);
  const cartaInputRef = useRef<HTMLInputElement>(null);

  // Filtrar tipos de documento segun tipo de persona
  const filteredDocOptions = useMemo(() => {
    if (tipoPersona === "NATURAL") {
      return tipoDocumentoOptions.filter((o) => o.value !== "RUC");
    }
    if (tipoPersona === "JURIDICO") {
      return tipoDocumentoOptions.filter((o) => o.value === "RUC");
    }
    return tipoDocumentoOptions;
  }, [tipoPersona]);

  // Al cambiar tipo de persona, auto-setear tipo de documento
  useEffect(() => {
    if (tipoPersona === "JURIDICO") {
      setValue("tipoDocumento", "RUC");
      setValue("nombres", "");
      setValue("apellidos", "");
    } else if (tipoPersona === "NATURAL") {
      if (tipoDocumento === "RUC") setValue("tipoDocumento", "DNI");
      setValue("razonSocial", "");
    }
  }, [tipoPersona, setValue]);

  // Limpiar numero al cambiar tipo de documento
  useEffect(() => {
    setValue("numeroDocumento", "");
    setClienteExistente(null);
    setValidationResult(null);
  }, [tipoDocumento, setValue]);

  const handleDocumentoBlur = async (numero: string) => {
    if (!numero || numero.trim().length < 6) return;
    setCheckingDoc(true);
    try {
      const found = await clienteService.findByDocumento(numero.trim());
      setClienteExistente(found);
      if (found) {
        setValue("tipoPersona", found.tipoPersona);
        setValue("nombres", found.nombres ?? "");
        setValue("apellidos", found.apellidos ?? "");
        setValue("razonSocial", found.razonSocial ?? "");
        setValue("emailNotificaciones", found.emailNotificaciones ?? "");
        setValue("telefono1", found.telefono1 ?? "");
        setValue("telefono2", found.telefono2 ?? "");
        setValue("whatsapp", found.whatsapp ?? "");
        setValue("cumpleanos", found.cumpleanos ?? "");
        setValue("direccion", found.direccion ?? "");
        setValue("distrito", found.distrito ?? "");
        setValue("provincia", found.provincia ?? "");
        setValue("departamento", found.departamento ?? "");
      }
    } finally {
      setCheckingDoc(false);
    }
  };

  // Validar documento contra RENIEC/SUNAT y autocompletar
  const handleValidarDocumento = async () => {
    const numero = watch("numeroDocumento")?.toString().trim();
    const tipo = watch("tipoDocumento");
    if (!numero || !tipo) return;
    if (tipo === "DNI" && numero.length !== 8) return;
    if (tipo === "RUC" && numero.length !== 11) return;

    setValidatingDoc(true);
    setValidationResult(null);
    try {
      const result = await clienteService.validarDocumento(tipo, numero);
      setValidationResult(result);
      if (result) {
        // Detectar tipo persona por RUC: 10=natural, 20=juridica
        if (tipo === "RUC") {
          const esPJ = numero.startsWith("20");
          setValue("tipoPersona", esPJ ? "JURIDICO" : "NATURAL");
          if (esPJ) {
            setValue("razonSocial", result.razonSocial || result.nombreCompleto || "");
            setValue("nombres", "");
            setValue("apellidos", "");
          } else {
            // RUC 10 = persona natural con negocio
            const partes = (result.razonSocial || result.nombreCompleto || "").split(" ");
            if (partes.length >= 3) {
              setValue("apellidos", partes.slice(0, 2).join(" "));
              setValue("nombres", partes.slice(2).join(" "));
            } else {
              setValue("nombres", result.razonSocial || result.nombreCompleto || "");
              setValue("apellidos", "");
            }
            setValue("razonSocial", "");
          }
        } else {
          // DNI
          setValue("tipoPersona", "NATURAL");
          setValue("nombres", result.nombres || "");
          const apellidos = [result.apellidoPaterno, result.apellidoMaterno].filter(Boolean).join(" ");
          setValue("apellidos", apellidos);
          setValue("razonSocial", "");
        }
        if (result.direccion) setValue("direccion", result.direccion);
        if (result.distrito) setValue("distrito", result.distrito);
        if (result.provincia) setValue("provincia", result.provincia);
        if (result.departamento) setValue("departamento", result.departamento);
      }
    } finally {
      setValidatingDoc(false);
    }
  };

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
      setClienteExistente(null);
      setValidationResult(null);
      setCartaFile(null);
    } else if (isOpen && initialValues) {
      reset({
        tipoPersona: "",
        razonSocial: "",
        nombres: "",
        apellidos: "",
        direccion: "",
        distrito: "",
        provincia: "",
        departamento: "",
        telefono1: "",
        telefono2: "",
        whatsapp: "",
        emailNotificaciones: "",
        recibirNotificaciones: false,
        cumpleanos: "",
        tipoDocumento: "",
        numeroDocumento: "",
        asignadoA: user.idUsuario,
        registradoPor: user.idUsuario,
        ...initialValues,
      });
    }
  }, [isOpen, reset, initialValues, user]);

  const onSubmit = async (data: any) => {
    const isNumericDoc = data.tipoDocumento === "DNI" || data.tipoDocumento === "RUC";

    const documentos: any[] = [];
    if (cartaFile) {
      setUploadingCarta(true);
      try {
        const url = await storageService.uploadFile(cartaFile, "documentos-clientes");
        documentos.push({
          tipoDocumento: TipoDocumentoArchivo.CARTA_NOMBRAMIENTO,
          urlArchivo: url,
          descripcion: `Carta de Nombramiento - ${cartaFile.name}`,
        });
      } finally {
        setUploadingCarta(false);
      }
    }

    const dataSubmit = {
      ...data,
      numeroDocumento: isNumericDoc ? Number(data.numeroDocumento) : data.numeroDocumento,
      telefono1: data.telefono1 || null,
      telefono2: data.telefono2 || null,
      whatsapp: data.whatsapp || null,
      emailNotificaciones: data.emailNotificaciones || null,
      cumpleanos: data.cumpleanos || null,
      contactos: [],
      documentos,
    };

    await addCliente(dataSubmit);
    onClose();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      position={presentation === "drawer" ? "right" : "center"}
      panelClassName={presentation === "drawer" ? "h-full rounded-none" : ""}
    >
      <Modal
        className={
          presentation === "drawer" ? "h-full max-h-full rounded-none" : ""
        }
      >
        <ModalHeader title="Registrar Nuevo Cliente" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="tipoPersona" required>
                  Tipo de Persona
                </Label>
                <Controller
                  name="tipoPersona"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <AppSelect
                      options={tipoPersonaOptions as any}
                      placeholder="Selecciona el tipo"
                      value={tipoPersonaOptions.find((o) => o.value === field.value) ?? null}
                      onChange={(opt) => field.onChange((opt as any)?.value ?? null)}
                    />
                  )}
                />
                {errors.tipoPersona && (
                  <span className="text-sm text-red-500">El tipo de persona es requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="tipoDocumento" required>
                  Tipo de Documento
                </Label>
                <Controller
                  name="tipoDocumento"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <AppSelect
                      options={filteredDocOptions as any}
                      placeholder="Selecciona el tipo"
                      value={filteredDocOptions.find((o) => o.value === field.value) ?? null}
                      onChange={(opt) => field.onChange((opt as any)?.value ?? null)}
                    />
                  )}
                />
                {errors.tipoDocumento && (
                  <span className="text-sm text-red-500">El tipo de documento es requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="numeroDocumento" required>
                Numero de Documento
              </Label>
              <div className="flex gap-2">
                <Input
                  id="numeroDocumento"
                  type="text"
                  className="flex-1"
                  placeholder={
                    tipoDocumento === "DNI" ? "8 digitos" :
                    tipoDocumento === "RUC" ? "11 digitos (10=natural, 20=empresa)" :
                    tipoDocumento === "CE" ? "9 a 12 caracteres" :
                    tipoDocumento === "PASAPORTE" ? "6 a 20 caracteres" :
                    "Numero de documento"
                  }
                  {...register("numeroDocumento", {
                    required: "El numero de documento es requerido",
                    validate: (value) => {
                      const v = String(value).trim();
                      if (!tipoDocumento) return "Primero seleccione el tipo de documento";
                      if (tipoDocumento === "DNI" && !/^\d{8}$/.test(v)) return "DNI: 8 digitos";
                      if (tipoDocumento === "RUC") {
                        if (!/^\d{11}$/.test(v)) return "RUC: 11 digitos";
                        if (!v.startsWith("10") && !v.startsWith("20")) return "RUC: debe empezar con 10 o 20";
                      }
                      if (tipoDocumento === "CE" && (v.length < 9 || v.length > 12)) return "CE: 9 a 12 caracteres";
                      if (tipoDocumento === "PASAPORTE" && (v.length < 6 || v.length > 20)) return "Pasaporte: 6 a 20 caracteres";
                      return true;
                    },
                    onBlur: (e) => handleDocumentoBlur(e.target.value),
                  })}
                />
                {(tipoDocumento === "DNI" || tipoDocumento === "RUC") && (
                  <button
                    type="button"
                    onClick={handleValidarDocumento}
                    disabled={validatingDoc}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 shrink-0"
                    style={{ backgroundColor: "var(--austral-azul)" }}
                  >
                    {validatingDoc ? "Validando..." : "Validar"}
                  </button>
                )}
              </div>
              {validationResult && (
                <div className="flex items-start gap-2 mt-1 p-3 bg-green-50 border border-green-300 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold">Datos autocompletados desde {tipoDocumento === "RUC" ? "SUNAT" : "RENIEC"}</p>
                    <p className="mt-0.5">{validationResult.nombreCompleto || validationResult.razonSocial}</p>
                    {validationResult.estado && (
                      <p className="text-xs text-green-600">Estado: {validationResult.estado} — {validationResult.condicion}</p>
                    )}
                  </div>
                </div>
              )}
              {validatingDoc && (
                <span className="text-xs text-blue-500">Consultando {tipoDocumento === "RUC" ? "SUNAT" : "RENIEC"}...</span>
              )}
              {checkingDoc && (
                <span className="text-xs text-gray-400">Verificando en el CRM...</span>
              )}
              {errors.numeroDocumento && (
                <span className="text-sm text-red-500">{errors.numeroDocumento.message as string}</span>
              )}
              {!checkingDoc && clienteExistente && (
                <div className="flex items-start gap-2 mt-1 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800 leading-snug">
                    <p className="font-semibold">Este prospecto ya esta registrado en el sistema</p>
                    <p className="mt-0.5">
                      <span className="font-medium">
                        {clienteExistente.tipoPersona === "JURIDICO"
                          ? clienteExistente.razonSocial
                          : `${clienteExistente.nombres ?? ""} ${clienteExistente.apellidos ?? ""}`.trim()}
                      </span>{" "}
                      se encuentra asignado a otro asesor de Austral.
                    </p>
                  </div>
                </div>
              )}
            </FormGroup>

            {/* Razon Social - solo JURIDICO */}
            {tipoPersona === "JURIDICO" && (
              <FormGroup>
                <Label htmlFor="razonSocial" required>Razon Social</Label>
                <Input id="razonSocial" placeholder="Ej: Empresa SAC" {...register("razonSocial", { required: true })} />
                {errors.razonSocial && <span className="text-sm text-red-500">La razon social es requerida</span>}
              </FormGroup>
            )}

            {/* Nombres y Apellidos - solo NATURAL o sin seleccionar */}
            {(tipoPersona === "NATURAL" || tipoPersona === "") && (
              <FormGroupDivisor>
                <FormGroup>
                  <Label htmlFor="nombres" required={tipoPersona === "NATURAL"}>Nombres</Label>
                  <Input id="nombres" placeholder="Ej: Juan Pedro" {...register("nombres", { required: tipoPersona === "NATURAL" ? "Los nombres son requeridos" : false })} />
                  {errors.nombres && <span className="text-sm text-red-500">{errors.nombres.message as string}</span>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="apellidos" required={tipoPersona === "NATURAL"}>Apellidos</Label>
                  <Input id="apellidos" placeholder="Ej: Perez Gomez" {...register("apellidos", { required: tipoPersona === "NATURAL" ? "Los apellidos son requeridos" : false })} />
                  {errors.apellidos && <span className="text-sm text-red-500">{errors.apellidos.message as string}</span>}
                </FormGroup>
              </FormGroupDivisor>
            )}

            <FormGroup>
              <Label htmlFor="cumpleanos">{tipoPersona === "JURIDICO" ? "Fecha de Constitucion" : "Cumpleanos / Aniversario"}</Label>
              <AppDatePickerField control={control} name="cumpleanos" id="cumpleanos" placeholder="Ej: 1990-01-01" calendarProps={{ maxDate: new Date() }} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="direccion" required>Direccion</Label>
              <Controller
                name="direccion"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LocationInput
                    value={field.value}
                    onChange={(locationData: any) => {
                      field.onChange(locationData.address);
                      if (locationData.distrito) setValue("distrito", locationData.distrito);
                      if (locationData.provincia) setValue("provincia", locationData.provincia);
                      if (locationData.departamento) setValue("departamento", locationData.departamento);
                      if (locationData.lat) setValue("latitud", locationData.lat);
                      if (locationData.lng) setValue("longitud", locationData.lng);
                    }}
                    placeholder="Ej: Av. Siempre Viva 123"
                  />
                )}
              />
              {errors.direccion && <span className="text-sm text-red-500">La direccion es requerida</span>}
            </FormGroup>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="distrito">Distrito</Label>
                <Input id="distrito" placeholder="Ej: Miraflores" {...register("distrito", { required: true })} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="provincia">Provincia</Label>
                <Input id="provincia" placeholder="Ej: Lima" {...register("provincia", { required: true })} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="departamento">Departamento</Label>
                <Input id="departamento" placeholder="Ej: Lima" {...register("departamento", { required: true })} />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="telefono1" required>Telefono Principal</Label>
                <Controller name="telefono1" control={control} rules={{ required: true }} render={({ field }) => <PhoneInput value={field.value} onChange={field.onChange} />} />
                {errors.telefono1 && <span className="text-sm text-red-500">El telefono principal es requerido</span>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefono2">Telefono Secundario</Label>
                <Controller name="telefono2" control={control} render={({ field }) => <PhoneInput value={field.value} onChange={field.onChange} />} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Controller name="whatsapp" control={control} render={({ field }) => <PhoneInput value={field.value} onChange={field.onChange} />} />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="emailNotificaciones">Email</Label>
                <Input id="emailNotificaciones" type="email" placeholder="Ej: correo@correo.com" {...register("emailNotificaciones")} />
              </FormGroup>
              <FormGroup>
                <div className="flex items-center space-x-2 h-10 pt-6">
                  <Controller
                    name="recibirNotificaciones"
                    control={control}
                    render={({ field }) => <Checkbox id="recibirNotificaciones" checked={field.value} onCheckedChange={field.onChange} />}
                  />
                  <Label htmlFor="recibirNotificaciones" className="cursor-pointer">Recibir Notificaciones?</Label>
                </div>
              </FormGroup>
            </FormGroupDivisor>

            {/* Carta de Nombramiento */}
            <FormGroup>
              <Label htmlFor="cartaNombramiento">Carta de Nombramiento</Label>
              <div className="mt-1">
                {!cartaFile ? (
                  <button
                    type="button"
                    onClick={() => cartaInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Subir carta de nombramiento (PDF, DOC, DOCX)
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm text-blue-800 truncate flex-1">{cartaFile.name}</span>
                    <button type="button" onClick={() => setCartaFile(null)} className="p-1 hover:bg-blue-100 rounded">
                      <X className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                )}
                <input ref={cartaInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setCartaFile(file); e.target.value = ""; }} />
                <p className="text-xs text-gray-400 mt-1">Opcional. Documento firmado por el cliente designando a AI Corredores como su corredor.</p>
              </div>
            </FormGroup>
          </ModalBody>

          <SubmitButtons onClose={onClose} isSubmitting={isSubmitting || uploadingCarta} />
        </form>
      </Modal>
    </ModalContainer>
  );
};
