import { useAuthStore } from "@/store/auth.store";

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Imagen de construcción en la parte inferior derecha */}
      <div className="absolute -bottom-60 -right-10 md:-bottom-20 md:right-5 lg:top-3 lg:right-20 w-full h-full pointer-events-none">
        <img
          src="/images/torrebg.png"
          alt="Construcción"
          className="absolute bottom-0 right-0 h-full w-auto object-contain opacity-20 animate-fade-in-delay-2"
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-20 py-12">
          <div className="max-w-3xl space-y-10">
            {/* Logo y marca */}
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="bg-amber-900 w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center p-3 shadow-lg">
                <img
                  src="/images/bdlogowhite.webp"
                  alt="Betondecken Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Austral
                </h2>
                <p className="text-amber-700 text-sm lg:text-base font-medium">
                  Sistema de Gestión Integral
                </p>
              </div>
            </div>

            {/* Mensaje de bienvenida */}
            <div className="animate-fade-in-delay-1 space-y-6">
              <div className="inline-block">
                <span className="text-amber-600 text-lg lg:text-xl font-semibold tracking-wide uppercase">
                  Bienvenido
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                {user?.nombreUsuario}
              </h1>
              <div className="h-1.5 w-32 bg-linear-to-r from-amber-600 to-amber-800 rounded-full" />
            </div>

            {/* Información del rol */}
            <div className="animate-fade-in-delay-2">
              <div className="inline-flex items-center gap-3 bg-linear-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 px-6 py-4 rounded-lg shadow-md">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-gray-600 text-xs uppercase tracking-wider font-semibold">
                    Rol actual
                  </p>
                  <p className="text-gray-900 text-lg font-bold">{user?.rol.nombreRol}</p>
                </div>
              </div>
            </div>

            {/* Card de instrucciones */}
            <div className="animate-fade-in-delay-3">
              <div className="bg-transparent rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center">
                      <span className="text-amber-700 text-xl font-bold">
                        →
                      </span>
                    </div>
                    <h3 className="text-gray-900 text-lg font-bold">
                      Comienza ahora
                    </h3>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Utiliza el menú lateral para navegar entre los diferentes
                    módulos <br /> del sistema disponibles según tu rol y
                    permisos asignados.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="animate-fade-in-delay-4 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                © 2025 Betondecken. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
