import { QueryClient } from '@tanstack/react-query';

// Configuración del cliente de consulta
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Tiempo que los datos se consideran frescos (en milisegundos)
            staleTime: 1000 * 60 * 5, // 5 minutos
            // Tiempo que los datos permanecen en caché cuando no están en uso
            gcTime: 1000 * 60 * 10, // 10 minutos
            // Reintentos en caso de error
            retry: 1,
            // Refetch automático cuando la ventana recupera el foco
            refetchOnWindowFocus: true,
            // Refetch automático al reconectar la red
            refetchOnReconnect: true,
        },
    },
});