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
import type { Compania, UpdateCompaniaDto } from "@/types/compania.interface";

interface EditarCompaniaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateCompaniaDto) => Promise<void>;
  compania: Compania;
}

export const EditarCompania = ({
  isOpen,
  onClose,
  onSubmit,
  compania,
}: EditarCompaniaProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCompaniaDto>({
    defaultValues: {
      ruc: compania.ruc,
      razonSocial: compania.razonSocial,
      nombreComercial: compania.nombreComercial,
      direccion: compania.direccion || "",
      telefono: compania.telefono || "",
      email: compania.email || "",
      web: compania.web || "",
      logoUrl: compania.logoUrl || "",
    },
  });

  const handleFormSubmit = async (data: UpdateCompaniaDto) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Editar Compañía" onClose={onClose} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
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

            <FormGroupDivisor>
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
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="web">Sitio Web</Label>
              <Input
                id="web"
                type="url"
                placeholder="Ej: www.empresa.com"
                {...register("web")}
              />
            </FormGroup>

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
              Actualizar
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
