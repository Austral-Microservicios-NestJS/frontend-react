import { Input, Label } from "@/components/ui";
import type { InvoiceFormData } from "@/types/agente-factura.interface";

interface Props {
  formData: InvoiceFormData;
  onChange: (data: InvoiceFormData) => void;
  disabled?: boolean;
}

export const FormularioFactura = ({ formData, onChange, disabled }: Props) => {
  const handleChange = (field: keyof InvoiceFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Emisor Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="razonSocialEmisor">Razón Social Emisor</Label>
          <Input
            id="razonSocialEmisor"
            placeholder="Razón Social"
            value={formData.razonSocialEmisor}
            onChange={(e) => handleChange("razonSocialEmisor", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rucEmisor">RUC Emisor</Label>
          <Input
            id="rucEmisor"
            placeholder="RUC"
            value={formData.rucEmisor}
            onChange={(e) => handleChange("rucEmisor", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Cliente Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="razonSocialCliente">Razón Social Cliente</Label>
          <Input
            id="razonSocialCliente"
            placeholder="Razón Social"
            value={formData.razonSocialCliente}
            onChange={(e) => handleChange("razonSocialCliente", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rucCliente">RUC Cliente</Label>
          <Input
            id="rucCliente"
            placeholder="RUC"
            value={formData.rucCliente}
            onChange={(e) => handleChange("rucCliente", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Factura Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numeroFactura">Número de Factura</Label>
          <Input
            id="numeroFactura"
            placeholder="F001-00000000"
            value={formData.numeroFactura}
            onChange={(e) => handleChange("numeroFactura", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaEmision">Fecha de Emisión</Label>
          <Input
            id="fechaEmision"
            type="date"
            value={formData.fechaEmision}
            onChange={(e) => handleChange("fechaEmision", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moneda">Moneda</Label>
          <Input
            id="moneda"
            placeholder="PEN / USD"
            value={formData.moneda}
            onChange={(e) => handleChange("moneda", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subtotal">Subtotal</Label>
          <Input
            id="subtotal"
            placeholder="0.00"
            value={formData.subtotal}
            onChange={(e) => handleChange("subtotal", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="igv">IGV</Label>
          <Input
            id="igv"
            placeholder="0.00"
            value={formData.igv}
            onChange={(e) => handleChange("igv", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="importeTotal">Importe Total</Label>
          <Input
            id="importeTotal"
            placeholder="0.00"
            value={formData.importeTotal}
            onChange={(e) => handleChange("importeTotal", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
