import { useState, useRef } from "react";
import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  SubmitButtons,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { clienteService } from "@/services/cliente.service";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<any>;
}

export const ImportarClientesModal = ({ isOpen, onClose, onImport }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    success: number;
    failed: number;
    errors: { row: number; message: string }[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const handleDownloadTemplate = async () => {
    try {
      await clienteService.downloadTemplate();
      toast.success("Plantilla descargada correctamente");
    } catch (error) {
      toast.error("Error al descargar la plantilla");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!file || !user?.idUsuario) return;

    setIsLoading(true);
    try {
      const data = await onImport(file);
      setResults(data);
      if (data.success > 0) {
        toast.success(`Se importaron ${data.success} clientes correctamente`);
        // No need to call onSuccess, parent handles it via standard query flow if needed
      }
      if (data.failed > 0) {
        toast.warning(`Fallaron ${data.failed} registros`);
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Error al importar clientes";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResults(null);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={handleClose} size="md">
      <Modal>
        <ModalHeader title="Importar Clientes" onClose={handleClose} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImport();
          }}
        >
          <ModalBody>
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Plantilla de Importación
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Descarga el formato requerido
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  type="button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </div>

              <div
                className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {file ? file.name : "Click para seleccionar archivo Excel"}
                  </span>
                  {!file && (
                    <span className="text-xs text-muted-foreground">
                      Soporta .xlsx y .xls
                    </span>
                  )}
                </div>
              </div>

              {results && (
                <div className="space-y-3 mt-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-md">
                      <div className="font-bold">{results.total}</div>
                      <div className="text-xs">Total</div>
                    </div>
                    <div className="p-2 bg-green-50 text-green-700 rounded-md">
                      <div className="font-bold">{results.success}</div>
                      <div className="text-xs">Exitosos</div>
                    </div>
                    <div className="p-2 bg-red-50 text-red-700 rounded-md">
                      <div className="font-bold">{results.failed}</div>
                      <div className="text-xs">Fallidos</div>
                    </div>
                  </div>

                  {results.errors.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border rounded-md p-2 text-xs text-red-600 bg-red-50">
                      <p className="font-semibold mb-1">Errores:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {results.errors.map((err, idx) => (
                          <li key={idx}>
                            Fila {err.row}: {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ModalBody>

          {results ? (
            <div className="flex justify-end">
              <Button onClick={handleClose} type="button">
                Cerrar
              </Button>
            </div>
          ) : (
            <SubmitButtons
              isSubmitting={isLoading}
              onClose={handleClose}
              label="Importar"
              loading="Importando..."
            />
          )}
        </form>
      </Modal>
    </ModalContainer>
  );
};
