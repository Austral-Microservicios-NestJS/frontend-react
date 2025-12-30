// Types for Agente Facturas

export interface InvoiceItem {
  cantidad: number;
  unidadMedida: string;
  descripcion: string;
  valorUnitario: number;
}

export interface InvoiceApiResponse {
  ruc_emisor: string | null;
  razon_social_emisor: string | null;
  ruc_cliente: string | null;
  razon_social_cliente: string | null;
  fecha_emision: string | null;
  numero_factura: string | null;
  moneda: string | null;
  sub_total_ventas: number | null;
  igv: number | null;
  importe_total: number | null;
  detalle_items: {
    cantidad: number;
    unidad_medida: string;
    descripcion: string;
    valor_unitario: number;
  }[];
}

export interface InvoiceFormData {
  razonSocialEmisor: string;
  rucEmisor: string;
  razonSocialCliente: string;
  rucCliente: string;
  numeroFactura: string;
  fechaEmision: string;
  moneda: string;
  subtotal: string;
  igv: string;
  importeTotal: string;
  detalleItems: InvoiceItem[];
}

export interface InvoiceRecord {
  id: string;
  userId: string;
  rucEmisor: string;
  razonSocialEmisor: string;
  rucCliente: string;
  razonSocialCliente: string;
  fechaEmision: string;
  numeroFactura: string;
  moneda: string;
  subtotal: number;
  igv: number;
  importeTotal: number;
  detalleItems: InvoiceItem[];
  imagePreview?: string;
  createdAt: string;
}
