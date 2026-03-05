import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  FormGroupDivisor,
  LocationInput,
  PhoneInput,
  UpdateButtons,
  AppSelect,
  AppDatePickerField,
} from "@/components/shared";
import { Input, Label, Checkbox } from "@/components/ui";
import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  tipoPersonaOptions,
  tipoDocumentoOptions,
  type Cliente,
  type UpdateCliente,
} from "@/types/cliente.interface";
import dayjs from "dayjs";

interface EditarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateCliente) => Promise<void>;
  cliente: Cliente;
}

export const EditarCliente = ({
  isOpen,
  onClose,
  onSubmit,
  cliente,
}: EditarClienteProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<UpdateCliente>({
    defaultValues: {
      tipoPersona: cliente.tipoPersona,
      razonSocial: cliente.razonSocial || "",
      nombres: cliente.nombres || "",
      apellidos: cliente.apellidos || "",
      direccion: cliente.direccion,
      distrito: cliente.distrito || "",
      provincia: cliente.provincia || "",
      departamento: cliente.departamento || "",
      latitud: cliente.latitud || 0,
      longitud: cliente.longitud || 0,
      telefono1: cliente.telefono1,
      telefono2: cliente.telefono2 || "",
      whatsapp: cliente.whatsapp || "",
      emailNotificaciones: cliente.emailNotificaciones || "",
      recibirNotificaciones: cliente.recibirNotificaciones,
      cumpleanos: cliente.cumpleanos
        ? dayjs(cliente.cumpleanos).format("YYYY-MM-DD")
        : "",
      tipoDocumento: cliente.tipoDocumento,
      numeroDocumento: cliente.numeroDocumento,
      asignadoA: cliente.asignadoA || "",
      registradoPor: cliente.registradoPor,
    },
  });

  const tipoPersona   = watch("tipoPersona");
  const tipoDocumento = watch("tipoDocumento");

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setValue("numeroDocumento", "" as any);
  }, [tipoDocumento, setValue]);

  const handleFormSubmit = async (data: UpdateCliente) => {
    const isNumericDoc = data.tipoDocumento === "DNI" || data.tipoDocumento === "RUC";
    const dataSubmit = {
      ...data,
      numeroDocumento: isNumericDoc ? Number(data.numeroDocumento) : data.numeroDocumento,
      latitud:
        data.latitud !== undefined && data.latitud !== null
          ? Number(data.latitud)
          : data.latitud,
      longitud:
        data.longitud !== undefined && data.longitud !== null
          ? Number(data.longitud)
          : data.longitud,
      telefono1: data.telefono1 || undefined,
      telefono2: data.telefono2 || undefined,
      whatsapp: data.whatsapp || undefined,
      emailNotificaciones: data.emailNotificaciones || undefined,
      cumpleanos: data.cumpleanos || undefined,
    };
    await onSubmit(dataSubmit);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="xl">
      <Modal>
        <ModalHeader title="Editar Cliente" onClose={onClose} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                calendarProps={{ maxDate: new Date(), minDate: new Date("1900-01-01") }}
              />
            </FormGroup>

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
            </FormGroup>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="distrito">Distrito</Label>
                <Input
                  id="distrito"
                  placeholder="Ej: Miraflores"
                  {...register("distrito")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  placeholder="Ej: Lima"
                  {...register("provincia")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  placeholder="Ej: Lima"
                  {...register("departamento")}
                />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="telefono1" required>
                  Teléfono Principal
                </Label>
                <Controller
                  name="telefono1"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefono2">Teléfono Secundario</Label>
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
                  {...register("emailNotificaciones")}
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

          <UpdateButtons
            onClose={onClose}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
          />
        </form>
      </Modal>
    </ModalContainer>
  );
};
