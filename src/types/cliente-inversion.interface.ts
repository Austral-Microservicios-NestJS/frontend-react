import type { Cliente } from "./cliente.interface";

export enum Moneda {
    PEN = "PEN",
    USD = "USD",
}

export const monedaOptions = [
    { value: Moneda.PEN, label: "PEN (Soles)" },
    { value: Moneda.USD, label: "USD (Dólares)" },
] as const;

export interface ClienteInversion {
    idInversion: string;
    idCliente: Cliente;
    monto: number;
    moneda: Moneda;
    tipo: string;
    descripcion?: string;
    fechaGasto: string;
    registradoPor?: string;
    fechaCreacion: string;
}

export interface CreateClienteInversion {
    idCliente: string;
    monto: number;
    moneda: Moneda;
    tipo: string;
    descripcion?: string;
    fechaGasto: string;
    registradoPor?: string;
}

export interface UpdateClienteInversion extends Partial<CreateClienteInversion> { }
