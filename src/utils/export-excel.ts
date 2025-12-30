import * as XLSX from "xlsx";
import { useInvoiceStore } from "@/store/invoice.store";
import { useDniStore } from "@/store/agente-dni.store";

export const exportInvoiceRecordsToExcel = (userId: string) => {
  const records = useInvoiceStore
    .getState()
    .records.filter((r) => r.userId === userId);

  if (records.length === 0) {
    throw new Error("No hay registros para exportar");
  }

  const data = records.map((record) => ({
    "Número Factura": record.numeroFactura,
    "RUC Emisor": record.rucEmisor,
    "Razón Social Emisor": record.razonSocialEmisor,
    "RUC Cliente": record.rucCliente,
    "Razón Social Cliente": record.razonSocialCliente,
    "Fecha Emisión": record.fechaEmision,
    Moneda: record.moneda,
    Subtotal: record.subtotal,
    IGV: record.igv,
    "Importe Total": record.importeTotal,
    "Fecha Registro": new Date(record.createdAt).toLocaleDateString("es-PE"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");

  const fileName = `facturas_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportDniRecordsToExcel = (userId: string) => {
  const records = useDniStore
    .getState()
    .records.filter((r) => r.idUsuario === userId);

  if (records.length === 0) {
    throw new Error("No hay registros para exportar");
  }

  const data = records.map((record) => ({
    "Número DNI": record.numeroDni,
    Nombres: record.nombres,
    "Apellido Paterno": record.apellidoPaterno,
    "Apellido Materno": record.apellidoMaterno,
    Sexo: record.sexo === "M" ? "Masculino" : "Femenino",
    "Estado Civil": record.estadoCivil,
    "Fecha Nacimiento": record.fechaNacimiento,
    "Fecha Emisión": record.fechaEmision,
    "Fecha Caducidad": record.fechaCaducidad,
    "Fecha Registro": new Date(record.fechaCreacion).toLocaleDateString(
      "es-PE"
    ),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "DNI Records");

  const fileName = `dni_records_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
