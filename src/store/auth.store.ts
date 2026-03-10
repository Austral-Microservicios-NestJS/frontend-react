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
    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: (user, token) => {
                Cookies.set('auth-token', token, {
                    expires: 7,
                    path: '/',
                    sameSite: 'lax',
                });
                // Normalizar rol legacy en el momento del login
                const rol = user.rol;
                const normalizedUser = rol && LEGACY_ROLE_MAP[rol.nombreRol]
                    ? { ...user, rol: { ...rol, nombreRol: LEGACY_ROLE_MAP[rol.nombreRol] } }
                    : user;
                set({ user: normalizedUser, isAuthenticated: true });
            },
            logout: () => {
                Cookies.remove('auth-token');
                set({ user: null, isAuthenticated: false });
            },
            setLoading: (loading) => set({ isLoading: loading }),
            initializeAuth: () => {
                const token = Cookies.get('auth-token');
                const state = get();

                if (token && state.user) {
                    // Normalizar nombre de rol legacy si es necesario
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
            }),
        }
    )
);
