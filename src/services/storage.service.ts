import { api } from "@/config/api-client";

export const storageService = {
  /**
   * Sube un archivo al servidor y devuelve la URL pública
   * @param file - Archivo a subir
   * @returns URL pública del archivo subido
   */
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // El backend devuelve { url: "https://..." }
    return data.url;
  },
};
