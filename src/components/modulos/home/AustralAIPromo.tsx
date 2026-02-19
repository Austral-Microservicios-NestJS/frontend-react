import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ShinyText from "@/components/ui/ShinyText";

export const AustralAIPromo = () => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg text-white h-full min-h-[180px] flex flex-col justify-between p-5 group bg-slate-900">
      {/* Animated blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-[70px] opacity-40 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-[70px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-[70px] opacity-40 animate-blob animation-delay-4000" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/70 via-slate-900/30 to-transparent z-0 pointer-events-none" />

      {/* Logo grande a la derecha, mitad visible */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-70 h-70 opacity-20 pointer-events-none z-0">
        <img
          src="/images/logo-austral-main.png"
          alt=""
          className="w-full h-full object-contain invert brightness-0"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full gap-6">
        {/* Title + description */}
        <div>
          <h2 className="text-4xl font-black leading-none tracking-tight mb-3">
            <ShinyText
              text="Austral AI"
              disabled={false}
              speed={2}
              className=""
              color="#d1d5db"
              shineColor="#ffffff"
            />
          </h2>
          <p className="text-white/55 text-sm font-medium leading-snug max-w-48">
            Analiza pólizas, gestiona documentos y automatiza tareas con IA.
          </p>
        </div>

        {/* CTA */}
        <Link to="/dashboard/agentes-ia/austral-ai" className="w-fit">
          <div className="relative group/btn">
            <span className="absolute inset-0 aurora-bg rounded-lg opacity-90 pointer-events-none" />
            <button className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg bg-transparent text-white font-bold text-sm hover:bg-white/10 transition-all shadow-lg">
              <Sparkles className="w-4 h-4" />
              Probar ahora
              <ArrowRight className="w-4 h-4 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};
