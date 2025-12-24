import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

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
                    expires: 7, // 7 días (js-cookie uses days)
                    path: '/',
                    sameSite: 'lax',
                });
                set({ user, isAuthenticated: true });
            },
            logout: () => {
                Cookies.remove('auth-token');
                set({ user: null, isAuthenticated: false });
            },
            setLoading: (loading) => set({ isLoading: loading }),
            initializeAuth: () => {
                const token = Cookies.get('auth-token');
                const state = get();

                // Si hay token pero no hay usuario en el estado, significa que se recargó la página
                // El estado persistido de Zustand debería tener el usuario
                if (token && state.user) {
                    set({ isAuthenticated: true });
                } else if (!token) {
                    // Si no hay token, limpiar el estado
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
