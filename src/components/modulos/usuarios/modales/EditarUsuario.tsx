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
import {
  validarNumeroDocumento,
  validarTelefonoPeru,
  validarNombre,
  EMAIL_PATTERN,
} from "@/utils/validators";

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
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombres: usuario.persona?.nombres || "",
      apellidos: usuario.persona?.apellidos || "",
      tipoDocumento: usuario.persona?.tipoDocumento || "",
      numeroDocumento: usuario.persona?.numeroDocumento || "",
      telefono: usuario.persona?.telefono || "",
      telefonoEmpresarial: usuario.persona?.telefonoEmpresarial || "",
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
                  {...register("nombres", { validate: validarNombre })}
                />
                {errors.nombres && (
                  <span className="text-xs text-red-500">
                    {errors.nombres.message as string}
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  placeholder="Ej: Pérez Gómez"
                  {...register("apellidos", { validate: validarNombre })}
                />
                {errors.apellidos && (
                  <span className="text-xs text-red-500">
                    {errors.apellidos.message as string}
                  </span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="tipoDocumento">Tipo de documento</Label>
                <Controller
                  name="tipoDocumento"
                  control={control}
                  rules={{ required: "Selecciona el tipo de documento" }}
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
                {errors.tipoDocumento && (
                  <span className="text-xs text-red-500">
                    {errors.tipoDocumento.message as string}
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="numeroDocumento">Número de documento</Label>
                <Input
                  id="numeroDocumento"
                  type="text"
                  inputMode="text"
                  placeholder="Ej: 87609723"
                  {...register("numeroDocumento", {
                    required: "El número de documento es requerido",
                    validate: (v) =>
                      validarNumeroDocumento(watch("tipoDocumento"), v),
                  })}
                />
                {errors.numeroDocumento && (
                  <span className="text-xs text-red-500">
                    {errors.numeroDocumento.message as string}
                  </span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej: correo@ejemplo.com"
                {...register("correo", {
                  required: "El correo es requerido",
                  pattern: EMAIL_PATTERN,
                })}
              />
              {errors.correo && (
                <span className="text-xs text-red-500">
                  {errors.correo.message as string}
                </span>
              )}
            </FormGroup>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="telefono">Teléfono personal</Label>
                <Input
                  id="telefono"
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="Ej: 912543678"
                  {...register("telefono", {
                    validate: (v) => validarTelefonoPeru(v),
                  })}
                />
                {errors.telefono && (
                  <span className="text-xs text-red-500">
                    {errors.telefono.message as string}
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telefonoEmpresarial">
                  Teléfono empresarial <span className="text-xs text-gray-500">(único, visible al cliente)</span>
                </Label>
                <Input
                  id="telefonoEmpresarial"
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="Ej: 987654321"
                  {...register("telefonoEmpresarial", {
                    validate: (v) =>
                      validarTelefonoPeru(v, { requerido: false }),
                  })}
                />
                {errors.telefonoEmpresarial && (
                  <span className="text-xs text-red-500">
                    {errors.telefonoEmpresarial.message as string}
                  </span>
                )}
              </FormGroup>
            </FormGroupDivisor>
            <FormGroup>
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                type="text"
                placeholder="Ej: Río de la Plata 440"
                {...register("direccion", {
                  required: "La dirección es requerida",
                  minLength: { value: 5, message: "Dirección muy corta (mín. 5)" },
                })}
              />
              {errors.direccion && (
                <span className="text-xs text-red-500">
                  {errors.direccion.message as string}
                </span>
              )}
            </FormGroup>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="idRol">Rol del usuario</Label>
                <Controller
                  name="idRol"
                  control={control}
                  rules={{ required: "Selecciona el rol del usuario" }}
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
                {errors.idRol && (
                  <span className="text-xs text-red-500">
                    {errors.idRol.message as string}
                  </span>
                )}
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
                    max: { value: 100, message: "Máximo 100%" },
                    min: { value: 0, message: "No puede ser negativo" },
                    valueAsNumber: true,
                  })}
                />
                {errors.porcentajeComision && (
                  <span className="text-xs text-red-500">
                    {errors.porcentajeComision.message as string}
                  </span>
                )}
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
