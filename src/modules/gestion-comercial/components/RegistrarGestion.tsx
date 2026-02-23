import { useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  FormGroup,
  FormGroupDivisor,
} from "@/components/shared";
import {
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import {
  GestionCanal,
  GestionEstado,
  GestionPrioridad,
  GestionTipo,
  gestionCanalOptions,
  gestionEstadoOptions,
  gestionPrioridadOptions,
  gestionTipoOptions,
  type CreateGestion,
} from "../gestion-comercial.types";
import type { User } from "@/store/auth.store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGestion) => Promise<void>;
  user: User;
}

export const RegistrarGestion = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateGestion>({
    defaultValues: {
      tipo: GestionTipo.LLAMADA,
      estado: GestionEstado.PENDIENTE,
      prioridad: GestionPrioridad.MEDIA,
      canal: GestionCanal.VIRTUAL,
      idAsesor: user.idUsuario,
      idCliente: "",
      descripcion: "",
      meetLink: "",
      idPoliza: "",
      idSiniestro: "",
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: CreateGestion) => {
    // Limpiar campos vacíos opcionales
    const payload: CreateGestion = {
      ...data,
      idPoliza: data.idPoliza || undefined,
      idSiniestro: data.idSiniestro || undefined,
      meetLink: data.meetLink || undefined,
      fechaProgramada: data.fechaProgramada || undefined,
      fechaVencimiento: data.fechaVencimiento || undefined,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Gestión" onClose={onClose} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            {/* Tipo + Canal */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="tipo">Tipo de Gestión</Label>
                <Controller
                  name="tipo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionTipoOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tipo && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="canal">Canal</Label>
                <Controller
                  name="canal"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el canal" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionCanalOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
            </FormGroupDivisor>

            {/* Descripción */}
            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe la gestión..."
                rows={3}
                {...register("descripcion")}
              />
            </FormGroup>

            {/* Prioridad + Estado */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="prioridad">Prioridad</Label>
                <Controller
                  name="prioridad"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionPrioridadOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
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
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionEstadoOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
            </FormGroupDivisor>

            {/* Fechas */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="fechaProgramada">Fecha Programada</Label>
                <Input
                  id="fechaProgramada"
                  type="datetime-local"
                  {...register("fechaProgramada")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                <Input
                  id="fechaVencimiento"
                  type="datetime-local"
                  {...register("fechaVencimiento")}
                />
              </FormGroup>
            </FormGroupDivisor>

            {/* ID Cliente */}
            <FormGroup>
              <Label htmlFor="idCliente">ID Cliente</Label>
              <Input
                id="idCliente"
                placeholder="UUID del cliente"
                {...register("idCliente", { required: true })}
              />
              {errors.idCliente && (
                <span className="text-xs text-red-500">Campo requerido</span>
              )}
            </FormGroup>

            {/* Meet link */}
            <FormGroup>
              <Label htmlFor="meetLink">Enlace de Reunión (opcional)</Label>
              <Input
                id="meetLink"
                placeholder="https://meet.google.com/..."
                {...register("meetLink")}
              />
            </FormGroup>

            {/* IDs opcionales */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="idPoliza">ID Póliza (opcional)</Label>
                <Input
                  id="idPoliza"
                  placeholder="UUID de la póliza"
                  {...register("idPoliza")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="idSiniestro">ID Siniestro (opcional)</Label>
                <Input
                  id="idSiniestro"
                  placeholder="UUID del siniestro"
                  {...register("idSiniestro")}
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
              Guardar
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
