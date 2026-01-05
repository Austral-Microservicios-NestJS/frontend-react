import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/auth.store";
import { RegistrarCliente } from "@/components/modulos/clientes/modales/RegistrarCliente";
import { EditarCliente } from "@/components/modulos/clientes/modales/EditarCliente";
import { useClientes } from "@/hooks/useCliente";
import { TablaClientes } from "@/components/modulos/clientes/tablas/TablaClientes";
import type { Cliente, UpdateCliente } from "@/types/cliente.interface";

export default function ClientesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const { user } = useAuthStore();
  const { clientes, addCliente, updateCliente } = useClientes();

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
        <BotonRegistro
          label="Registrar Cliente"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <TablaClientes clientes={clientes} onEdit={handleEdit} />

      <RegistrarCliente
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        addCliente={addCliente}
        user={user!}
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
