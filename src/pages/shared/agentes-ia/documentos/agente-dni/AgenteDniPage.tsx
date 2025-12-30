import { useState } from "react";
import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { useAgenteDni } from "@/hooks/useAgenteDni";
import { useAuthStore } from "@/store/auth.store";
import { FormularioDni } from "@/components/modulos/agentes-ia/agente-dni/FormularioDni";
import { VistaPreviaDni } from "@/components/modulos/agentes-ia/agente-dni/VistaPreviaDni";
import { TablaDniRecords } from "@/components/modulos/agentes-ia/agente-dni/TablaDniRecords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportDniRecordsToExcel } from "@/utils/export-excel";
import {
  UploadCloud,
  Loader2,
  FileCheck,
  Sparkles,
  FileSpreadsheet,
  Save,
} from "lucide-react";
import type { DniRecord } from "@/types/agente-dni.interface";
import { toast } from "sonner";

export default function AgenteDniPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const [viewingRecord, setViewingRecord] = useState<DniRecord | null>(null);

  const {
    formData,
    setFormData,
    isProcessing,
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

  const handleExportToExcel = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para exportar");
      return;
    }

    try {
      exportDniRecordsToExcel(user.idUsuario);
      toast.success("Excel descargado correctamente");
    } catch (error: any) {
      toast.error(error.message || "Error al exportar");
    }
  };

  return (
    <>
      <Header
        title="Agente DNI"
        description="Procesa y analiza documentos DNI automáticamente"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <Button
          onClick={handleExportToExcel}
          disabled={userRecords.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
      </Header>

      <div className="space-y-6 mt-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Upload Area */}
          <Card className="flex flex-col lg:col-span-1">
            <CardHeader>
              <CardTitle>Subir Imagen</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-6">
              {!previewUrl ? (
                <label
                  htmlFor="file-upload"
                  className="w-full h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] border-2 border-dashed rounded-xl border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <div className="p-4 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-[--austral-azul] transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-700">
                      Sube el DNI aquí
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 text-center max-w-xs px-2">
                      Arrastra y suelta la imagen del DNI aquí, o haz clic para
                      seleccionar
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isProcessing}
                  />
                </label>
              ) : (
                <div className="w-full h-full flex flex-col gap-4">
                  <div className="relative w-full h-[300px] rounded-xl overflow-hidden border-2 border-blue-200">
                    <img
                      src={previewUrl}
                      alt="DNI Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {!hasProcessed ? (
                    <Button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="w-full"
                      style={{ backgroundColor: "var(--austral-azul)" }}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Procesar Documento
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700 font-medium">
                        Documento procesado
                      </span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Subir otro documento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Information Form */}
          <Card className="flex flex-col lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Información Extraída
                {hasProcessed && (
                  <FileCheck className="h-5 w-5 text-green-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormularioDni
                formData={formData}
                onChange={setFormData}
                disabled={isProcessing}
              />

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={saveRecord}
                  disabled={isProcessing || !formData.numeroDni}
                  style={{ backgroundColor: "var(--austral-verde)" }}
                  className="text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingRecordId
                    ? "Actualizar Información"
                    : "Guardar Información"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Records Section */}
        {userRecords.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Registros Recientes
                </h2>
                <p className="text-gray-500">
                  Documentos DNI procesados recientemente
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {userRecords.length}{" "}
                {userRecords.length === 1 ? "registro" : "registros"}
              </div>
            </div>

            <TablaDniRecords
              records={userRecords}
              onEdit={editRecord}
              onDelete={deleteRecord}
              onView={setViewingRecord}
            />
          </div>
        )}

        {/* View Modal */}
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
