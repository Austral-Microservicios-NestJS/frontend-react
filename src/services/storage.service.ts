import { api } from "@/config/api-client";

export const storageService = {
  /**
   * Sube un archivo al servidor y devuelve la URL publica
   * @param file - Archivo a subir
   * @param folder - Carpeta destino (default: 'observaciones')
   * @returns URL publica del archivo subido
   */
  uploadFile: async (file: File, folder?: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const params = folder ? `?folder=${encodeURIComponent(folder)}` : "";

    const { data } = await api.post(`/storage/upload${params}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // El backend devuelve { url: "https://..." }
    return data.url;
  },
};
