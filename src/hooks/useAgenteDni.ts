import { useState } from "react";
import { toast } from "sonner";
import { agenteDniApi } from "@/services/agente-dni.service";
import { useDniStore } from "@/store/agente-dni.store";
import { useAuthStore } from "@/store/auth.store";
import type { DniData } from "@/types/agente-dni.interface";

const mapEstadoCivil = (estadoCivil: string | null): string => {
  if (!estadoCivil) return "";
  const lower = estadoCivil.toLowerCase();
  if (lower.includes("soltero")) return "SOLTERO";
  if (lower.includes("casado")) return "CASADO";
  if (lower.includes("divorciado")) return "DIVORCIADO";
  if (lower.includes("viudo")) return "VIUDO";
  return estadoCivil.toUpperCase();
};

export const useAgenteDni = () => {
  const { user } = useAuthStore();
  const { addRecord, updateRecord, getUserRecords, removeRecord } = useDniStore();
  const userRecords = user ? getUserRecords(user.idUsuario) : [];

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  const [formData, setFormData] = useState<DniData>({
    numeroDni: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    sexo: "",
    estadoCivil: "",
    fechaNacimiento: "",
    fechaEmision: "",
    fechaCaducidad: "",
  });

  const extractMutation = agenteDniApi.useExtractDni();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validar tipo de archivo (solo imágenes)
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Por favor, sube una imagen (JPG, PNG o WebP).", {
        duration: 5000,
      });
      return;
    }

    // Validar tamaño de archivo (máx 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("El archivo no debe superar los 10MB.", {
        duration: 5000,
      });
      return;
    }

    setSelectedFile(file);
    setHasProcessed(false);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const result = await extractMutation.mutateAsync(selectedFile);

      // Mapear respuesta de API a campos del formulario
      setFormData({
        numeroDni: result.numero_dni || "",
        apellidoPaterno: result.apellido_paterno || "",
        apellidoMaterno: result.apellido_materno || "",
        nombres: result.nombres || "",
        sexo: result.sexo || "",
        estadoCivil: mapEstadoCivil(result.estado_civil),
        fechaNacimiento: result.fecha_nacimiento || "",
        fechaEmision: result.fecha_emision || "",
        fechaCaducidad: result.fecha_caducidad || "",
      });

      setHasProcessed(true);

      toast.success("Extracción completada exitosamente", {
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error processing DNI:", error);
      toast.error("Error al procesar el documento", {
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveRecord = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para guardar", {
        duration: 3000,
      });
      return;
    }

    if (!formData.numeroDni) {
      toast.error("El DNI es requerido", {
        duration: 3000,
      });
      return;
    }

    const recordData = {
      ...formData,
      idUsuario: user.idUsuario,
      imagePreview: previewUrl || undefined,
    };

    if (editingRecordId) {
      updateRecord(editingRecordId, recordData);
      toast.success("Registro actualizado exitosamente", {
        duration: 3000,
      });
      setEditingRecordId(null);
    } else {
      addRecord(recordData);
      toast.success("Registro guardado exitosamente", {
        duration: 3000,
      });
    }

    resetForm();
  };

  const editRecord = (recordId: string) => {
    const record = userRecords.find((r) => r.id === recordId);
    if (!record) return;

    setFormData({
      numeroDni: record.numeroDni,
      apellidoPaterno: record.apellidoPaterno,
      apellidoMaterno: record.apellidoMaterno,
      nombres: record.nombres,
      sexo: record.sexo,
      estadoCivil: record.estadoCivil,
      fechaNacimiento: record.fechaNacimiento,
      fechaEmision: record.fechaEmision,
      fechaCaducidad: record.fechaCaducidad,
    });

    setPreviewUrl(record.imagePreview || null);
    setEditingRecordId(recordId);
    setHasProcessed(true);
  };

  const deleteRecord = (recordId: string) => {
    removeRecord(recordId);
    toast.success("Registro eliminado", {
      duration: 3000,
    });
  };

  const resetForm = () => {
    setFormData({
      numeroDni: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombres: "",
      sexo: "",
      estadoCivil: "",
      fechaNacimiento: "",
      fechaEmision: "",
      fechaCaducidad: "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setHasProcessed(false);
    setEditingRecordId(null);
  };

  return {
    // Estado
    formData,
    setFormData,
    isProcessing,
    selectedFile,
    previewUrl,
    hasProcessed,
    editingRecordId,
    userRecords,

    // Métodos
    handleFileSelect,
    processImage,
    saveRecord,
    editRecord,
    deleteRecord,
    resetForm,
  };
};
