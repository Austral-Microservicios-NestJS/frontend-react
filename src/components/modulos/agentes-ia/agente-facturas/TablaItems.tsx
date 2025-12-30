import type { InvoiceItem } from "@/types/agente-factura.interface";

interface Props {
  items: InvoiceItem[];
}

export const TablaItems = ({ items }: Props) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Cantidad
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Unidad
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Descripción
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">
              Precio Unitario
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.cantidad}</td>
                <td className="px-4 py-3">{item.unidadMedida}</td>
                <td className="px-4 py-3">{item.descripcion}</td>
                <td className="px-4 py-3 text-right">
                  {item.valorUnitario.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                No hay items procesados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
