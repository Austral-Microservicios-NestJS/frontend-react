import { Clock, LogOut, RefreshCw } from 'lucide-react';

interface SessionWarningModalProps {
  minutesLeft: number;
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionWarningModal = ({ minutesLeft, onExtend, onLogout }: SessionWarningModalProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        {/* Ícono */}
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
          <Clock className="w-7 h-7 text-amber-600" />
        </div>

        {/* Texto */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Tu sesión está por expirar
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Por inactividad, la sesión se cerrará en{' '}
            <span className="font-semibold text-amber-600">
              {minutesLeft} {minutesLeft === 1 ? 'minuto' : 'minutos'}
            </span>.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ¿Deseas continuar trabajando?
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
          <button
            onClick={onExtend}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#003d5c] text-white text-sm font-medium hover:bg-[#004f78] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
