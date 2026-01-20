import type { Compania } from "./compania.interface";
import type { Producto } from "./producto.interface";
import type { Ramo } from "./ramo.interface";

export interface Poliza {
  idPoliza: string;
  numeroPoliza: string;
  nombreAsegurado: string;
  idCliente: string;
  registradoPor: string;
  idCompania: string;
  idProducto: string;
  idRamo: string;
  idBroker?: string;
  idAgente?: string;
  fechaEmision: string;
  vigenciaInicio: string;
  vigenciaFin: string;
  estado: string;
  moneda: string;
  sumaAsegurada?: number;
  primaTotal?: number;
  comisionBroker: number;
  comisionAgente: number;
  tipoVigencia: TipoVigencia;
  descripcion?: string;
  compania?: Compania;
  producto?: Producto;
  ramo?: Ramo;
  createdAt?: string;
  updatedAt?: string;
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
  idBroker?: string;
  idAgente?: string;
  fechaEmision: string;
  vigenciaInicio: string;
  vigenciaFin: string;
  estado: string;
  moneda: string;
  comisionBroker: number;
  comisionAgente: number;
  tipoVigencia: TipoVigencia;
  descripcion?: string;
}

export interface UpdatePolizaDto extends Partial<Poliza> {}


export enum TipoVigencia {
    ANUAL = 'ANUAL',
    DECLARACION_MENSUAL = 'DECLARACION_MENSUAL',
    PERIODICA = 'PERIODICA',
    NO_RENOVABLE = 'NO_RENOVABLE',
    EVENTUAL = 'EVENTUAL',
    FLOTANTE = 'FLOTANTE',
}

export const tipoVigenciaOptions = [
    { value: TipoVigencia.ANUAL, label: "ANUAL" },
    { value: TipoVigencia.DECLARACION_MENSUAL, label: "DECLARACIÓN MENSUAL" },
    { value: TipoVigencia.PERIODICA, label: "PERIÓDICA" },
    { value: TipoVigencia.NO_RENOVABLE, label: "NO RENOVABLE" },
    { value: TipoVigencia.EVENTUAL, label: "EVENTUAL" },
    { value: TipoVigencia.FLOTANTE, label: "FLOTANTE" },
] as const;