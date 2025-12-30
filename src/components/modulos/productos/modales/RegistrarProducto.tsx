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
import {
  Input,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import type { CreateProductoDto } from "@/types/producto.interface";
import { useCompanias } from "@/hooks/useCompanias";
import { useRamos } from "@/hooks/useRamos";

interface RegistrarProductoProps {
  isOpen: boolean;
  onClose: () => void;
  addProducto: (data: CreateProductoDto) => Promise<void>;
  idRamo?: string; // Opcional: si viene de la página de ramo, prellenar
}

export const RegistrarProducto = ({
  isOpen,
  onClose,
  addProducto,
  idRamo,
}: RegistrarProductoProps) => {
  const { companias } = useCompanias();
  const { ramos } = useRamos();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateProductoDto>({
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      idCompania: "",
      idRamo: idRamo || "",
      esObligatorio: false,
      activo: true,
    },
  });

  // Resetear formulario cuando el modal se cierra o cuando cambia idRamo
  useEffect(() => {
    if (!isOpen) {
      reset();
    } else if (idRamo) {
      // Si hay idRamo, actualizar el formulario
      reset({
        codigo: "",
        nombre: "",
        descripcion: "",
        idCompania: "",
        idRamo: idRamo,
        esObligatorio: false,
        activo: true,
      });
    }
  }, [isOpen, reset, idRamo]);

  const onSubmit = async (data: CreateProductoDto) => {
    await addProducto(data);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Nuevo Producto" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  placeholder="Ej: PROD-001"
                  maxLength={11}
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
                  placeholder="Ej: Seguro Todo Riesgo"
                  {...register("nombre", { required: true })}
                />
                {errors.nombre && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="idCompania">Compañía</Label>
                <Controller
                  name="idCompania"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar compañía..." />
                      </SelectTrigger>
                      <SelectContent>
                        {companias.map((compania) => (
                          <SelectItem
                            key={compania.idCompania}
                            value={compania.idCompania}
                          >
                            {compania.nombreComercial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idCompania && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="idRamo">Ramo</Label>
                <Controller
                  name="idRamo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar ramo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ramos.map((ramo) => (
                          <SelectItem key={ramo.idRamo} value={ramo.idRamo}>
                            {ramo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idRamo && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el producto..."
                rows={4}
                {...register("descripcion", { required: true })}
              />
              {errors.descripcion && (
                <span className="text-xs text-red-500">Campo requerido</span>
              )}
            </FormGroup>

            <FormGroupDivisor>
              <FormGroup>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="esObligatorio"
                    {...register("esObligatorio")}
                  />
                  <Label
                    htmlFor="esObligatorio"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Es obligatorio
                  </Label>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activo" {...register("activo")} />
                  <Label
                    htmlFor="activo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Activo
                  </Label>
                </div>
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
