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
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import type { User } from "@/store/auth.store";
import {
  tipoDocumentoOptions,
  type CreateUsuario,
  type Rol,
} from "@/types/usuario.interface";
import { useEffect } from "react";

interface RegistrarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  addUsuario: (data: CreateUsuario) => Promise<void>;
  //   addUsuario: (data: any) => Promise<void>;
  user: User;
  roles: Rol[];
}

export const RegistrarUsuario = ({
  isOpen,
  onClose,
  roles,
  user,
  addUsuario,
}: RegistrarUsuarioProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {},
  } = useForm({
    defaultValues: {
      nombres: "",
      apellidos: "",
      tipoDocumento: "",
      numeroDocumento: "",
      telefono: "",
      direccion: "",
      correo: "",
      idRol: "",
      porcentajeComision: 0,
      idSupervisor: user.idUsuario,
    },
  });

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: any) => {
    // Convertir porcentajeComision a número
    const dataToSend = {
      ...data,
      porcentajeComision: Number(data.porcentajeComision) || 0,
    };
    console.log("Datos a enviar:", dataToSend);
    await addUsuario(dataToSend);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Nuevo Usuario" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="Nombres">Nombres</Label>
                <Input
                  id="nombres"
                  placeholder="Ej: Juan Carlos"
                  {...register("nombres", { required: true })}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="Apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  placeholder="Ej: Pérez Gómez"
                  {...register("apellidos", { required: true })}
                />
              </FormGroup>
            </FormGroupDivisor>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="tipoDocumento">Tipo de documento</Label>
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

              <FormGroup>
                <Label htmlFor="numeroDocumento">Número de documento</Label>
                <Input
                  id="numeroDocumento"
                  type="text"
                  placeholder="Ej: 87609723"
                  {...register("numeroDocumento", { required: true })}
                />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej: correo@ejemplo.com"
                {...register("correo", { required: true })}
              />
            </FormGroup>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  type="number"
                  placeholder="Ej: 912543678"
                  {...register("telefono", { required: true })}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="direccion">Direccion</Label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Ej: Rio de la plata 440"
                  {...register("direccion", { required: true })}
                />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="idRol">Rol del usuario</Label>
                <Controller
                  name="idRol"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((option) => (
                          <SelectItem key={option.idRol} value={option.idRol}>
                            {option.nombreRol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="porcentajeComision">
                  Porcentaje de Comisión (%)
                </Label>
                <Input
                  id="porcentajeComision"
                  type="number"
                  placeholder="Ej: 25"
                  step={0.01}
                  {...register("porcentajeComision", {
                    required: true,
                    max: 100,
                    min: 0,
                    valueAsNumber: true,
                  })}
                />
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
