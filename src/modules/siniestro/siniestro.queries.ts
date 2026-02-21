import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siniestroService } from "./siniestro.service";
import { siniestroKeys } from "./siniestro.keys";
import type { CreateSiniestro, UpdateSiniestro } from "./siniestro.types";

export const useGetSiniestrosByPoliza = (idPoliza: string) => {
  return useQuery({
    queryKey: siniestroKeys.byPoliza(idPoliza),
    queryFn: () => siniestroService.getByPoliza(idPoliza),
    enabled: !!idPoliza,
    refetchOnWindowFocus: false,
  });
};

export const useGetSiniestro = (id: string) => {
  return useQuery({
    queryKey: siniestroKeys.detail(id),
    queryFn: () => siniestroService.getById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateSiniestro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (siniestro: CreateSiniestro) => siniestroService.create(siniestro),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: siniestroKeys.byPoliza(data.idPoliza) });
    },
  });
};

export const useUpdateSiniestro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiniestro }) =>
      siniestroService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: siniestroKeys.byPoliza(data.idPoliza) });
      queryClient.invalidateQueries({ queryKey: siniestroKeys.detail(data.idSiniestro) });
    },
  });
};

export const useDeleteSiniestro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => siniestroService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siniestroKeys.all });
    },
  });
};
