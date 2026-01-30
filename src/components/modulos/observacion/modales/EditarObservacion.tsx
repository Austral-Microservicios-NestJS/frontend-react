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
    await onSubmit(data);
    onClose();
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
                      observacion.imagenUrl
                        ? `${
                            import.meta.env.VITE_API_URL ||
                            "http://localhost:3000/api/v1"
                          }/observacion/image?path=${observacion.imagenUrl}`
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
