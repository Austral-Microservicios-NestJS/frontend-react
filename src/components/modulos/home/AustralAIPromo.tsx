import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ShinyText from "@/components/ui/ShinyText";

export const AustralAIPromo = () => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg text-white h-full min-h-[180px] flex flex-col justify-center p-5 md:p-6 group bg-slate-900">
      {/* Lava Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent z-0 pointer-events-none" />

      {/* Logo de Austral en el fondo (derecha) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-64 opacity-40 pointer-events-none z-0 mix-blend-overlay">
        <img
          src="/images/logo-austral-main.png"
          alt="Austral Logo"
          className="w-full h-full object-contain invert brightness-0"
        />
      </div>

      <div className="relative z-10 max-w-xl pl-1">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight drop-shadow-xl tracking-tight">
          <ShinyText
            text="Austral AI"
            disabled={false}
            speed={2}
            className=""
            color="#d1d5db"
            shineColor="#ffffff"
          />
        </h2>

        <p className="text-blue-100/90 mb-6 max-w-md text-sm md:text-base leading-relaxed drop-shadow-sm font-medium">
          Asistente inteligente para análisis de pólizas, gestión de documentos
          y automatización de tareas. El futuro de los seguros está aquí.
        </p>

        <Link to="/dashboard/agentes-ia/austral-ai">
          <Button
            size="default"
            className="bg-white text-blue-700 hover:bg-gray-200 hover:cursor-pointer border-none shadow-xl shadow-blue-900/20 font-bold text-sm px-6 py-5"
          >
            <Sparkles className="w-4 h-4 mr-2 text-blue-600 group-hover:text-blue-700" />
            Probar ahora
            <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
