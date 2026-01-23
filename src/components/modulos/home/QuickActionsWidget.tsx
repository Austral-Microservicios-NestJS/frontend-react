import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, UserPlus, PlusCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActionsWidget = () => {
  const actions = [
    {
      label: "Crear cliente",
      icon: UserPlus,
      className:
        "bg-green-50 border-green-100 hover:bg-green-600 hover:shadow-green-200",
      iconClassName:
        "bg-white text-green-600 group-hover:bg-white/20 group-hover:text-white",
      textClassName: "text-green-700 group-hover:text-white",
      link: "/dashboard/gestion-trabajo/clientes",
    },
    {
      label: "Crear póliza",
      icon: FilePlus2,
      className:
        "bg-indigo-50 border-indigo-100 hover:bg-indigo-600 hover:shadow-indigo-200",
      iconClassName:
        "bg-white text-indigo-600 group-hover:bg-white/20 group-hover:text-white",
      textClassName: "text-indigo-700 group-hover:text-white",
      link: "/dashboard/gestion-trabajo/polizas",
    },
    {
      label: "Crear lead",
      icon: PlusCircle,
      className:
        "bg-blue-50 border-blue-100 hover:bg-blue-600 hover:shadow-blue-200",
      iconClassName:
        "bg-white text-blue-600 group-hover:bg-white/20 group-hover:text-white",
      textClassName: "text-blue-700 group-hover:text-white",
      link: "/dashboard/gestion-trabajo/leads",
    },
  ];

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-gray-200 bg-white relative overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2 ml-1">
          <Zap className="w-5 h-5 text-amber-500" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex flex-col gap-2.5 h-full justify-center">
          {actions.map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 relative overflow-hidden shadow-sm ${action.className}`}
            >
              <div
                className={`p-2 rounded-lg transition-colors duration-300 shrink-0 shadow-sm ${action.iconClassName}`}
              >
                <action.icon className="w-5 h-5" />
              </div>
              <span
                className={`text-base font-bold transition-colors ${action.textClassName}`}
              >
                {action.label}
              </span>

              {/* Hover Arrow */}
              <div className="absolute right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
