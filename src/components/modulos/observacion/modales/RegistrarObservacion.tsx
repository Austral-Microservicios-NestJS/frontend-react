import { useEffect, useState } from "react";
import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  FormGroupDivisor,
  SubmitButtons,
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
  CategoriaObservacion,
  PrioridadObservacion,
  CanalObservacion,
  EstadoObservacion,
  type CreateObservacion,
} from "@/types/observacion.interface";
import type { User } from "@/store/auth.store";
import { storageService } from "@/services/storage.service";
import { toast } from "sonner";

interface RegistrarObservacionProps {
  isOpen: boolean;
  onClose: () => void;
  addObservacion: (data: Omit<CreateObservacion, "creadoPor">) => Promise<void>;
  user: User;
}

export const RegistrarObservacion = ({
  isOpen,
  onClose,
  addObservacion,
  user,
}: RegistrarObservacionProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateObservacion>({
    defaultValues: {
      asunto: "",
      descripcion: "",
      categoria: CategoriaObservacion.BUG,
      prioridad: PrioridadObservacion.MEDIA,
      canal: CanalObservacion.SISTEMA,
      estado: EstadoObservacion.PENDIENTE,
      creadoPor: user.idUsuario,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
      setIsSubmitting(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateObservacion) => {
    setIsSubmitting(true);
    try {
      let imagenUrl: string | undefined = undefined;

      // PASO 1: Si hay imagen, subirla primero al storage
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

      // PASO 2: Crear la observación con la URL de la imagen (si existe)
      const { imagen, creadoPor, ...rest } = data;
      const observacionData = {
        ...rest,
        imagenEvidencia: imagenUrl, // Incluir la URL si se subió la imagen
      };

      await addObservacion(observacionData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Nueva Observación" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  placeholder="Ej: Botón no responde en módulo ventas"
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
                placeholder="Describe detalladamente la observación..."
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
                {errors.canal && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
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
                {errors.prioridad && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
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
                {errors.estado && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label>Imagen de evidencia</Label>
              <Controller
                name="imagen"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUpload value={value} onChange={onChange} />
                )}
              />
            </FormGroup>
          </ModalBody>

          <SubmitButtons onClose={onClose} isSubmitting={isSubmitting} />
        </form>
      </Modal>
    </ModalContainer>
  );
};
