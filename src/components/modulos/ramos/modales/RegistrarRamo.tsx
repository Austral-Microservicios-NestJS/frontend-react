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
import { Input, Label, Textarea } from "@/components/ui";
import { useForm } from "react-hook-form";
import type { CreateRamoDto } from "@/types/ramo.interface";

interface RegistrarRamoProps {
  isOpen: boolean;
  onClose: () => void;
  addRamo: (data: CreateRamoDto) => Promise<void>;
}

export const RegistrarRamo = ({
  isOpen,
  onClose,
  addRamo,
}: RegistrarRamoProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRamoDto>({
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      activo: true,
    },
  });

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateRamoDto) => {
    await addRamo(data);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Nuevo Ramo" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  placeholder="Ej: VEH-001"
                  {...register("codigo", { required: true })}
                />
                {errors.codigo && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Seguro Vehicular"
                  {...register("nombre", { required: true })}
                />
                {errors.nombre && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="abreviatura">Abreviatura</Label>
                <Input
                  id="abreviatura"
                  placeholder="Ej: VEH"
                  {...register("abreviatura")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="grupo">Grupo</Label>
                <Input
                  id="grupo"
                  placeholder="Ej: RRGG"
                  {...register("grupo")}
                />
              </FormGroup>
            </FormGroupDivisor>
            <FormGroup>
              <FormGroup>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el ramo de seguro..."
                  rows={4}
                  {...register("descripcion")}
                />
              </FormGroup>
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
