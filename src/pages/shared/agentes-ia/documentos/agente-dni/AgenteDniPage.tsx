import { useState } from "react";
import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { useAgenteDni } from "@/hooks/useAgenteDni";
import { FormularioDni } from "@/components/modulos/agentes-ia/agente-dni/FormularioDni";
import { VistaPreviaDni } from "@/components/modulos/agentes-ia/agente-dni/VistaPreviaDni";
import { TablaDniRecords } from "@/components/modulos/agentes-ia/agente-dni/TablaDniRecords";
import {
  UploadCloud,
  Loader2,
  FileCheck,
  Trash2,
  Save,
  Sparkles,
} from "lucide-react";
import type { DniRecord } from "@/types/agente-dni.interface";

export default function AgenteDniPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [viewingRecord, setViewingRecord] = useState<DniRecord | null>(null);

  const {
    formData,
    setFormData,
    isProcessing,
    selectedFile,
    previewUrl,
    hasProcessed,
    editingRecordId,
    userRecords,
    handleFileSelect,
    processImage,
    saveRecord,
    editRecord,
    deleteRecord,
    resetForm,
  } = useAgenteDni();

  return (
    <>
      <Header
        title="Agente DNI"
        description="Extrae datos de documentos de identidad usando IA"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="p-6 space-y-6">
        {/* Sección de Upload y Procesamiento */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles
              className="w-5 h-5"
              style={{ color: "var(--austral-azul)" }}
            />
            Procesar Documento
          </h2>

          <div className="space-y-4">
            {/* Upload de archivo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Haz clic para seleccionar una imagen del DNI
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG o WebP (máx. 10MB)
                </span>
              </label>
            </div>

            {/* Vista previa y botones */}
            {previewUrl && (
              <div className="space-y-4">
                <VistaPreviaDni previewUrl={previewUrl} />

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={processImage}
                    disabled={isProcessing || hasProcessed}
                    className="px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--austral-azul)" }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Extraer Datos
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formulario de datos extraídos */}
        {hasProcessed && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-green-600" />
              Datos Extraídos
              {editingRecordId && (
                <span className="text-sm text-gray-500">
                  (Editando registro)
                </span>
              )}
            </h2>

            <FormularioDni
              formData={formData}
              onChange={setFormData}
              disabled={isProcessing}
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={saveRecord}
                className="px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                style={{ backgroundColor: "var(--austral-verde)" }}
              >
                <Save className="w-4 h-4" />
                {editingRecordId ? "Actualizar Registro" : "Guardar Registro"}
              </button>

              {editingRecordId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabla de registros guardados */}
        {userRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Registros Guardados ({userRecords.length})
            </h2>

            <TablaDniRecords
              records={userRecords}
              onEdit={editRecord}
              onDelete={deleteRecord}
              onView={setViewingRecord}
            />
          </div>
        )}

        {/* Modal de visualización */}
        {viewingRecord && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewingRecord(null)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">
                Detalle del Registro
              </h3>

              {viewingRecord.imagePreview && (
                <div className="mb-4">
                  <VistaPreviaDni previewUrl={viewingRecord.imagePreview} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">DNI:</span>{" "}
                  {viewingRecord.numeroDni}
                </div>
                <div>
                  <span className="font-semibold">Sexo:</span>{" "}
                  {viewingRecord.sexo === "M" ? "Masculino" : "Femenino"}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Nombres:</span>{" "}
                  {viewingRecord.nombres}
                </div>
                <div>
                  <span className="font-semibold">Apellido Paterno:</span>{" "}
                  {viewingRecord.apellidoPaterno}
                </div>
                <div>
                  <span className="font-semibold">Apellido Materno:</span>{" "}
                  {viewingRecord.apellidoMaterno}
                </div>
                <div>
                  <span className="font-semibold">Estado Civil:</span>{" "}
                  {viewingRecord.estadoCivil}
                </div>
                <div>
                  <span className="font-semibold">Fecha Nacimiento:</span>{" "}
                  {viewingRecord.fechaNacimiento}
                </div>
                <div>
                  <span className="font-semibold">Fecha Emisión:</span>{" "}
                  {viewingRecord.fechaEmision}
                </div>
                <div>
                  <span className="font-semibold">Fecha Caducidad:</span>{" "}
                  {viewingRecord.fechaCaducidad}
                </div>
              </div>

              <button
                onClick={() => setViewingRecord(null)}
                className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
