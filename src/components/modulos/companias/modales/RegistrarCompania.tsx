import { useEffect } from "react";
import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormGroupDivisor,
} from "@/components/shared";
import { Input, Label } from "@/components/ui";
import { useForm } from "react-hook-form";
import type { CreateCompaniaDto } from "@/types/compania.interface";

interface RegistrarCompaniaProps {
  isOpen: boolean;
  onClose: () => void;
  addCompania: (data: CreateCompaniaDto) => Promise<void>;
}

export const RegistrarCompania = ({
  isOpen,
  onClose,
  addCompania,
}: RegistrarCompaniaProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCompaniaDto>({
    defaultValues: {
      ruc: "",
      razonSocial: "",
      nombreComercial: "",
      direccion: "",
      telefono: "",
      email: "",
      web: "",
      logoUrl: "",
    },
  });

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateCompaniaDto) => {
    await addCompania(data);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Nueva Compañía" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  placeholder="Ej: 20123456789"
                  {...register("ruc", { required: true })}
                />
                {errors.ruc && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="nombreComercial">Nombre Comercial</Label>
                <Input
                  id="nombreComercial"
                  placeholder="Ej: Mi Empresa SAC"
                  {...register("nombreComercial", { required: true })}
                />
                {errors.nombreComercial && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="razonSocial">Razón Social</Label>
              <Input
                id="razonSocial"
                placeholder="Ej: Mi Empresa Sociedad Anónima Cerrada"
                {...register("razonSocial", { required: true })}
              />
              {errors.razonSocial && (
                <span className="text-xs text-red-500">Campo requerido</span>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                placeholder="Ej: Av. Principal 123, Lima"
                {...register("direccion")}
              />
            </FormGroup>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="Ej: 01-2345678"
                  {...register("telefono")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ej: contacto@empresa.com"
                  {...register("email")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="web">Sitio Web</Label>
                <Input
                  id="web"
                  type="url"
                  placeholder="Ej: www.empresa.com"
                  {...register("web")}
                />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="logoUrl">URL del Logo</Label>
              <Input
                id="logoUrl"
                type="url"
                placeholder="Ej: https://ejemplo.com/logo.png"
                {...register("logoUrl")}
              />
            </FormGroup>
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
