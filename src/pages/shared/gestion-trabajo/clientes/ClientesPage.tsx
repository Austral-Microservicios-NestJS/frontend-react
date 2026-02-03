import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/auth.store";
import { RegistrarCliente } from "@/components/modulos/clientes/modales/RegistrarCliente";
import { EditarCliente } from "@/components/modulos/clientes/modales/EditarCliente";
import { useClientes } from "@/hooks/useCliente";
import { TablaClientes } from "@/components/modulos/clientes/tablas/TablaClientes";
import { ImportarClientesModal } from "@/components/modulos/clientes/modales/ImportarClientesModal";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Cliente, UpdateCliente } from "@/types/cliente.interface";

export default function ClientesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [isImportarOpen, setIsImportarOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [leadInitialValues, setLeadInitialValues] = useState<
    Partial<any> | undefined
  >(undefined);
  const { user } = useAuthStore();
  const { clientes, addCliente, updateCliente, importarClientes } =
    useClientes();
  const location = useLocation();

  // Auto-abrir modal con datos del lead si viene desde LeadDetail
  useEffect(() => {
    const state = location.state as {
      leadInitialValues?: Record<string, any>;
    } | null;
    if (state?.leadInitialValues) {
      setLeadInitialValues(state.leadInitialValues);
      setIsRegistrarOpen(true);
      // Limpiar el state del historial sin provocar re-render de React Router
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
  };

  const handleUpdate = async (data: UpdateCliente) => {
    if (editingCliente) {
      await updateCliente(editingCliente.idCliente, data);
    }
  };

  return (
    <>
      <Header
        title="Clientes"
        description="Gestiona tus clientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportarOpen(true)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importar Excel
          </Button>
          <BotonRegistro
            label="Registrar Cliente"
            onClick={() => setIsRegistrarOpen(true)}
          />
        </div>
      </Header>

      <TablaClientes clientes={clientes} onEdit={handleEdit} />

      <RegistrarCliente
        isOpen={isRegistrarOpen}
        onClose={() => {
          setIsRegistrarOpen(false);
          setLeadInitialValues(undefined);
        }}
        addCliente={addCliente}
        user={user!}
        initialValues={leadInitialValues}
      />

      <ImportarClientesModal
        isOpen={isImportarOpen}
        onClose={() => setIsImportarOpen(false)}
        onImport={importarClientes}
      />

      {editingCliente && (
        <EditarCliente
          isOpen={!!editingCliente}
          onClose={() => setEditingCliente(null)}
          onSubmit={handleUpdate}
          cliente={editingCliente}
        />
      )}
    </>
  );
}
