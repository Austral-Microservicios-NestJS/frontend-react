import { Grid } from "@/components/shared";
import type { Actividad } from "@/types/actividad.interface";

interface Props {
  actividades: Actividad[];
}

export const ActividadesGrid = ({ actividades }: Props) => {
  return (
    <Grid
      data={actividades}
      renderItem={(actividad) => (
        // Aquí va tu componente de cartilla personalizada
        <div className="p-4 border rounded-lg">
          <h3>{actividad.titulo}</h3>
          <p>{actividad.tipoActividad}</p>
        </div>
      )}
      columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
      pageSize={20}
      pageSizeOptions={[10, 20, 50]}
    />
  );
};
