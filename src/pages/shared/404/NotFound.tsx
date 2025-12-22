import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Número 404 grande */}
        <div className="mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-amber-800 leading-none">
            404
          </h1>
        </div>

        {/* Icono de búsqueda */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 opacity-20 blur-xl rounded-full"></div>
            <div className="relative bg-white rounded-full p-6 shadow-lg">
              <Search className="w-16 h-16 text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Mensaje principal */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-amber-500 hover:text-amber-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            Volver atrás
          </button>

          <button
            onClick={handleGoHome}
            className="group flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-600 to-amber-500 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            Ir al inicio
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si crees que esto es un error, por favor contacta al soporte
            técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
