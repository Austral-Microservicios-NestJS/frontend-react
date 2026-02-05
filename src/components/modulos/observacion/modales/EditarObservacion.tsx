import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  FormGroupDivisor,
  UpdateButtons,
} from "@/components/shared";
import {
  Input,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  ImageUpload,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import {
  categoriaObservacionOptions,
  prioridadObservacionOptions,
  canalObservacionOptions,
  estadoObservacionOptions,
  type Observacion,
  type UpdateObservacion,
} from "@/types/observacion.interface";
import { storageService } from "@/services/storage.service";
import { toast } from "sonner";
import { useState } from "react";

interface EditarObservacionProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateObservacion) => Promise<void>;
  observacion: Observacion;
}

export const EditarObservacion = ({
  isOpen,
  onClose,
  onSubmit,
  observacion,
}: EditarObservacionProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateObservacion>({
    defaultValues: {
      asunto: observacion.asunto,
      descripcion: observacion.descripcion,
      categoria: observacion.categoria,
      prioridad: observacion.prioridad,
      canal: observacion.canal,
      estado: observacion.estado,
    },
  });

  const handleFormSubmit = async (data: UpdateObservacion) => {
    try {
      let imagenUrl: string | undefined = undefined;

      // PASO 1: Si hay nueva imagen, subirla primero
      if (data.imagen) {
        toast.info("Subiendo imagen...");
        try {
          imagenUrl = await storageService.uploadFile(data.imagen);
          toast.success("Imagen subida correctamente");
        } catch (error) {
          toast.error("Error al subir la imagen");
          throw error;
        }
      }

      // PASO 2: Actualizar observación con la URL (si se subió nueva imagen)
      const { imagen, ...rest } = data;
      const updateData: UpdateObservacion = {
        ...rest,
        ...(imagenUrl && { imagenEvidencia: imagenUrl }), // Solo incluir si se subió nueva imagen
      };

      await onSubmit(updateData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Editar Observación" onClose={onClose} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  placeholder="Ej: Botón no responde"
                  {...register("asunto", { required: true })}
                />
                {errors.asunto && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="categoria">Categoría</Label>
                <Controller
                  name="categoria"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriaObservacionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoria && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe detalladamente..."
                rows={4}
                {...register("descripcion", { required: true })}
              />
              {errors.descripcion && (
                <span className="text-xs text-red-500">Campo requerido</span>
              )}
            </FormGroup>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="canal">Canal</Label>
                <Controller
                  name="canal"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Canal" />
                      </SelectTrigger>
                      <SelectContent>
                        {canalObservacionOptions.map((option) => (
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
                <Label htmlFor="prioridad">Prioridad</Label>
                <Controller
                  name="prioridad"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        {prioridadObservacionOptions.map((option) => (
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
                <Label htmlFor="estado">Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoObservacionOptions.map((option) => (
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
              <Label>Imagen</Label>
              <Controller
                name="imagen" // Ensure UpdateObservacion has 'imagen'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUpload
                    value={value}
                    onChange={onChange}
                    previewUrl={
                      observacion.imagenEvidencia
                        ? observacion.imagenEvidencia
                        : undefined
                    }
                  />
                )}
              />
            </FormGroup>
          </ModalBody>

          <UpdateButtons
            onClose={onClose}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
          />
        </form>
      </Modal>
    </ModalContainer>
  );
};
