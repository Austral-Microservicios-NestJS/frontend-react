import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/config/api-client';

const INACTIVITY_LIMIT  = 2 * 60 * 60 * 1000;   // 2 horas sin actividad → cerrar sesión
const WARNING_BEFORE    = 5 * 60 * 1000;          // advertir 5 min antes del cierre
const CHECK_INTERVAL    = 60 * 1000;              // revisar cada 1 minuto
const REFRESH_INTERVAL  = 30 * 60 * 1000;         // refrescar token cada 30 min si hay actividad

export const useSessionTimeout = () => {
  const { isAuthenticated, lastActivity, logout, updateActivity } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [minutesLeft, setMinutesLeft]  = useState(5);
  const lastRefreshRef = useRef<number>(Date.now());

  // ── Refrescar token silenciosamente si el usuario sigue activo ──────────────
  const refreshToken = async () => {
    const token = Cookies.get('auth-token');
    if (!token) return;
    try {
      const res = await api.post('/auth/verify', { token });
      const newToken = res.data?.token;
      if (newToken) {
        Cookies.set('auth-token', newToken, { expires: 1, path: '/', sameSite: 'lax' });
        lastRefreshRef.current = Date.now();
      }
    } catch {
      // El interceptor 401 en api-client ya maneja el logout si el token expiró
    }
  };

  // ── Extender sesión manualmente (botón "Continuar" del modal) ───────────────
  const extendSession = async () => {
    updateActivity();
    setShowWarning(false);
    await refreshToken();
  };

  // ── Cerrar sesión desde el modal ─────────────────────────────────────────────
  const logoutNow = () => {
    setShowWarning(false);
    logout();
    window.location.href = '/';
  };

  // ── Tracker de actividad del usuario ────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => updateActivity();

    window.addEventListener('mousemove',  handleActivity, { passive: true });
    window.addEventListener('keydown',    handleActivity, { passive: true });
    window.addEventListener('click',      handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove',  handleActivity);
      window.removeEventListener('keydown',    handleActivity);
      window.removeEventListener('click',      handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isAuthenticated, updateActivity]);

  // ── Timer principal: chequeo de inactividad + refresh periódico ─────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const idleTime = Date.now() - lastActivity;
      const timeLeft = INACTIVITY_LIMIT - idleTime;

      if (idleTime >= INACTIVITY_LIMIT) {
        // Tiempo de inactividad superado → cerrar sesión
        setShowWarning(false);
        logout();
        window.location.href = '/';
        toast.error('Tu sesión se cerró por inactividad.');
        return;
      }

      if (timeLeft <= WARNING_BEFORE) {
        // Faltan menos de 5 minutos → mostrar advertencia
        setMinutesLeft(Math.max(1, Math.ceil(timeLeft / 60000)));
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }

      // Refrescar el JWT silenciosamente cada 30 min si hay actividad reciente
      const timeSinceRefresh = Date.now() - lastRefreshRef.current;
      if (idleTime < REFRESH_INTERVAL && timeSinceRefresh >= REFRESH_INTERVAL) {
        await refreshToken();
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity, logout]);

  return { showWarning, minutesLeft, extendSession, logoutNow };
};
