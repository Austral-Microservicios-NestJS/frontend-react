import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Car, Stethoscope, Heart, HardHat, FileText, Activity, Shield } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalFooter,
} from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, CreateLead } from "@/types/lead.interface";
import {
  EstadoLead,
  PrioridadLead,
  FuenteLead,
  TipoSeguro,
  estadoLeadOptions,
  prioridadLeadOptions,
  fuenteLeadOptions,
  tipoSeguroOptions,
} from "@/types/lead.interface";

interface RegistrarLeadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLead) => Promise<void>;
  leadToEdit?: Lead | null;
}

export const RegistrarLead = ({
  isOpen,
  onClose,
  onSubmit,
  leadToEdit,
}: RegistrarLeadProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateLead>({
    defaultValues: {
      estado: EstadoLead.NUEVO,
      prioridad: PrioridadLead.MEDIA,
      fuente: FuenteLead.FORMULARIO_WEB,
      tipoSeguro: TipoSeguro.AUTO,
    },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (leadToEdit) {
      setValue("nombre", leadToEdit.nombre);
      setValue("email", leadToEdit.email || "");
      setValue("telefono", leadToEdit.telefono || "");
      setValue("empresa", leadToEdit.empresa || "");
      setValue("cargo", leadToEdit.cargo || "");
      setValue("fuente", leadToEdit.fuente);
      setValue("estado", leadToEdit.estado);
      setValue("prioridad", leadToEdit.prioridad);
      setValue("tipoSeguro", leadToEdit.tipoSeguro);
      setValue("valorEstimado", leadToEdit.valorEstimado || "");
      setValue("notas", leadToEdit.notas || "");
    } else {
      reset({
        estado: EstadoLead.NUEVO,
        prioridad: PrioridadLead.MEDIA,
        fuente: FuenteLead.FORMULARIO_WEB,
        tipoSeguro: TipoSeguro.AUTO,
      });
    }
  }, [leadToEdit, setValue, reset]);

  const handleFormSubmit = async (data: CreateLead) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error al guardar lead:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const estado = watch("estado");
  const prioridad = watch("prioridad");
  const fuente = watch("fuente");
  const tipoSeguro = watch("tipoSeguro");

  // Mapear iconos para tipos de seguro
  const getTipoSeguroIcon = (tipo: string) => {
    const iconMap: Record<string, any> = {
      AUTO: Car,
      SALUD: Stethoscope,
      VIDA: Heart,
      SCTR: HardHat,
      VIDA_LEY: FileText,
      EPS: Activity,
      SOAT: Shield,
      OTRO: FileText,
    };
    return iconMap[tipo] || FileText;
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={handleClose} size="lg">
      <Modal>
        <ModalHeader
          title={leadToEdit ? "Editar Lead" : "Registrar Lead"}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nombre">
                  Nombre Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  {...register("nombre", {
                    required: "El nombre es requerido",
                  })}
                  placeholder="Juan Pérez García"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="juan@example.com"
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  {...register("telefono")}
                  placeholder="987654321"
                />
              </div>

              <div>
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  {...register("empresa")}
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  {...register("cargo")}
                  placeholder="Gerente General"
                />
              </div>
            </div>
            </div>

            {/* Clasificación del Lead */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Clasificación del Lead</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoSeguro">
                  Tipo de Seguro <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={tipoSeguro}
                  onValueChange={(value) => setValue("tipoSeguro", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de seguro" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoSeguroOptions.map((option) => {
                      const Icon = getTipoSeguroIcon(option.value);
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fuente">
                  Fuente <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={fuente}
                  onValueChange={(value) => setValue("fuente", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuenteLeadOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estado">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={estado}
                  onValueChange={(value) => setValue("estado", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadoLeadOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${option.color}`}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prioridad">
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={prioridad}
                  onValueChange={(value) =>
                    setValue("prioridad", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {prioridadLeadOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${option.color}`}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Información Adicional</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="valorEstimado">Valor Estimado (S/)</Label>
                <Input
                  id="valorEstimado"
                  type="text"
                  {...register("valorEstimado")}
                  placeholder="1500.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ingrese solo números y decimales
                </p>
              </div>

              <div>
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  {...register("notas")}
                  placeholder="Información adicional sobre el lead..."
                  rows={4}
                />
              </div>
            </div>
            </div>

            {/* Información sobre detalles */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm mb-1">
                  Información específica del seguro
                </h4>
                <p className="text-blue-800 text-xs">
                  Los detalles específicos de cada tipo de seguro (auto, salud, vida, etc.)
                  se agregarán después de crear el lead inicial. Por ahora, completa la
                  información básica de contacto y clasificación.
                </p>
              </div>
            </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Guardando..."
                : leadToEdit
                ? "Actualizar"
                : "Registrar"}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
