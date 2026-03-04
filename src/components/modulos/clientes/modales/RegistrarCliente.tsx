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
import { useEffect } from "react";
import {
  tipoPersonaOptions,
  tipoDocumentoOptions,
} from "@/types/cliente.interface";
import type { User } from "@/store/auth.store";

interface RegistrarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  addCliente: (data: any) => Promise<void>;
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

  useEffect(() => {
    setValue("numeroDocumento", "");
  }, [tipoDocumento, setValue]);

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
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
    const dataSubmit = {
      ...data,
      numeroDocumento: isNumericDoc ? Number(data.numeroDocumento) : data.numeroDocumento,
      telefono1: data.telefono1 || null,
      telefono2: data.telefono2 || null,
      whatsapp: data.whatsapp || null,
      emailNotificaciones: data.emailNotificaciones || null,
      cumpleanos: data.cumpleanos || null,
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
                })}
              />
              {errors.numeroDocumento && (
                <span className="text-sm text-red-500">
                  {errors.numeroDocumento.message as string}
                </span>
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
          </ModalBody>

          <SubmitButtons onClose={onClose} isSubmitting={isSubmitting} />
        </form>
      </Modal>
    </ModalContainer>
  );
};
