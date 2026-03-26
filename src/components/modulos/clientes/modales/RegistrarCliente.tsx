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
import { useEffect, useState, useRef } from "react";
import {
  tipoPersonaOptions,
  tipoDocumentoOptions,
  TipoDocumentoArchivo,
} from "@/types/cliente.interface";
import type { Cliente } from "@/types/cliente.interface";
import type { User } from "@/store/auth.store";
import { clienteService } from "@/services/cliente.service";
import { storageService } from "@/services/storage.service";
import { AlertCircle, Upload, FileText, X } from "lucide-react";

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

  const tipoPersona   = watch("tipoPersona");
  const tipoDocumento = watch("tipoDocumento");

  const [clienteExistente, setClienteExistente] = useState<Cliente | null>(null);
  const [checkingDoc, setCheckingDoc] = useState(false);
  const [cartaFile, setCartaFile] = useState<File | null>(null);
  const [uploadingCarta, setUploadingCarta] = useState(false);
  const cartaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("numeroDocumento", "");
    setClienteExistente(null);
  }, [tipoDocumento, setValue]);

  const handleDocumentoBlur = async (numero: string) => {
    if (!numero || numero.trim().length < 6) return;
    setCheckingDoc(true);
    try {
      const found = await clienteService.findByDocumento(numero.trim());
      setClienteExistente(found);
      if (found) {
        // Auto-llenar los campos con los datos del cliente encontrado
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

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
      setClienteExistente(null);
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

    // Subir carta de nombramiento si existe
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
                      value={
                        tipoPersonaOptions.find(
                          (o) => o.value === field.value,
                        ) ?? null
                      }
                      onChange={(opt) =>
                        field.onChange((opt as any)?.value ?? null)
                      }
                    />
                  )}
                />
                {errors.tipoPersona && (
                  <span className="text-sm text-red-500">
                    El tipo de persona es requerido
                  </span>
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
                      options={tipoDocumentoOptions as any}
                      placeholder="Selecciona el tipo"
                      value={
                        tipoDocumentoOptions.find(
                          (o) => o.value === field.value,
                        ) ?? null
                      }
                      onChange={(opt) =>
                        field.onChange((opt as any)?.value ?? null)
                      }
                    />
                  )}
                />
                {errors.tipoDocumento && (
                  <span className="text-sm text-red-500">
                    El tipo de documento es requerido
                  </span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="numeroDocumento" required>
                Número de Documento
              </Label>
              <Input
                id="numeroDocumento"
                type="text"
                placeholder={
                  tipoDocumento === "DNI"       ? "8 dígitos numéricos" :
                  tipoDocumento === "RUC"       ? "11 dígitos (empieza con 10 o 20)" :
                  tipoDocumento === "CE"        ? "9 a 12 caracteres" :
                  tipoDocumento === "PASAPORTE" ? "6 a 20 caracteres" :
                  "Número de documento"
                }
                {...register("numeroDocumento", {
                  required: "El número de documento es requerido",
                  validate: (value) => {
                    const v = String(value).trim();
                    if (!tipoDocumento) return "Primero seleccione el tipo de documento";
                    if (tipoDocumento === "DNI") {
                      if (!/^\d{8}$/.test(v)) return "El DNI debe tener exactamente 8 dígitos numéricos";
                    }
                    if (tipoDocumento === "RUC") {
                      if (!/^\d{11}$/.test(v)) return "El RUC debe tener exactamente 11 dígitos numéricos";
                      if (!v.startsWith("10") && !v.startsWith("20")) return "El RUC debe empezar con 10 (persona natural) o 20 (empresa)";
                    }
                    if (tipoDocumento === "CE") {
                      if (v.length < 9 || v.length > 12) return "El Carnet de Extranjería debe tener entre 9 y 12 caracteres";
                    }
                    if (tipoDocumento === "PASAPORTE") {
                      if (v.length < 6 || v.length > 20) return "El Pasaporte debe tener entre 6 y 20 caracteres";
                    }
                    return true;
                  },
                  onBlur: (e) => handleDocumentoBlur(e.target.value),
                })}
              />
              {checkingDoc && (
                <span className="text-xs text-gray-400">Verificando documento...</span>
              )}
              {errors.numeroDocumento && (
                <span className="text-sm text-red-500">
                  {errors.numeroDocumento.message as string}
                </span>
              )}
              {!checkingDoc && clienteExistente && (
                <div className="flex items-start gap-2 mt-1 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800 leading-snug">
                    <p className="font-semibold">
                      ⚠️ Este prospecto ya está registrado en el sistema
                    </p>
                    <p className="mt-0.5">
                      <span className="font-medium">
                        {clienteExistente.tipoPersona === "JURIDICO"
                          ? clienteExistente.razonSocial
                          : `${clienteExistente.nombres ?? ""} ${clienteExistente.apellidos ?? ""}`.trim()}
                      </span>{" "}
                      se encuentra asignado a otro asesor de Austral.
                    </p>
                    <p className="mt-1 text-amber-700">
                      Para trabajar con este cliente necesitarás la{" "}
                      <span className="font-semibold">carta de nombramiento</span>.
                      Se ha notificado al asesor responsable.
                    </p>
                  </div>
                </div>
              )}
            </FormGroup>

            {tipoPersona === "JURIDICO" && (
              <FormGroup>
                <Label htmlFor="razonSocial" required>
                  Razón Social
                </Label>
                <Input
                  id="razonSocial"
                  placeholder="Ej: Empresa SAC"
                  {...register("razonSocial", { required: true })}
                />
                {errors.razonSocial && (
                  <span className="text-sm text-red-500">
                    La razón social es requerida
                  </span>
                )}
              </FormGroup>
            )}

            {tipoPersona === "NATURAL" && (
              <FormGroupDivisor>
                <FormGroup>
                  <Label htmlFor="nombres" required>
                    Nombres
                  </Label>
                  <Input
                    id="nombres"
                    placeholder="Ej: Juan Pedro"
                    {...register("nombres", { required: "Los nombres son requeridos" })}
                  />
                  {errors.nombres && (
                    <span className="text-sm text-red-500">{errors.nombres.message as string}</span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="apellidos" required>
                    Apellidos
                  </Label>
                  <Input
                    id="apellidos"
                    placeholder="Ej: Pérez Gómez"
                    {...register("apellidos", { required: "Los apellidos son requeridos" })}
                  />
                  {errors.apellidos && (
                    <span className="text-sm text-red-500">{errors.apellidos.message as string}</span>
                  )}
                </FormGroup>
              </FormGroupDivisor>
            )}
            <FormGroup>
              <Label htmlFor="cumpleanos">Cumpleaños / Aniversario</Label>
              <AppDatePickerField
                control={control}
                name="cumpleanos"
                id="cumpleanos"
                placeholder="Ej: 1990-01-01"
                calendarProps={{ maxDate: new Date() }}
              />
            </FormGroup>

            {/* Ubicacion */}
            <FormGroup>
              <Label htmlFor="direccion" required>
                Dirección (Potenciado por Google Maps)
              </Label>
              <Controller
                name="direccion"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LocationInput
                    value={field.value}
                    onChange={(locationData: any) => {
                      field.onChange(locationData.address);
                      // Auto-fill other fields if available
                      if (locationData.distrito) {
                        setValue("distrito", locationData.distrito);
                      }
                      if (locationData.provincia) {
                        setValue("provincia", locationData.provincia);
                      }
                      if (locationData.departamento) {
                        setValue("departamento", locationData.departamento);
                      }
                      // Set coordinates
                      if (locationData.lat)
                        setValue("latitud", locationData.lat);
                      if (locationData.lng)
                        setValue("longitud", locationData.lng);
                    }}
                    placeholder="Ej: Av. Siempre Viva 123"
                  />
                )}
              />
              {errors.direccion && (
                <span className="text-sm text-red-500">
                  La dirección es requerida
                </span>
              )}
            </FormGroup>
            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="distrito">Distrito</Label>
                <Input
                  id="distrito"
                  placeholder="Ej: Miraflores"
                  {...register("distrito", { required: true })}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  placeholder="Ej: Miraflores"
                  {...register("provincia", { required: true })}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  placeholder="Ej: Miraflores"
                  {...register("departamento", { required: true })}
                />
              </FormGroup>
            </FormGroupDivisor>
            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="telefono1" required>
                  Telefono Principal
                </Label>
                <Controller
                  name="telefono1"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.telefono1 && (
                  <span className="text-sm text-red-500">
                    El teléfono principal es requerido
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefono2">Telefono Secundario</Label>
                <Controller
                  name="telefono2"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormGroup>
            </FormGroupDivisor>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="emailNotificaciones">Email</Label>
                <Input
                  id="emailNotificaciones"
                  type="email"
                  placeholder="Ej: correo@correo.com"
                  {...register("emailNotificaciones", { required: false })}
                />
              </FormGroup>
              <FormGroup>
                <div className="flex items-center space-x-2 h-10 pt-6">
                  <Controller
                    name="recibirNotificaciones"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="recibirNotificaciones"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="recibirNotificaciones"
                    className="cursor-pointer"
                  >
                    Recibir Notificaciones?
                  </Label>
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
                    <button
                      type="button"
                      onClick={() => setCartaFile(null)}
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      <X className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                )}
                <input
                  ref={cartaInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCartaFile(file);
                    e.target.value = "";
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Opcional. Documento firmado por el cliente designando a AI Corredores como su corredor.
                </p>
              </div>
            </FormGroup>
          </ModalBody>

          <SubmitButtons onClose={onClose} isSubmitting={isSubmitting || uploadingCarta} />
        </form>
      </Modal>
    </ModalContainer>
  );
};
