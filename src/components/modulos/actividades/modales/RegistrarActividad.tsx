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
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import { tipoActividadOptions } from "@/types/actividad.interface";
import type { User } from "@/store/auth.store";
import { useEffect } from "react";

interface RegistrarActividadProps {
  isOpen: boolean;
  onClose: () => void;
  addActividad: (data: any) => Promise<void>;
  user: User;
}

export const RegistrarActividad = ({
  isOpen,
  onClose,
  addActividad,
  user,
}: RegistrarActividadProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {},
  } = useForm({
    defaultValues: {
      titulo: "",
      tipoActividad: "",
      fechaActividad: "",
      descripcion: "",
      creadaPor: user.idUsuario,
    },
  });

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: any) => {
    await addActividad(data);
    onClose();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      onAfterClose={() => reset()}
    >
      <Modal>
        <ModalHeader title="Registrar Nueva Actividad" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Reunion con el equipo"
                  {...register("titulo", { required: true })}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="tipoActividad">Tipo de Actividad</Label>
                <Controller
                  name="tipoActividad"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoActividadOptions.map((option) => (
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="fechaActividad">Fecha de actividad</Label>
              <Input
                id="fechaActividad"
                type="date"
                {...register("fechaActividad", { required: true })}
              />
            </div>
            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Ej: Discutir los próximos pasos del proyecto"
                {...register("descripcion", { required: true })}
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
