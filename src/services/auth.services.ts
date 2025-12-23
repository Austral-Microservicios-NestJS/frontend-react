  import { api } from "@/config/api-client";

export const authService = {
    async login(credentials: { correo: string; contrasena: string }) {
        try {
            const response = await api.post("/auth/login", credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Error al iniciar sesión");
        }
    },

    async register(userData: {
        correo: string;
        contrasena?: string;
        nombreUsuario?: string;
        idRol: string;
        nombres: string;
        apellidos: string;
        tipoDocumento: string;
        numeroDocumento: string;
        telefono?: string;
        direccion?: string;
    }) {
        try {
            const response = await api.post("/auth/register", userData);
            return response;
        } catch (error: any) {
            throw new Error(error.message || "Error al registrar usuario");
        }
    },

    async verify(token: string) {
        try {
            const response = await api.post("/auth/verify", { token });
            return response;
        } catch (error: any) {
            throw new Error(error.message || "Error al verificar token");
        }
    },

    async getUsers() {
        try {
            const response = await api.get("/auth/users");
            return response;
        } catch (error: any) {
            throw new Error(error.message || "Error al obtener usuarios");
        }
    },

    async getUsersByRole(role: string) {
        try {
            const response = await api.get(`/auth/users/role/${role}`);
            return response;
        } catch (error: any) {
            throw new Error(error.message || "Error al obtener usuarios por rol");
        }
    },

    async getUserById(id: string) {
        try {
            const response = await api.get(`/auth/validate/${id}`);
            return response;
        } catch (error: any) {
            throw new Error(error.message || "Error al obtener usuario");
        }
    },

    async toggleUserStatus(id: string) {
        try {
            const response = await api.patch(`/auth/toggle-status/${id}`);
            return response;
        } catch (error: any) {
            throw new Error(error.message || "Error al cambiar estado del usuario");
        }
    },

    async updateUser(
        id: string,
        userData: { correo?: string; telefono?: string }
    ) {
        try {
            const response = await api.patch(`/auth/${id}`, userData);
            return response;
        } catch (error: any) {
            throw new Error(error.message || "Error al actualizar usuario");
        }
    },
};
