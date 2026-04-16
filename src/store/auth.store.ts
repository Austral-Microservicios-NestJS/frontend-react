import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

const LEGACY_ROLE_MAP: Record<string, string> = {
  'ADMIN_GENERAL':   'ADMINISTRADOR',
  'BROKER_JURIDICO': 'BROKER',
  'BROKER_NATURAL':  'EJECUTIVO_CUENTA',
  'VENDEDOR':        'PROMOTOR_VENTA',
};

export interface User {
    idUsuario: string;
    correo: string;
    nombreUsuario: string;
    rol: {
        idRol: string;
        nombreRol: string;
        descripcionRol?: string;
        activo?: boolean;
        fechaCreacion?: string;
        fechaModificacion?: string;
    };
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    lastActivity: number;
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    initializeAuth: () => void;
    updateActivity: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            lastActivity: Date.now(),
            login: (user, token) => {
                Cookies.set('auth-token', token, {
                    expires: 1,         // 1 día — el JWT de 8h controla la auth real
                    path: '/',
                    sameSite: 'lax',
                });
                const rol = user.rol;
                const normalizedUser = rol && LEGACY_ROLE_MAP[rol.nombreRol]
                    ? { ...user, rol: { ...rol, nombreRol: LEGACY_ROLE_MAP[rol.nombreRol] } }
                    : user;
                set({ user: normalizedUser, isAuthenticated: true, lastActivity: Date.now() });
            },
            logout: () => {
                Cookies.remove('auth-token');
                try { localStorage.removeItem('austral-ai-chat-storage'); } catch {}
                set({ user: null, isAuthenticated: false, lastActivity: 0 });
            },
            setLoading: (loading) => set({ isLoading: loading }),
            updateActivity: () => set({ lastActivity: Date.now() }),
            initializeAuth: () => {
                const token = Cookies.get('auth-token');
                const state = get();

                if (token && state.user) {
                    const rol = state.user.rol;
                    const normalizedRol = rol && LEGACY_ROLE_MAP[rol.nombreRol]
                        ? { ...rol, nombreRol: LEGACY_ROLE_MAP[rol.nombreRol] }
                        : rol;
                    set({
                        user: { ...state.user, rol: normalizedRol },
                        isAuthenticated: true,
                    });
                } else if (!token) {
                    set({ user: null, isAuthenticated: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                lastActivity: state.lastActivity,
            }),
        }
    )
);
