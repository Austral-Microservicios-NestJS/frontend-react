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
import {
  tipoDocumentoOptions,
  type Usuario,
  type UpdateUsuario,
  type Rol,
} from "@/types/usuario.interface";

interface FormData extends UpdateUsuario {
  porcentajeComision?: number;
}

interface EditarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUsuario, porcentajeComision?: number) => Promise<void>;
  usuario: Usuario;
  roles: Rol[];
  porcentajeComisionActual?: number;
}

export const EditarUsuario = ({
  isOpen,
  onClose,
  onSubmit,
  usuario,
  roles,
  porcentajeComisionActual = 0,
}: EditarUsuarioProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: {},
  } = useForm<FormData>({
    defaultValues: {
      nombres: usuario.persona?.nombres || "",
      apellidos: usuario.persona?.apellidos || "",
      tipoDocumento: usuario.persona?.tipoDocumento || "",
      numeroDocumento: usuario.persona?.numeroDocumento || "",
      telefono: usuario.persona?.telefono || "",
      direccion: usuario.persona?.direccion || "",
      correo: usuario.correo,
      idRol: usuario.rol?.idRol || "",
      porcentajeComision: porcentajeComisionActual,
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    const { porcentajeComision, ...usuarioData } = data;
    await onSubmit(usuarioData, Number(porcentajeComision) || 0);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Editar Usuario" onClose={onClose} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="nombres">Nombres</Label>
                <Input
                  id="nombres"
                  placeholder="Ej: Juan Carlos"
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
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="text"
                  placeholder="Ej: 912543678"
                  {...register("telefono")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Ej: Rio de la plata 440"
                  {...register("direccion")}
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
              Actualizar
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
