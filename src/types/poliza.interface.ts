export interface Poliza {
  idPoliza: string;
  numeroPoliza: string;
  nombreAsegurado: string;
  idCliente: string;
  registradoPor: string;
  idCompania: string;
  idProducto: string;
  idRamo: string;
  fechaEmision: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  moneda: string;
  comisionBroker: number;
  comisionAgente: number;
  tipoVigencia: string;
  descripcion?: string;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
}

export interface CreatePolizaDto {
  numeroPoliza: string;
  nombreAsegurado: string;
  idCliente: string;
  registradoPor: string;
  idCompania: string;
  idProducto: string;
  idRamo: string;
  fechaEmision: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  moneda: string;
  comisionBroker: number;
  comisionAgente: number;
  tipoVigencia: string;
  descripcion?: string;
}

export interface UpdatePolizaDto extends Partial<Poliza> {}
