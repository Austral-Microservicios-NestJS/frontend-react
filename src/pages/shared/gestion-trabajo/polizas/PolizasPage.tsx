import { useState, useMemo } from "react";
import { Header, BotonRegistro, ModalContainer, Modal, ModalHeader, ModalBody } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { TablaPolizas } from "@/components/modulos/polizas/tablas/TablaPolizas";
import { RegistrarPoliza } from "@/components/modulos/polizas";
import { usePolizas } from "@/hooks/usePolizas";
import { useAuthStore } from "@/store/auth.store";
import { clienteService } from "@/services/cliente.service";
import type { Cliente } from "@/types/cliente.interface";
import { Input } from "@/components/ui";
import { Search, User } from "lucide-react";

export default function PolizasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { polizas, addPoliza } = usePolizas();
  const { user } = useAuthStore();

  const [step, setStep] = useState<"idle" | "selecting" | "registrando">("idle");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar clientes para el selector
  const { data: clientesData } = clienteService.useGetAll({ page: 1, limit: 500 });
  const clientes: Cliente[] = clientesData?.data ?? [];

  const clientesFiltrados = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return clientes.slice(0, 50);
    return clientes.filter((c) => {
      const nombre = c.tipoPersona === "JURIDICO"
        ? (c.razonSocial ?? "")
        : `${c.nombres ?? ""} ${c.apellidos ?? ""}`.trim();
      return (
        nombre.toLowerCase().includes(q) ||
        String(c.numeroDocumento).includes(q)
      );
    }).slice(0, 50);
  }, [clientes, searchQuery]);

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setStep("registrando");
  };

  const handleClose = () => {
    setStep("idle");
    setClienteSeleccionado(null);
    setSearchQuery("");
  };

  return (
    <>
      <Header
        title="Gestión de Pólizas"
        description="Administra las pólizas de seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Nueva Póliza"
          onClick={() => setStep("selecting")}
        />
      </Header>

      <div className="mt-6">
        <TablaPolizas polizas={polizas} />
      </div>

      {/* Paso 1: Seleccionar cliente */}
      <ModalContainer
        isOpen={step === "selecting"}
        onClose={handleClose}
        size="md"
        position="center"
      >
        <Modal>
          <ModalHeader title="Seleccionar Cliente" onClose={handleClose} />
          <ModalBody>
            <p className="text-sm text-gray-500 mb-3">
              Busca y selecciona el cliente para registrar la póliza.
            </p>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o documento..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-200">
              {clientesFiltrados.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No se encontraron clientes
                </p>
              ) : (
                clientesFiltrados.map((cliente) => {
                  const nombre = cliente.tipoPersona === "JURIDICO"
                    ? cliente.razonSocial
                    : `${cliente.nombres ?? ""} ${cliente.apellidos ?? ""}`.trim();
                  return (
                    <button
                      key={cliente.idCliente}
                      type="button"
                      onClick={() => handleClienteSelect(cliente)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#003d5c]/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-[#003d5c]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {nombre}
                        </p>
                        <p className="text-xs text-gray-400">
                          {cliente.tipoDocumento}: {cliente.numeroDocumento}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ModalBody>
        </Modal>
      </ModalContainer>

      {/* Paso 2: Registrar póliza */}
      {user && clienteSeleccionado && (
        <RegistrarPoliza
          isOpen={step === "registrando"}
          onClose={handleClose}
          addPoliza={addPoliza}
          idCliente={clienteSeleccionado.idCliente}
          idUsuario={user.idUsuario}
          cliente={clienteSeleccionado}
        />
      )}
    </>
  );
}
