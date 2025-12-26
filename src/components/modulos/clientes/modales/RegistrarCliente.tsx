import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormGroupDivisor,
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
}

export const RegistrarCliente = ({
  isOpen,
  onClose,
  addCliente,
  user,
}: RegistrarClienteProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
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

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: any) => {
    const dataSubmit = {
      ...data,
      numeroDocumento: Number(data.numeroDocumento),
    };

    await addCliente(dataSubmit);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="xl">
      <Modal>
        <ModalHeader title="Registrar Nuevo Cliente" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
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
              <Input
                id="direccion"
                placeholder="Ej: Av. Siempre Viva 123"
                {...register("direccion", { required: true })}
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
                <Input
                  id="telefono1"
                  type="text"
                  placeholder="Ej: 999888777"
                  {...register("telefono1", { required: true })}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefono2">Telefono Secundario</Label>
                <Input
                  id="telefono2"
                  type="text"
                  placeholder="Ej: 999888777"
                  {...register("telefono2", { required: true })}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefono3">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="text"
                  placeholder="Ej: 999888777"
                  {...register("whatsapp", { required: true })}
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
