import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IdCard, FileText, FileCheck, ArrowRight } from "lucide-react";

interface AgenteDocumento {
  id: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: React.ReactNode;
  color: string;
}

const agentesDocumentos: AgenteDocumento[] = [
  {
    id: "agente-dni",
    nombre: "Agente DNI",
    descripcion:
      "Extrae automáticamente información de documentos de identidad como nombres, fechas y números de documento.",
    ruta: "/dashboard/agentes-ia/agente-dni",
    icono: <IdCard className="h-6 w-6" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "agente-factura",
    nombre: "Agente Facturas",
    descripcion:
      "Procesa facturas y extrae datos como emisor, montos, fechas de emisión y detalles de productos.",
    ruta: "/dashboard/agentes-ia/agente-facturas",
    icono: <FileText className="h-6 w-6" />,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "agente-poliza",
    nombre: "Agente Pólizas",
    descripcion:
      "Analiza pólizas de seguros para extraer coberturas, vigencias, asegurados y condiciones especiales.",
    ruta: "/dashboard/agentes-ia/agente-polizas",
    icono: <FileCheck className="h-6 w-6" />,
    color: "bg-violet-100 text-violet-600",
  },
];

export default function AgentesDocumentosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleNavigation = (ruta: string) => {
    navigate(ruta);
  };

  return (
    <>
      <Header
        title="Agentes de Documentos"
        description="Selecciona un agente de IA para procesar tus documentos"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="mt-6">
        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agentesDocumentos.map((agente) => (
            <Card
              key={agente.id}
              onClick={() => handleNavigation(agente.ruta)}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${agente.color} flex items-center justify-center mb-3`}
                >
                  {agente.icono}
                </div>
                <CardTitle className="text-lg">{agente.nombre}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600">
                  {agente.descripcion}
                </CardDescription>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span>Acceder</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
