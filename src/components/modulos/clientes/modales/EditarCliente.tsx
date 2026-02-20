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
} from "@/components/shared";
import {
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
} from "@/components/ui";
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
    formState: { isSubmitting, isDirty },
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

  const tipoPersona = watch("tipoPersona");

  const handleFormSubmit = async (data: UpdateCliente) => {
    const dataSubmit = {
      ...data,
      numeroDocumento: Number(data.numeroDocumento),
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
                <Label htmlFor="tipoPersona" required>Tipo de Persona</Label>
                <Controller
                  name="tipoPersona"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoPersonaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="tipoDocumento" required>Tipo de Documento</Label>
                <Controller
                  name="tipoDocumento"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoDocumentoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="numeroDocumento" required>Número de Documento</Label>
              <Input
                id="numeroDocumento"
                type="number"
                placeholder="Ej: 12345678"
                {...register("numeroDocumento", { required: true })}
              />
            </FormGroup>

            {tipoPersona === "JURIDICO" && (
              <FormGroup>
                <Label htmlFor="razonSocial" required>Razón Social</Label>
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
                  <Label htmlFor="nombres" required>Nombres</Label>
                  <Input
                    id="nombres"
                    placeholder="Ej: Juan Pedro"
                    {...register("nombres", { required: true })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="apellidos" required>Apellidos</Label>
                  <Input
                    id="apellidos"
                    placeholder="Ej: Pérez Gómez"
                    {...register("apellidos", { required: true })}
                  />
                </FormGroup>
              </FormGroupDivisor>
            )}

            <FormGroup>
              <Label htmlFor="cumpleanos">Cumpleaños / Aniversario</Label>
              <Input
                id="cumpleanos"
                placeholder="Ej: 1990-01-01"
                type="date"
                {...register("cumpleanos")}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="direccion" required>Dirección</Label>
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
                <Label htmlFor="telefono1" required>Teléfono Principal</Label>
                <Controller
                  name="telefono1"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefono2">Teléfono Secundario</Label>
                <Controller
                  name="telefono2"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                    />
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

          <UpdateButtons onClose={onClose} isSubmitting={isSubmitting} isDirty={isDirty} />
        </form>
      </Modal>
    </ModalContainer>
  );
};
