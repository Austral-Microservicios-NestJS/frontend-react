import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useInvoiceStore } from "@/store/invoice.store";
import { agenteFacturasApi } from "@/services/agente-facturas.service";
import type {
  InvoiceFormData,
  InvoiceRecord,
} from "@/types/agente-factura.interface";
import { toast } from "sonner";

const initialFormData: InvoiceFormData = {
  razonSocialEmisor: "",
  rucEmisor: "",
  razonSocialCliente: "",
  rucCliente: "",
  numeroFactura: "",
  fechaEmision: "",
  moneda: "",
  subtotal: "",
  igv: "",
  importeTotal: "",
  detalleItems: [],
};

export const useAgenteFacturas = () => {
  const { user } = useAuthStore();
  const { addRecord, updateRecord, removeRecord, getUserRecords } =
    useInvoiceStore();

  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  const userRecords = user ? getUserRecords(user.idUsuario) : [];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF or images)
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, sube un PDF o imagen (JPG, PNG, WebP).");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("El archivo no debe superar los 10MB.");
      return;
    }

    setSelectedFile(file);
    setHasProcessed(false);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const convertDateFormat = (dateStr: string | null): string => {
    if (!dateStr) return "";
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const processFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const result = await agenteFacturasApi.extractData(selectedFile);

      setFormData({
        razonSocialEmisor: result.razon_social_emisor || "",
        rucEmisor: result.ruc_emisor || "",
        razonSocialCliente: result.razon_social_cliente || "",
        rucCliente: result.ruc_cliente || "",
        numeroFactura: result.numero_factura || "",
        fechaEmision: convertDateFormat(result.fecha_emision),
        moneda: result.moneda || "",
        subtotal: result.sub_total_ventas?.toString() || "",
        igv: result.igv?.toString() || "",
        importeTotal: result.importe_total?.toString() || "",
        detalleItems:
          result.detalle_items?.map((item) => ({
            cantidad: item.cantidad,
            unidadMedida: item.unidad_medida,
            descripcion: item.descripcion,
            valorUnitario: item.valor_unitario,
          })) || [],
      });

      setHasProcessed(true);
      toast.success("Extracción completada");
    } catch (error: any) {
      console.error("Error processing invoice:", error);
      toast.error("Error al procesar el documento");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveRecord = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para guardar");
      return;
    }

    if (!formData.numeroFactura) {
      toast.error("El número de factura es requerido");
      return;
    }

    const recordData = {
      rucEmisor: formData.rucEmisor,
      razonSocialEmisor: formData.razonSocialEmisor,
      rucCliente: formData.rucCliente,
      razonSocialCliente: formData.razonSocialCliente,
      fechaEmision: formData.fechaEmision,
      numeroFactura: formData.numeroFactura,
      moneda: formData.moneda,
      subtotal: parseFloat(formData.subtotal) || 0,
      igv: parseFloat(formData.igv) || 0,
      importeTotal: parseFloat(formData.importeTotal) || 0,
      detalleItems: formData.detalleItems,
      imagePreview: previewUrl || undefined,
    };

    if (editingRecordId) {
      updateRecord(editingRecordId, recordData);
      toast.success("Información actualizada correctamente");
    } else {
      if (!selectedFile) {
        addRecord(user.idUsuario, recordData);
        toast.success("Información guardada correctamente");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          addRecord(user.idUsuario, {
            ...recordData,
            imagePreview: reader.result as string,
          });
          toast.success("Información guardada correctamente");
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const editRecord = (record: InvoiceRecord) => {
    setEditingRecordId(record.id);
    setFormData({
      razonSocialEmisor: record.razonSocialEmisor,
      rucEmisor: record.rucEmisor,
      razonSocialCliente: record.razonSocialCliente,
      rucCliente: record.rucCliente,
      numeroFactura: record.numeroFactura,
      fechaEmision: record.fechaEmision,
      moneda: record.moneda,
      subtotal: record.subtotal.toString(),
      igv: record.igv.toString(),
      importeTotal: record.importeTotal.toString(),
      detalleItems: record.detalleItems,
    });
    setPreviewUrl(record.imagePreview || null);
    setHasProcessed(true);
    toast.info("Registro cargado para edición");
  };

  const deleteRecord = (recordId: string) => {
    removeRecord(recordId);
    toast.success("Registro eliminado");
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setHasProcessed(false);
    setEditingRecordId(null);
    setFormData(initialFormData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return {
    formData,
    setFormData,
    isProcessing,
    selectedFile,
    previewUrl,
    hasProcessed,
    editingRecordId,
    userRecords,
    handleFileSelect,
    processFile,
    saveRecord,
    editRecord,
    deleteRecord,
    resetForm,
    formatFileSize,
  };
};
