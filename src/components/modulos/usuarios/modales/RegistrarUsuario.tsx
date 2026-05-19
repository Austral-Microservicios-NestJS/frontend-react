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
import { Roles } from "@/utils/roles";
import {
  tipoDocumentoOptions,
  type CreateUsuario,
  type Rol,
} from "@/types/usuario.interface";
import {
  validarNumeroDocumento,
  validarTelefonoPeru,
  validarNombre,
  EMAIL_PATTERN,
} from "@/utils/validators";
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
  // BROKER solo puede crear usuarios de su red (PROMOTOR_VENTA, REFERENCIADOR, PUNTO_VENTA)
  const isBroker = user?.rol?.nombreRol === Roles.BROKER;
  const availableRoles = isBroker
    ? roles.filter((role) =>
        ([Roles.PROMOTOR_VENTA, Roles.REFERENCIADOR, Roles.PUNTO_VENTA] as string[]).includes(role.nombreRol)
      )
    : roles;
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombres: "",
      apellidos: "",
      tipoDocumento: "",
      numeroDocumento: "",
      telefono: "",
      telefonoEmpresarial: "",
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
    // Garantizar que idSupervisor siempre vaya (RHF no lo envía si no está registrado)
    const dataToSend = {
      ...data,
      porcentajeComision: Number(data.porcentajeComision) || 0,
      idSupervisor: user?.idUsuario,
    };
    try {
      await addUsuario(dataToSend);
      onClose();
    } catch {
      // addUsuario ya mostró el toast; dejamos el modal abierto para que corrija
    }
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
                  {...register("nombres", { validate: validarNombre })}
                />
                {errors.nombres && (
                  <span className="text-xs text-red-500">
                    {errors.nombres.message as string}
                  </span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="Apellidos">Apellidos</Label>
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
                        {availableRoles.map((option) => (
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
                    required: "La comisión es requerida",
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
              Guardar
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
