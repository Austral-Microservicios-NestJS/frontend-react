import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormGroupDivisor,
  LocationInput,
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
import { useEffect } from "react";
import { toast } from "sonner";
import {
  tipoPersonaOptions,
  tipoDocumentoOptions,
} from "@/types/cliente.interface";
import type { User } from "@/store/auth.store";

// Opciones de prefijos de países
const countryPrefixes = [
  { code: "+51", name: "Perú" },
  { code: "+56", name: "Chile" },
  { code: "+54", name: "Argentina" },
  { code: "+57", name: "Colombia" },
  { code: "+58", name: "Venezuela" },
  { code: "+52", name: "México" },
  { code: "+1", name: "Estados Unidos" },
  { code: "+34", name: "España" },
  { code: "+593", name: "Ecuador" },
  { code: "+595", name: "Paraguay" },
];

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
    formState: {},
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
      telefono1Prefix: "+51",
      telefono2Prefix: "+51",
      whatsappPrefix: "+51",
      asignadoA: user.idUsuario,
      registradoPor: user.idUsuario,
    },
  });

  const tipoPersona = watch("tipoPersona");

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    } else if (isOpen && initialValues) {
      // fusionar valores por defecto con initialValues
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
        telefono1Prefix: "+51",
        telefono2Prefix: "+51",
        whatsappPrefix: "+51",
        asignadoA: user.idUsuario,
        registradoPor: user.idUsuario,
        ...initialValues,
      });
    }
  }, [isOpen, reset, initialValues, user]);

  const onSubmit = async (data: any) => {
    const {
      telefono1Prefix,
      telefono2Prefix,
      whatsappPrefix,
      ...dataWithoutPrefixes
    } = data;
    const dataSubmit = {
      ...dataWithoutPrefixes,
      numeroDocumento: Number(data.numeroDocumento),
      telefono1: data.telefono1 ? `${telefono1Prefix}${data.telefono1}` : null,
      telefono2: data.telefono2 ? `${telefono2Prefix}${data.telefono2}` : null,
      whatsapp: data.whatsapp ? `${whatsappPrefix}${data.whatsapp}` : null,
    };

    await addCliente(dataSubmit);
    onClose();
  };

  const isDrawer = presentation === "drawer";
  const prefixWidthClass = isDrawer ? "w-20" : "w-32";

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      position={isDrawer ? "right" : "center"}
      panelClassName={isDrawer ? "h-full rounded-none" : ""}
    >
      <Modal
        className={isDrawer ? "h-full max-h-full rounded-none" : ""}
      >
        <ModalHeader title="Registrar Nuevo Cliente" onClose={onClose} />

        <form
          onSubmit={handleSubmit(onSubmit, () => {
            toast.error("Completa los campos obligatorios");
          })}
        >
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="tipoPersona">Tipo de Persona</Label>
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
                <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
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
              <Label htmlFor="numeroDocumento">Número de Documento</Label>
              <Input
                id="numeroDocumento"
                type="number"
                placeholder="Ej: 12345678"
                {...register("numeroDocumento", { required: true })}
              />
            </FormGroup>

            {tipoPersona === "JURIDICO" && (
              <FormGroup>
                <Label htmlFor="razonSocial">Razón Social</Label>
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
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    placeholder="Ej: Juan Pedro"
                    {...register("nombres", { required: true })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="apellidos">Apellidos</Label>
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
                {...register("cumpleanos", { required: true })}
              />
            </FormGroup>

            {/* Ubicacion */}
            <FormGroup>
              <Label htmlFor="direccion">Dirección</Label>
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
                <Label htmlFor="telefono1">Telefono Principal</Label>
                <div className="flex gap-2">
                  <Controller
                    name="telefono1Prefix"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={prefixWidthClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryPrefixes.map((prefix) => (
                            <SelectItem key={prefix.code} value={prefix.code}>
                              {prefix.name} ({prefix.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    id="telefono1"
                    type="text"
                    placeholder="999888777"
                    className="flex-1"
                    {...register("telefono1")}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefono2">Telefono Secundario</Label>
                <div className="flex gap-2">
                  <Controller
                    name="telefono2Prefix"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={prefixWidthClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryPrefixes.map((prefix) => (
                            <SelectItem key={prefix.code} value={prefix.code}>
                              {prefix.name} ({prefix.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    id="telefono2"
                    type="text"
                    placeholder="999888777"
                    className="flex-1"
                    {...register("telefono2")}
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="flex gap-2">
                  <Controller
                    name="whatsappPrefix"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={prefixWidthClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countryPrefixes.map((prefix) => (
                            <SelectItem key={prefix.code} value={prefix.code}>
                              {prefix.name} ({prefix.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Input
                    id="whatsapp"
                    type="text"
                    placeholder="999888777"
                    className="flex-1"
                    {...register("whatsapp")}
                  />
                </div>
              </FormGroup>
            </FormGroupDivisor>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="emailNotificaciones">Email</Label>
                <Input
                  id="emailNotificaciones"
                  type="email"
                  placeholder="Ej: correo@correo.com"
                  {...register("emailNotificaciones", { required: true })}
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

          <ModalFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              Guardar
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
