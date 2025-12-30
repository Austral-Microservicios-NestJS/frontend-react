import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { InvoiceRecord } from "@/types/agente-factura.interface";
import { FileText, DollarSign, Calendar, Eye, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface Props {
  records: InvoiceRecord[];
  onEdit: (record: InvoiceRecord) => void;
  onDelete: (recordId: string) => void;
  onView: (record: InvoiceRecord) => void;
}

export const GridFacturaRecords = ({ records, onDelete, onView }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <Card
          key={record.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  {record.numeroFactura}
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <DollarSign className="h-3 w-3" />
                  <span>
                    {record.moneda} {record.importeTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1 text-xs">
              <p className="text-gray-500">
                Emisor:{" "}
                <span className="text-gray-900 font-medium">
                  {record.razonSocialEmisor}
                </span>
              </p>
              <p className="text-gray-500">
                Cliente:{" "}
                <span className="text-gray-900 font-medium">
                  {record.razonSocialCliente}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>
                {dayjs(record.createdAt).format("DD MMM YYYY, HH:mm")}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onView(record)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(record.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
