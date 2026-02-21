export const siniestroKeys = {
  all: ["siniestros"] as const,
  byPoliza: (idPoliza: string) => ["siniestros", "poliza", idPoliza] as const,
  detail: (id: string) => ["siniestros", id] as const,
};
